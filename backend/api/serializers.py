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
        fields = ['id', 'chinese_name', 'english_name', 'category']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'Chinese_Name' in data and 'chinese_name' not in data:
            data['chinese_name'] = data['Chinese_Name']
        if 'English_Name' in data and 'english_name' not in data:
            data['english_name'] = data['English_Name']
        return super().to_internal_value(data)


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
            material_id = item.get('material_id') or (item.get('material') if isinstance(item.get('material'), (int, str)) else None) or item.get('id')

            material = None
            if material_id:
                material = Material.objects.filter(id=material_id).first()
            if not material and name_en:
                material = Material.objects.filter(category=cat, english_name=name_en).first()
            if not material and name_zh:
                material = Material.objects.filter(category=cat, chinese_name=name_zh).first()
            if not material and (name_en or name_zh):
                material = Material.objects.create(
                    category=cat,
                    english_name=name_en or name_zh,
                    chinese_name=name_zh or name_en,
                )
            if not material:
                continue

            items_to_create.append(
                CocktailRecipeItem(
                    cocktail=cocktail,
                    material=material,
                    amount=item.get('amount', ''),
                    unit_zh=item.get('unit_zh', ''),
                    unit_en=item.get('unit_en', ''),
                    order=item.get('order', index),
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
    recipe_items = CocktailRecipeItemSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Cocktail
        exclude = ['materials', 'recipe_ingredients']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'Chinese_Name' in data and 'chinese_name' not in data:
            data['chinese_name'] = data['Chinese_Name']
        if 'English_Name' in data and 'english_name' not in data:
            data['english_name'] = data['English_Name']
        return super().to_internal_value(data)

    def create(self, validated_data):
        bases_data = self.initial_data.get('bases', self.initial_data.get('Bases', []))
        liqueurs_data = self.initial_data.get('liqueurs', self.initial_data.get('Liqueurs', []))
        alcohols_data = self.initial_data.get('alcohols', self.initial_data.get('Alcohols', []))
        ingredients_data = self.initial_data.get('ingredients', self.initial_data.get('Ingredients', []))
        recipe_ingredients = self.initial_data.get('recipe_ingredients')

        with transaction.atomic():
            cocktail = Cocktail.objects.create(**validated_data)
            _sync_recipe_items(
                cocktail,
                recipe_ingredients,
                bases_data=bases_data,
                liqueurs_data=liqueurs_data,
                alcohols_data=alcohols_data,
                ingredients_data=ingredients_data,
            )
            return cocktail

    def update(self, instance, validated_data):
        bases_data = self.initial_data.get('bases', self.initial_data.get('Bases'))
        liqueurs_data = self.initial_data.get('liqueurs', self.initial_data.get('Liqueurs'))
        alcohols_data = self.initial_data.get('alcohols', self.initial_data.get('Alcohols'))
        ingredients_data = self.initial_data.get('ingredients', self.initial_data.get('Ingredients'))
        recipe_ingredients = self.initial_data.get('recipe_ingredients')

        with transaction.atomic():
            for field_name, value in validated_data.items():
                setattr(instance, field_name, value)
            instance.save()

            if any(x is not None for x in [bases_data, liqueurs_data, alcohols_data, ingredients_data, recipe_ingredients]):
                _sync_recipe_items(
                    instance,
                    recipe_ingredients,
                    bases_data=bases_data,
                    liqueurs_data=liqueurs_data,
                    alcohols_data=alcohols_data,
                    ingredients_data=ingredients_data,
                )
            return instance
