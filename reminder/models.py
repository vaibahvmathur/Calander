from __future__ import unicode_literals

from django.db import models


# Create your models here.
class Event(models.Model):
    name = models.CharField(db_column='Name', max_length=200, blank=True, null=True)
    location = models.CharField(db_column='Location', max_length=200, blank=True, null=True)
    description = models.TextField(db_column='Description', blank=True, null=True)
    date = models.DateField(db_column='Date', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'events'
