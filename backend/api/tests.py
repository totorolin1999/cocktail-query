import base64
import json
import shutil
import tempfile
import uuid
from django.urls import reverse
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Base, Liqueur, Alcohol, Ingredient, Cocktail
from .utils import build_model

TEMP_MEDIA_ROOT = tempfile.mkdtemp()


class CocktailListFilterTests(APITestCase):
    def setUp(self):
        vodka = Base.objects.create(id=4, Chinese_Name="伏特加", English_Name="Vodka")
        rum = Base.objects.create(id=5, Chinese_Name="蘭姆酒", English_Name="Rum")
        cointreau = Liqueur.objects.create(id=2, Chinese_Name="君度橙酒", English_Name="Cointreau")

        long_island = Cocktail.objects.create(
            Chinese_Name="長島冰茶",
            English_Name="Long Island Iced Tea",
        )
        long_island.Bases.add(vodka)
        long_island.Liqueurs.add(cointreau)

        cosmopolitan = Cocktail.objects.create(
            Chinese_Name="柯夢波丹",
            English_Name="Cosmopolitan",
        )
        cosmopolitan.Bases.add(vodka)
        cosmopolitan.Liqueurs.add(cointreau)

        kamikaze = Cocktail.objects.create(
            Chinese_Name="神風特攻隊",
            English_Name="Kamikaze",
        )
        kamikaze.Bases.add(vodka)
        kamikaze.Liqueurs.add(cointreau)

        free_cuba = Cocktail.objects.create(
            Chinese_Name="自由古巴",
            English_Name="Free Cuba",
        )
        free_cuba.Bases.add(rum)

        long_island.Bases.add(rum)

    def test_filter_cocktails_by_vodka_and_cointreau(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4", "liqueurs[]": "2"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)

        names = [item["Chinese_Name"] for item in data]
        self.assertIn("長島冰茶", names)
        self.assertIn("柯夢波丹", names)
        self.assertIn("神風特攻隊", names)
        self.assertNotIn("自由古巴", names)


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class CocktailAPITestCase(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

        self.vodka = Base.objects.create(id=4, Chinese_Name="伏特加", English_Name="Vodka")
        self.rum = Base.objects.create(id=5, Chinese_Name="蘭姆酒", English_Name="Rum")
        self.cointreau = Liqueur.objects.create(id=2, Chinese_Name="君度橙酒", English_Name="Cointreau")
        self.tequila = Alcohol.objects.create(id=3, Chinese_Name="龍舌蘭", English_Name="Tequila")
        self.lemon = Ingredient.objects.create(id=10, Chinese_Name="檸檬", English_Name="Lemon")

        self.long_island = Cocktail.objects.create(
            Chinese_Name="長島冰茶",
            English_Name="Long Island Iced Tea",
        )
        self.long_island.Bases.add(self.vodka)
        self.long_island.Liqueurs.add(self.cointreau)
        self.long_island.Alcohols.add(self.tequila)
        self.long_island.Ingredients.add(self.lemon)

        self.mix_cocktail = Cocktail.objects.create(
            Chinese_Name="伏蘭君",
            English_Name="Vodka Rum Cointreau",
        )
        self.mix_cocktail.Bases.add(self.vodka, self.rum)
        self.mix_cocktail.Liqueurs.add(self.cointreau)

        self.free_cuba = Cocktail.objects.create(
            Chinese_Name="自由古巴",
            English_Name="Free Cuba",
        )
        self.free_cuba.Bases.add(self.rum)

    def test_cocktail_detail_returns_expected_data(self):
        response = self.client.get(reverse("cocktail-detail", args=[self.long_island.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["Chinese_Name"], "長島冰茶")

    def test_cocktail_list_response_format(self):
        response = self.client.get(reverse("cocktail-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

        item = data[0]
        self.assertIn("id", item)
        self.assertIn("Chinese_Name", item)
        self.assertIn("English_Name", item)
        self.assertIn("image", item)
        self.assertIn("Bases", item)
        self.assertIn("Liqueurs", item)
        self.assertIn("Alcohols", item)
        self.assertIn("Ingredients", item)

        self.assertIsInstance(item["Bases"], list)
        self.assertIsInstance(item["Liqueurs"], list)
        self.assertIsInstance(item["Alcohols"], list)
        self.assertIsInstance(item["Ingredients"], list)

        for nested_list in ["Bases", "Liqueurs", "Alcohols", "Ingredients"]:
            for nested_item in item[nested_list]:
                self.assertIsInstance(nested_item, dict)
                self.assertIn("id", nested_item)
                self.assertIn("Chinese_Name", nested_item)
                self.assertIn("English_Name", nested_item)

        self.assertTrue(item["image"].startswith("/media/cocktail_images/"))

    def test_cocktail_create_requires_authentication(self):
        self.client.force_authenticate(user=None)
        payload = {
            "Chinese_Name": "新雞尾酒",
            "English_Name": "New Cocktail",
            "Bases": [{"id": self.vodka.id}],
            "Liqueurs": [{"id": self.cointreau.id}],
            "Alcohols": [{"id": self.tequila.id}],
            "Ingredients": [{"id": self.lemon.id}],
        }
        response = self.client.post(reverse("cocktail-create"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cocktail_create_update_and_delete(self):
        payload = {
            "Chinese_Name": "新雞尾酒",
            "English_Name": "New Cocktail",
            "Bases": [{"id": self.vodka.id}],
            "Liqueurs": [{"id": self.cointreau.id}],
            "Alcohols": [{"id": self.tequila.id}],
            "Ingredients": [{"id": self.lemon.id}],
        }

        create_response = self.client.post(reverse("cocktail-create"), payload, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        created_data = create_response.json()
        self.assertEqual(created_data["Chinese_Name"], "新雞尾酒")
        self.assertEqual(len(created_data["Bases"]), 1)
        self.assertEqual(len(created_data["Liqueurs"]), 1)
        self.assertEqual(len(created_data["Alcohols"]), 1)
        self.assertEqual(len(created_data["Ingredients"]), 1)

        cocktail_id = created_data["id"]
        update_payload = {"Chinese_Name": "更新雞尾酒"}
        update_response = self.client.post(reverse("cocktail-update", args=[cocktail_id]), update_payload, format="json")
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.json()["Chinese_Name"], "更新雞尾酒")

        delete_response = self.client.delete(reverse("cocktail-delete", args=[cocktail_id]))
        self.assertEqual(delete_response.status_code, status.HTTP_200_OK)
        self.assertFalse(Cocktail.objects.filter(id=cocktail_id).exists())

    def test_cocktail_create_allows_image_upload(self):
        payload = {
            "Chinese_Name": "有圖調酒",
            "English_Name": "Image Cocktail",
            "Bases": json.dumps([{"id": self.vodka.id}]),
            "Liqueurs": json.dumps([{"id": self.cointreau.id}]),
            "Alcohols": json.dumps([{"id": self.tequila.id}]),
            "Ingredients": json.dumps([{"id": self.lemon.id}]),
        }
        filename = f"test_{uuid.uuid4().hex}.png"
        image = SimpleUploadedFile(
            name=filename,
            content=base64.b64decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII='
            ),
            content_type="image/png",
        )
        payload["image"] = image
        response = self.client.post(reverse("cocktail-create"), payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["Chinese_Name"], "有圖調酒")
        self.assertIn("image", data)
        self.assertTrue(data["image"].endswith(".png"))

    def test_cocktail_update_can_modify_material_relations(self):
        new_ingredient = Ingredient.objects.create(id=11, Chinese_Name="薄荷", English_Name="Mint")
        update_payload = {
            "Chinese_Name": "長島最新版",
            "Bases": [{"id": self.rum.id}],
            "Liqueurs": [{"id": self.cointreau.id}],
            "Ingredients": [{"id": new_ingredient.id}],
        }
        response = self.client.post(reverse("cocktail-update", args=[self.long_island.id]), update_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["Chinese_Name"], "長島最新版")
        self.assertEqual([item["id"] for item in data["Bases"]], [self.rum.id])
        self.assertEqual([item["id"] for item in data["Liqueurs"]], [self.cointreau.id])
        self.assertEqual([item["id"] for item in data["Ingredients"]], [new_ingredient.id])

    def test_cocktail_list_pipe_separated_ids(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4|5"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["Chinese_Name"], "伏蘭君")

    def test_cocktail_list_requires_all_selected_related_items(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4|5", "liqueurs[]": "2"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["Chinese_Name"], "伏蘭君")

    def test_cocktail_recommendation_returns_similar_cocktails(self):
        build_model()
        response = self.client.get(reverse("cocktail-recommendation", args=[self.long_island.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertTrue(any(item["Chinese_Name"] == "伏蘭君" for item in data))
