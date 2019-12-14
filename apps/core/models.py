# -*- coding: utf-8 -*-

import os
from django.db import models
from django.contrib.auth.models import User
from django.db.utils import Error
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.functional import cached_property
import json

# Create your models here.


def user_directory_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return 'images/users/photos_profile/{0}_{1}{2}'.format(instance.user.username, instance.user.id, extension)


class CoreUser(models.Model):
    USER_TYPE_LOGIN = (
        ('MN', 'Manual'),
        ('FB', 'Facebook'),
        ('IG', 'Instagram'),
        ('GH', 'GitHub'),
        ('LD', 'LinkedIn'),
    )
    UF_CHOICES = [
        ("AC", "Acre"), ("AL", "Alagoas"), ("AM", "Amazonas"), ("AP", "Amapá"),
        ("CE", "Ceará"), ("DF", "Distrito"), ("ES", "Espírito Santo"),
        ("GO", "Goiânia"), ("MA", "Maranhão"), ("MG", "Minas Gerais"),
        ("MS", "Mato Grosso do Sul"), ("MT", "Mato Grosso"), ("PA", "Pará"),
        ("PB", "Paraíba"), ("PE", "Pernambuco"), ("PI", "Piauí"), ("PR", "Paraná"),
        ("RJ", "Rio de Janeiro"), ("RN", "Rio Grande do Norte"), ("RO", "Rondônia"),
        ("RR", "Roraima"), ("RS", "Rio Grande do Sul"), ("SC", "Santa Catarina"),
        ("SE", "Sergipe"), ("SP", "São Paulo"), ("TO", "Tocantins"),
    ]
    pk_core_user = models.CharField(
        max_length=20, primary_key=True, verbose_name='Doc. Identif.'
    )
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    user_photo = models.ImageField(
        upload_to=user_directory_path, default='images/user.png', blank=True
    )
    user_uf = models.CharField(
        max_length=2, choices=UF_CHOICES, verbose_name='UF'
    )
    user_city = models.CharField(max_length=100, verbose_name='Cidade')
    type_login = models.CharField(
        max_length=2, choices=USER_TYPE_LOGIN, verbose_name='Tipo Login'
    )

    @cached_property
    def username(self):
        return self.user.username

    @cached_property
    def password(self):
        return self.user.password

    # def _get_username(self):
    #     return self.user.username
    #
    # def _get_password(self):
    #     return self.user.password
    # username = property(_get_username)
    # password = property(_get_password)



    class Meta:
        db_table = 'core_user'
        verbose_name = "Usuário"

    def save(self, *args, **kwargs):
        # Delete user_photo if exists
        try:
            obj = CoreUser.objects.get(pk_coreuser=self.pk_core_user)
            if obj.user_photo != self.user_photo and obj.user_photo != 'images/user.png':
                obj.user_photo.delete(save=False)
        except Error:
            pass

        super(CoreUser, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s' % self.user

    def __str__(self):
        return u'%s' % self.user


class TypeDevice(models.Model):
    FIELD_MAP_DEVICE_PARAMS = json.dumps({
        "ga_ssid": "identity",
        "ga_ap_mac": 'mac do ap',
        "ga_nas_id": "chap-id",
        "ga_srvr":  "server-address",
        "ga_cmac": "mac",
        "ga_cip": "ip",
        "ga_loc": "",
        "ga_Qv": "chap-challenge",
        "link-login": "link-login",
        "link-orig": "link-orig",
        "link-login-only": "link-login-only",
        "link-orig-esc": "link-orig-esc",
    })

    pk_types_device = models.AutoField(primary_key=True, verbose_name='Código')
    descr_device = models.CharField(max_length=100, verbose_name='Descrição')
    supply_device = models.CharField(max_length=50, verbose_name='Marca')
    model_device = models.CharField(max_length=50, verbose_name='Modelo')
    flag_approve = models.BooleanField(default=False, verbose_name='Homologado')
    field_map_device_params = models.TextField(
        verbose_name='Parâmetros', default=FIELD_MAP_DEVICE_PARAMS
    )
    insert_date = models.DateTimeField(auto_now_add=True, verbose_name='Data de Inserção')
    update_date = models.DateTimeField(null=True, blank=True, verbose_name='Data de Atualização')

    class Meta:
        db_table = 'core_types_device'
        verbose_name = 'Tipos de Dispositivos'


class ServerDevices(models.Model):
    pk_devices = models.CharField(
        max_length=15, primary_key=True, verbose_name='Mac do Dispositivo'
    )
    fk_types_device = models.ForeignKey(
        TypeDevice, on_delete=models.PROTECT, verbose_name='Tipo'
    )
    descr_device = models.CharField(max_length=100, verbose_name='Descrição')
    descr_device = models.CharField(max_length=100, verbose_name='Descrição')
    ga_nas_id = models.CharField(max_length=50, verbose_name='Ident. Diálogo')
    ga_srvr = models.CharField(max_length=64, verbose_name='Ip do AP')
    ga_loc = models.CharField(max_length=64, verbose_name='Localização')
    insert_date = models.DateTimeField(
        auto_now_add=True, verbose_name='Data de Inserção'
    )
    update_date = models.DateTimeField(
        null=True, blank=True, verbose_name='Data de Atualização'
    )

    class Meta:
        db_table = 'core_server_devices'
        verbose_name = 'Autenticadores'


class UserDevices(models.Model):
    pk_user_devices = models.AutoField(
        primary_key=True, verbose_name='Código Dispositivo'
    )
    fk_server_devices = models.ForeignKey(
        ServerDevices, on_delete=models.PROTECT
    )
    mac_address = models.CharField(
        max_length=15, unique=True, verbose_name='Endereço Mac'
    )
    fk_user = models.ForeignKey(
        CoreUser,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        verbose_name='Usuário'
    )
    ga_ssid = models.CharField(max_length=64, verbose_name='SSID conexão')
    ga_cmac = models.CharField(max_length=15, verbose_name='Mac Cliente')
    ga_cip = models.CharField(max_length=15, verbose_name='IP Cliente')
    ga_Qv = models.CharField(max_length=128, verbose_name='autenticador')
    link_login = models.CharField(max_length=128, verbose_name='Link Login')
    link_orig = models.CharField(max_length=128, verbose_name='Link Original')
    link_login_only = models.CharField(
        max_length=128, verbose_name='Link Login Author'
    )
    link_orig_esc = models.CharField(
        max_length=128, verbose_name='Link de Redirecionamento'
    )
    insert_date = models.DateTimeField(
        auto_now_add=True, verbose_name='Data de Inserção'
    )
    update_date = models.DateTimeField(
        null=True, blank=True, verbose_name='Data de Atualização'
    )

    class Meta:
        db_table = 'core_user_devices'
        verbose_name = 'Dispositivos'


class LogUserDevice(models.Model):
    pk_log_users_devices = models.BigAutoField(
        primary_key=True, verbose_name='Código'
    )
    fk_user_devices = models.ForeignKey(
        UserDevices, on_delete=models.PROTECT, verbose_name='Usuário'
    )
    insert_date = models.DateTimeField(
        auto_now_add=True, verbose_name='Data de Inserção'
    )


@receiver(post_delete, sender=CoreUser)
def post_delete_handler(sender, instance, **kwargs):
    # Not delete default user image 'user.png'
    if instance.user_photo != 'images/user.png':
        instance.user_photo.delete(False)
