from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import datetime
from models import Event
from django.core import serializers


@csrf_exempt
def home_page(request):
    # Render to Home Page
    return render(
            request,
            'reminder/home.html',
            {}
    )


@csrf_exempt
def save_event(request):
    # Get all details to be save
    name = request.POST.get('name')
    location = request.POST.get('location')
    description = request.POST.get('desc')
    temp_date = request.POST.get('date')
    # Get date in dd-mm-yyyy format and get proper date time object
    date = datetime.datetime.strptime(temp_date, "%d-%m-%Y")
    try:
        # Get new Event Class object
        newEvent = Event()
        newEvent.name = name
        newEvent.location = location
        newEvent.description = description
        newEvent.date = date
        # Save New Event
        newEvent.save()
        success = True
        new_id = newEvent.id
    except:
        success = False
        new_id = 0
    # Return success and new event id
    return JsonResponse({'success': success, 'new_id':new_id})


@csrf_exempt
def get_event(request):
    # Get Month date for which data is needed
    event_date = request.GET.get('date')
    dates_list = {}
    today_event_lists = []
    if event_date:
        # Get current date
        date1 = datetime.datetime.strptime(event_date, "%d-%m-%Y")
        # Get current date for next month ( After 1 month date )
        date2 = date1.replace(month=date1.month+1, day=1)
        # Loop through all dates in current month
        for single_date in daterange(date1, date2):
            # Get all events for particular date
            temp = Event.objects.filter(date=single_date)
            temp_d = serializers.serialize('json', temp)
            dates_list.update({single_date.strftime('%d-%m-%Y'): eval(temp_d)})

        today_date = datetime.date.today()
        today_temp_events = Event.objects.filter(date=today_date)
        today_event_lists = eval(serializers.serialize('json', today_temp_events))
        success = True
    else:
        success = False
    # Return success and date and associated events list
    return JsonResponse({'success': success, 'dates_list': dates_list, 'today_event_lists': today_event_lists})


def daterange(start_d, end_d):
    # Return all dates between start and end date
    return (start_d + datetime.timedelta(days=i) for i in range((end_d - start_d).days))


@csrf_exempt
def edit_event(request):
    # Get Details for event to be edited
    id_edit_event = request.POST.get('event_id')
    name_edit_event = request.POST.get('name')
    location_edit_event = request.POST.get('location')
    description_edit_event = request.POST.get('desc')
    try:
        # Get particular event with respect to id
        newEvent = Event.objects.get(id=id_edit_event)
        newEvent.name = name_edit_event
        newEvent.location = location_edit_event
        newEvent.description = description_edit_event
        # Save new data for event
        newEvent.save()
        success = True
    except:
        success = False
    # Return success message
    return JsonResponse({'success': success})


@csrf_exempt
def delete_event(request):
    # Get id of event to be deleted
    id_delete = request.POST.get('delete_this_id')
    try:
        # Get Event with respect to id
        delete_event = Event.objects.get(id=id_delete)
        # Delete event
        delete_event.delete()
        success = True
    except:
        success = False
    # Return success message
    return JsonResponse({'success': success})
