from django.urls import path

from review.views import (ProjectList, ProjectDetail,
                          ReviewDetail, ReviewList,
                          AssetList, AssetDetail,
                          MediaList, MediaDetail)


urlpatterns = [
    path('projects/', ProjectList.as_view(), name='project_list'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project_detail'),
    path('reviews/', ReviewList.as_view(), name='review_list'),
    path('reviews/<int:pk>/', ReviewDetail.as_view(), name='review_detail'),
    path('assets/', AssetList.as_view(), name='asset_list'),
    path('assets/<int:pk>/', AssetDetail.as_view(), name='asset_detail'),
    path('media/', MediaList.as_view(), name='media_list'),
    path('media/<int:pk>/', MediaDetail.as_view(), name='media_detail')
]
