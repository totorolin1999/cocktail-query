import base64
import csv
import json
import joblib
import shutil
import tempfile
import uuid
from pathlib import Path
from django.urls import reverse
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Material, Cocktail, CocktailRecipeItem
from .scripts.build_iba_recipes import parse_ingredient
from .utils import build_model

TEMP_MEDIA_ROOT = tempfile.mkdtemp()


class IBACocktailFixtureTests(SimpleTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        fixture_path = Path(__file__).parent / "fixtures" / "iba_cocktail_recipes.json"
        cls.recipes = json.loads(fixture_path.read_text(encoding="utf-8"))
        cls.by_name = {recipe["English_Name"]: recipe for recipe in cls.recipes}
        source_path = Path(__file__).parent / "fixtures" / "iba_recipe_source.json"
        cls.source_by_url = {
            row["url"]: row
            for row in json.loads(source_path.read_text(encoding="utf-8"))
        }

    def test_fixture_has_complete_three_category_iba_catalog(self):
        self.assertEqual(len(self.recipes), 102)
        self.assertEqual(len(self.by_name), 102)
        self.assertEqual(
            {
                category: sum(recipe["iba_category"] == category for recipe in self.recipes)
                for category in (
                    "The unforgettables",
                    "Contemporary Classics",
                    "New Era",
                )
            },
            {
                "The unforgettables": 34,
                "Contemporary Classics": 34,
                "New Era": 34,
            },
        )
        self.assertTrue(
            all(
                recipe["source_url"]
                and recipe["recipe_ingredients"]
                and all(
                    item["name_en"] and item["name_zh"] and item["amount"]
                    for item in recipe["recipe_ingredients"]
                )
                for recipe in self.recipes
            )
        )

    def test_fixture_matches_official_source_snapshot(self):
        self.assertEqual(len(self.source_by_url), len(self.recipes))
        for recipe in self.recipes:
            with self.subTest(cocktail=recipe["English_Name"]):
                source = self.source_by_url[recipe["source_url"]]
                self.assertEqual(recipe["iba_category"], source["category"])
                self.assertEqual(recipe["instructions_en"], source["method_en"])
                self.assertEqual(recipe["garnish_en"], source["garnish_en"])

    def test_quantity_parser_preserves_ranges_and_dash_units(self):
        pineapple = parse_ingredient("3 to 4 pcs Pineapple Chunks")
        bitters = parse_ingredient("Dash of Angostura Bitters (optional)")
        apricot_brandy = parse_ingredient("30 ml Apricot Brandy")
        campari = parse_ingredient("30 ml Bitter Campari")

        self.assertEqual(pineapple["amount"], "3 to 4 pcs")
        self.assertEqual(pineapple["name_en"], "Pineapple Chunks")
        self.assertEqual(bitters["amount"], "Dash")
        self.assertEqual(bitters["name_en"], "Angostura Bitters (optional)")
        self.assertEqual(apricot_brandy["category"], "liqueur")
        self.assertEqual(apricot_brandy["name_zh"], "杏桃白蘭地")
        self.assertEqual(campari["category"], "liqueur")

    def test_base_spirit_translations_distinguish_styles_and_origins(self):
        examples = {
            "30 ml Goslings Rum": "哥斯林蘭姆酒",
            "30 ml Gold Jamaican Rum": "牙買加金蘭姆酒",
            "30 ml Cuban Rum": "古巴蘭姆酒",
            "30 ml London Dry Gin": "倫敦乾琴酒",
            "30 ml Old Tom Gin": "老湯姆琴酒",
            "30 ml Vodka Citron": "檸檬伏特加",
            "30 ml Tequila 100% agave": "100% 龍舌蘭酒",
        }

        for raw, expected_name in examples.items():
            with self.subTest(raw=raw):
                self.assertEqual(parse_ingredient(raw)["name_zh"], expected_name)

    def test_confirmed_iba_recipe_corrections_are_present(self):
        missionary = self.by_name["Missionary's Downfall"]
        pineapple = next(
            item
            for item in missionary["recipe_ingredients"]
            if item["name_en"] == "Pineapple Chunks"
        )
        self.assertEqual(pineapple["amount"], "3 to 4 pcs")

        self.assertEqual(self.by_name["Bloody Mary"]["glassware_en"], "Rocks glass")
        self.assertIn("mixing glass with ice", self.by_name["Bloody Mary"]["instructions_en"])
        self.assertIn("chilled flute", self.by_name["Bellini"]["instructions_en"])
        self.assertEqual(self.by_name["Whiskey Sour"]["glassware_en"], "Cobbler glass")
        self.assertNotIn("dry-shake", self.by_name["Whiskey Sour"]["instructions_en"])

        bees_knees = self.by_name["Bee's Knees"]
        honey_syrup = next(
            item
            for item in bees_knees["recipe_ingredients"]
            if item["name_en"] == "Honey Syrup"
        )
        self.assertEqual(honey_syrup["name_zh"], "蜂蜜糖漿")
        self.assertIn("until it dissolves", bees_knees["instructions_en"])
        self.assertIn("chilled cocktail glass", bees_knees["instructions_en"])


class CocktailListFilterTests(APITestCase):
    def setUp(self):
        vodka = Material.objects.create(id=4, category="base", chinese_name="伏特加", english_name="Vodka")
        rum = Material.objects.create(id=5, category="base", chinese_name="蘭姆酒", english_name="Rum")
        cointreau = Material.objects.create(id=2, category="liqueur", chinese_name="君度橙酒", english_name="Cointreau")

        long_island = Cocktail.objects.create(
            chinese_name="長島冰茶",
            english_name="Long Island Iced Tea",
            strength="high",
            glassware_zh="高球杯",
            glassware_en="Highball glass",
        )
        CocktailRecipeItem.objects.create(cocktail=long_island, material=vodka)
        CocktailRecipeItem.objects.create(cocktail=long_island, material=cointreau)
        CocktailRecipeItem.objects.create(cocktail=long_island, material=rum)

        cosmopolitan = Cocktail.objects.create(
            chinese_name="柯夢波丹",
            english_name="Cosmopolitan",
            strength="medium",
            glassware_zh="馬丁尼杯",
            glassware_en="Cocktail glass",
        )
        CocktailRecipeItem.objects.create(cocktail=cosmopolitan, material=vodka)
        CocktailRecipeItem.objects.create(cocktail=cosmopolitan, material=cointreau)

        kamikaze = Cocktail.objects.create(
            chinese_name="神風特攻隊",
            english_name="Kamikaze",
            strength="low",
            glassware_zh="雞尾酒杯",
            glassware_en="Cocktail glass",
        )
        CocktailRecipeItem.objects.create(cocktail=kamikaze, material=vodka)
        CocktailRecipeItem.objects.create(cocktail=kamikaze, material=cointreau)

        free_cuba = Cocktail.objects.create(
            chinese_name="自由古巴",
            english_name="Free Cuba",
        )
        CocktailRecipeItem.objects.create(cocktail=free_cuba, material=rum)

    def test_filter_cocktails_by_vodka_and_cointreau(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4", "liqueurs[]": "2"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)

        names = [item["chinese_name"] for item in data]
        self.assertIn("長島冰茶", names)
        self.assertIn("柯夢波丹", names)
        self.assertIn("神風特攻隊", names)
        self.assertNotIn("自由古巴", names)

    def test_filter_cocktails_by_iba_category_and_other_criteria(self):
        long_island = Cocktail.objects.get(english_name="Long Island Iced Tea")
        cosmopolitan = Cocktail.objects.get(english_name="Cosmopolitan")
        kamikaze = Cocktail.objects.get(english_name="Kamikaze")
        long_island.iba_category = "The Unforgettables"
        cosmopolitan.iba_category = "Contemporary Classics"
        kamikaze.iba_category = "New Era"
        long_island.save()
        cosmopolitan.save()
        kamikaze.save()

        response = self.client.get(
            reverse("cocktail-list"),
            {
                "iba_category": "Contemporary Classics",
                "bases[]": "4",
                "name": "cosmo",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["english_name"] for item in response.json()],
            ["Cosmopolitan"],
        )

    def test_filter_cocktails_by_strength_and_bilingual_glassware(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"strength": "medium", "glassware": "馬丁尼杯"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["english_name"] for item in response.json()],
            ["Cosmopolitan"],
        )

        english_response = self.client.get(
            reverse("cocktail-list"),
            {"glassware": "Cocktail glass"},
        )
        self.assertEqual(english_response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            {item["english_name"] for item in english_response.json()},
            {"Cosmopolitan", "Kamikaze"},
        )


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class CocktailAPITestCase(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

        self.vodka = Material.objects.create(id=4, category="base", chinese_name="伏特加", english_name="Vodka")
        self.rum = Material.objects.create(id=5, category="base", chinese_name="蘭姆酒", english_name="Rum")
        self.cointreau = Material.objects.create(id=2, category="liqueur", chinese_name="君度橙酒", english_name="Cointreau")
        self.tequila = Material.objects.create(id=3, category="alcohol", chinese_name="龍舌蘭", english_name="Tequila")
        self.lemon = Material.objects.create(id=10, category="ingredient", chinese_name="檸檬", english_name="Lemon")

        self.long_island = Cocktail.objects.create(
            chinese_name="長島冰茶",
            english_name="Long Island Iced Tea",
        )
        CocktailRecipeItem.objects.create(cocktail=self.long_island, material=self.vodka)
        CocktailRecipeItem.objects.create(cocktail=self.long_island, material=self.cointreau)
        CocktailRecipeItem.objects.create(cocktail=self.long_island, material=self.tequila)
        CocktailRecipeItem.objects.create(cocktail=self.long_island, material=self.lemon)

        self.mix_cocktail = Cocktail.objects.create(
            chinese_name="伏蘭君",
            english_name="Vodka Rum Cointreau",
        )
        CocktailRecipeItem.objects.create(cocktail=self.mix_cocktail, material=self.vodka)
        CocktailRecipeItem.objects.create(cocktail=self.mix_cocktail, material=self.rum)
        CocktailRecipeItem.objects.create(cocktail=self.mix_cocktail, material=self.cointreau)

        self.free_cuba = Cocktail.objects.create(
            chinese_name="自由古巴",
            english_name="Free Cuba",
        )
        CocktailRecipeItem.objects.create(cocktail=self.free_cuba, material=self.rum)

    def test_cocktail_detail_returns_expected_data(self):
        CocktailRecipeItem.objects.filter(cocktail=self.long_island).delete()
        CocktailRecipeItem.objects.create(
            cocktail=self.long_island,
            material=self.vodka,
            amount="15",
            unit_zh="毫升",
            unit_en="ml",
            order=0,
        )
        self.long_island.instructions_zh = "加入冰塊搖勻。"
        self.long_island.instructions_en = "Shake with ice."
        self.long_island.glassware_zh = "高球杯"
        self.long_island.glassware_en = "Highball glass"
        self.long_island.save()

        response = self.client.get(reverse("cocktail-detail", args=[self.long_island.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["chinese_name"], "長島冰茶")
        self.assertEqual(data["recipe_items"][0]["amount"], "15")
        self.assertEqual(data["recipe_items"][0]["unit_en"], "ml")
        self.assertEqual(data["instructions_en"], "Shake with ice.")
        self.assertEqual(data["glassware_en"], "Highball glass")
        self.assertNotIn("recipe_ingredients", data)
        self.assertNotIn("bases", data)

    def test_cocktail_list_response_format(self):
        response = self.client.get(reverse("cocktail-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

        item = data[0]
        self.assertIn("id", item)
        self.assertIn("chinese_name", item)
        self.assertIn("english_name", item)
        self.assertIn("image", item)
        self.assertIn("recipe_items", item)
        self.assertNotIn("bases", item)
        self.assertNotIn("liqueurs", item)
        self.assertNotIn("alcohols", item)
        self.assertNotIn("ingredients", item)
        self.assertNotIn("materials", item)
        self.assertNotIn("recipe_ingredients", item)
        self.assertIn("instructions_zh", item)
        self.assertIn("artwork_color", item)

        self.assertIsInstance(item["recipe_items"], list)
        self.assertGreaterEqual(len(item["recipe_items"]), 1)
        for recipe_item in item["recipe_items"]:
            self.assertIsInstance(recipe_item, dict)
            self.assertIn("amount", recipe_item)
            self.assertIn("material", recipe_item)
            mat = recipe_item["material"]
            self.assertIn("id", mat)
            self.assertIn("chinese_name", mat)
            self.assertIn("english_name", mat)
            self.assertIn("category", mat)

        self.assertTrue(item["image"].startswith("/media/cocktail_images/"))

    def test_public_api_hides_inactive_cocktails(self):
        self.free_cuba.is_active = False
        self.free_cuba.save(update_fields=["is_active"])

        list_response = self.client.get(reverse("cocktail-list"))
        detail_response = self.client.get(
            reverse("cocktail-detail", args=[self.free_cuba.id])
        )

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertNotIn(
            self.free_cuba.id,
            [item["id"] for item in list_response.json()],
        )
        self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cocktail_update_persists_recipe_details(self):
        recipe_ingredients = [
            {
                "name_zh": "伏特加",
                "name_en": "Vodka",
                "amount": "45 ml",
                "unit_zh": "",
                "unit_en": "",
                "category": "base",
            }
        ]
        payload = {
            "recipe_ingredients": recipe_ingredients,
            "iba_category": "The Unforgettables",
            "instructions_zh": "加冰搖勻後濾入杯中。",
            "instructions_en": "Shake with ice and strain into the glass.",
            "glassware_zh": "雞尾酒杯",
            "glassware_en": "Cocktail glass",
            "source_url": "https://iba-world.com/iba-cocktail/example/",
            "strength": "medium",
            "artwork_color": "clear",
        }

        response = self.client.post(
            reverse("cocktail-update", args=[self.long_island.id]),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recipe_items = response.json()["recipe_items"]
        self.assertEqual(len(recipe_items), 1)
        self.assertEqual(recipe_items[0]["amount"], "45 ml")
        self.assertEqual(recipe_items[0]["material"]["chinese_name"], "伏特加")
        self.assertEqual(response.json()["iba_category"], "The Unforgettables")
        self.assertEqual(response.json()["instructions_en"], payload["instructions_en"])
        self.assertEqual(response.json()["source_url"], payload["source_url"])

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
        self.assertEqual(created_data["chinese_name"], "新雞尾酒")
        recipe_items = created_data["recipe_items"]
        self.assertEqual(sum(1 for r in recipe_items if r["material"]["category"] == "base"), 1)
        self.assertEqual(sum(1 for r in recipe_items if r["material"]["category"] == "liqueur"), 1)
        self.assertEqual(sum(1 for r in recipe_items if r["material"]["category"] == "alcohol"), 1)
        self.assertEqual(sum(1 for r in recipe_items if r["material"]["category"] == "ingredient"), 1)

        cocktail_id = created_data["id"]
        update_payload = {"Chinese_Name": "更新雞尾酒"}
        update_response = self.client.post(reverse("cocktail-update", args=[cocktail_id]), update_payload, format="json")
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.json()["chinese_name"], "更新雞尾酒")

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
        self.assertEqual(data["chinese_name"], "有圖調酒")
        self.assertIn("image", data)
        self.assertTrue(data["image"].endswith(".png"))

    def test_cocktail_update_can_modify_material_relations(self):
        new_ingredient = Material.objects.create(id=11, category="ingredient", chinese_name="薄荷", english_name="Mint")
        update_payload = {
            "Chinese_Name": "長島最新版",
            "Bases": [{"id": self.rum.id}],
            "Liqueurs": [{"id": self.cointreau.id}],
            "Ingredients": [{"id": new_ingredient.id}],
        }
        response = self.client.post(reverse("cocktail-update", args=[self.long_island.id]), update_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["chinese_name"], "長島最新版")
        recipe_items = data["recipe_items"]
        self.assertEqual([item["material"]["id"] for item in recipe_items if item["material"]["category"] == "base"], [self.rum.id])
        self.assertEqual([item["material"]["id"] for item in recipe_items if item["material"]["category"] == "liqueur"], [self.cointreau.id])
        self.assertEqual([item["material"]["id"] for item in recipe_items if item["material"]["category"] == "ingredient"], [new_ingredient.id])

    def test_cocktail_update_resolves_form_select_values(self):
        update_payload = {
            "Bases": [{"value": self.rum.id}],
            "Ingredients": [{"value": self.lemon.id}],
        }

        response = self.client.post(
            reverse("cocktail-update", args=[self.long_island.id]),
            update_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recipe_items = response.json()["recipe_items"]
        self.assertEqual(
            [item["material"]["id"] for item in recipe_items if item["material"]["category"] == "base"],
            [self.rum.id],
        )
        self.assertEqual(
            [item["material"]["id"] for item in recipe_items if item["material"]["category"] == "ingredient"],
            [self.lemon.id],
        )
        self.assertEqual(
            [item["material"]["id"] for item in recipe_items if item["material"]["category"] == "alcohol"],
            [self.tequila.id],
        )

    def test_cocktail_create_rejects_unknown_material_ids(self):
        response = self.client.post(
            reverse("cocktail-create"),
            {
                "Chinese_Name": "錯誤材料",
                "English_Name": "Invalid Material",
                "Bases": [{"value": 99999}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Bases", response.json())
        self.assertFalse(Cocktail.objects.filter(english_name="Invalid Material").exists())

    def test_material_crud(self):
        create_response = self.client.post(
            reverse("item-create", args=["ingredient"]),
            {"Chinese_Name": "萊姆", "English_Name": "Lime"},
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        material_id = create_response.json()["id"]

        list_response = self.client.get(reverse("material-list", args=["ingredient"]))
        detail_response = self.client.get(
            reverse("item-detail", args=["ingredient", material_id])
        )
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertIn(material_id, [item["id"] for item in list_response.json()])
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.json()["english_name"], "Lime")

        update_response = self.client.post(
            reverse("item-update", args=["ingredient", material_id]),
            {"english_name": "Fresh Lime"},
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.json()["chinese_name"], "萊姆")
        self.assertEqual(update_response.json()["english_name"], "Fresh Lime")

        delete_response = self.client.delete(
            reverse("item-delete", args=["ingredient", material_id])
        )
        self.assertEqual(delete_response.status_code, status.HTTP_200_OK)
        self.assertFalse(Material.objects.filter(id=material_id).exists())

    def test_material_endpoints_reject_unknown_model_types(self):
        response = self.client.get(reverse("material-list", args=["cocktail"]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cocktail_list_searches_chinese_and_english_names_case_insensitively(self):
        chinese_response = self.client.get(
            reverse("cocktail-list"),
            {"name": "長島"},
        )
        english_response = self.client.get(
            reverse("cocktail-list"),
            {"name": "long island"},
        )

        self.assertEqual(chinese_response.status_code, status.HTTP_200_OK)
        self.assertEqual(english_response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["id"] for item in chinese_response.json()],
            [self.long_island.id],
        )
        self.assertEqual(
            [item["id"] for item in english_response.json()],
            [self.long_island.id],
        )

    def test_recommendation_model_supports_more_than_eight_materials(self):
        extra_ingredients = [
            Material.objects.create(
                category="ingredient",
                chinese_name=f"額外材料{index}",
                english_name=f"Extra ingredient {index}",
            )
            for index in range(1, 6)
        ]
        for mat in extra_ingredients:
            CocktailRecipeItem.objects.create(cocktail=self.long_island, material=mat)

        with tempfile.TemporaryDirectory() as output_dir:
            output_csv = Path(output_dir) / "cocktails.csv"
            output_model = Path(output_dir) / "similarities.joblib"
            build_model(output_csv=output_csv, output_model=output_model)

            with output_csv.open(encoding="utf-8", newline="") as csv_file:
                header = next(csv.reader(csv_file))
            similarity_frame = joblib.load(output_model)

        self.assertIn("Ingredient9", header)
        self.assertEqual(len(similarity_frame), Cocktail.objects.filter(is_active=True).count())
        self.assertIn("Chinese_Name", similarity_frame.columns)

    def test_recommendation_model_weights_base_spirits_above_ingredients(self):
        base_match = Cocktail.objects.create(
            chinese_name="基酒相同",
            english_name="Shared Base",
        )
        CocktailRecipeItem.objects.create(cocktail=base_match, material=self.vodka)

        ingredient_match = Cocktail.objects.create(
            chinese_name="副材料相同",
            english_name="Shared Ingredient",
        )
        CocktailRecipeItem.objects.create(cocktail=ingredient_match, material=self.lemon)

        with tempfile.TemporaryDirectory() as output_dir:
            output_model = Path(output_dir) / "similarities.joblib"
            build_model(
                output_csv=Path(output_dir) / "cocktails.csv",
                output_model=output_model,
            )
            similarity_frame = joblib.load(output_model).set_index("Chinese_Name")

        self.assertGreater(
            similarity_frame.loc["長島冰茶", "基酒相同"],
            similarity_frame.loc["長島冰茶", "副材料相同"],
        )

    def test_cocktail_list_pipe_separated_ids(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4|5"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["chinese_name"], "伏蘭君")

    def test_cocktail_list_requires_all_selected_related_items(self):
        response = self.client.get(
            reverse("cocktail-list"),
            {"bases[]": "4|5", "liqueurs[]": "2"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["chinese_name"], "伏蘭君")

    def test_cocktail_recommendation_returns_similar_cocktails(self):
        build_model()
        response = self.client.get(reverse("cocktail-recommendation", args=[self.long_island.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertTrue(any(item["chinese_name"] == "伏蘭君" for item in data))

    def test_chart_list_returns_counts_with_single_query(self):
        response = self.client.get(reverse("chart-list", args=["base"]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        by_en = {item["english_label"]: item["size"] for item in data}
        self.assertEqual(by_en.get("Vodka"), 2)
        self.assertEqual(by_en.get("Rum"), 2)

    def test_cocktail_list_uses_constant_queries(self):
        with self.assertNumQueries(3):
            response = self.client.get(reverse("cocktail-list"))
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertGreaterEqual(len(response.json()), 2)

    def test_cocktail_custom_manager(self):
        inactive = Cocktail.objects.create(
            chinese_name="隱藏調酒",
            english_name="Hidden Cocktail",
            is_active=False,
        )
        active_qs = Cocktail.objects.active()
        self.assertNotIn(inactive, active_qs)
        self.assertIn(self.long_island, active_qs)

    def test_material_and_recipe_item_sync(self):
        payload = {
            "chinese_name": "整併調酒",
            "english_name": "Consolidated Cocktail",
            "recipe_ingredients": [
                {
                    "name_zh": "特選琴酒",
                    "name_en": "Craft Gin",
                    "category": "base",
                    "amount": "45 ml",
                    "unit_zh": "",
                    "unit_en": "",
                },
                {
                    "name_zh": "通寧水",
                    "name_en": "Tonic Water",
                    "category": "ingredient",
                    "amount": "120 ml",
                    "unit_zh": "",
                    "unit_en": "",
                },
            ],
        }
        response = self.client.post(reverse("cocktail-create"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cocktail = Cocktail.objects.get(english_name="Consolidated Cocktail")
        self.assertEqual(cocktail.recipe_items.count(), 2)
        self.assertEqual(cocktail.materials.count(), 2)
        recipe_item = cocktail.recipe_items.first()
        self.assertEqual(recipe_item.material.english_name, "Craft Gin")
        self.assertEqual(recipe_item.amount, "45 ml")

    def test_material_endpoints(self):
        material_response = self.client.get(reverse("material-list", args=["material"]))
        self.assertEqual(material_response.status_code, status.HTTP_200_OK)

        chart_response = self.client.get(reverse("chart-list", args=["material"]))
        self.assertEqual(chart_response.status_code, status.HTTP_200_OK)

