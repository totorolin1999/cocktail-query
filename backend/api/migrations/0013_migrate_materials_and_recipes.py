from django.conf import settings
from django.db import migrations


def populate_materials_and_recipe_items(apps, schema_editor):
    if settings.TESTING:
        return

    db_alias = schema_editor.connection.alias

    Base = apps.get_model('api', 'Base')
    Liqueur = apps.get_model('api', 'Liqueur')
    Alcohol = apps.get_model('api', 'Alcohol')
    Ingredient = apps.get_model('api', 'Ingredient')
    Material = apps.get_model('api', 'Material')
    Cocktail = apps.get_model('api', 'Cocktail')
    CocktailRecipeItem = apps.get_model('api', 'CocktailRecipeItem')

    model_categories = [
        ('base', Base),
        ('liqueur', Liqueur),
        ('alcohol', Alcohol),
        ('ingredient', Ingredient),
    ]

    # 1. 搬遷現有材料資料到 Material
    old_to_material = {}
    for category, OldModel in model_categories:
        for old_item in OldModel.objects.using(db_alias).all():
            material = (
                Material.objects.using(db_alias)
                .filter(category=category, English_Name=old_item.English_Name)
                .first()
            )
            if not material:
                material = Material.objects.using(db_alias).create(
                    Chinese_Name=old_item.Chinese_Name,
                    English_Name=old_item.English_Name,
                    category=category,
                )
            old_to_material[(category, old_item.id)] = material

    # 2. 將 Cocktail 的 recipe_ingredients 結構化資料轉為 CocktailRecipeItem
    for cocktail in Cocktail.objects.using(db_alias).all():
        recipe_ingredients = cocktail.recipe_ingredients or []
        created_recipe_items = []

        if recipe_ingredients:
            for index, item in enumerate(recipe_ingredients):
                category = item.get('category', 'ingredient')
                name_en = item.get('name_en', '').strip()
                name_zh = item.get('name_zh', '').strip()

                material = (
                    Material.objects.using(db_alias)
                    .filter(category=category, English_Name=name_en)
                    .first()
                )
                if not material and name_zh:
                    material = (
                        Material.objects.using(db_alias)
                        .filter(category=category, Chinese_Name=name_zh)
                        .first()
                    )
                if not material:
                    material = Material.objects.using(db_alias).create(
                        Chinese_Name=name_zh or name_en,
                        English_Name=name_en or name_zh,
                        category=category,
                    )

                created_recipe_items.append(
                    CocktailRecipeItem(
                        cocktail=cocktail,
                        material=material,
                        amount=item.get('amount', ''),
                        unit_zh=item.get('unit_zh', ''),
                        unit_en=item.get('unit_en', ''),
                        order=index,
                    )
                )
        else:
            # 若無 recipe_ingredients JSON，則由 M2M 關聯建立基本用量項目
            order = 0
            for category, rel_name in [
                ('base', 'Bases'),
                ('liqueur', 'Liqueurs'),
                ('alcohol', 'Alcohols'),
                ('ingredient', 'Ingredients'),
            ]:
                for rel_obj in getattr(cocktail, rel_name).all():
                    mat = old_to_material.get((category, rel_obj.id))
                    if mat:
                        created_recipe_items.append(
                            CocktailRecipeItem(
                                cocktail=cocktail,
                                material=mat,
                                amount='',
                                unit_zh='',
                                unit_en='',
                                order=order,
                            )
                        )
                        order += 1

        if created_recipe_items:
            CocktailRecipeItem.objects.using(db_alias).bulk_create(created_recipe_items)


def reverse_populate(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    CocktailRecipeItem = apps.get_model('api', 'CocktailRecipeItem')
    Material = apps.get_model('api', 'Material')

    CocktailRecipeItem.objects.using(db_alias).all().delete()
    Material.objects.using(db_alias).all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_cocktailrecipeitem_material_and_more'),
    ]

    operations = [
        migrations.RunPython(
            populate_materials_and_recipe_items,
            reverse_populate,
        ),
    ]
