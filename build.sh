#!/usr/bin/env bash

set -o errexit  # exit on error

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata bases.json
python manage.py loaddata liqueurs.json
python manage.py loaddata alcohols.json
python manage.py loaddata ingredients.json
python manage.py loaddata cocktails.json