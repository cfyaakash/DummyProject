from rest_framework import serializers
from .models import *


class CompanySerializers(serializers.ModelSerializer):
    # import ipdb; ipdb.set_trace;

    class Meta:
        model = Company
        fields = '__all__'


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = '__all__'


class StorySerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    source_id = serializers.PrimaryKeyRelatedField(source = 'source',  queryset=Source.objects.all())
    companies = CompanySerializers(many=True, read_only=True)

    class Meta:
        model = Story

        fields = '__all__'




class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = '__all__'


