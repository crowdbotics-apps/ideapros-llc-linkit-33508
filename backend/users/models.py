from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django.contrib.gis.db.models import PointField

from home.models import UUIDModel
from .constants import USER_TYPES

import uuid


class User(AbstractUser):
    """
    The base user model that holds any fields related to authentication
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    email = models.EmailField(unique=True)
    activation_key = models.CharField(max_length=255, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    type = models.CharField(choices=USER_TYPES, max_length=16, blank=True)


    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def __str__(self):
        return self.email or '--empty--'


class Kitch(UUIDModel):
    """
    A profile model for Kitch User Types
    """
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
        )
    # Fields
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    photo = models.ImageField(
        upload_to='user/kitch/photos',
        blank=True, null=True
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
    restaurant_name = models.CharField(
        max_length=255,
        blank=True
    )
    location = PointField(
        blank=True,
        null=True
    )
    pickup = models.BooleanField(
        default=False
    )
    dropoff = models.BooleanField(
        default=False
    )
    about_us = models.TextField(
        blank=True
    )


    def __str__(self):
        return self.user.email or '--empty--'


class Litch(UUIDModel):
    """
    A profile model for Litch User Types
    """
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
        )
    # Fields
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    photo = models.ImageField(
        upload_to='user/litch/photos',
        blank=True, null=True
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )

    def __str__(self):
        return self.user.email or '--empty--'
