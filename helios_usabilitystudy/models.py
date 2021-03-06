from django.db import models
from django.contrib.auth.models import User


class Subject(models.Model):
    user = models.ForeignKey(User)
    subject_id = models.CharField('Subject ID', max_length=30, unique=True, primary_key=True)
    experiment_type = models.CharField('Experiment_Type', max_length=2, unique=False)

    def __str__(self):
        return 'Subject: ' + str(self.subject_id)


class Timestamp(models.Model):
    subject = models.ForeignKey(Subject)
    timestamp = models.DateTimeField('Timestamp')
    type = models.CharField('Type', max_length=42)

    def __str__(self):
            return 'Subject: ' + str(self.subject)


class Option(models.Model):
    option_code = models.CharField('Option_code', max_length=4, unique=True, primary_key=True)
    option = models.CharField('Option', max_length=50)
    option_description = models.CharField('Description', max_length=2000, null=True)

    def __str__(self):
        return 'Option: ' + str(self.option)


class Question(models.Model):
    question = models.CharField('Question', max_length=2000)
    number_answers = models.IntegerField('Allowed number answers')
    options = models.ManyToManyField(Option)

    def __str__(self):
        return 'Question: ' + str(self.question)
