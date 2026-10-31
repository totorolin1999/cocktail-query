from django.db import migrations


def update_iba_categories(apps, schema_editor):
    Cocktail = apps.get_model('api', 'Cocktail')
    cocktails = Cocktail.objects.using(schema_editor.connection.alias)
    cocktails.filter(iba_category='New Era Drinks').update(iba_category='New Era')
    cocktails.filter(iba_category='The Unforgettables').update(
        iba_category='The unforgettables',
    )


def restore_legacy_iba_categories(apps, schema_editor):
    Cocktail = apps.get_model('api', 'Cocktail')
    cocktails = Cocktail.objects.using(schema_editor.connection.alias)
    cocktails.filter(iba_category='New Era').update(iba_category='New Era Drinks')
    cocktails.filter(iba_category='The unforgettables').update(
        iba_category='The Unforgettables',
    )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_distinguish_base_spirit_names'),
    ]

    operations = [
        migrations.RunPython(
            update_iba_categories,
            restore_legacy_iba_categories,
        ),
    ]
