# config/urls.py
"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http.response import HttpResponseRedirect
from django.urls import path, include, reverse
from django.conf.urls import url
from django.views.generic import TemplateView

from user.views import accept_invite

API = 'api/v1/'


def invite(request):
    return HttpResponseRedirect(reverse('user_invite'))


urlpatterns = [
    # Override for email invitations
    # accept-invite must implement in frontend
    url(r'^invitations/accept-invite/(?P<key>\w+)/?$',
        accept_invite, name='accept-invite'),
    url(r'^invitations/send-invite/', invite, name='send-invite'),
    url(r'^invitations/',
        include('invitations.urls', namespace='invitations')),

    # this url is used to generate email content
    url(
        r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/' +
        r'(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'
    ),
    path('admin/', admin.site.urls),
    path(API + 'auth/', include('user.urls')),
    path(API + 'review/', include('review.urls')),
]
