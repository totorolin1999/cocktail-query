from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_load_cocktail_fixtures'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cocktail',
            name='image',
            field=models.ImageField(
                default='cocktail_images/illustration.svg',
                upload_to='cocktail_images',
            ),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='recipe_ingredients',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='iba_category',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='instructions_zh',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='instructions_en',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='glassware_zh',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='glassware_en',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='garnish_zh',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='garnish_en',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='flavor_zh',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='flavor_en',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='strength',
            field=models.CharField(
                blank=True,
                choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='history_zh',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='history_en',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='source_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='artwork_color',
            field=models.CharField(
                choices=[
                    ('amber', 'Amber'),
                    ('red', 'Red'),
                    ('pink', 'Pink'),
                    ('blue', 'Blue'),
                    ('green', 'Green'),
                    ('cream', 'Cream'),
                    ('clear', 'Clear'),
                    ('purple', 'Purple'),
                    ('orange', 'Orange'),
                    ('brown', 'Brown'),
                ],
                default='amber',
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name='cocktail',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
