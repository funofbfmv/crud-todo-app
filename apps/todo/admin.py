from django.contrib import admin
from .models import Task
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'created_at')  
    list_filter = ('status', 'created_at')  
    search_fields = ('title', 'description', 'user__username') 
    autocomplete_fields = ['user'] 


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

    # Добавляем отображение задач пользователя в виде встроенного списка
    inlines = []

    def get_inline_instances(self, request, obj=None):
        if obj:  # Только если объект пользователя выбран
            self.inlines = [TaskInline]
        return super().get_inline_instances(request, obj)


class TaskInline(admin.TabularInline):
    model = Task
    extra = 0  # Не добавлять пустые строки
    fields = ('title', 'description', 'status', 'created_at')
    readonly_fields = ('created_at',)
    show_change_link = True  # Ссылка для редактирования задачи



admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)