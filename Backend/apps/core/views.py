from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def recibir_datos(request):
    if request.method == 'POST':
        try:
            datos_recibidos = json.loads(request.body)
            print("*************************************")
            print(datos_recibidos)
            return JsonResponse({'mensaje': 'Datos recibidos correctamente.'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Los datos no están en formato JSON válido.'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)
