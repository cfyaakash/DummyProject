# Generated by Django 4.1.2 on 2022-11-04 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("newsStories", "0003_alter_story_body_text"),
    ]

    operations = [
        migrations.AlterField(
            model_name="story",
            name="body_text",
            field=models.TextField(max_length=1000),
        ),
    ]