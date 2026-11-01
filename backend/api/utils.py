import csv
import joblib
import pandas as pd
from pathlib import Path
from django.conf import settings
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .models import Cocktail


FEATURE_WEIGHTS = {
    'base': 2.0,
    'liqueur': 1.5,
    'alcohol': 1.25,
    'ingredient': 1.0,
}


def build_model(output_csv=None, output_model=None):
    if output_csv is None:
        output_csv = Path(settings.COCKTAIL_OUTPUT_CSV_TEST if settings.TESTING else settings.COCKTAIL_OUTPUT_CSV)
    else:
        output_csv = Path(output_csv)

    if output_model is None:
        output_model = Path(settings.COCKTAIL_MODEL_FILE_TEST if settings.TESTING else settings.COCKTAIL_MODEL_FILE)
    else:
        output_model = Path(output_model)

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    output_model.parent.mkdir(parents=True, exist_ok=True)

    cocktails = list(
        Cocktail.objects.filter(is_active=True).prefetch_related(
            'recipe_items__material'
        )
    )
    names = [cocktail.Chinese_Name for cocktail in cocktails]
    feature_rows = []
    csv_rows = []

    for cocktail in cocktails:
        features = {}
        csv_row = [cocktail.Chinese_Name, cocktail.English_Name]
        recipe_items = list(cocktail.recipe_items.all())
        csv_row.extend(item.material.Chinese_Name for item in recipe_items)
        for item in recipe_items:
            cat = item.material.category
            features[f'{cat}:{item.material.pk}'] = FEATURE_WEIGHTS.get(cat, 1.0)
        feature_rows.append(features)
        csv_rows.append(csv_row)

    max_material_count = max((len(row) - 2 for row in csv_rows), default=0)
    csv_header = ['Chinese_Name', 'English_Name'] + [
        f'Ingredient{index}'
        for index in range(1, max_material_count + 1)
    ]
    with output_csv.open('w', newline='', encoding='utf-8') as output_file:
        writer = csv.writer(output_file, delimiter=',')
        writer.writerow(csv_header)
        writer.writerows(csv_rows)

    if feature_rows and any(feature_rows):
        vectorizer = DictVectorizer(sparse=True, sort=True)
        vectorized = vectorizer.fit_transform(feature_rows)
        similarities = cosine_similarity(vectorized)
    else:
        similarities = [[0.0] * len(cocktails) for _ in cocktails]

    for index in range(len(similarities)):
        similarities[index][index] = 1.0

    similarity_frame = pd.DataFrame(
        similarities,
        columns=names,
        index=names,
    ).reset_index(names='Chinese_Name')
    joblib.dump(similarity_frame, output_model)
