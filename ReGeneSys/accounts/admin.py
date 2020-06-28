from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Permissions


class PermissionsInline(admin.StackedInline):
    model = Permissions
    can_delete = False
    verbose_name_plural = 'Permissions'


class UserAdmin(BaseUserAdmin):
    inlines = (PermissionsInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
