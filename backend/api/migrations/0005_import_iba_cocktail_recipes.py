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


def import_iba_recipes(apps, schema_editor):
    if settings.TESTING:
        return

    db_alias = schema_editor.connection.alias
    app_dir = Path(__file__).resolve().parents[1]
    with (app_dir / 'fixtures' / 'iba_cocktail_recipes.json').open(encoding='utf-8') as fixture_file:
        recipes = json.load(fixture_file)
    with (app_dir / 'fixtures' / 'cocktail_data.json').open(encoding='utf-8') as fixture_file:
        initial_data = json.load(fixture_file)

    Cocktail = apps.get_model('api', 'Cocktail')
    material_models = {
        category: apps.get_model('api', model_name)
        for category, model_name in MODEL_BY_CATEGORY.items()
    }
    iba_names = {recipe['English_Name'] for recipe in recipes}
    original_names = {
        entry['fields']['English_Name']
        for entry in initial_data
        if entry['model'] == 'api.cocktail'
    }

    Cocktail.objects.using(db_alias).filter(
        English_Name__in=original_names - iba_names,
    ).update(is_active=False)

    for recipe in recipes:
        cocktail = (
            Cocktail.objects.using(db_alias)
            .filter(English_Name=recipe['English_Name'])
            .order_by('pk')
            .first()
        )
        if cocktail is None:
            cocktail = Cocktail()

        related_ids = {category: set() for category in MODEL_BY_CATEGORY}
        for item in recipe['recipe_ingredients']:
            category = item['category']
            Material = material_models[category]
            material, _ = Material.objects.using(db_alias).get_or_create(
                English_Name=item['name_en'],
                defaults={'Chinese_Name': item['name_zh']},
            )
            if material.Chinese_Name != item['name_zh']:
                material.Chinese_Name = item['name_zh']
                material.save(using=db_alias, update_fields=['Chinese_Name'])
            related_ids[category].add(material.pk)

        for field in COCKTAIL_FIELDS:
            setattr(cocktail, field, recipe[field])
        cocktail.save(using=db_alias)
        cocktail.Bases.set(related_ids['base'])
        cocktail.Liqueurs.set(related_ids['liqueur'])
        cocktail.Alcohols.set(related_ids['alcohol'])
        cocktail.Ingredients.set(related_ids['ingredient'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_cocktail_recipe_details'),
    ]

    operations = [
        migrations.RunPython(import_iba_recipes, migrations.RunPython.noop),
    ]
