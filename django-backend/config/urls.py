"""URL configuration for the auth-only backend."""

from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("accounts.urls")),
]
