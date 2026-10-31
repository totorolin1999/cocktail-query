import json
from pathlib import Path

from django.conf import settings
from django.db import migrations


MODEL_BY_CATEGORY = {
    'base': 'Base',
    'liqueur': 'Liqueur',
    'alcohol': 'Alcohol',
    'ingredient': 'Ingredient',
}
RELATION_FIELDS = {
    'Base': 'Bases',
    'Liqueur': 'Liqueurs',
    'Alcohol': 'Alcohols',
    'Ingredient': 'Ingredients',
}
COCKTAIL_FIELDS = (
    'Chinese_Name',
    'English_Name',
    'recipe_ingredients',
    'iba_category',
    'instructions_zh',
    'instructions_en',
    'glassware_zh',
    'glassware_en',
    'garnish_zh',
    'garnish_en',
    'flavor_zh',
    'flavor_en',
    'strength',
    'history_zh',
    'history_en',
    'source_url',
    'artwork_color',
    'is_active',
)


def correct_iba_recipe_details(apps, schema_editor):
    if settings.TESTING:
        return

    db_alias = schema_editor.connection.alias
    fixture_path = (
        Path(__file__).resolve().parents[1]
        / 'fixtures'
        / 'iba_cocktail_recipes.json'
    )
    with fixture_path.open(encoding='utf-8') as fixture_file:
        recipes = json.load(fixture_file)

    Cocktail = apps.get_model('api', 'Cocktail')
    material_models = {
        category: apps.get_model('api', model_name)
        for category, model_name in MODEL_BY_CATEGORY.items()
    }

    for recipe in recipes:
        cocktail, _ = Cocktail.objects.using(db_alias).get_or_create(
            English_Name=recipe['English_Name'],
            defaults={
                field: recipe[field]
                for field in COCKTAIL_FIELDS
            },
        )
        related_ids = {category: set() for category in MODEL_BY_CATEGORY}
        for item in recipe['recipe_ingredients']:
            Material = material_models[item['category']]
            material, _ = Material.objects.using(db_alias).get_or_create(
                English_Name=item['name_en'],
                defaults={'Chinese_Name': item['name_zh']},
            )
            if material.Chinese_Name != item['name_zh']:
                material.Chinese_Name = item['name_zh']
                material.save(using=db_alias, update_fields=['Chinese_Name'])
            related_ids[item['category']].add(material.pk)

        for field in COCKTAIL_FIELDS:
            setattr(cocktail, field, recipe[field])
        cocktail.save(using=db_alias)
        cocktail.Bases.set(related_ids['base'])
        cocktail.Liqueurs.set(related_ids['liqueur'])
        cocktail.Alcohols.set(related_ids['alcohol'])
        cocktail.Ingredients.set(related_ids['ingredient'])

    for model_name, relation_field in RELATION_FIELDS.items():
        Material = apps.get_model('api', model_name)
        used_ids = Material.objects.using(db_alias).filter(
            **{f'cocktail__{relation_field}__isnull': False}
        ).values_list('pk', flat=True)
        Material.objects.using(db_alias).exclude(pk__in=used_ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_replace_legacy_cocktail_images'),
    ]

    operations = [
        migrations.RunPython(correct_iba_recipe_details, migrations.RunPython.noop),
    ]
