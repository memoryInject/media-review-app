from django.contrib import admin

from review.models import Project, Review, Asset, Media


admin.site.register(Project)
admin.site.register(Review)
admin.site.register(Asset)
admin.site.register(Media)
