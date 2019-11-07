# -*- coding: utf-8 -*-

from django.urls import path

app_name = 'login'
urlpatterns = [
    # login/
    path('', views.UserFormView.as_view(), name='loginview'),

    # login/registrar/
    path(
        'registrar/',
        views.UserRegistrationFormView.as_view(),
        name='registrarview'
    ),

    # login/esqueceu/:
    path('esqueceu/', views.ForgotPasswordView.as_view(), name='esqueceuview'),

    # login/trocarsenha/:
    path(
        'trocarsenha/<str:idb64>-<str:token>/',
        views.PasswordResetConfirmView.as_view(),
        name='trocarsenhaview'
    ),

    # logout
    path('logout/', views.UserLogoutView.as_view(), name='logoutview'),

]
