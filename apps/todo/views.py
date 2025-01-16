from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Возвращаем задачи текущего пользователя
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Привязываем задачу к текущему пользователю
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def archive(self, request, pk=None):
        # Архивирование задачи
        task = self.get_object()
        task.archived = True
        task.save()
        return Response({'status': 'archived'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def restore(self, request, pk=None):
        # Восстановление задачи из архива
        task = self.get_object()
        task.archived = False
        task.save()
        return Response({'status': 'restored'}, status=status.HTTP_200_OK)