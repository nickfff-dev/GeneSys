from django.db import models
from django.contrib.auth.models import User, AbstractUser
# Create your models here.

class UserPermissions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="permissions")
    is_nurse = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
