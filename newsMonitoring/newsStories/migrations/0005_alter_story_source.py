# Generated by Django 4.1.2 on 2022-11-04 10:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("newsStories", "0004_alter_story_body_text"),
    ]

    operations = [
        migrations.AlterField(
            model_name="story",
            name="source",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="newsStories.source",
            ),
        ),
    ]
