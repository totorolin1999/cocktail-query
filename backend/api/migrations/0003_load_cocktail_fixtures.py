import json
from pathlib import Path

from django.core.management.color import no_style
from django.conf import settings
from django.db import migrations


def load_initial_cocktail_data(apps, schema_editor):
    if settings.TESTING:
        return

    Cocktail = apps.get_model('api', 'Cocktail')
    db_alias = schema_editor.connection.alias
    if Cocktail.objects.using(db_alias).exists():
        return

    fixture_path = Path(__file__).resolve().parents[1] / 'fixtures' / 'cocktail_data.json'
    with fixture_path.open(encoding='utf-8') as fixture_file:
        fixture_data = json.load(fixture_file)

    model_names = {
        'api.base': 'Base',
        'api.ingredient': 'Ingredient',
        'api.liqueur': 'Liqueur',
        'api.alcohol': 'Alcohol',
        'api.cocktail': 'Cocktail',
    }
    loaded_models = set()

    for entry in fixture_data:
        model = apps.get_model('api', model_names[entry['model']])
        fields = entry['fields'].copy()
        relations = {
            field_name: fields.pop(field_name)
            for field_name in list(fields)
            if model._meta.get_field(field_name).many_to_many
        }
        instance = model(pk=entry.get('pk'), **fields)
        instance.save(using=db_alias, force_insert=True)
        loaded_models.add(model)

        for field_name, related_ids in relations.items():
            getattr(instance, field_name).set(related_ids)

    with schema_editor.connection.cursor() as cursor:
        for statement in schema_editor.connection.ops.sequence_reset_sql(
            no_style(), loaded_models
        ):
            cursor.execute(statement)


def reverse_initial_cocktail_data(apps, schema_editor):
    Cocktail = apps.get_model('api', 'Cocktail')
    Base = apps.get_model('api', 'Base')
    Liqueur = apps.get_model('api', 'Liqueur')
    Alcohol = apps.get_model('api', 'Alcohol')
    Ingredient = apps.get_model('api', 'Ingredient')

    Cocktail.objects.all().delete()
    Ingredient.objects.all().delete()
    Alcohol.objects.all().delete()
    Liqueur.objects.all().delete()
    Base.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_alcohol_id_alter_base_id_alter_cocktail_id_alter_ingredient_id_alter_liqueur_id'),
    ]

    operations = [
        migrations.RunPython(load_initial_cocktail_data, reverse_code=reverse_initial_cocktail_data),
    ]
