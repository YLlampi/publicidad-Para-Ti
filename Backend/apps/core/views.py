import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product


@csrf_exempt
def recibir_datos(request):
    if request.method == 'POST':
        try:
            datos_recibidos = json.loads(request.body)

            age = int(datos_recibidos['age'])
            gender = datos_recibidos['gender']
            emotion = datos_recibidos['emotion']

            if gender == 'masculino':
                gender = 'M'
            else:
                gender = 'F'

            products = Product.objects.filter(
                gender_product=gender,
                # emotion_product=emotion
            )

            products = products.filter(age_min__lte=age, age_max__gte=age)

            data = [{
                'id': product.id,
                'name_product': product.name_product,
                'price_product': f'{product.price_product}',
                'type_product': f'{product.type_product}',
                'stock': product.stock,
                'image_url': f'http://localhost:8000{product.image_product.url}'
            }for product in products]

            return JsonResponse({'products': data})
        except (KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Los datos recibidos no son válidos.'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)


@csrf_exempt
def get_product(request):
    if request.method == 'POST':
        try:
            datos_recibidos = json.loads(request.body)

            id_product = int(datos_recibidos['id'])
            product = Product.objects.get(id=id_product)

            data = {
                'id': product.id,
                'name_product': product.name_product,
                'price_product': f'{product.price_product}',
                'type_product': f'{product.type_product}',
                'stock': product.stock,
                'image_url': f'http://localhost:8000{product.image_product.url}'
            }

            return JsonResponse({'product': data})
        except (KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Los datos recibidos no son válidos.'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)
