# user/urls.py
from django.urls import path, include

from user.views import UserList, UserDetail, user_invite, user_accept


urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('register/', include('dj_rest_auth.registration.urls')),
    path('users/', UserList.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('invite/', user_invite, name='user_invite'),
    path('accept/', user_accept, name='user_accept')
]
