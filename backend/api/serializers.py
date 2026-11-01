from rest_framework import serializers
from django.db import transaction
from .models import (
    Cocktail,
    Material,
    CocktailRecipeItem,
)


class MaterialSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Material
        fields = '__all__'


# 向下相容舊版 Serializer 命名
class BaseSerializer(MaterialSerializer):
    pass


class LiqueurSerializer(MaterialSerializer):
    pass


class AlcoholSerializer(MaterialSerializer):
    pass


class IngredientSerializer(MaterialSerializer):
    pass


class CocktailRecipeItemSerializer(serializers.ModelSerializer):
    material = MaterialSerializer(read_only=True)
    material_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = CocktailRecipeItem
        fields = ['id', 'material', 'material_id', 'amount', 'unit_zh', 'unit_en', 'order']


def _sync_recipe_items(cocktail, recipe_ingredients=None, bases_data=None, liqueurs_data=None, alcohols_data=None, ingredients_data=None):
    if recipe_ingredients and isinstance(recipe_ingredients, list):
        CocktailRecipeItem.objects.filter(cocktail=cocktail).delete()
        items_to_create = []
        for index, item in enumerate(recipe_ingredients):
            if not isinstance(item, dict):
                continue
            cat = item.get('category', 'ingredient')
            name_en = item.get('name_en', '').strip()
            name_zh = item.get('name_zh', '').strip()
            if not name_en and not name_zh:
                continue

            material = Material.objects.filter(category=cat, English_Name=name_en).first()
            if not material and name_zh:
                material = Material.objects.filter(category=cat, Chinese_Name=name_zh).first()
            if not material:
                material = Material.objects.create(
                    category=cat,
                    English_Name=name_en or name_zh,
                    Chinese_Name=name_zh or name_en,
                )

            items_to_create.append(
                CocktailRecipeItem(
                    cocktail=cocktail,
                    material=material,
                    amount=item.get('amount', ''),
                    unit_zh=item.get('unit_zh', ''),
                    unit_en=item.get('unit_en', ''),
                    order=index,
                )
            )
        if items_to_create:
            CocktailRecipeItem.objects.bulk_create(items_to_create)
    else:
        categories_data = [
            ('base', bases_data),
            ('liqueur', liqueurs_data),
            ('alcohol', alcohols_data),
            ('ingredient', ingredients_data),
        ]

        if all(data is None for _, data in categories_data):
            if recipe_ingredients == []:
                CocktailRecipeItem.objects.filter(cocktail=cocktail).delete()
            return

        for cat, data_list in categories_data:
            if data_list is None:
                continue
            CocktailRecipeItem.objects.filter(cocktail=cocktail, material__category=cat).delete()
            items_to_create = []
            max_order = CocktailRecipeItem.objects.filter(cocktail=cocktail).count()
            for entry in data_list:
                mat_id = entry.get('id') if isinstance(entry, dict) else entry
                material = Material.objects.filter(id=mat_id).first()
                if not material:
                    continue
                items_to_create.append(
                    CocktailRecipeItem(
                        cocktail=cocktail,
                        material=material,
                        amount='',
                        order=max_order,
                    )
                )
                max_order += 1
            if items_to_create:
                CocktailRecipeItem.objects.bulk_create(items_to_create)


class CocktailSerializer(serializers.ModelSerializer):
    materials = serializers.SerializerMethodField()
    recipe_items = CocktailRecipeItemSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    # 向下相容前端所需的中繼清單欄位
    Bases = serializers.SerializerMethodField()
    Liqueurs = serializers.SerializerMethodField()
    Alcohols = serializers.SerializerMethodField()
    Ingredients = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = '__all__'

    def get_materials(self, obj):
        return [
            {
                'id': item.material.id,
                'Chinese_Name': item.material.Chinese_Name,
                'English_Name': item.material.English_Name,
                'category': item.material.category,
            }
            for item in obj.recipe_items.all()
        ]

    def _extract_category(self, obj, cat):
        return [
            {
                'id': item.material.id,
                'Chinese_Name': item.material.Chinese_Name,
                'English_Name': item.material.English_Name,
            }
            for item in obj.recipe_items.all()
            if item.material.category == cat
        ]

    def get_Bases(self, obj):
        return self._extract_category(obj, 'base')

    def get_Liqueurs(self, obj):
        return self._extract_category(obj, 'liqueur')

    def get_Alcohols(self, obj):
        return self._extract_category(obj, 'alcohol')

    def get_Ingredients(self, obj):
        return self._extract_category(obj, 'ingredient')

    def create(self, validated_data):
        bases_data = self.initial_data.get('Bases', [])
        liqueurs_data = self.initial_data.get('Liqueurs', [])
        alcohols_data = self.initial_data.get('Alcohols', [])
        ingredients_data = self.initial_data.get('Ingredients', [])

        with transaction.atomic():
            cocktail = Cocktail.objects.create(**validated_data)
            _sync_recipe_items(
                cocktail,
                cocktail.recipe_ingredients,
                bases_data=bases_data,
                liqueurs_data=liqueurs_data,
                alcohols_data=alcohols_data,
                ingredients_data=ingredients_data,
            )
            return cocktail

    def update(self, instance, validated_data):
        bases_data = self.initial_data.get('Bases')
        liqueurs_data = self.initial_data.get('Liqueurs')
        alcohols_data = self.initial_data.get('Alcohols')
        ingredients_data = self.initial_data.get('Ingredients')

        with transaction.atomic():
            for field_name, value in validated_data.items():
                setattr(instance, field_name, value)
            instance.save()

            if any(x is not None for x in [bases_data, liqueurs_data, alcohols_data, ingredients_data]) or 'recipe_ingredients' in validated_data:
                _sync_recipe_items(
                    instance,
                    instance.recipe_ingredients if 'recipe_ingredients' in validated_data else None,
                    bases_data=bases_data,
                    liqueurs_data=liqueurs_data,
                    alcohols_data=alcohols_data,
                    ingredients_data=ingredients_data,
                )
            return instance
