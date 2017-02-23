# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-23 21:32
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Duration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('has_verified', models.NullBooleanField(editable=False, verbose_name='Verification performed')),
                ('instruction_duration', models.BigIntegerField(editable=False, verbose_name='Instruction (Millisec)')),
                ('verification_number', models.BigIntegerField(editable=False, verbose_name='Number of verifications')),
                ('overall_duration', models.BigIntegerField(editable=False, verbose_name='Overall (Millisec)')),
                ('voting_duration', models.BigIntegerField(editable=False, verbose_name='Voting (Millisec)')),
                ('verification_duration', models.BigIntegerField(editable=False, verbose_name='Verification (Millisec)')),
            ],
        ),
        migrations.CreateModel(
            name='Option',
            fields=[
                ('option_code', models.CharField(max_length=4, primary_key=True, serialize=False, unique=True, verbose_name='Option_code')),
                ('option', models.CharField(max_length=50, verbose_name='Option')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=2000, verbose_name='Question')),
                ('number_answers', models.IntegerField(verbose_name='Allowed number answers')),
                ('options', models.ManyToManyField(to='helios_usabilitystudy.Option')),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('subject_id', models.CharField(max_length=30, primary_key=True, serialize=False, unique=True, verbose_name='Subject ID')),
                ('experiment_type', models.CharField(max_length=2, verbose_name='Experiment_Type')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='duration',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='helios_usabilitystudy.Subject'),
        ),
    ]
