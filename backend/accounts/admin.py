from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserPermissions


class UserPermissionsInline(admin.StackedInline):
    model = UserPermissions
    can_delete = False
    verbose_name_plural = 'UserPermissions'


class UserAdmin(BaseUserAdmin):
    inlines = (UserPermissionsInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
