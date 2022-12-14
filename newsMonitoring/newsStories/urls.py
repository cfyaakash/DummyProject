from django.urls import include, re_path as url, path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

# from core import views as core_views

from . import views
# from .views import SourceViewSet

app_name = 'newsStories'
router = routers.DefaultRouter()
router.register(r'posts', views.story_api, basename='posts')
router.register(r'source', views.Source_api, basename='src')

urlpatterns =[
    path('', views.index, name='index'),
    path('home', views.home, name='home'),
    # path('sources', views.index, name='index'),
    path('source', views.source, name='source'),
    path('sources', views.sourceList, name='sources'),
    path('update/<int:pk>', views.update_source, name='update'),
    path('delete/<int:pk>', views.source_delete, name='delete'),
    path('updatestory/<int:pk>', views.update_story, name='updatestory'),
    path('storydelete/<int:pk>', views.story_delete, name='storydelete'),
    path('search', views.source_search, name='search'),
    path('storyadd', views.add_story, name='storyadd'),
    path('storylist', views.story_listing, name='storylist'),
    path('storysearch', views.story_search, name='storysearch'),
    path('fetch/<int:pk>', views.story_fetch, name='fetch'),
    path('storyapi/', views.story_api, name= 'storyapi'),
    path('sourceapi/', views.Source_api, name= 'sourceapi'),
    path('storyapi/<int:pk>/', views.story_api_detail, name='storyapidetail'),
    path('sourceapi/<int:pk>/', views.source_api_detail, name='sourceapidetail'),
    path('company_api', views.Company_api, name = 'companyapi')

]
urlpatterns = format_suffix_patterns(urlpatterns)
