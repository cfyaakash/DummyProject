# Generated by Django 4.1.2 on 2022-12-02 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("newsStories", "0007_alter_story_pub_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="story",
            name="companies",
            field=models.ManyToManyField(null=True, to="newsStories.company"),
        ),
    ]
