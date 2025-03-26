from django.db import models

# Create your models here.

class Base(models.Model):
    id = models.AutoField(primary_key=True)
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Liqueur(models.Model):
    id = models.AutoField(primary_key=True)
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Alcohol(models.Model):
    id = models.AutoField(primary_key=True)
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Ingredient(models.Model):
    id = models.AutoField(primary_key=True)
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Chinese_Name

class Cocktail(models.Model):
    id = models.AutoField(primary_key=True)
    Chinese_Name = models.CharField(max_length=255)
    English_Name = models.CharField(max_length=255)
    Bases = models.ManyToManyField(Base, blank=True, null=True)
    Liqueurs = models.ManyToManyField(Liqueur, blank=True, null=True)
    Alcohols = models.ManyToManyField(Alcohol, blank=True, null=True)
    Ingredients = models.ManyToManyField(Ingredient, blank=True, null=True)

    def __str__(self):
        return self.Chinese_Name