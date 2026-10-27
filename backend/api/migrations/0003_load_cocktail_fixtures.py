from django.db import migrations
from django.core.management import call_command


def load_initial_cocktail_data(apps, schema_editor):
    Cocktail = apps.get_model('api', 'Cocktail')
    # 防呆機制：若資料庫已存在調酒資料則略過，避免重複載入或覆蓋變更
    if not Cocktail.objects.exists():
        print("\n[Auto-Migration] Loading initial cocktail data from fixture...")
        call_command('loaddata', 'cocktail_data.json')


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
