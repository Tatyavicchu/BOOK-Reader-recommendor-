from django.contrib import admin
from django.urls import path
from django.urls import path, include
from . import views  # Import views from the current recomm directory

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('recommend-books/', include('recomm.urls')),
    path('recommend-books/', views.recommendbooks, name='recommendbooks'),  # Your view
    path('get-book-text/',views.textextractor,name='textextractor'),
]
