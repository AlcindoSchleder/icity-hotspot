# -*- coding: utf-8 -*-

import os
from django.db import models
from django.contrib.auth.models import User
from django.db.utils import Error
from django.db.models.signals import post_delete
from django.dispatch import receiver


# Create your models here.
def user_directory_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return 'images/users/photos_profile/{0}_{1}{2}'.format(instance.user.username, instance.user.id, extension)


class CoreUser(models.Model):
    pk_core_user = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_photo = models.ImageField(
        upload_to=user_directory_path, default='images/user.png', blank=True
    )

    class Meta:
        verbose_name = "Usuario"

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


@receiver(post_delete, sender=CoreUser)
def post_delete_handler(sender, instance, **kwargs):
    # Not delete default user image 'user.png'
    if instance.user_photo != 'images/user.png':
        instance.user_photo.delete(False)
