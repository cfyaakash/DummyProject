from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .forms import RegisterForm, SourceForm, StoryForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *
import feedparser
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
# from bs4 import beautifulsoup
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from newsStories.serializers import *
from rest_framework import permissions
# from rest_framework import viewsets
# from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.authentication import SessionAuthentication
from rest_framework.request import Request
from rest_framework.parsers import JSONParser

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        pass


from rest_framework import generics


def index(request):
    return render(request, "newsStories/home.html")


def home(request):
    return render(request, "newsStories/index.html")


def register(request):
    form = RegisterForm()
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        user = request.POST.get('username')
        company = request.POST.get('company')
        client = request.POST.get('client')

        if form.is_valid():
            form.save()
            try:
                company = Company.objects.get(name=company)
            except Company.DoesNotExist:
                company = Company.objects.create(name=company)

            try:
                client = Company.objects.get(name=client)
            except Company.DoesNotExist:
                client = Company.objects.create(name=client)

            user = User.objects.get(username=user)
            subscribed = Subscriber.objects.create(user=user, company=company, client=client)
            subscribed.save()
            messages.success(request, 'Account successfully created')
            return redirect('login')

    context = {'form': form}
    return render(request, "newsStories/register.html", context)


def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            subscriber = Subscriber.objects.get(user=user.id)
            if Source.objects.filter(created_by=subscriber).exists():
                return redirect('/home')
            else:
                return redirect('/source')
        else:
            messages.info(request, 'Username or password is incorrect')

    context = {}
    return render(request, 'newsStories/login.html', context)


def logoutUser(request):
    logout(request)
    return redirect('login')


def source(request):
    # import ipdb;ipdb.set_trace()
    form = SourceForm()
    if request.method == 'POST':
        form = SourceForm(request.POST)
        if form.is_valid():
            curr_user = request.user.id
            name = request.POST.get('name')
            url = request.POST.get('url')
            # sub = Subscriber.objects.get(user=user_here)
            sub = Subscriber.objects.select_related('client').get(user=curr_user)
            client = sub.client  # does not hit the database again
            source_save = Source.objects.create(name=name, url=url, created_by=sub, client=client)
            source_save.save()

        messages.success(request, 'Source successfully created')
        return redirect('/sources')
    else:
        context = {'form': form}
        return render(request, "newsStories/source.html", context)


def sourceList(request):
    # import ipdb;
    # ipdb.set_trace()
    curr_user = request.user
    if curr_user.is_staff:
        sources = Source.objects.all()
        count = 0
        for i in sources:
            count = count + 1
        # count = Source.objects.all().count()
        if count == 0:
            return redirect('/source')

    else:
        curr_user = request.user.id
        sub = Subscriber.objects.get(user=curr_user)
        # sub = Source.objects.select_related('created_by')
        sources = Source.objects.filter(created_by=sub)
        count = 0
        for i in sources:
            count = count + 1

    context = {'sources': sources, 'count': count}
    return render(request, "newsStories/sourcesList.html", context)


def update_source(request, pk):
    form = SourceForm()
    if request.method == 'POST':
        form = SourceForm(request.POST)
        if form.is_valid():
            new_name = form.cleaned_data['name']
            new_url = form.cleaned_data['url']
            old_data = Source.objects.get(id=pk)
            old_data.name = new_name
            old_data.url = new_url
            old_data.save()
            messages.success(request, 'Source successfully updated')
            return redirect('/sources')

    else:
        source_obj = Source.objects.get(id=pk)
        context = {'source_obj': source_obj}
        return render(request, "newsStories/update_source.html", context)


def source_delete(request, pk):
    context = {}
    old_data = Source.objects.get(id=pk)
    if request.method == "POST":
        old_data.delete()
        return redirect('/sources')

    return render(request, "newsStories/delete_source.html", context)


def source_search(request):
    user_here = request.user.id
    sub = Subscriber.objects.get(user=user_here)
    # import ipdb;ipdb.set_trace()
    search = request.GET.get('search')
    if request.user.is_staff:
        sources = Source.objects.filter((Q(name__icontains=search) | Q(url__icontains=search)))

    else:
        sources = Source.objects.filter((Q(name__icontains=search) | Q(url__icontains=search)) & Q(created_by=sub))
    context = {'sources': sources, }
    return render(request, "newsStories/sourcesList.html", context)


def add_story(request):
    form = StoryForm()
    if request.method == 'POST':
        form = StoryForm(request.POST)
        if form.is_valid():
            # user_here = request.user.id
            title = form.cleaned_data['title']
            url = form.cleaned_data['url']
            pub_date = form.cleaned_data['pub_date']
            body_text = form.cleaned_data['body_text']
            source = form.cleaned_data['source']
            company = form.cleaned_data['company']
            count = company.count()
            sub = Subscriber.objects.select_related('client').get(user=request.user.id)
            client = sub.client

            story_save = Story.objects.create(title=title, url=url, pub_date=pub_date, client=client,
                                              body_text=body_text, source=source)
            story_save.save()
            for i in range(count):
                company_id = company[i].id
                story_save.companies.add(company_id)

        messages.success(request, 'Source successfully updated')
        return redirect('/storylist')
    else:
        context = {'form': form}
        return render(request, "newsStories/addStory.html", context)


def story_listing(request):
    if request.user.is_staff:
        stories_list = Story.objects.all()
        count = 0
        for i in stories_list:
            count = count + 1
    else:
        # curr_user = request.user.id
        # sub = Subscriber.objects.get(user=user_here)
        sub = Subscriber.objects.select_related('client').get(user=request.user.id)
        curr_client = sub.client
        stories_list = Story.objects.filter(client=curr_client)
        count = 0
        for i in stories_list:
            count = count + 1

    page = request.GET.get('page', 1)

    paginator = Paginator(stories_list, 5)
    try:
        stories = paginator.page(page)
    except PageNotAnInteger:
        stories = paginator.page(1)
    except EmptyPage:
        stories = paginator.page(paginator.num_pages)

    context = {
        'stories': stories, 'count': count,
    }
    return render(request, 'newsStories/storyListing.html', context)


def update_story(request, pk):
    form = StoryForm()

    if request.method == 'POST':
        form = StoryForm(request.POST)
        if form.is_valid():
            new_title = form.cleaned_data['title']
            new_url = form.cleaned_data['url']
            new_pub_date = form.cleaned_data['pub_date']
            new_body_text = form.cleaned_data['body_text']
            new_source = form.cleaned_data['source']
            new_company = form.cleaned_data['company']
            old_data = Story.objects.get(id=pk)
            old_data.title = new_title
            old_data.url = new_url
            old_data.pub_date = new_pub_date
            old_data.body_text = new_body_text
            old_data.source = new_source
            old_data.companies = new_company
            old_data.save()

        messages.success(request, 'Story successfully updated')
        return redirect('/storylist')

    else:
        story_obj = Story.objects.get(id=pk)
        print(story_obj)
        context = {'story_obj': story_obj}
        return render(request, "newsStories/update_story.html", context)


def story_search(request):
    # curr_user = request.user.id
    sub = Subscriber.objects.select_related('client').get(user=request.user.id)
    curr_client = sub.client
    # import ipdb;ipdb.set_trace()
    search = request.GET.get('search')
    if request.user.is_staff:
        stories = Story.objects.filter((Q(title__icontains=search) | Q(url__icontains=search)))
        # count = stories.count
        count = 0
        for i in stories:
            count = count + 1

    else:
        stories = Story.objects.filter((Q(title__icontains=search) | Q(url__icontains=search)) & Q(client=curr_client))
        # count = stories.count
        count = 0
        for i in stories:
            count = count + 1
    context = {'stories': stories, 'count': count}
    return render(request, "newsStories/storyListing.html", context)


def story_delete(request, pk):
    old_data = Story.objects.get(id=pk)
    old_data.delete()
    return redirect('/storylist')


def story_fetch(request, pk):
    client_source = Source.objects.get(id=pk)
    source_url = client_source.url
    feed = feedparser.parse(source_url)
    list = feed.entries

    for e in list:
        entry_title = e.title
        entry_link = e.link
        entry_desc = e.description
        entry_pub = e.published
        curr_source = Source.objects.select_related('client').get(url=source_url)
        curr_client = curr_source.client
        curr_company = curr_client.id
        if Story.objects.filter(title=entry_title).exists():
            pass
        else:
            try:
                story_data = Story.objects.create(title=entry_title, url=entry_link, body_text=entry_desc,
                                                  pub_date=entry_pub, source=curr_source, client=curr_client)
                story_data.save()
                story_data.companies.add(curr_company)
            except IntegrityError as e:
                continue

    return redirect('/home')

@csrf_exempt
# @api_view(['GET','POST'])
@permission_classes((permissions.AllowAny,))
def story_api(request, format=None):
    # import ipdb;
    # ipdb. set_trace()
    if request.user.is_staff:
        if request.method == 'GET':
            stories = Story.objects.all()
            serializer = StorySerializer(stories, many=True)
            return JsonResponse(serializer.data, safe=False)

        elif request.method == 'POST':
            data = JSONParser().parse(request)
            user = request.user.id
            sub = Subscriber.objects.select_related('client').get(user = request.user.id)
            client = sub.client.id
            comp = []
            for i in data['companies']:
                 comp.append(i['id'])


            # for  i in company:
            #     com.append(i.id)
            # client = sub.client
            data['client'] = client
            # data['client'] = client
            source = data['source']['id']
            data['source_id'] = source
            data['companies'] = comp
            # import ipdb; ipdb.set_trace()
            serializer = StorySerializer(data=data)
            # s = data['id']
            # story = Story.objects.get(id=s)
            # c = Story.companies.add(*comp)


            print(serializer)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        sub = Subscriber.objects.select_related('client').get(user=request.user.id)
        curr_client = sub.client






        if request.method == 'GET':
            stories = Story.objects.filter(client=curr_client)
            serializer = StorySerializer(stories, many=True)
            return JsonResponse(serializer.data, safe=False)

        elif request.method == 'POST':
            serializer = StorySerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class story_api(generics.ListCreateAPIView):
#     queryset = Story.objects.all()
#     serializer_class = StorySerializer
#
# class storyDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Story.objects.all()
#     serializer_class = StorySerializer
# @csrf_exempt
@csrf_exempt
# @api_view(['GET', 'POST','DELETE'])
@permission_classes((permissions.AllowAny,))
def Source_api(request, format=None, *args, **kwargs):
    # import ipdb;ipdb.set_trace()
    if request.user.is_staff:
        if request.method == 'GET':
            sources = Source.objects.all()
            serializer = SourceSerializer(sources, many=True)
            return JsonResponse(serializer.data, safe=False)

        elif request.method == 'POST':
            user = request.user.id
            data = JSONParser().parse(request)
            sub = Subscriber.objects.select_related('client').get(user=request.user.id)

            client = sub.client
            # S = request.source.id
            data['created_by'] = user
            data['client'] = client.id
            # import ipdb; ipdb.set_trace()
            serializer = SourceSerializer(data=data )
            print(serializer)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        curr_user = request.user.id
        sub = Subscriber.objects.get(user=curr_user)

        if request.method == 'GET':
            sources = Source.objects.filter(created_by=sub)
            serializer = SourceSerializer(sources, many=True)
            return JsonResponse(serializer.data, safe=False)

        elif request.method == 'POST':
            data = JSONParser().parse(request)
            # client = sub.client
            data['created_by'] = curr_user
            # import ipdb; ipdb.set_trace()
            serializer = SourceSerializer(data=data)
            print(serializer)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
# @api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((permissions.AllowAny,))
def story_api_detail(request, pk, format = None):
    # import ipdb; ipdb.set_trace()
    try:
        stories  = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return JsonResponse({'message': 'The Story does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StorySerializer(stories)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        # import ipdb; ipdb.set_trace()
        data = JSONParser().parse(request)
        # user = request.user.id
        sub = Subscriber.objects.select_related('client').get(user=request.user.id)
        client = sub.client.id
        comp = []
        for i in data['companies']:
            comp.append(i['id'])

        # for  i in company:
        #     com.append(i.id)
        # client = sub.client
        data['client'] = client
        s = data['id']
        story = Story.objects.get(id =s)
        c = story.companies.add(*comp)
        data['companies'] = c
        source = data['source']
        data['source_id'] = source['id']


        serializer = StorySerializer(stories, data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        stories.delete()
        return JsonResponse({},status=status.HTTP_204_NO_CONTENT)
@csrf_exempt
# @api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((permissions.AllowAny,))
def source_api_detail(request, pk, format = None):
    try:
        sources = Source.objects.get(pk=pk)
    except Source.DoesNotExist:
        return JsonResponse({'message': 'The Source does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer =  SourceSerializer(sources)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        user = request.user.id
        sub = Subscriber.objects.select_related('client').get(user=request.user.id)

        # S = request.source.id
        data['created_by'] = user
        data['client'] = sub.client.id
        # import ipdb; ipdb.set_trace()
        # serializer = SourceSerializer(sourcedata=data)
        serializer = SourceSerializer(sources, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # import ipdb;
        # ipdb.set_trace()

        sources.delete()
        return JsonResponse({},status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@permission_classes((permissions.AllowAny,))
def Company_api(request, format=None):
    if request.user.is_staff:
        if request.method == 'GET':
            company = Company.objects.all()
            serializer = CompanySerializers(company, many=True)
            return JsonResponse(serializer.data, safe=False)
    else:
        curr_user = request.user.id
        sub = Subscriber.objects.get(user=curr_user)
        if request.method == 'GET':
            company = Company.objects(created_by=sub)
            serializer = CompanySerializers(company, many=True)
            return JsonResponse(serializer.data, safe=False)