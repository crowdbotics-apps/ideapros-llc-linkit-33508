# Generated by Django 2.2.28 on 2022-11-23 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20221123_1049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kitch',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='user/kitch/photos'),
        ),
        migrations.AlterField(
            model_name='litch',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='user/litch/photos'),
        ),
    ]
