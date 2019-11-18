# -*- coding: utf-8 -*-

from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.translation import ugettext_lazy as _

from .models import CoreUser

# User social login on system
SOCIAL_LOGINS_APPS = (
    (u'facebook', u'Facebook'),
    (u'github', u'GitHub'),
    (u'instagram', u'Instagram'),
    (u'linkedin', u'LinkedIn'),
    (u'twitter', u'Twitter'),
    (u'youtube', u'YouTube'),
)


class UserLoginForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'password')
        # fields = ('username', 'password', 'type_login')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control line-input', 'placeholder': 'Nome de usuário'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control line-input', 'placeholder': 'Senha'}),
            # 'type_login': forms.CharField(widget=forms.RadioSelect(choices=SOCIAL_LOGINS_APPS))
        }
        labels = {
            'username': _(u'person'),
            'password': _(u'lock'),
        }

    # Validar/autenticar campos de login
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError(u"Usuário ou senha inválidos.")
        return self.cleaned_data

    def authenticate_user(self, username, password):
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError(u"Usuário ou senha inválidos.")
        return user


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Senha'}), min_length=6, label='lock')
    confirm = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Confirme a senha'}), min_length=6, label='lock')
    username = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Nome de usuário'}), label='person')
    email = forms.CharField(widget=forms.EmailInput(attrs={
                            'class': 'form-control line-input', 'placeholder': 'Email'}), label='email', required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password',)


class PasswordResetForm(forms.Form):
    email_or_username = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Email/Usuário'}))


class SetPasswordForm(forms.Form):
    new_password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Nova senha'}), min_length=6)
    new_password_confirm = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Confirmar a nova senha'}), min_length=6)
