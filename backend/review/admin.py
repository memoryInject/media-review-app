from django.contrib import admin

from review.models import Project, Review, Asset, Media, Feedback


admin.site.register(Project)
admin.site.register(Review)
admin.site.register(Asset)
admin.site.register(Media)
admin.site.register(Feedback)
