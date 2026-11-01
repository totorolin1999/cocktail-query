from django.contrib import admin
from .models import Cocktail, Material, CocktailRecipeItem


class CocktailRecipeItemInline(admin.TabularInline):
    model = CocktailRecipeItem
    extra = 1


@admin.register(Cocktail)
class CocktailAdmin(admin.ModelAdmin):
    list_display = ('Chinese_Name', 'English_Name', 'iba_category', 'strength', 'is_active')
    list_filter = ('is_active', 'iba_category', 'strength')
    search_fields = ('Chinese_Name', 'English_Name')
    inlines = [CocktailRecipeItemInline]


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('Chinese_Name', 'English_Name', 'category')
    list_filter = ('category',)
    search_fields = ('Chinese_Name', 'English_Name')


@admin.register(CocktailRecipeItem)
class CocktailRecipeItemAdmin(admin.ModelAdmin):
    list_display = ('cocktail', 'material', 'amount', 'order')
    list_filter = ('material__category',)
    search_fields = ('cocktail__Chinese_Name', 'material__Chinese_Name')
