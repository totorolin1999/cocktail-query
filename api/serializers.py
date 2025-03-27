from rest_framework import serializers
from .models import Cocktail, Base, Liqueur, Alcohol, Ingredient



class BaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Base
        fields = '__all__'

class LiqueurSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Liqueur
        fields = '__all__'

class AlcoholSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Alcohol
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Ingredient
        fields = '__all__'

class CocktailSerializer(serializers.ModelSerializer):
    Bases = BaseSerializer(many=True)
    Liqueurs = LiqueurSerializer(many=True)
    Alcohols = AlcoholSerializer(many=True)
    Ingredients = IngredientSerializer(many=True)

    class Meta:
        model = Cocktail
        fields = '__all__'

    def create(self, validated_data):
        bases_data = validated_data.pop('Bases')
        liqueurs_data = validated_data.pop('Liqueurs')
        alcohols_data = validated_data.pop('Alcohols')
        ingredients_data = validated_data.pop('Ingredients')
        cocktail = Cocktail.objects.create(**validated_data)
        
        baseIdList = []
        for base_data in bases_data:
            baseIdList.append(base_data["id"])
        cocktail.Bases.set(baseIdList)

        liqueurIdList = []
        for liqueur_data in liqueurs_data:
            liqueurIdList.append(liqueur_data["id"])
        cocktail.Liqueurs.set(liqueurIdList)

        alcoholIdList = []
        for alcohol_data in alcohols_data:
            alcoholIdList.append(alcohol_data["id"])
        cocktail.Alcohols.set(alcoholIdList)

        ingredientIdList = []
        for ingredient_data in ingredients_data:
            ingredientIdList.append(ingredient_data["id"])
        cocktail.Ingredients.set(ingredientIdList)

        return cocktail
    
    def update(self, instance, validated_data):
        instance.Chinese_Name = validated_data.get('Chinese_Name', instance.Chinese_Name)
        instance.English_Name = validated_data.get('English_Name', instance.English_Name)
        instance.save()

        return instance