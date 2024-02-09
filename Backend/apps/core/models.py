from django.db import models


# Create your models here.

class Product(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    EMOTION_CHOICES = (
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('surprised', 'Surprised'),
        ('neutral', 'Neutral')
    )

    TYPE_PRODUCT_CHOICES = (
        ('up', 'Up'),
        ('down', 'Down'),
    )

    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5')
    )

    name_product = models.CharField('Producto', max_length=255)
    image_product = models.ImageField('Imagen', upload_to='product_images/')
    price_product = models.DecimalField(
        'Precio', max_digits=10, decimal_places=2)
    stock = models.IntegerField('Stock')
    type_product = models.CharField('Tipo',
                                    max_length=4, choices=TYPE_PRODUCT_CHOICES, default='up')
    rating = models.IntegerField(
        'Calificación', choices=RATING_CHOICES, default='5')
    dominant_color = models.CharField('Color', max_length=7, default="#000000")

    gender_product = models.CharField('Género',
                                      max_length=1, choices=GENDER_CHOICES, default='M')
    age_min = models.IntegerField('Edad Mínima')
    age_max = models.IntegerField('Edad Máxima')
    emotion_product = models.CharField('Emoción',
                                       max_length=20, choices=EMOTION_CHOICES, default='happy')

    def __str__(self):
        return f'{self.name_product}'

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
