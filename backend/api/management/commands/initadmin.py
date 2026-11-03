import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = '自動建立超級管理員帳號（自環境變數讀取，若已存在則自動跳過）'

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    '⚠️ 未設定 DJANGO_SUPERUSER_USERNAME 或 DJANGO_SUPERUSER_PASSWORD 環境變數，略過自動建立管理員。'
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.SUCCESS(
                    f'ℹ️ 超級使用者「{username}」已存在，略過建立。'
                )
            )
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ 超級使用者「{username}」已成功建立！'
                )
            )
