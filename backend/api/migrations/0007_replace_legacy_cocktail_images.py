import re

from django.db import migrations


LEGACY_IMAGE = re.compile(r'/?cocktail_images/\d+\.jpe?g', re.IGNORECASE)


def replace_legacy_images(apps, schema_editor):
    db_alias = schema_editor.connection.alias
    Cocktail = apps.get_model('api', 'Cocktail')

    for cocktail in Cocktail.objects.using(db_alias).only('pk', 'image').iterator():
        image_name = cocktail.image.name if cocktail.image else ''
        if LEGACY_IMAGE.fullmatch(image_name):
            cocktail.image = 'cocktail_images/illustration.svg'
            cocktail.save(using=db_alias, update_fields=['image'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_legacy_cocktails'),
    ]

    operations = [
        migrations.RunPython(replace_legacy_images, migrations.RunPython.noop),
    ]
