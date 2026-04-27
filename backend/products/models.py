from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.3)
    ratings_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)

    image = models.CharField(max_length=500)  # store image path or URL
    color = models.CharField(max_length=100, blank=True, null=True)
    size = models.CharField(max_length=100, blank=True, null=True)

    category = models.CharField(max_length=100, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
