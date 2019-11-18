# -*- coding: utf-8 -*-

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, get_user_model
from django.views.generic import View, FormView
from django.db.models.query_utils import Q
from django.core.mail import send_mail
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template import loader

from hotspot.settings import DEFAULT_FROM_EMAIL

from .app_forms import (
    UserLoginForm, UserRegistrationForm, SetPasswordForm, PasswordResetForm
)

from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages


from .views_mixim import SuperUserRequiredMixin

# Create your views here.


class MainPageView(View):
    template_name = 'index'

    def get(self, request):
        return render(request, self.template_name)


class UserFormView(View):
    form_class = UserLoginForm
    template_name = 'login/login.html'

    def get(self, request):
        form = self.form_class(None)

        if request.user.is_authenticated:
            return redirect('core:index')
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST or None)
        if request.POST and form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = form.authenticate_user(username=username, password=password)
            if user:
                if not request.POST.get('remember_me', None):
                    request.session.set_expiry(0)
                login(request, user)
                return redirect('core:index')

        return render(request, self.template_name, {'form': form})


class UserRegistrationFormView(SuperUserRequiredMixin, SuccessMessageMixin, FormView):
    form_class = UserRegistrationForm
    template_name = 'login/registrar.html'
    success_url = reverse_lazy('login:usuariosview')
    success_message = "Novo usuário <b>%(username)s</b> criado com sucesso."

    def get_success_message(self, cleaned_data):
        return self.success_message % dict(cleaned_data, username=cleaned_data['username'])

    def get(self, request, *args, **kwargs):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            password = form.cleaned_data['password']
            password_confirm = form.cleaned_data['confirm']
            if password == password_confirm:
                user.set_password(password)
                user.save()
                return self.form_valid(form)
            else:
                form.add_error('password', 'Senhas diferentes.')
                return self.form_invalid(form)

            # return redirect("login:usuariosview")

        return render(request, self.template_name, {'form': form})


class UserLogoutView(View):

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("core:index")


class ForgotPasswordView(FormView):
    template_name = "login/esqueceu_senha.html"
    success_url = reverse_lazy('login:loginview')
    form_class = PasswordResetForm

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if not DEFAULT_FROM_EMAIL:
            form.add_error(
                field=None, error=u"Envio de email não configurado.")
            return self.form_invalid(form)

        if form.is_valid():
            data = form.cleaned_data["email_or_username"]
            associated_user = User.objects.filter(
                Q(email=data) | Q(username=data)).first()

            if associated_user:
                try:
                    if associated_user.email:
                        c = {
                            'email': associated_user.email,
                            'domain': request.META['HTTP_HOST'],
                            'site_name': 'djangoSIGE',
                            'uid': urlsafe_base64_encode(force_bytes(associated_user.pk)).decode(encoding="utf-8"),
                            'user': associated_user,
                            'token': default_token_generator.make_token(associated_user),
                            'protocol': 'http://',
                        }
                        subject = u"Redefinir sua senha - DjangoSIGE"
                        email_template_name = 'login/trocar_senha_email.html'
                        email_mensagem = loader.render_to_string(
                            email_template_name, c)
                        sended = send_mail(subject, email_mensagem, DEFAULT_FROM_EMAIL, [
                                           associated_user.email, ], fail_silently=False)

                        if sended == 1:
                            messages.success(request, u'Um email foi enviado para ' + data +
                                             u'. Aguarde o recebimento da mensagem para trocar sua senha.')
                            return self.form_valid(form)
                        else:
                            form.add_error(
                                field=None, error=u"Erro ao enviar email de verificação.")
                            return self.form_invalid(form)
                    else:
                        form.add_error(
                            field=None, error=u"Este usuário não cadastrou um email.")
                        return self.form_invalid(form)

                except Exception as e:
                    form.add_error(field=None, error=e)
                    return self.form_invalid(form)

            else:
                form.add_error(
                    field=None, error=u"Usuário/Email: {} não foi encontrado na database.".format(data))
                return self.form_invalid(form)

        form.add_error(field=None, error="Entrada inválida.")
        return self.form_invalid(form)


class PasswordResetConfirmView(FormView):
    template_name = "login/trocar_senha.html"
    success_url = reverse_lazy('login:loginview')
    form_class = SetPasswordForm

    def post(self, request, uidb64=None, token=None, *args, **kwargs):
        userModel = get_user_model()
        form = self.form_class(request.POST)

        if uidb64 is None or token is None:
            form.add_error(
                field=None,
                error=u"O link usado para a troca de senha não é válido ou expirou, por favor tente enviar novamente."
            )
            return self.form_invalid(form)

        try:
            uid = urlsafe_base64_decode(uidb64)
            user = userModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, userModel.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if form.is_valid():
                new_password = form.cleaned_data['new_password']
                new_password_confirm = form.cleaned_data[
                    'new_password_confirm']
                if new_password == new_password_confirm:
                    user.set_password(new_password)
                    user.save()
                    messages.success(request, u"Senha trocada com sucesso")
                    return self.form_valid(form)
                else:
                    form.add_error(field=None, error=u"Senhas diferentes.")
                    return self.form_invalid(form)
            else:
                form.add_error(
                    field=None, error=u"Não foi possivel trocar a senha. Formulário inválido.")
                return self.form_invalid(form)
        else:
            form.add_error(
                field=None,
                error=u"O link usado para a troca de senha não é válido ou expirou, por favor tente enviar novamente."
            )
            return self.form_invalid(form)
