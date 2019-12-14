# -*- coding: utf-8 -*-

from django.urls import path

from .views import (
    MainPageView,
    UserLoginForm,
    UserRegistrationFormView,
    ForgotPasswordView,
    PasswordResetConfirmView,
    UserLogoutView,
)


app_name = 'login'
urlpatterns = [
    path('', MainPageView.as_view(), name='index'),
    # path('login/', UserView.as_view(), name='logoutview'),
    # login/registrar/
    path(
        'registrar/',
        UserRegistrationFormView.as_view(),
        name='registrarview'
    ),
    # login/esqueceu/:
    path('esqueceu/', ForgotPasswordView.as_view(), name='esqueceuview'),
    # login/trocarsenha/:
    path(
        'trocarsenha/<str:idb64>-<str:token>/',
        PasswordResetConfirmView.as_view(),
        name='trocarsenhaview'
    ),
    # logout
    path('logout/', UserLogoutView.as_view(), name='logoutview'),
]
