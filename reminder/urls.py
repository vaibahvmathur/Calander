from django.conf.urls import url
import reminder.views as myview

app_name = 'reminder'

urlpatterns = [
    url(r'^$', myview.home_page, name="HomePage"),
    url(r'^save_event', myview.save_event, name="saveEvent"),
    url(r'^get_event', myview.get_event, name="getEvent"),
    url(r'^edit_event', myview.edit_event, name="editEvent"),
    url(r'^delete_event', myview.delete_event, name="deleteEvent"),
]

