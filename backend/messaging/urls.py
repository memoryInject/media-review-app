from django.urls import path

from messaging.views import NotificationList, NotificationDetail


urlpatterns = [
    path('notifications/',
         NotificationList.as_view(), name='notification_list'),
    path('notifications/<int:pk>/', NotificationDetail.as_view(),
         name='notification_detail'),
]
