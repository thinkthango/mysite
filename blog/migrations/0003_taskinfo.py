# Generated by Django 2.1 on 2018-08-27 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_userinfo'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('taskno', models.IntegerField()),
                ('taskcontent', models.TextField()),
                ('taskdate', models.DateTimeField()),
                ('taskperson', models.CharField(max_length=50)),
                ('taskstatus', models.CharField(max_length=1)),
                ('taskps', models.CharField(max_length=255)),
            ],
        ),
    ]
