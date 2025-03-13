"""cocktail_query_drf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root':settings.MEDIA_ROOT}), 
    re_path(r'^static/(?P<path>.*)$', serve,{'document_root':settings.STATIC_ROOT}), 
    path('api/', include('api.urls')),
    path('', views.index, name='index'),
    path('Login', views.index, name='index'),
    path('Bases', views.index, name='index'),
    path('AddBase', views.index, name='index'),
    path('UpdateBase/<str:pk>', views.index_pk, name='index_pk'),
    path('Liqueurs', views.index, name='index'),
    path('AddLiqueur', views.index, name='index'),
    path('UpdateLiqueur/<str:pk>', views.index_pk, name='index_pk'),
    path('Alcohols', views.index, name='index'),
    path('AddAlcohol', views.index, name='index'),
    path('UpdateAlcohol/<str:pk>', views.index_pk, name='index_pk'),
    path('Ingredients', views.index, name='index'),
    path('AddIngredient', views.index, name='index'),
    path('UpdateIngredient/<str:pk>', views.index_pk, name='index_pk'),
    path('Cocktails', views.index, name='index'),
    path('AddCocktail', views.index, name='index'),
    path('UpdateCocktail/<str:pk>', views.index_pk, name='index_pk'),
    path('Cocktail/<str:pk>', views.index_pk, name='index_pk'),
    path('Charts', views.index, name='index'),
    path('UserBases', views.index, name='index'),
    path('UserLiqueurs', views.index, name='index'),
    path('UserAlcohols', views.index, name='index'),
    path('UserIngredients', views.index, name='index'),
]
