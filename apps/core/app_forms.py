# -*- coding: utf-8 -*-

from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import CoreUser


class UserLoginForm(forms.ModelForm):

    password = forms.HiddenInput(attrs={'value': 'hotspot-icity'})
    username = forms.EmailInput(
        attrs={
            'class': 'form-control line-input',
            'placeholder': 'seu_email@exemplo.com.br'
        }
    )

    class Meta:
        model = CoreUser
        fields = (
            'type_login', 'pk_core_user', 'user_uf', 'user_city'
        )
        widgets = {
            'type_login': forms.HiddenInput(attrs={'value': 'MN'}),
            'pk_core_user': forms.TextInput(
                attrs={
                    'class': 'form-control line-input',
                    'placeholder': 'Doc. Identif.'
                }
            ),
            'user_uf': forms.Select(
                attrs={
                    'class': 'form-control line-input',
                    'choices': CoreUser.UF_CHOICES,
                }
            ),
            'user_city': forms.TextInput(
                attrs={
                    'class': 'form-control line-input',
                    'placeholder': 'Cidade'
                }
            )
        }
        labels = {
            'pk_core_user': 'C.P.F.',
            'user_uf': 'UF: ',
            'user_city': 'Cidade: ',
        }

    # Validar/autenticar campos de login
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError("Usuário ou senha inválidos.")
        return self.cleaned_data

    def authenticate_user(self, username, password):
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError("Usuário ou senha inválidos.")
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


class PasswordResetForm(forms.ModelForm):
    email_or_username = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Email/Usuário'}))


class SetPasswordForm(forms.Form):
    new_password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Nova senha'}), min_length=6)
    new_password_confirm = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control line-input', 'placeholder': 'Confirmar a nova senha'}), min_length=6)
