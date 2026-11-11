import json
from pathlib import Path

from django.conf import settings
from django.db import migrations


COCKTAIL_FIELDS = (
    ('chinese_name', 'Chinese_Name'),
    ('english_name', 'English_Name'),
    ('recipe_ingredients', 'recipe_ingredients'),
    ('iba_category', 'iba_category'),
    ('instructions_zh', 'instructions_zh'),
    ('instructions_en', 'instructions_en'),
    ('glassware_zh', 'glassware_zh'),
    ('glassware_en', 'glassware_en'),
    ('garnish_zh', 'garnish_zh'),
    ('garnish_en', 'garnish_en'),
    ('flavor_zh', 'flavor_zh'),
    ('flavor_en', 'flavor_en'),
    ('strength', 'strength'),
    ('history_zh', 'history_zh'),
    ('history_en', 'history_en'),
    ('source_url', 'source_url'),
    ('artwork_color', 'artwork_color'),
    ('is_active', 'is_active'),
)


def import_iba_recipes(apps, schema_editor):
    if getattr(settings, 'TESTING', False):
        return

    db_alias = schema_editor.connection.alias
    Cocktail = apps.get_model('api', 'Cocktail')
    Material = apps.get_model('api', 'Material')
    CocktailRecipeItem = apps.get_model('api', 'CocktailRecipeItem')

    if Cocktail.objects.using(db_alias).exists():
        return

    app_dir = Path(__file__).resolve().parents[1]
    fixture_path = app_dir / 'fixtures' / 'iba_cocktail_recipes.json'
    with fixture_path.open(encoding='utf-8') as fixture_file:
        recipes = json.load(fixture_file)

    for recipe in recipes:
        cocktail_data = {
            model_attr: recipe.get(json_key, '' if model_attr != 'is_active' and model_attr != 'recipe_ingredients' else (True if model_attr == 'is_active' else []))
            for model_attr, json_key in COCKTAIL_FIELDS
        }
        cocktail = Cocktail.objects.using(db_alias).create(**cocktail_data)

        recipe_items = []
        for index, item in enumerate(recipe.get('recipe_ingredients', [])):
            category = item.get('category', 'ingredient')
            name_en = item.get('name_en', '').strip()
            name_zh = item.get('name_zh', '').strip()

            material = (
                Material.objects.using(db_alias)
                .filter(category=category, english_name=name_en)
                .first()
            )
            if not material and name_zh:
                material = (
                    Material.objects.using(db_alias)
                    .filter(category=category, chinese_name=name_zh)
                    .first()
                )
            if not material:
                material = Material.objects.using(db_alias).create(
                    chinese_name=name_zh or name_en,
                    english_name=name_en or name_zh,
                    category=category,
                )
            elif material.chinese_name != name_zh and name_zh:
                material.chinese_name = name_zh
                material.save(using=db_alias, update_fields=['chinese_name'])

            recipe_items.append(
                CocktailRecipeItem(
                    cocktail=cocktail,
                    material=material,
                    amount=item.get('amount', ''),
                    unit_zh=item.get('unit_zh', ''),
                    unit_en=item.get('unit_en', ''),
                    order=index,
                )
            )

        if recipe_items:
            CocktailRecipeItem.objects.using(db_alias).bulk_create(recipe_items)


def reverse_iba_recipes(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    CocktailRecipeItem = apps.get_model('api', 'CocktailRecipeItem')
    Cocktail = apps.get_model('api', 'Cocktail')
    Material = apps.get_model('api', 'Material')

    CocktailRecipeItem.objects.using(db_alias).all().delete()
    Cocktail.objects.using(db_alias).all().delete()
    Material.objects.using(db_alias).all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(import_iba_recipes, reverse_code=reverse_iba_recipes),
    ]
