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
import os
import pathlib

from django.contrib import admin
from django.http.response import HttpResponseRedirect
from django.urls import path, include, reverse, re_path
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.shortcuts import render

from user.views import accept_invite

API = 'api/v1/'


def invite(request):
    return HttpResponseRedirect(reverse('user_invite'))


def render_react(request):
    return render(request, 'index.html')


def render_api_doc(request):
    return render(request, 'api-index.html')


# For react pwa setup not necessary
def get_css_map():
    # try block for running it in CI
    try:
        file = os.path.basename(sorted(
            pathlib.Path(settings.STATIC_ROOT + '/css').glob(
                '**/main.*.chunk.css.map'))[0])
        return 'static/css/' + file
    except Exception:
        return 'static/css/' + 'main.c9aead2c.chunk.css.map'


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
    path(API + 'upload/', include('upload.urls')),
    path(API + 'cloud/', include('cloud.urls')),

    # For react pwa and seo
    path('robots.txt', TemplateView.as_view(
        template_name='robots.txt', content_type='text/plain')),
    path('service-worker.js', TemplateView.as_view(
        template_name='service-worker.js', content_type='text/javascript')),
    path('service-worker.js.map', TemplateView.as_view(
        template_name='service-worker.js.map',
        content_type='application/json')),
    path('asset-manifest.json', TemplateView.as_view(
        template_name='asset-manifest.json', content_type='application/json')),
    path('manifest.webmanifest', TemplateView.as_view(
        template_name='manifest.webmanifest',
        content_type='application/manifest+json')),
    path('browserconfig.xml', TemplateView.as_view(
        template_name='browserconfig.xml', content_type='application/xml')),
    re_path(r'main.\w*.chunk.css.map', TemplateView.as_view(
        template_name=get_css_map(), content_type='application/json')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# For api doc crated with insomnia
urlpatterns.append(re_path(r'^api/v1/', render_api_doc))

# For react index.html at root and all other routes
urlpatterns.append(re_path(r'^$', render_react))
# urlpatterns.append(re_path(r'^(?:.*)/?$', render_react))
urlpatterns.append(re_path(r'^(?!.*media)(?!.*static)(?:.*)/?$', render_react))
