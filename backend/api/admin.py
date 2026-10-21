from django.contrib import admin

# Register your models here.

from .models import Cocktail, Base, Liqueur, Alcohol, Ingredient

admin.site.register(Cocktail)
admin.site.register(Base)
admin.site.register(Liqueur)
admin.site.register(Alcohol)
admin.site.register(Ingredient)