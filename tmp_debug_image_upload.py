from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Base, Liqueur, Alcohol, Ingredient

user, _ = User.objects.get_or_create(username='tmp_user', defaults={'password': 'tmp'})
client = APIClient()
client.force_authenticate(user=user)

vodka, _ = Base.objects.get_or_create(Chinese_Name='伏特加', English_Name='Vodka')
cointreau, _ = Liqueur.objects.get_or_create(Chinese_Name='君度橙酒', English_Name='Cointreau')
tequila, _ = Alcohol.objects.get_or_create(Chinese_Name='龍舌蘭', English_Name='Tequila')
lemon, _ = Ingredient.objects.get_or_create(Chinese_Name='檸檬', English_Name='Lemon')

image = SimpleUploadedFile(
    name='test.png',
    content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x00\x00\x00\x00\x00\x00',
    content_type='image/png',
)
payload = {
    'Chinese_Name': '有圖調酒',
    'English_Name': 'Image Cocktail',
    'Bases': '[{"id": %d}]' % vodka.id,
    'Liqueurs': '[{"id": %d}]' % cointreau.id,
    'Alcohols': '[{"id": %d}]' % tequila.id,
    'Ingredients': '[{"id": %d}]' % lemon.id,
    'image': image,
}

response = client.post('/api/cocktail-create/', payload, format='multipart')
print('status:', response.status_code)
print('data:', getattr(response, 'data', None))
print('content:', response.content)
