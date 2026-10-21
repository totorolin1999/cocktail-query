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
    image = serializers.ImageField(required=False, allow_null=True)

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
        bases_data = validated_data.pop('Bases', None)
        liqueurs_data = validated_data.pop('Liqueurs', None)
        alcohols_data = validated_data.pop('Alcohols', None)
        ingredients_data = validated_data.pop('Ingredients', None)

        instance.Chinese_Name = validated_data.get('Chinese_Name', instance.Chinese_Name)
        instance.English_Name = validated_data.get('English_Name', instance.English_Name)
        instance.image = validated_data.get('image', instance.image)
        instance.save()

        if bases_data is not None:
            base_ids = [item['id'] for item in bases_data if 'id' in item]
            instance.Bases.set(base_ids)
        if liqueurs_data is not None:
            liqueur_ids = [item['id'] for item in liqueurs_data if 'id' in item]
            instance.Liqueurs.set(liqueur_ids)
        if alcohols_data is not None:
            alcohol_ids = [item['id'] for item in alcohols_data if 'id' in item]
            instance.Alcohols.set(alcohol_ids)
        if ingredients_data is not None:
            ingredient_ids = [item['id'] for item in ingredients_data if 'id' in item]
            instance.Ingredients.set(ingredient_ids)

        return instance