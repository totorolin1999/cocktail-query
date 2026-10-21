from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.db.models import Q

from .serializers import (
    CocktailSerializer,
    BaseSerializer,
    LiqueurSerializer,
    AlcoholSerializer,
    IngredientSerializer,
)
from .models import Cocktail, Base, Liqueur, Alcohol, Ingredient
from .utils import build_model

import joblib
import json
from django.conf import settings

MODEL_MAPPING = {
    'base': (Base, BaseSerializer),
    'liqueur': (Liqueur, LiqueurSerializer),
    'alcohol': (Alcohol, AlcoholSerializer),
    'ingredient': (Ingredient, IngredientSerializer),
}

def get_model_and_serializer(model_type):
    if model_type not in MODEL_MAPPING:
        raise ValueError(f'未知的模型類型: {model_type}')
    return MODEL_MAPPING[model_type]


def _parse_ids(request, key):
    values = request.query_params.getlist(key)
    if not values:
        single_value = request.query_params.get(key, '')
        values = [single_value] if single_value else []

    ids = []
    for value in values:
        if not value:
            continue
        for part in value.split('|'):
            part = part.strip()
            if not part:
                continue
            try:
                ids.append(int(part))
            except ValueError:
                continue
    return ids


def _filter_related_all(queryset, field_name, ids):
    # 同一種類的多個選項必須同時存在於 cocktail 的關聯清單中。
    # 例如 bases[] = 4|5 代表 cocktail 必須同時包含 Base id 4 和 Base id 5。
    for related_id in ids:
        queryset = queryset.filter(**{f'{field_name}__id': related_id})
    return queryset


def _parse_json_field(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (ValueError, TypeError):
            return value
    if isinstance(value, list):
        parsed = []
        for item in value:
            if isinstance(item, str):
                try:
                    parsed.append(json.loads(item))
                except (ValueError, TypeError):
                    parsed.append(item)
            else:
                parsed.append(item)
        return parsed
    return value


def _normalize_request_data(request):
    data = {}
    request_data = request.data

    if hasattr(request_data, 'getlist'):
        for key in request_data:
            values = request_data.getlist(key)
            if len(values) == 1:
                data[key] = values[0]
            else:
                data[key] = values
    elif isinstance(request_data, dict):
        data.update(request_data)
    else:
        try:
            for key in request_data:
                data[key] = request_data[key]
        except Exception:
            data = dict(request_data)

    for key in request.FILES:
        files = request.FILES.getlist(key)
        if len(files) == 1:
            data[key] = files[0]
        else:
            data[key] = files
    return data


def _resolve_related_payload(payload, field_name, model):
    raw_items = payload.get(field_name, []) or []
    ids = []
    for item in raw_items:
        if not isinstance(item, dict):
            continue
        value = item.get('value') or item.get('id')
        try:
            ids.append(int(value))
        except (TypeError, ValueError):
            continue

    objects = model.objects.filter(id__in=ids)
    return [
        {
            'id': obj.id,
            'Chinese_Name': obj.Chinese_Name,
            'English_Name': obj.English_Name,
        }
        for obj in objects
    ]


def _build_backup_item(model_name, fields):
    return {'model': f'api.{model_name}', 'fields': fields}


def _serialize_model_entries(model_name, items):
    return [
        _build_backup_item(
            model_name,
            {'Chinese_Name': item['Chinese_Name'], 'English_Name': item['English_Name']},
        )
        for item in items
    ]


def _serialize_cocktail_backup(items):
    entries = []
    for item in items:
        entries.append(
            {
                'model': 'api.cocktail',
                'fields': {
                    'Chinese_Name': item['Chinese_Name'],
                    'English_Name': item['English_Name'],
                    'image': f"/cocktail_images/{item['id']}.jpeg",
                    'Bases': [base['id'] for base in item['Bases']],
                    'Liqueurs': [liqueur['id'] for liqueur in item['Liqueurs']],
                    'Alcohols': [alcohol['id'] for alcohol in item['Alcohols']],
                    'Ingredients': [ingredient['id'] for ingredient in item['Ingredients']],
                },
            }
        )
    return entries


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Token': '/api/token',
        'Refresh': '/api/token/refresh',
        'List': '/cocktail-list/',
        'Detail': '/cocktail-detail/<str:pk>/',
        'Create': '/api/cocktail-create/',
        'Update': '/api/cocktail-update/<str:pk>/',
        'Delete': '/api/cocktail-delete/<str:pk>/',
    }
    return Response(api_urls)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def cocktailList(request):
    name = request.query_params.get('name', '')
    bases = _parse_ids(request, 'bases[]')
    liqueurs = _parse_ids(request, 'liqueurs[]')
    alcohols = _parse_ids(request, 'alcohols[]')
    ingredients = _parse_ids(request, 'ingredients[]')

    cocktails = Cocktail.objects.all()

    if name:
        cocktails = cocktails.filter(
            Q(Chinese_Name__contains=name) | Q(English_Name__contains=name)
        )

    if bases:
        cocktails = _filter_related_all(cocktails, 'Bases', bases)
    if liqueurs:
        cocktails = _filter_related_all(cocktails, 'Liqueurs', liqueurs)
    if alcohols:
        cocktails = _filter_related_all(cocktails, 'Alcohols', alcohols)
    if ingredients:
        cocktails = _filter_related_all(cocktails, 'Ingredients', ingredients)

    serializer = CocktailSerializer(cocktails.distinct(), many=True)
    return Response(serializer.data)


@api_view(['GET'])
def cocktailDetail(request, pk):
    cocktail = get_object_or_404(Cocktail, id=pk)
    serializer = CocktailSerializer(cocktail, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def itemDetail(request, model_type, pk):
    Model, Serializer = get_model_and_serializer(model_type)
    item = get_object_or_404(Model, id=pk)
    serializer = Serializer(item, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def cocktailCreate(request):
    data = _normalize_request_data(request)

    data['Bases'] = _parse_json_field(data.get('Bases', []))
    data['Liqueurs'] = _parse_json_field(data.get('Liqueurs', []))
    data['Alcohols'] = _parse_json_field(data.get('Alcohols', []))
    data['Ingredients'] = _parse_json_field(data.get('Ingredients', []))

    data['Bases'] = _resolve_related_payload(data, 'Bases', Base)
    data['Liqueurs'] = _resolve_related_payload(data, 'Liqueurs', Liqueur)
    data['Alcohols'] = _resolve_related_payload(data, 'Alcohols', Alcohol)
    data['Ingredients'] = _resolve_related_payload(data, 'Ingredients', Ingredient)

    serializer = CocktailSerializer(data=data)
    if serializer.is_valid():
        cocktail = serializer.save()
        build_model()
        return Response(CocktailSerializer(cocktail).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def cocktailUpdate(request, pk):
    cocktail = get_object_or_404(Cocktail, id=pk)
    data = _normalize_request_data(request)

    data['Bases'] = _parse_json_field(data.get('Bases', []))
    data['Liqueurs'] = _parse_json_field(data.get('Liqueurs', []))
    data['Alcohols'] = _parse_json_field(data.get('Alcohols', []))
    data['Ingredients'] = _parse_json_field(data.get('Ingredients', []))

    serializer = CocktailSerializer(instance=cocktail, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        build_model()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemCreate(request, model_type):
    _, Serializer = get_model_and_serializer(model_type)
    serializer = Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemUpdate(request, model_type, pk):
    Model, Serializer = get_model_and_serializer(model_type)
    item = get_object_or_404(Model, id=pk)
    serializer = Serializer(instance=item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cocktailDelete(request, pk):
    cocktail = get_object_or_404(Cocktail, id=pk)
    cocktail.delete()
    build_model()
    return Response({'message': '刪除成功'})


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
    item = get_object_or_404(Model, id=pk)
    item.delete()
    return Response({'message': '刪除成功'})


@api_view(['GET'])
def chartList(request, model_type):
    model_mapping = {
        'base': (Base, 'Bases'),
        'liqueur': (Liqueur, 'Liqueurs'),
        'alcohol': (Alcohol, 'Alcohols'),
        'ingredient': (Ingredient, 'Ingredients'),
    }
    if model_type not in model_mapping:
        return Response({'error': f'未知的模型類型: {model_type}'}, status=400)

    Model, relation_field = model_mapping[model_type]
    items = Model.objects.all()
    chart_list = []
    for item in items:
        count = Cocktail.objects.filter(**{relation_field: item}).count()
        chart_list.append(
            {
                'chinese_label': item.Chinese_Name,
                'english_label': item.English_Name,
                'size': count,
            }
        )
    return Response(chart_list)


@api_view(['GET'])
def cocktailRecommendation(request, pk):
    cocktail = get_object_or_404(Cocktail, id=pk)
    model_path = settings.COCKTAIL_MODEL_FILE_TEST if settings.TESTING else settings.COCKTAIL_MODEL_FILE
    try:
        similarity_df = joblib.load(model_path)
    except FileNotFoundError:
        return Response([])

    input_cocktail = cocktail.Chinese_Name

    if 'Chinese_Name' not in similarity_df.columns:
        return Response([])

    similarity_df = similarity_df.set_index('Chinese_Name')
    if input_cocktail not in similarity_df.index:
        return Response([])

    recommendations = similarity_df.loc[input_cocktail].nlargest(9)
    recommendations = [name for name in recommendations.index if name != input_cocktail]
    cocktails = Cocktail.objects.filter(Chinese_Name__in=recommendations)
    serializer = CocktailSerializer(cocktails, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def backupData(request):
    data = []
    data.extend(_serialize_model_entries('base', BaseSerializer(Base.objects.all(), many=True).data))
    data.extend(_serialize_model_entries('liqueur', LiqueurSerializer(Liqueur.objects.all(), many=True).data))
    data.extend(_serialize_model_entries('alcohol', AlcoholSerializer(Alcohol.objects.all(), many=True).data))
    data.extend(_serialize_model_entries('ingredient', IngredientSerializer(Ingredient.objects.all(), many=True).data))

    cocktails = CocktailSerializer(Cocktail.objects.all(), many=True).data
    data.extend(_serialize_cocktail_backup(cocktails))

    file_path = 'backupData/cocktail_data.json'
    with open(file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=2, ensure_ascii=False)

    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename='data.json')
