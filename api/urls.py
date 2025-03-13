from django.urls import path, re_path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.apiOverview, name='api-Overview'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('cocktail-list/', views.cocktailList, name='cocktail-list'),
    # re_path(r'^cocktail-list/$', views.cocktailList, name='cocktail-list'),
    path('cocktail-detail/<str:pk>/', views.cocktailDetail, name='cocktail-detail'),
    path('cocktail-create/', views.cocktailCreate, name='cocktail-create'),
    path('cocktail-update/<str:pk>/', views.cocktailUpdate, name='cocktail-update'),
    path('cocktail-delete/<str:pk>/', views.cocktailDelete, name='cocktail-delete'),
    path('base-list/', views.baseList, name='base-list'),
    path('base-detail/<str:pk>/', views.baseDetail, name='base-detail'),
    path('base-create/', views.baseCreate, name='base-create'),
    path('base-update/<str:pk>/', views.baseUpdate, name='base-update'),
    path('base-delete/<str:pk>/', views.baseDelete, name='base-delete'),
    path('liqueur-list/', views.liqueurList, name='liqueur-list'),
    path('liqueur-detail/<str:pk>/', views.liqueurDetail, name='liqueur-detail'),
    path('liqueur-create/', views.liqueurCreate, name='liqueur-create'),
    path('liqueur-update/<str:pk>/', views.liqueurUpdate, name='liqueur-update'),
    path('liqueur-delete/<str:pk>/', views.liqueurDelete, name='liqueur-delete'),
    path('alcohol-list/', views.alcoholList, name='alcohol-list'),
    path('alcohol-detail/<str:pk>/', views.alcoholDetail, name='alcohol-detail'),
    path('alcohol-create/', views.alcoholCreate, name='alcohol-create'),
    path('alcohol-update/<str:pk>/', views.alcoholUpdate, name='alcohol-update'),
    path('alcohol-delete/<str:pk>/', views.alcoholDelete, name='alcohol-delete'),
    path('ingredient-list/', views.ingredientList, name='ingredient-list'),
    path('ingredient-detail/<str:pk>/', views.ingredientDetail, name='ingredient-detail'),
    path('ingredient-create/', views.ingredientCreate, name='ingredient-create'),
    path('ingredient-update/<str:pk>/', views.ingredientUpdate, name='ingredient-update'),
    path('ingredient-delete/<str:pk>/', views.ingredientDelete, name='ingredient-delete'),
    path('base-chart/', views.baseChart, name='base-chart'),
    path('liqueur-chart/', views.liqueurChart, name='liqueur-chart'),
    path('alcohol-chart/', views.alcoholChart, name='alcohol-chart'),
    path('ingredient-chart/', views.ingredientChart, name='ingredient-chart'),
    path('cocktail-recommendation/<str:pk>/', views.cocktailRecommendation, name='cocktail-recommendation'),
    path('backup-data/', views.backupData, name='backup-data'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
