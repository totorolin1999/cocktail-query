from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response

from .serializers import CocktailSerializer, BaseSerializer, LiqueurSerializer, AlcoholSerializer, IngredientSerializer
from .models import Cocktail, Base, Liqueur, Alcohol, Ingredient
from django.db.models import Q

import joblib
import pandas as pd
import csv
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Create your views here.

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Token': '/api/token',
        'Refresh': '/api/token/refresh',
        'List': '/cocktail-list/',
        'Detail': '/cocktail-detail/<str:pk>/',
        'Create': '/cocktail-create/',
        'Update': '/cocktail-update/<str:pk>/',
        'Delete': '/cocktail-delete/<str:pk>/',
    }
    return Response(api_urls)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def cocktailList(request):
    
    name = request.query_params.get('name')
    bases = request.query_params.get('bases[]')
    liqueurs = request.query_params.get('liqueurs[]')
    alcohols = request.query_params.get('alcohols[]')
    ingredients = request.query_params.get('ingredients[]')

    if name == None or bases == None or liqueurs == None or alcohols == None or ingredients == None:
        cocktails = Cocktail.objects.all()
        serializer = CocktailSerializer(cocktails, many=True)
        return Response(serializer.data)
    
    cocktails = Cocktail.objects.filter(Q(Chinese_Name__contains=name) | Q(English_Name__contains=name))
    if len(bases):
        # bases = bases.split("|")
        bases = list(map(int, bases.split("|")))
        for base in bases:
            cocktails =  cocktails.filter(Q(Bases=base))
    if len(liqueurs):
        liqueurs = list(map(int, liqueurs.split("|")))
        for liqueur in liqueurs:
            cocktails =  cocktails.filter(Q(Liqueurs=liqueur))
    if len(alcohols):
        alcohols = list(map(int, alcohols.split("|")))
        for alcohol in alcohols:
            cocktails =  cocktails.filter(Q(Alcohols=alcohol))
    if len(ingredients):
        ingredients = list(map(int, ingredients.split("|")))
        for ingredient in ingredients:
            cocktails =  cocktails.filter(Q(Ingredients=ingredient))
    serializer = CocktailSerializer(cocktails, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def cocktailDetail(request, pk):
    cocktails = Cocktail.objects.get(Cocktail_ID=pk)
    serializer = CocktailSerializer(cocktails, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cocktailCreate(request):

    baseList = []
    for baseData in request.data["Bases"]:
        baseObj = Base.objects.get(Base_ID=baseData['value'])
        baseList.append({
            "Base_ID": baseObj.Base_ID,
            "Chinese_Name": baseObj.Chinese_Name,
            "English_Name": baseObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Bases"] = baseList

    liqueurList = []
    for liqueurData in request.data["Liqueurs"]:
        liqueurObj = Liqueur.objects.get(Liqueur_ID=liqueurData['value'])
        liqueurList.append({
            "Liqueur_ID": liqueurObj.Liqueur_ID,
            "Chinese_Name": liqueurObj.Chinese_Name,
            "English_Name": liqueurObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Liqueurs"] = liqueurList

    alcoholList = []
    for alcoholData in request.data["Alcohols"]:
        alcoholObj = Alcohol.objects.get(Alcohol_ID=alcoholData['value'])
        alcoholList.append({
            "Alcohol_ID": alcoholObj.Alcohol_ID,
            "Chinese_Name": alcoholObj.Chinese_Name,
            "English_Name": alcoholObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Alcohols"] = alcoholList

    ingredientList = []
    for ingredientData in request.data["Ingredients"]:
        ingredientObj = Ingredient.objects.get(Ingredient_ID=ingredientData['value'])
        ingredientList.append({
            "Ingredient_ID": ingredientObj.Ingredient_ID,
            "Chinese_Name": ingredientObj.Chinese_Name,
            "English_Name": ingredientObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Ingredients"] = ingredientList

    cocktailSerializer = CocktailSerializer(data=cocktailData)
    # cocktailSerializer = CocktailSerializer(data=request.data)

    if cocktailSerializer.is_valid():
        cocktailSerializer.save()
        buildModel()

    return Response(cocktailSerializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cocktailUpdate(request, pk):
    cocktail = Cocktail.objects.get(Cocktail_ID=pk)
    serializer = CocktailSerializer(instance=cocktail,data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        buildModel()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cocktailDelete(request, pk):
    cocktail = Cocktail.objects.get(Cocktail_ID=pk)
    cocktail.delete()
    buildModel()

    return Response('刪除成功')

@api_view(['GET'])
def baseList(request):
    bases = Base.objects.all()
    serializer = BaseSerializer(bases, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def baseDetail(request, pk):
    bases = Base.objects.get(Base_ID=pk)
    serializer = BaseSerializer(bases, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def baseCreate(request):
    serializer = BaseSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def baseUpdate(request, pk):
    base = Base.objects.get(Base_ID=pk)
    serializer = BaseSerializer(instance=base,data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def baseDelete(request, pk):
    base = Base.objects.get(Base_ID=pk)
    base.delete()

    return Response('刪除成功')

@api_view(['GET'])
def liqueurList(request):
    liqueurs = Liqueur.objects.all()
    serializer = LiqueurSerializer(liqueurs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def liqueurDetail(request, pk):
    liqueurs = Liqueur.objects.get(Liqueur_ID=pk)
    serializer = LiqueurSerializer(liqueurs, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def liqueurCreate(request):
    serializer = LiqueurSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def liqueurUpdate(request, pk):
    liqueur = Liqueur.objects.get(Liqueur_ID=pk)
    serializer = LiqueurSerializer(instance=liqueur,data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def liqueurDelete(request, pk):
    liqueur = Liqueur.objects.get(Liqueur_ID=pk)
    liqueur.delete()

    return Response('刪除成功')

@api_view(['GET'])
def alcoholList(request):
    alcohols = Alcohol.objects.all()
    serializer = AlcoholSerializer(alcohols, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def alcoholDetail(request, pk):
    alcohols = Alcohol.objects.get(Alcohol_ID=pk)
    serializer = AlcoholSerializer(alcohols, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def alcoholCreate(request):
    serializer = AlcoholSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def alcoholUpdate(request, pk):
    alcohol = Alcohol.objects.get(Alcohol_ID=pk)
    serializer = AlcoholSerializer(instance=alcohol,data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def alcoholDelete(request, pk):
    alcohol = Alcohol.objects.get(Alcohol_ID=pk)
    alcohol.delete()

    return Response('刪除成功')

@api_view(['GET'])
def ingredientList(request):
    ingredients = Ingredient.objects.all()
    serializer = IngredientSerializer(ingredients, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ingredientDetail(request, pk):
    ingredients = Ingredient.objects.get(Ingredient_ID=pk)
    serializer = IngredientSerializer(ingredients, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ingredientCreate(request):
    serializer = IngredientSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ingredientUpdate(request, pk):
    ingredient = Ingredient.objects.get(Ingredient_ID=pk)
    serializer = IngredientSerializer(instance=ingredient,data=request.data)
    
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def ingredientDelete(request, pk):
    ingredient = Ingredient.objects.get(Ingredient_ID=pk)
    ingredient.delete()

    return Response('刪除成功')

@api_view(['GET'])
def baseChart(request):
    bases = Base.objects.all()
    chartList = []
    for base in bases:
        bases = Base.objects.all()
        cocktails = Cocktail.objects.filter(Q(Bases=base))
        chartList.append({"label": base.Chinese_Name, "size": len(cocktails)})
    return Response(chartList)

@api_view(['GET'])
def liqueurChart(request):
    liqueurs = Liqueur.objects.all()
    chartList = []
    for liqueur in liqueurs:
        liqueurs = Liqueur.objects.all()
        cocktails = Cocktail.objects.filter(Q(Liqueurs=liqueur))
        chartList.append({"label": liqueur.Chinese_Name, "size": len(cocktails)})
    return Response(chartList)

@api_view(['GET'])
def alcoholChart(request):
    alcohols = Alcohol.objects.all()
    chartList = []
    for alcohol in alcohols:
        alcohols = Alcohol.objects.all()
        cocktails = Cocktail.objects.filter(Q(Alcohols=alcohol))
        chartList.append({"label": alcohol.Chinese_Name, "size": len(cocktails)})
    return Response(chartList)

@api_view(['GET'])
def ingredientChart(request):
    ingredients = Ingredient.objects.all()
    chartList = []
    for ingredient in ingredients:
        ingredients = Ingredient.objects.all()
        cocktails = Cocktail.objects.filter(Q(Ingredients=ingredient))
        chartList.append({"label": ingredient.Chinese_Name, "size": len(cocktails)})
    return Response(chartList)

@api_view(['GET'])
def cocktailRecommendation(request, pk):
    cocktail = Cocktail.objects.get(Cocktail_ID=pk)

    model = joblib.load('cocktailData/cocktailModel.joblib')
    input_cocktail = cocktail.Chinese_Name
    recommendations = pd.DataFrame(model.nlargest(8,input_cocktail)['Chinese_Name'])
    recommendations = recommendations[recommendations['Chinese_Name']!=input_cocktail]
    cocktailList = []
    for index, row in recommendations.iterrows():
        cocktailList.append(row['Chinese_Name'])
    cocktails = Cocktail.objects.filter(Chinese_Name__in=cocktailList)
    serializer = CocktailSerializer(cocktails, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def backupData(request):
    baseJson, liqueurJson, alcoholJson, ingredientJson, cocktailJson = [], [], [], [], []

    bases = Base.objects.all()
    serializer = BaseSerializer(bases, many=True)
    for i in serializer.data:
        baseJson.append({"model": "api.base", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
    jsonFile = open('backupData/bases.json','w',encoding="utf8")
    json.dump(baseJson, jsonFile, indent=2, ensure_ascii = False)

    liqueurs = Liqueur.objects.all()
    serializer = LiqueurSerializer(liqueurs, many=True)
    for i in serializer.data:
        liqueurJson.append({"model": "api.liqueur", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
    jsonFile = open('backupData/liqueurs.json','w',encoding="utf8")
    json.dump(liqueurJson, jsonFile, indent=2, ensure_ascii = False)

    alcohols = Alcohol.objects.all()
    serializer = AlcoholSerializer(alcohols, many=True)
    for i in serializer.data:
        alcoholJson.append({"model": "api.alcohol", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
    jsonFile = open('backupData/alcohols.json','w',encoding="utf8")
    json.dump(alcoholJson, jsonFile, indent=2, ensure_ascii = False)

    ingredients = Ingredient.objects.all()
    serializer = IngredientSerializer(ingredients, many=True)
    for i in serializer.data:
        ingredientJson.append({"model": "api.ingredient", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
    jsonFile = open('backupData/ingredients.json','w',encoding="utf8")
    json.dump(ingredientJson, jsonFile, indent=2, ensure_ascii = False)

    cocktails = Cocktail.objects.all()
    serializer = CocktailSerializer(cocktails, many=True)
    index = 0
    for i in serializer.data:
        cocktailJson.append({"model": "api.cocktail", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
        cocktailJson[index]["fields"]["Bases"] = []
        cocktailJson[index]["fields"]["Liqueurs"] = []
        cocktailJson[index]["fields"]["Alcohols"] = []
        cocktailJson[index]["fields"]["Ingredients"] = []
        for j in i['Bases']:
                cocktailJson[index]["fields"]["Bases"].append(j['Base_ID'])
        for j in i['Liqueurs']:
                cocktailJson[index]["fields"]["Liqueurs"].append(j['Liqueur_ID'])
        for j in i['Alcohols']:
                cocktailJson[index]["fields"]["Alcohols"].append(j['Alcohol_ID'])
        for j in i['Ingredients']:
                cocktailJson[index]["fields"]["Ingredients"].append(j['Ingredient_ID'])
        index += 1
    jsonFile = open('backupData/cocktails.json','w',encoding="utf8")
    json.dump(cocktailJson, jsonFile, indent=2, ensure_ascii = False)
    return Response('備份完成')

def buildModel():
    with open('cocktailData/cocktailOutput.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=',')
        writer.writerow(['Chinese_Name', 'English_Name', 'Ingredient1', 'Ingredient2', 'Ingredient3', 'Ingredient4', 'Ingredient5', 'Ingredient6', 'Ingredient7', 'Ingredient8'])

        cocktails = Cocktail.objects.all()
        serializer = CocktailSerializer(cocktails, many=True)
        for i in serializer.data:
            row = []
            row.append(i['Chinese_Name'])
            row.append(i['English_Name'])
            for j in i['Bases']:
                row.append(j['Chinese_Name'])
            for j in i['Alcohols']:
                row.append(j['Chinese_Name'])
            for j in i['Liqueurs']:
                row.append(j['Chinese_Name'])
            for j in i['Ingredients']:
                row.append(j['Chinese_Name'])
            
            writer.writerow(row)
    
    df = pd.read_csv('cocktailData/cocktailOutput.csv')

    # combine all strings:
    df2 = df.drop(['English_Name'],axis=1)

    df2['data'] = df2[df2.columns[1:]].apply(
        lambda x: ' '.join(x.dropna().astype(str)),
        axis=1
    )

    vectorizer = CountVectorizer()
    vectorized = vectorizer.fit_transform(df2['data'])
    similarities = cosine_similarity(vectorized)
    df = pd.DataFrame(similarities, columns=df['Chinese_Name'], index=df['Chinese_Name']).reset_index()
    joblib.dump(df, 'cocktailData/cocktailModel.joblib')