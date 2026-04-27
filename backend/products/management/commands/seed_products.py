import json
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand

from products.models import Product


class Command(BaseCommand):
    help = "Seed the products table from the frontend products.json file."

    def handle(self, *args, **options):
        repo_root = Path(__file__).resolve().parents[4]
        source_file = repo_root / "login-app" / "src" / "data" / "products.json"

        if not source_file.exists():
            self.stderr.write(self.style.ERROR(f"Source file not found: {source_file}"))
            return

        with source_file.open("r", encoding="utf-8") as file:
            products_data = json.load(file)

        created_count = 0
        updated_count = 0

        for item in products_data:
            defaults = {
                "description": item.get("description", ""),
                "price": Decimal(str(item.get("price", "0"))),
                "original_price": (
                    Decimal(str(item["originalPrice"]))
                    if item.get("originalPrice") not in (None, "")
                    else None
                ),
                "rating": Decimal(str(item.get("rating", "4.3"))),
                "ratings_count": item.get("ratingsCount", 0),
                "reviews_count": item.get("reviewsCount", 0),
                "image": item.get("image", ""),
                "color": item.get("color") or "",
                "size": item.get("size") or "",
                "category": item.get("category") or "",
                "stock": item.get("stock", 0),
                "is_featured": item.get("isFeatured", False),
            }

            product, created = Product.objects.update_or_create(
                name=item.get("name", "").strip(),
                defaults=defaults,
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete. Created: {created_count}, Updated: {updated_count}"
            )
        )
