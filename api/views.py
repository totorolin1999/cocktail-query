from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse

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

MODEL_MAPPING = {
    'base': (Base, BaseSerializer),
    'liqueur': (Liqueur, LiqueurSerializer),
    'alcohol': (Alcohol, AlcoholSerializer),
    'ingredient': (Ingredient, IngredientSerializer),
}

def get_model_and_serializer(model_type):
    """
    根據 model_type 獲取對應的模型和序列化器
    
    :param model_type: 模型類型字符串
    :return: (Model, Serializer) 元組
    :raises ValueError: 當 model_type 不存在時
    """
    if model_type not in MODEL_MAPPING:
        raise ValueError(f"未知的模型類型: {model_type}")
    
    return MODEL_MAPPING[model_type]

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
    name = request.query_params.get('name', '')
    bases = request.query_params.get('bases[]', '')
    liqueurs = request.query_params.get('liqueurs[]', '')
    alcohols = request.query_params.get('alcohols[]', '')
    ingredients = request.query_params.get('ingredients[]', '')

    cocktails = Cocktail.objects.all()

    if name:
        cocktails = cocktails.filter(Q(Chinese_Name__contains=name) | Q(English_Name__contains=name))
    if bases:
        bases = list(map(int, bases.split("|")))
        for base in bases:
            cocktails =  cocktails.filter(Q(Bases=base))
    if liqueurs:
        liqueurs = list(map(int, liqueurs.split("|")))
        for liqueur in liqueurs:
            cocktails =  cocktails.filter(Q(Liqueurs=liqueur))
    if alcohols:
        alcohols = list(map(int, alcohols.split("|")))
        for alcohol in alcohols:
            cocktails =  cocktails.filter(Q(Alcohols=alcohol))
    if ingredients:
        ingredients = list(map(int, ingredients.split("|")))
        for ingredient in ingredients:
            cocktails =  cocktails.filter(Q(Ingredients=ingredient))
    serializer = CocktailSerializer(cocktails, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def cocktailDetail(request, pk):
    cocktails = Cocktail.objects.get(id=pk)
    serializer = CocktailSerializer(cocktails, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def itemDetail(request, model_type, pk):
    Model, Serializer = get_model_and_serializer(model_type)
    
    try:
        item = get_object_or_404(Model, id=pk)
        serializer = Serializer(item, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cocktailCreate(request):

    baseList = []
    for baseData in request.data["Bases"]:
        baseObj = Base.objects.get(id=baseData['value'])
        baseList.append({
            "id": baseObj.id,
            "Chinese_Name": baseObj.Chinese_Name,
            "English_Name": baseObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Bases"] = baseList

    liqueurList = []
    for liqueurData in request.data["Liqueurs"]:
        liqueurObj = Liqueur.objects.get(id=liqueurData['value'])
        liqueurList.append({
            "id": liqueurObj.id,
            "Chinese_Name": liqueurObj.Chinese_Name,
            "English_Name": liqueurObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Liqueurs"] = liqueurList

    alcoholList = []
    for alcoholData in request.data["Alcohols"]:
        alcoholObj = Alcohol.objects.get(id=alcoholData['value'])
        alcoholList.append({
            "id": alcoholObj.id,
            "Chinese_Name": alcoholObj.Chinese_Name,
            "English_Name": alcoholObj.English_Name
        })
    cocktailData = request.data
    cocktailData["Alcohols"] = alcoholList

    ingredientList = []
    for ingredientData in request.data["Ingredients"]:
        ingredientObj = Ingredient.objects.get(id=ingredientData['value'])
        ingredientList.append({
            "id": ingredientObj.id,
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
    cocktail = Cocktail.objects.get(id=pk)
    serializer = CocktailSerializer(instance=cocktail,data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        buildModel()

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemCreate(request, model_type):
    _, Serializer = get_model_and_serializer(model_type)
    serializer = Serializer(data=request.data)
    
    try:
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemUpdate(request, model_type, pk):
    Model, Serializer = get_model_and_serializer(model_type)
    
    try:
        # 使用 get_object_or_404 确保对象存在，找不到时返回404
        item = get_object_or_404(Model, id=pk)
        
        # 使用序列化器进行更新
        serializer = Serializer(instance=item, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cocktailDelete(request, pk):
    cocktail = Cocktail.objects.get(id=pk)
    cocktail.delete()
    buildModel()

    return Response('刪除成功')

@api_view(['GET'])
def materialList(request, model_type):
    Model, Serializer = get_model_and_serializer(model_type)
    items = Model.objects.all()
    serializer = Serializer(items, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def itemDelete(request, model_type, pk):
    Model, _ = get_model_and_serializer(model_type)
    
    try:
        item = get_object_or_404(Model, id=pk)
        item.delete()
        return Response({'message': '刪除成功'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def chartList(request, model_type):
    model_mapping = {
        'base': (Base, 'Bases'),
        'liqueur': (Liqueur, 'Liqueurs'),
        'alcohol': (Alcohol, 'Alcohols'),
        'ingredient': (Ingredient, 'Ingredients'),
    }
    
    if model_type not in model_mapping:
        return Response({"error": f"未知的模型類型: {model_type}"}, status=400)
    
    Model, relation_field = model_mapping[model_type]
    items = Model.objects.all()
    
    chart_list = []
    for item in items:
        # 使用動態的關聯欄位名稱創建查詢
        filter_kwargs = {relation_field: item}
        cocktails = Cocktail.objects.filter(**filter_kwargs)
        
        chart_list.append({
            "chinese_label": item.Chinese_Name,
            "english_label": item.English_Name,
            "size": len(cocktails)
        })
    
    return Response(chart_list)

@api_view(['GET'])
def cocktailRecommendation(request, pk):
    cocktail = Cocktail.objects.get(id=pk)

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
    data = []
    index = 0

    bases = Base.objects.all()
    serializer = BaseSerializer(bases, many=True)
    for i in serializer.data:
        data.append({"model": "api.base", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
        index += 1

    liqueurs = Liqueur.objects.all()
    serializer = LiqueurSerializer(liqueurs, many=True)
    for i in serializer.data:
        data.append({"model": "api.liqueur", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
        index += 1

    alcohols = Alcohol.objects.all()
    serializer = AlcoholSerializer(alcohols, many=True)
    for i in serializer.data:
        data.append({"model": "api.alcohol", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
        index += 1

    ingredients = Ingredient.objects.all()
    serializer = IngredientSerializer(ingredients, many=True)
    for i in serializer.data:
        data.append({"model": "api.ingredient", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name']}})
        index += 1

    cocktails = Cocktail.objects.all()
    serializer = CocktailSerializer(cocktails, many=True)
    for i in serializer.data:
        data.append({"model": "api.cocktail", "fields": {"Chinese_Name": i['Chinese_Name'], "English_Name": i['English_Name'], "image": f"/cocktail_images/{i['id']}.jpeg"}})
        data[index]["fields"]["Bases"] = []
        data[index]["fields"]["Liqueurs"] = []
        data[index]["fields"]["Alcohols"] = []
        data[index]["fields"]["Ingredients"] = []
        for j in i['Bases']:
                data[index]["fields"]["Bases"].append(j['id'])
        for j in i['Liqueurs']:
                data[index]["fields"]["Liqueurs"].append(j['id'])
        for j in i['Alcohols']:
                data[index]["fields"]["Alcohols"].append(j['id'])
        for j in i['Ingredients']:
                data[index]["fields"]["Ingredients"].append(j['id'])
        index += 1

    file_path = "backupData/cocktail_data.json"
    with open(file_path, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=2, ensure_ascii = False)
    
    response = FileResponse(open(file_path, "rb"), as_attachment=True, filename="data.json")
    return response

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