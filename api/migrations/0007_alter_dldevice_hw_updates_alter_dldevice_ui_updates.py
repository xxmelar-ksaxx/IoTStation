# Generated by Django 4.0.2 on 2023-02-24 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_dldevice_hw_updates_dldevice_ui_updates'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dldevice',
            name='HW_updates',
            field=models.JSONField(default={}),
        ),
        migrations.AlterField(
            model_name='dldevice',
            name='UI_updates',
            field=models.JSONField(default={}),
        ),
    ]