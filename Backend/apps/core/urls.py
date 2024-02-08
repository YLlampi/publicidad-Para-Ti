from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('recibir-datos/', views.recibir_datos, name='recibir-datos'),
    path('get-product/', views.get_product, name='get-product')
]
