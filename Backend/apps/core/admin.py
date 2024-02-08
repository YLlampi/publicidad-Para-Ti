from django.contrib import admin
from .models import Product


# Register your models here.

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
    'name_product', 'image_tag', 'price_product', 'quantity_product', 'gender_product', 'age_min', 'age_max',
    'emotion_product')
    search_fields = ('name_product',)
    list_filter = ('gender_product', 'emotion_product')
    readonly_fields = ('image_tag',)

    def image_tag(self, obj):
        return obj.image_product.url if obj.image_product else ''

    image_tag.short_description = 'Image'
