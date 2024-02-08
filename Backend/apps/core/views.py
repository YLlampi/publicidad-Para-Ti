from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def recibir_datos(request):
    if request.method == 'POST':
        datos_recibidos = request.POST.get('datos', None)
        if datos_recibidos:
            # Procesar los datos recibidos como desees
            print(datos_recibidos)
            return JsonResponse({'mensaje': 'Datos recibidos correctamente.'})
        else:
            return JsonResponse({'error': 'No se recibieron datos.'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)
