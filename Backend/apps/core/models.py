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

    name_product = models.CharField(max_length=255)
    image_product = models.ImageField(upload_to='product_images/')
    price_product = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    type_product = models.CharField(
        max_length=4, choices=TYPE_PRODUCT_CHOICES, default='up')

    gender_product = models.CharField(
        max_length=1, choices=GENDER_CHOICES, default='M')
    age_max = models.IntegerField()
    age_min = models.IntegerField()
    emotion_product = models.CharField(
        max_length=20, choices=EMOTION_CHOICES, default='happy')

    def __str__(self):
        return f'{self.name_product}'

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
