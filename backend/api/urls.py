from django.urls import path
from . import views
from .views import (
    MyTokenObtainPairView,
    cocktailCollection,
    cocktailMember,
    materialCollection,
    materialMember,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # API Catalog Overview
    path('', views.apiOverview, name='api-Overview'),

    # RESTful v1 Endpoints
    path('v1/auth/token/', MyTokenObtainPairView.as_view(), name='v1-token_obtain_pair'),
    path('v1/auth/token/refresh/', TokenRefreshView.as_view(), name='v1-token_refresh'),
    path('v1/cocktails/', cocktailCollection, name='v1-cocktails-collection'),
    path('v1/cocktails/<str:pk>/', cocktailMember, name='v1-cocktails-member'),
    path('v1/cocktails/<str:pk>/recommendations/', views.cocktailRecommendation, name='v1-cocktails-recommendations'),
    path('v1/materials/<str:model_type>/', materialCollection, name='v1-materials-collection'),
    path('v1/materials/<str:model_type>/<str:pk>/', materialMember, name='v1-materials-member'),
    path('v1/charts/<str:model_type>/', views.chartList, name='v1-charts'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
