import json
from pathlib import Path

from django.conf import settings
from django.db import migrations


def distinguish_base_spirit_names(apps, schema_editor):
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

    Base = apps.get_model('api', 'Base')
    Cocktail = apps.get_model('api', 'Cocktail')

    for recipe in recipes:
        for item in recipe['recipe_ingredients']:
            if item['category'] == 'base':
                Base.objects.using(db_alias).filter(
                    English_Name=item['name_en'],
                ).update(Chinese_Name=item['name_zh'])

        Cocktail.objects.using(db_alias).filter(
            English_Name=recipe['English_Name'],
        ).update(recipe_ingredients=recipe['recipe_ingredients'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_correct_iba_recipe_details'),
    ]

    operations = [
        migrations.RunPython(
            distinguish_base_spirit_names,
            migrations.RunPython.noop,
        ),
    ]
