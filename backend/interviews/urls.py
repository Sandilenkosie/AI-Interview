from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_interview, name='create_interview'),
    path('', views.list_interviews, name='list_interviews'),
    path('voice/tts/', views.voice_tts, name='voice_tts'),
    path('voice/stt/', views.voice_stt, name='voice_stt'),
    path('<int:pk>/', views.get_interview, name='get_interview'),
    path('<int:pk>/answer/', views.answer_interview, name='answer_interview'),
    path('<int:pk>/delete/', views.delete_interview, name='delete_interview'),
]