from rest_framework import serializers
from django.db import transaction
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


class NestedBaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Base
        fields = '__all__'
        extra_kwargs = {
            'Chinese_Name': {'validators': []},
            'English_Name': {'validators': []},
        }


class NestedLiqueurSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Liqueur
        fields = '__all__'
        extra_kwargs = {
            'Chinese_Name': {'validators': []},
            'English_Name': {'validators': []},
        }


class NestedAlcoholSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Alcohol
        fields = '__all__'
        extra_kwargs = {
            'Chinese_Name': {'validators': []},
            'English_Name': {'validators': []},
        }


class NestedIngredientSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Ingredient
        fields = '__all__'
        extra_kwargs = {
            'Chinese_Name': {'validators': []},
            'English_Name': {'validators': []},
        }


class CocktailSerializer(serializers.ModelSerializer):
    Bases = NestedBaseSerializer(many=True, required=False)
    Liqueurs = NestedLiqueurSerializer(many=True, required=False)
    Alcohols = NestedAlcoholSerializer(many=True, required=False)
    Ingredients = NestedIngredientSerializer(many=True, required=False)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Cocktail
        fields = '__all__'

    def create(self, validated_data):
        bases_data = validated_data.pop('Bases', [])
        liqueurs_data = validated_data.pop('Liqueurs', [])
        alcohols_data = validated_data.pop('Alcohols', [])
        ingredients_data = validated_data.pop('Ingredients', [])

        with transaction.atomic():
            cocktail = Cocktail.objects.create(**validated_data)
            cocktail.Bases.set([item['id'] for item in bases_data if 'id' in item])
            cocktail.Liqueurs.set([item['id'] for item in liqueurs_data if 'id' in item])
            cocktail.Alcohols.set([item['id'] for item in alcohols_data if 'id' in item])
            cocktail.Ingredients.set([item['id'] for item in ingredients_data if 'id' in item])
            return cocktail

    def update(self, instance, validated_data):
        bases_data = validated_data.pop('Bases', None)
        liqueurs_data = validated_data.pop('Liqueurs', None)
        alcohols_data = validated_data.pop('Alcohols', None)
        ingredients_data = validated_data.pop('Ingredients', None)

        with transaction.atomic():
            for field_name, value in validated_data.items():
                setattr(instance, field_name, value)
            instance.save()

            if bases_data is not None:
                instance.Bases.set([item['id'] for item in bases_data if 'id' in item])
            if liqueurs_data is not None:
                instance.Liqueurs.set([item['id'] for item in liqueurs_data if 'id' in item])
            if alcohols_data is not None:
                instance.Alcohols.set([item['id'] for item in alcohols_data if 'id' in item])
            if ingredients_data is not None:
                instance.Ingredients.set([item['id'] for item in ingredients_data if 'id' in item])

            return instance
