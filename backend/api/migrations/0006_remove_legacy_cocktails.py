import json
from pathlib import Path

from django.db import migrations


MODEL_NAMES = ('Base', 'Liqueur', 'Alcohol', 'Ingredient')
RELATION_FIELDS = {
    'Base': 'Bases',
    'Liqueur': 'Liqueurs',
    'Alcohol': 'Alcohols',
    'Ingredient': 'Ingredients',
}


def remove_legacy_cocktails(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    app_dir = Path(__file__).resolve().parents[1]

    with (app_dir / 'fixtures' / 'iba_cocktail_recipes.json').open(encoding='utf-8') as fixture_file:
        iba_recipes = json.load(fixture_file)
    with (app_dir / 'fixtures' / 'cocktail_data.json').open(encoding='utf-8') as fixture_file:
        initial_data = json.load(fixture_file)

    iba_names = {recipe['English_Name'] for recipe in iba_recipes}
    legacy_names = {
        entry['fields']['English_Name']
        for entry in initial_data
        if entry['model'] == 'api.cocktail'
    } - iba_names

    Cocktail = apps.get_model('api', 'Cocktail')
    Cocktail.objects.using(db_alias).filter(English_Name__in=legacy_names).delete()

    for model_name in MODEL_NAMES:
        Material = apps.get_model('api', model_name)
        relation_field = RELATION_FIELDS[model_name]
        used_material_ids = Material.objects.using(db_alias).filter(
            **{f'cocktail__{relation_field}__isnull': False}
        ).values_list('pk', flat=True)
        Material.objects.using(db_alias).exclude(pk__in=used_material_ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_import_iba_cocktail_recipes'),
    ]

    operations = [
        migrations.RunPython(remove_legacy_cocktails),
    ]
