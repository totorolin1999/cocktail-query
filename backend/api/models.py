from django.db import models


class Base(models.Model):
    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)

    class Meta:
        ordering = ['id']
        verbose_name = '基酒'
        verbose_name_plural = '基酒'

    def __str__(self):
        return self.Chinese_Name


class Liqueur(models.Model):
    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)

    class Meta:
        ordering = ['id']
        verbose_name = '利口酒'
        verbose_name_plural = '利口酒'

    def __str__(self):
        return self.Chinese_Name


class Alcohol(models.Model):
    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)

    class Meta:
        ordering = ['id']
        verbose_name = '其他酒類'
        verbose_name_plural = '其他酒類'

    def __str__(self):
        return self.Chinese_Name


class Ingredient(models.Model):
    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)

    class Meta:
        ordering = ['id']
        verbose_name = '副材料'
        verbose_name_plural = '副材料'

    def __str__(self):
        return self.Chinese_Name


class CocktailQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def with_related(self):
        return self.prefetch_related('Bases', 'Liqueurs', 'Alcohols', 'Ingredients')


class CocktailManager(models.Manager.from_queryset(CocktailQuerySet)):
    pass


class Cocktail(models.Model):
    ARTWORK_COLORS = [
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
    ]
    STRENGTH_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)
    Bases = models.ManyToManyField(Base, blank=True)
    Liqueurs = models.ManyToManyField(Liqueur, blank=True)
    Alcohols = models.ManyToManyField(Alcohol, blank=True)
    Ingredients = models.ManyToManyField(Ingredient, blank=True)
    image = models.ImageField(default='cocktail_images/illustration.svg', upload_to='cocktail_images')
    recipe_ingredients = models.JSONField(default=list, blank=True)
    iba_category = models.CharField(max_length=50, blank=True, db_index=True)
    instructions_zh = models.TextField(blank=True)
    instructions_en = models.TextField(blank=True)
    glassware_zh = models.CharField(max_length=100, blank=True)
    glassware_en = models.CharField(max_length=100, blank=True)
    garnish_zh = models.CharField(max_length=255, blank=True)
    garnish_en = models.CharField(max_length=255, blank=True)
    flavor_zh = models.TextField(blank=True)
    flavor_en = models.TextField(blank=True)
    strength = models.CharField(max_length=10, choices=STRENGTH_CHOICES, blank=True, db_index=True)
    history_zh = models.TextField(blank=True)
    history_en = models.TextField(blank=True)
    source_url = models.URLField(blank=True)
    artwork_color = models.CharField(max_length=10, choices=ARTWORK_COLORS, default='amber')
    is_active = models.BooleanField(default=True, db_index=True)

    objects = CocktailManager()

    class Meta:
        ordering = ['id']
        verbose_name = '調酒'
        verbose_name_plural = '調酒'
        indexes = [
            models.Index(fields=['is_active', 'iba_category']),
            models.Index(fields=['is_active', 'strength']),
        ]

    def __str__(self):
        return self.Chinese_Name
