import csv
import joblib
import pandas as pd
from pathlib import Path
from django.conf import settings
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .models import Cocktail


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

    rows = []
    for cocktail in Cocktail.objects.prefetch_related('Bases', 'Alcohols', 'Liqueurs', 'Ingredients').all():
        row = [cocktail.Chinese_Name, cocktail.English_Name]
        row.extend([item.Chinese_Name for item in cocktail.Bases.all()])
        row.extend([item.Chinese_Name for item in cocktail.Alcohols.all()])
        row.extend([item.Chinese_Name for item in cocktail.Liqueurs.all()])
        row.extend([item.Chinese_Name for item in cocktail.Ingredients.all()])
        rows.append(row)

    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=',')
        writer.writerow([
            'Chinese_Name',
            'English_Name',
            'Ingredient1',
            'Ingredient2',
            'Ingredient3',
            'Ingredient4',
            'Ingredient5',
            'Ingredient6',
            'Ingredient7',
            'Ingredient8',
        ])
        writer.writerows(rows)

    df = pd.read_csv(output_csv)
    df2 = df.drop(['English_Name'], axis=1)
    df2['data'] = df2[df2.columns[1:]].apply(
        lambda x: ' '.join(x.dropna().astype(str)), axis=1
    )
    vectorizer = CountVectorizer()
    vectorized = vectorizer.fit_transform(df2['data'])
    similarities = cosine_similarity(vectorized)
    df = pd.DataFrame(similarities, columns=df['Chinese_Name'], index=df['Chinese_Name']).reset_index()
    joblib.dump(df, output_model)
