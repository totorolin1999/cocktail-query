from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.db.models import Q, Count

from .serializers import (
    CocktailSerializer,
    MaterialSerializer,
    BaseSerializer,
    LiqueurSerializer,
    AlcoholSerializer,
    IngredientSerializer,
)
from .models import (
    Cocktail,
    Material,
    CocktailRecipeItem,
)
from .utils import build_model

import joblib
import json
from django.conf import settings


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
                raise ValidationError({key: [f'材料 ID 無效：{part}']})
    return ids


def _filter_materials_all(queryset, ids):
    for related_id in ids:
        queryset = queryset.filter(materials__id=related_id)
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


def _resolve_related_payload(payload, field_name, model=Material):
    raw_items = payload.get(field_name, []) or []
    if not isinstance(raw_items, list):
        raise ValidationError({field_name: ['必須提供材料清單。']})

    ids = []
    for item in raw_items:
        value = item.get('value', item.get('id')) if isinstance(item, dict) else item
        try:
            related_id = int(value)
        except (TypeError, ValueError):
            raise ValidationError({field_name: [f'材料 ID 無效：{value}']})
        if related_id not in ids:
            ids.append(related_id)

    objects_by_id = model.objects.in_bulk(ids)
    missing_ids = [related_id for related_id in ids if related_id not in objects_by_id]
    if missing_ids:
        raise ValidationError({
            field_name: [f'找不到材料 ID：{", ".join(map(str, missing_ids))}']
        })

    return [
        {
            'id': objects_by_id[related_id].id,
            'Chinese_Name': objects_by_id[related_id].Chinese_Name,
            'English_Name': objects_by_id[related_id].English_Name,
        }
        for related_id in ids
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
                    'image': item['image'].replace('/media/', '', 1),
                    'Bases': [base['id'] for base in item['Bases']],
                    'Liqueurs': [liqueur['id'] for liqueur in item['Liqueurs']],
                    'Alcohols': [alcohol['id'] for alcohol in item['Alcohols']],
                    'Ingredients': [ingredient['id'] for ingredient in item['Ingredients']],
                    'recipe_ingredients': item['recipe_ingredients'],
                    'iba_category': item['iba_category'],
                    'instructions_zh': item['instructions_zh'],
                    'instructions_en': item['instructions_en'],
                    'glassware_zh': item['glassware_zh'],
                    'glassware_en': item['glassware_en'],
                    'garnish_zh': item['garnish_zh'],
                    'garnish_en': item['garnish_en'],
                    'flavor_zh': item['flavor_zh'],
                    'flavor_en': item['flavor_en'],
                    'strength': item['strength'],
                    'history_zh': item['history_zh'],
                    'history_en': item['history_en'],
                    'source_url': item['source_url'],
                    'artwork_color': item['artwork_color'],
                    'is_active': item['is_active'],
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
    iba_category = request.query_params.get('iba_category', '')
    strength = request.query_params.get('strength', '')
    glassware = request.query_params.get('glassware', '').strip()
    bases = _parse_ids(request, 'bases[]')
    liqueurs = _parse_ids(request, 'liqueurs[]')
    alcohols = _parse_ids(request, 'alcohols[]')
    ingredients = _parse_ids(request, 'ingredients[]')

    cocktails = Cocktail.objects.filter(is_active=True).prefetch_related(
        'recipe_items__material'
    )

    if name:
        cocktails = cocktails.filter(
            Q(Chinese_Name__icontains=name) | Q(English_Name__icontains=name)
        )

    if iba_category:
        cocktails = cocktails.filter(iba_category=iba_category)

    if strength:
        cocktails = cocktails.filter(strength=strength)

    if glassware:
        cocktails = cocktails.filter(
            Q(glassware_zh__iexact=glassware)
            | Q(glassware_en__iexact=glassware)
        )

    if bases:
        cocktails = _filter_materials_all(cocktails, bases)
    if liqueurs:
        cocktails = _filter_materials_all(cocktails, liqueurs)
    if alcohols:
        cocktails = _filter_materials_all(cocktails, alcohols)
    if ingredients:
        cocktails = _filter_materials_all(cocktails, ingredients)

    serializer = CocktailSerializer(cocktails.distinct(), many=True)
    return Response(serializer.data)


@api_view(['GET'])
def cocktailDetail(request, pk):
    cocktail = get_object_or_404(
        Cocktail.objects.prefetch_related('recipe_items__material'),
        id=pk,
        is_active=True,
    )
    serializer = CocktailSerializer(cocktail, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def itemDetail(request, model_type, pk):
    item = get_object_or_404(Material, id=pk)
    serializer = MaterialSerializer(item, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def cocktailCreate(request):
    data = _normalize_request_data(request)

    for field_name in ('Bases', 'Liqueurs', 'Alcohols', 'Ingredients'):
        data[field_name] = _parse_json_field(data.get(field_name, []))
        data[field_name] = _resolve_related_payload(data, field_name, Material)

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

    for field_name in ('Bases', 'Liqueurs', 'Alcohols', 'Ingredients'):
        if field_name in data:
            data[field_name] = _parse_json_field(data[field_name])
            data[field_name] = _resolve_related_payload(data, field_name, Material)

    serializer = CocktailSerializer(instance=cocktail, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        build_model()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemCreate(request, model_type):
    data = dict(request.data)
    if model_type != 'material':
        data['category'] = model_type
    serializer = MaterialSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def itemUpdate(request, model_type, pk):
    item = get_object_or_404(Material, id=pk)
    serializer = MaterialSerializer(instance=item, data=request.data, partial=True)
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
    valid_categories = {'base', 'liqueur', 'alcohol', 'ingredient', 'material'}
    if model_type not in valid_categories:
        raise ValidationError(f'未知的模型類型: {model_type}')

    if model_type == 'material':
        items = Material.objects.all()
    else:
        items = Material.objects.filter(category=model_type)

    serializer = MaterialSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def itemDelete(request, model_type, pk):
    item = get_object_or_404(Material, id=pk)
    item.delete()
    return Response({'message': '刪除成功'})


@api_view(['GET'])
def chartList(request, model_type):
    valid_categories = {'base', 'liqueur', 'alcohol', 'ingredient', 'material'}
    if model_type not in valid_categories:
        return Response({'error': f'未知的模型類型: {model_type}'}, status=400)

    if model_type == 'material':
        items = Material.objects.all()
    else:
        items = Material.objects.filter(category=model_type)

    items = items.annotate(
        size=Count('recipe_items__cocktail', filter=Q(recipe_items__cocktail__is_active=True), distinct=True)
    )
    chart_list = [
        {
            'chinese_label': item.Chinese_Name,
            'english_label': item.English_Name,
            'size': item.size,
        }
        for item in items
    ]
    return Response(chart_list)


@api_view(['GET'])
def cocktailRecommendation(request, pk):
    cocktail = get_object_or_404(Cocktail, id=pk, is_active=True)
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
    cocktails = Cocktail.objects.filter(
        Chinese_Name__in=recommendations, is_active=True
    ).prefetch_related('recipe_items__material')
    serializer = CocktailSerializer(cocktails, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def backupData(request):
    data = []
    data.extend(_serialize_model_entries('material', MaterialSerializer(Material.objects.all(), many=True).data))

    cocktails = CocktailSerializer(
        Cocktail.objects.all().prefetch_related('recipe_items__material'),
        many=True,
    ).data
    data.extend(_serialize_cocktail_backup(cocktails))

    file_path = 'backupData/cocktail_data.json'
    with open(file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=2, ensure_ascii=False)

    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename='data.json')
