from django.db import models

# Create your models here.

class Base(models.Model):
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Liqueur(models.Model):
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Alcohol(models.Model):
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Ingredient(models.Model):
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Cocktail(models.Model):
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)
    Bases = models.ManyToManyField(Base, blank=True)
    Liqueurs = models.ManyToManyField(Liqueur, blank=True)
    Alcohols = models.ManyToManyField(Alcohol, blank=True)
    Ingredients = models.ManyToManyField(Ingredient, blank=True)
    image = models.ImageField(default='cocktail_images/cocktail.svg', upload_to='cocktail_images')

    def __str__(self):
        return self.Chinese_Name
