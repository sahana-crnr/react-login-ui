from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "original_price",
            "rating",
            "ratings_count",
            "reviews_count",
            "image",
            "color",
            "size",
            "category",
            "stock",
            "is_featured",
            "created_at",
            "updated_at",
        ]
