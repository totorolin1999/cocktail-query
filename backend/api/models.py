from django.db import models


class Material(models.Model):
    CATEGORY_CHOICES = [
        ('base', '基酒'),
        ('liqueur', '利口酒'),
        ('alcohol', '其他酒類'),
        ('ingredient', '副材料'),
    ]

    Chinese_Name = models.CharField(max_length=255, db_index=True)
    English_Name = models.CharField(max_length=255, db_index=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, db_index=True)

    class Meta:
        ordering = ['id']
        verbose_name = '材料'
        verbose_name_plural = '材料'
        indexes = [
            models.Index(fields=['category', 'id']),
            models.Index(fields=['category', 'English_Name']),
        ]

    def __str__(self):
        return f"{self.Chinese_Name} ({self.get_category_display()})"


class CocktailQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def with_related(self):
        return self.prefetch_related('recipe_items__material')


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
    materials = models.ManyToManyField(
        Material,
        through='CocktailRecipeItem',
        blank=True,
        related_name='cocktails',
    )
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


class CocktailRecipeItem(models.Model):
    cocktail = models.ForeignKey(
        Cocktail,
        on_delete=models.CASCADE,
        related_name='recipe_items',
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='recipe_items',
    )
    amount = models.CharField(max_length=50, blank=True, default='')
    unit_zh = models.CharField(max_length=50, blank=True, default='')
    unit_en = models.CharField(max_length=50, blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = '酒譜用量項目'
        verbose_name_plural = '酒譜用量項目'
        indexes = [
            models.Index(fields=['cocktail', 'order']),
        ]

    def __str__(self):
        return f"{self.cocktail.Chinese_Name} - {self.material.Chinese_Name} ({self.amount})"
