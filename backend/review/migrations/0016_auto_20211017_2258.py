# Generated by Django 3.2.6 on 2021-10-17 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0015_feedback'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='asset_format',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='asset',
            name='duration',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='asset',
            name='frame_rate',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='asset',
            name='height',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='asset',
            name='width',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='asset',
            name='url',
            field=models.CharField(max_length=500),
        ),
    ]
