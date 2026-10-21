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
    path('material-list/<str:model_type>/', views.materialList, name='material-list'),
    # re_path(r'^cocktail-list/$', views.cocktailList, name='cocktail-list'),
    path('cocktail-detail/<str:pk>/', views.cocktailDetail, name='cocktail-detail'),
    path('cocktail-create/', views.cocktailCreate, name='cocktail-create'),
    path('cocktail-update/<str:pk>/', views.cocktailUpdate, name='cocktail-update'),
    path('cocktail-delete/<str:pk>/', views.cocktailDelete, name='cocktail-delete'),
    path('item-detail/<str:model_type>/<str:pk>/', views.itemDetail, name='item-detail'),
    path('item-create/<str:model_type>/', views.itemCreate, name='item-create'),
    path('item-update/<str:model_type>/<str:pk>/', views.itemUpdate, name='item-update'),
    path('item-delete/<str:model_type>/<str:pk>/', views.itemDelete, name='item-delete'),
    path('chart-list/<str:model_type>/', views.chartList, name='chart-list'),
    path('cocktail-recommendation/<str:pk>/', views.cocktailRecommendation, name='cocktail-recommendation'),
    path('backup-data/', views.backupData, name='backup-data'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
