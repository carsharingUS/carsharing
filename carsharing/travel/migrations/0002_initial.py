# Generated by Django 4.2.8 on 2024-05-25 09:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('travel', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='travelrequest',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='travel',
            name='host',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hosts_travel', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='travel',
            name='passengers',
            field=models.ManyToManyField(blank=True, related_name='travels_as_passenger', to=settings.AUTH_USER_MODEL),
        ),
    ]
