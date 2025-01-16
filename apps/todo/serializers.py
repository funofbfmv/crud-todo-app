from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'archived', 'created_at', 'user']
        read_only_fields = ['user', 'created_at']