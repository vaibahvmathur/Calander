/**
 * Created by Vaibhav on 25-04-2017.
 */
$(document).ready(function(){
    // EVENT EDIT :- SUBMIT BUTTON EVENT
    $("#popup-submit1").click(function(e) {
        e.preventDefault();
        // Get new event details
        var event_name = $("#myModal").attr("data-event-id");
        var name1 = $('#eventname1').val();
        var location1 = $('#eventlocation1').val();
        var desc1 = $('#eventdesc1').val();
        var event_id1 = $("#myModal").attr("data-id");
        // Call backend
        $.ajax({
            type: 'POST',
            url: "edit_event",
            dataType: 'json',
            data: {name: name1, location: location1, desc: desc1, event_id:event_id1},
            async: false,
            success: function (data) {
                if(data['success'])
                {
                    var leftside = $('.today-date-event-container').find('.today-date-event-container-data');
                    $.each(leftside, function(index, value){
                        if (('today_event_id_'+event_id1) == ($(this).attr('id')))
                        {
                            $(this).find('.event-container-data-name').html(name1);
                            $(this).find('.event-container-data-location').html(location1);
                        }
                    });
                    // Edit Event details in Calander and View detail popup and close edit event popup
                    $('#name_'+event_name).html(name1);
                    $('#'+event_name).find('.popup-name-display').html(name1);
                    $('#'+event_name).find('.popup-location-display').html(location1);
                    $('#'+event_name).find('.popup-desc-display').html(desc1);
                    $("#myModal").css("display", 'none');
                    clearpopup()

                }

            },
            error: function (request, error) {
                console.log("error");
                $("#myPop").attr("data-event-id", parseInt(0));
                clearpopup()
            }
        });
        return false
    });

    // EDIT EVENT :- CLICK OUTSIDE CLOSE EVENT
    window.onclick = function(event) {
        var modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }

    };


    // EDIT EVENT :- CLOSE EVENT ON CLICK - X BUTTON
    $('.close').click(function(){
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
    });


    // EDIT EVENT :- CLOSE EVENT ON CLICK - CLOSE BUTTON
    $('#popup-close1').click(function(){
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
    });


    // LEFT SIDE CALANDER EVENT
    $('#left-calendar').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: false,
        maxDate: 0,
        minDate: 0,
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });


    //MONTH CHANGE EVENT : CLICK UP ARROW /\
    $('#up-arrow').click(function(){
        // Plot calander for last month
        date = parseInt($('#my-heading').attr("data-date"));
        month = parseInt($('#my-heading').attr("data-month"));
        year = parseInt($('#my-heading').attr("data-year"));
        prev_date = new Date(year, month-1, date);
        last_month_plot = getDaysInMonth(prev_date.getMonth(), prev_date.getFullYear());
        plot_Calander(last_month_plot);
    });


    //MONTH CHANGE EVENT : CLICK UP ARROW \/
    $('#down-arrow').click(function(){
        // Plot calander for next month
        date = parseInt($('#my-heading').attr("data-date"));
        month = parseInt($('#my-heading').attr("data-month"));
        year = parseInt($('#my-heading').attr("data-year"));
        next_date = new Date(year, month+1, date);
        next_month_plot = getDaysInMonth(next_date.getMonth(), next_date.getFullYear());
        plot_Calander(next_month_plot);
    });


    // VIEW DETAIL EVENT  :- CLICK CLOSE EVENT
    $("#popup-close").click(function(){
        $("#myPop").popup("close");
        $("#myPop").attr("data-event-id", parseInt(0));
    });


    // ADD NEW EVENT :- SUBMIT BUTTON EVENT
    $("form").submit(function(e) {
        e.preventDefault();
        var name = $('#eventname').val();
        var location = $('#eventlocation').val();
        var desc = $('#eventdesc').val();
        var date = $("#myPop").attr("data-date");
        $.ajax({
            type: 'POST',
            url: "save_event",
            dataType: 'json',
            data: {name: name, location: location, desc: desc, date: date},
            async: false,
            success: function (data) {
                if(data['success'])
                {
                    addEvent(name, location, desc, date, data['new_id']);
                    $("#myPop").attr("data-event-id", parseInt(0));
                    $("#myPop").popup("close");
                    clearpopup()

                }

            },
            error: function (request, error) {
                console.log("error");
                $("#myPop").attr("data-event-id", parseInt(0));
                clearpopup()
            }
        });
        return false
    });


    // Main() functionality : Function callings Starts here

    // Get current month date
    var date = new Date();
    var today_day = date.getDate();
    var today_month = date.getMonth();
    var today_year = date.getFullYear();
    cur_month = getDaysInMonth(today_month, today_year);
    next_month = getDaysInMonth(date.getMonth()+1, date.getFullYear());
    // Start left side clock
    setInterval('updateClock()', 1000);
    // plot calander for given month
    plot_Calander(cur_month);
    // Event bindings
    calanderhover();
    calanderEventDetails();
    calanderClose();
    eventEdit();
    eventDelete();

});


function updateClock()
{
    var currentTime = new Date ( );
    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );
    var currentSeconds = currentTime.getSeconds ( );
    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
    // Choose either "AM" or "PM" as appropriate
    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
    // Convert the hours component to 12-hour format if needed
    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
    // Convert an hours component of "0" to "12"
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
    $("#clock").html(currentTimeString);
}


function getDaysInMonth(month, year)
{
    // Since no month has fewer than 28 days
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}


function openPopup()
{

    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    $('#calendar .days li:not(.other-month)').unbind('click');
    $('#calendar .days li:not(.other-month)').click(function(){
        total_length = $(this).find('.event .event-desc').length
        if(total_length < 3) {
            clearpopup();
            var this_id = $(this).find("div").attr("id");
            var this_day = $(this).find("div").attr("data-day");
            var this_date = $(this).find("div").attr("data-date");
            var this_month = $(this).find("div").attr("data-month");
            var this_year = $(this).find("div").attr("data-year");
            var temp = weekday[this_day] + ', ' + this_date + ' ' + months[this_month] + ' ' + this_year;
            $("#popup-date").html(temp);

            $("#myPop").popup("open");
            $("#myPop").attr("data-date", this_id);
            $("#myPop").attr("data-event-id", '0');
        }
        else
        {
            alert('only 3 event allowed');
        }

    });
}


function plot_Calander(cur_month)
{
    // Vlear calander
    $('#calendar').empty();
    // Add header
    $('#calendar').append('<ul class="weekdays"><li>Sunday</li><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li></ul>');
    $('#my-heading').empty();
    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var start_day_ul = '<ul class="days">';
    var day_other_month = '<li class="day other-month">';
    var day_this_month = '<li class="day">';
    var list_to_append = [];
    var event_to_append = [];
    var this_date = '';
    var this_week_date = '';
    // Get all events for this month
    var event_data = get_event_data(cur_month[0])[0];
    var today_event_list = get_event_data(cur_month[0])[1];
    // Loop through current months dates
    $.each(today_event_list, function(index, today_value){
        var event_today_id = 'today_event_id_'+ today_value['pk'];
        var event_today_name = today_value['fields']['name'];
        var event_today_location = today_value['fields']['location'];
        var this_to_append = '<div class="today-date-event-container-data" id='+event_today_id+'><span class="event-container-data-name">'+event_today_name+'</span><span class="event-container-data-location">'+event_today_location+'</span></div>'
        $('.today-date-event-container').append(this_to_append);
    });
    $.each(cur_month, function(index, value){
        if (index == 0)
        {
            // If day1 is not sunday(getDay=0) than previous month dates are on calander
            if(value.getDay() !=0){
                var cnt = 0;
                // loop previous months dates on this month calander
                while (cnt+1 != value.getDay()){
                    var temp = new Date(value);
                    var diff = value.getDay() - cnt -1;
                    temp.setDate(temp.getDate() - parseInt(diff));
                    this_date = ('0' + temp.getDate()).slice(-2) + '-' +  ('0' + (temp.getMonth() + 1)).slice(-2) + '-' + temp.getFullYear();
                    this_week_date ='<li class="day other-month"><div id='+this_date+' data-day='+temp.getDay()+' data-date='+temp.getDate()+' data-month='+temp.getMonth()+' data-year='+temp.getFullYear()+' class="date">'+temp.getDate()+'</div></li>';
                    list_to_append.push(this_week_date);
                    cnt += 1
                }
            }
            // plot day1 value
            this_date = ('0' + value.getDate()).slice(-2) + '-' +  ('0' + (value.getMonth() + 1)).slice(-2) + '-' + value.getFullYear();
            // Check Events length for this day
            // If no event for this date
            if(event_data[this_date].length == 0)
            {
                this_week_date = '<li class="day"><div id=' + this_date + ' data-day=' + value.getDay() + ' data-date=' + value.getDate() + ' data-month=' + value.getMonth() + ' data-year=' + value.getFullYear() + ' class="date">' + value.getDate() + '</div></li>';
            }
            // if events available for this date
            else
            {
                this_week_date = '<li class="day"><div id=' + this_date + ' data-day=' + value.getDay() + ' data-date=' + value.getDate() + ' data-month=' + value.getMonth() + ' data-year=' + value.getFullYear() + ' class="date">' + value.getDate() + '</div></li>';
                $.each(event_data[this_date], function(index, data_value1){
                    var t1_date = data_value1['fields']['date'];
                    var t1_description = data_value1['fields']['description'];
                    var t1_name = data_value1['fields']['name'];
                    var t1_location = data_value1['fields']['location'];
                    var t1_id = data_value1['pk'];
                    event_to_append.push({'name':t1_name, 'location':t1_location,'description':t1_description,'date':t1_date, 'id':t1_id});
                });

            }
            list_to_append.push(this_week_date);

        }
        // If last day of moth
        else if (index == cur_month.length - 1)
        {
            // Plot last day of month
            this_date = ('0' + value.getDate()).slice(-2) + '-' +  ('0' + (value.getMonth() + 1)).slice(-2) + '-' + value.getFullYear();
            // If no event for last day
            if(event_data[this_date].length == 0)
            {
                this_week_date ='<li class="day"><div id='+this_date+' data-day='+value.getDay()+' data-date='+value.getDate()+' data-month='+value.getMonth()+' data-year='+value.getFullYear()+' class="date">'+value.getDate()+'</div></li>';

            }
            // If events available for last day
            else
            {
                this_week_date = '<li class="day"><div id=' + this_date + ' data-day=' + value.getDay() + ' data-date=' + value.getDate() + ' data-month=' + value.getMonth() + ' data-year=' + value.getFullYear() + ' class="date">' + value.getDate() + '</div></li>';
                $.each(event_data[this_date], function(index, data_value2){
                    var t2_date = data_value2['fields']['date'];
                    var t2_description = data_value2['fields']['description'];
                    var t2_name = data_value2['fields']['name'];
                    var t2_location = data_value2['fields']['location'];
                    var t2_id = data_value2['pk'];
                    event_to_append.push({'name':t2_name, 'location':t2_location,'description':t2_description,'date':t2_date, 'id':t2_id })
                });
            }
            list_to_append.push(this_week_date);
            // Check if last day is saturday(getDay=6)
            // If not saturday next month dates are in this calander
            //Loop through next moth dates
            if(value.getDay()!=6){
                var cnt = 6;
                var temp = new Date(value);
                while (cnt != 0){
                    temp.setDate(temp.getDate() + 1);
                    this_date = ('0' + temp.getDate()).slice(-2) + '-' +  ('0' + (temp.getMonth() + 1)).slice(-2) + '-' + temp.getFullYear();
                    this_week_date ='<li class="day other-month"><div id='+this_date+' data-day='+value.getDay()+' data-date='+temp.getDate()+' data-month='+temp.getMonth()+' data-year='+temp.getFullYear()+' class="date">'+temp.getDate()+'</div></li>';
                    list_to_append.push(this_week_date);
                    cnt -= 1
                }
            }
        }
        // All dates between 1st day and Last date of this month
        else
        {
            this_date = ('0' + value.getDate()).slice(-2) + '-' +  ('0' + (value.getMonth() + 1)).slice(-2) + '-' + value.getFullYear();
            // No event available for this date
            if(event_data[this_date].length == 0)
            {
                this_week_date ='<li class="day"><div id='+this_date+' data-day='+value.getDay()+' data-date='+value.getDate()+' data-month='+value.getMonth()+' data-year='+value.getFullYear()+' class="date">'+value.getDate()+'</div></li>';
            }
            // Events available for this date
            else
            {
                this_week_date = '<li class="day"><div id=' + this_date + ' data-day=' + value.getDay() + ' data-date=' + value.getDate() + ' data-month=' + value.getMonth() + ' data-year=' + value.getFullYear() + ' class="date">' + value.getDate() + '</div></li>';
                $.each(event_data[this_date], function(index, data_value3){
                    var t3_date = data_value3['fields']['date'];
                    var t3_description = data_value3['fields']['description'];
                    var t3_name = data_value3['fields']['name'];
                    var t3_location = data_value3['fields']['location'];
                    var t3_id = data_value3['pk'];
                    event_to_append.push({'name':t3_name, 'location':t3_location,'description':t3_description,'date':t3_date, 'id':t3_id })
                });
            }
            list_to_append.push(this_week_date)
        }
    });
    start_ptr = 0;
    last_ptr = 7;
    // Loop for 6 rows in calander
    for (var i=0; i<5;i++){
        // Slice 1 week from dates (containing dates div) list
        // Plot for 1 WEEK DATES
        var temp_month = list_to_append.slice(start_ptr, last_ptr);
        this_temp = '<ul class="days">';
        $.each(temp_month, function(index, value) {
            this_temp += value
        });
        this_temp += '</ul>';
        $('#calendar').append(this_temp);
        start_ptr = last_ptr;
        last_ptr = last_ptr + 7;
    }
    month_name = months[cur_month[0].getMonth()];
    year_name = cur_month[0].getFullYear();

    $('#my-heading').append(month_name + ' ' + year_name);
    $('#my-heading').attr('data-date', cur_month[0].getDate());
    $('#my-heading').attr('data-month', cur_month[0].getMonth());
    $('#my-heading').attr('data-year', cur_month[0].getFullYear());
    // After Plotting calander : Plot Events in calander from event list
    insert_events(event_to_append);
    // Event Binding
    openPopup();

}


// ADD NEW EVENT INSIDE A DATE
function addEvent(name, location, desc, date, id)
{
    // Get date div in which event to be appended
    var $this_event =$("#calendar .days li div[id='"+date+"']");
    var $total_event = $this_event.parent().find('.event .event-desc');
    // Get unique code for event id
    var uni_code = get_uniqe();
    // If Date have already events
    if ($total_event.length){
        var data_event = 'event_' +uni_code+'_'+ date;
        var popup_event ='pop' + data_event;
        var pop_event_name = 'name_'+ popup_event;
        var new_event = '<div class="event-desc" id='+data_event+' data-event='+data_event+'><span id='+pop_event_name+' class="event-decorate">'+name+'</span><div data-role="popup" id='+popup_event+' class="ui-content this-popup-display" data-arrow="l"><span class="popup-close-me" data-id='+popup_event+'>&#10006;</span><span class="popup-date-display">'+date+'</span><span class="popup-label">Name</span><div class="popup-label-data popup-name-display">'+name+'</div><span class="popup-label">Where</span><div class="popup-label-data popup-location-display">'+location+'</div><span class="popup-label">Description</span><div class="popup-label-data popup-desc-display">'+desc+'</div><br/><button type="button" id="popup-delete-event" data-dismiss="popup" class="button button1 popup-delete-event" data-delete-id='+id+'>Delete</button><button type="button" id="popup-edit-event" class="button button2 popup-edit-event" data-id='+id+'>Edit</button></div></div>';
        $this_event.parent().find('.event').append(new_event);
    }
    // IF this is first event to be added
    else{
        var data_event = 'event_' + uni_code +'_'+ date;
        var popup_event ='pop' + data_event;
        var pop_event_name = 'name_'+ popup_event;
        var new_event = '<div class="event"><div id='+data_event+' class="event-desc" data-event='+data_event+'><span id='+pop_event_name+' class="event-decorate">'+name+'</span><div data-role="popup" id='+popup_event+' class="ui-content this-popup-display" data-arrow="l"><span class="popup-close-me" data-id='+popup_event+'>&#10006;</span><span class="popup-date-display">'+date+'</span><span class="popup-label">Name</span><div class="popup-label-data popup-name-display">'+name+'</div><span class="popup-label">Where</span><div class="popup-label-data popup-location-display">'+location+'</div><span class="popup-label">Description</span><div class="popup-label-data popup-desc-display">'+desc+'</div><br/><button type="button" id="popup-delete-event" data-dismiss="popup" class="button button1 popup-delete-event" data-delete-id='+id+'>Delete</button><button type="button" id="popup-edit-event" class="button button2 popup-edit-event" data-id='+id+'>Edit</button></div></div></div>';
        $this_event.parent().append(new_event);
    }
    // Event bindings for new event
    calanderEventDetails();
    calanderClose();
    eventEdit();
    eventDelete();
    calanderhover();
}


//GET ALL EVENTS FOR CALANDER
function get_event_data(temp_date)
{
    // Get Proper month for which events are to be fetched
    var curr_date = temp_date.getDate();
    var curr_month = temp_date.getMonth();
    var curr_year = temp_date.getFullYear();
    var date = (curr_date + "-" + (parseInt(curr_month)+1) + "-" + curr_year);
    var data_list = {};
    var today_event_lists = [];
    // Call to backend
    $.ajax({
        type: 'GET',
        url: "get_event",
        dataType: 'json',
        data: {date: date},
        async: false,
        success: function (data) {
            //Get events list for this month
            today_event_lists.push(data_list = data['dates_list'])
            today_event_lists.push(data_list = data['today_event_lists'])

        },
        error: function (request, error) {
            console.log("error");
        }
    });
    return today_event_lists
}


// Add events in calander for all dates
function insert_events(event_to_append)
{
    $.each(event_to_append, function(index, this_event_1){
        var value_new = new Date(this_event_1['date']);
        var date_temp_new = ('0' + value_new.getDate()).slice(-2) + '-' +  ('0' + (value_new.getMonth() + 1)).slice(-2) + '-' + value_new.getFullYear()
        addEvent(this_event_1['name'], this_event_1['location'], this_event_1['description'], date_temp_new, this_event_1['id']);
    });
    return true
}


// ADD EVENT :- Click EVENT
function calanderEventDetails() {

    $('#calendar .days li:not(.other-month) .event .event-desc').unbind('click');
    $('#calendar .days li:not(.other-month) .event .event-desc').click(function (event) {
        event.stopPropagation();
        var event_id = $(this).attr("data-event");
        var pop_id = 'pop' + event_id;
        $('#' + pop_id).popup();
        $('#' + pop_id).popup('open');
    });
}


// VIEW EVENT DETAILS :- CLOSE BUTTON Click EVENT
function calanderClose()
{
    $('.popup-close-me').unbind('click');
    $('.popup-close-me').click(function(){
        var id = $(this).attr('data-id');
        $('#'+id).popup('close');
    });
}


// CLEAR VIEW EVENT DETAIL AND EDIT EVENT DETAIL POPUP
function clearpopup()
{
    $('#eventname').val('');
    $('#eventlocation').val('');
    $('#eventdesc').val('');
    $('#eventname1').val('');
    $('#eventlocation1').val('');
    $('#eventdesc1').val('');

}


// VIEW EVENT DETAIL :- EDIT BUTTON CLICK
function eventEdit()
{
    $('.popup-edit-event').unbind('click');
    $('.popup-edit-event').click(function(e){
        e.preventDefault();
        clearpopup();
        // append details from view event popup to edit detail popup
        var id = $(this).attr('data-id');
        var this_temp_id = $(this).parent().attr('id');
        var t_date = $(this).parent().find('.popup-date-display').html();
        var t_name = $(this).parent().find('.popup-name-display').html();
        var t_loc = $(this).parent().find('.popup-location-display').html();
        var t_desc = $(this).parent().find('.popup-desc-display').html();
        // Close view detail popup and open edit detail popup
        $('#'+this_temp_id).popup('close');
        $('#myModal').css('display', 'block');
        $('#popup-date1').html(t_date);
        $('#eventname1').val(t_name);
        $('#eventlocation1').val(t_loc);
        $('#eventdesc1').val(t_desc);
        $('#myModal').attr('data-id',id);
        $('#myModal').attr('data-event-id',this_temp_id);
    });
}


// VIEW EVENT DETAIL :- DELETE BUTTON CLICK
function eventDelete()
{
    $('.popup-delete-event').unbind('click');
    $('.popup-delete-event').click(function(e){
        e.preventDefault();
        // Get event id to be deleted
        var parent_id = $(this).parent().attr('id');
        var delete_this_id = $(this).attr('data-delete-id');
        // Call backend
        $.ajax({
            type: 'POST',
            url: "delete_event",
            dataType: 'json',
            data: {delete_this_id: delete_this_id},
            async: false,
            success: function (data) {
                if(data['success'])
                {
                    var leftside = $('.today-date-event-container').find('.today-date-event-container-data');
                    $.each(leftside, function(index, value){
                        if (('today_event_id_'+delete_this_id) == ($(this).attr('id')))
                        {
                            $(this).remove()
                        }
                    });
                    // Remove Event from calander and close view detail popup
                    var remove_event_desc_from_calander = parent_id.slice(3,parent_id.length);
                    var remove_event_from_calander = remove_event_desc_from_calander.slice(-10);
                    var check_len = ($('#'+remove_event_desc_from_calander).parent().find('.event-desc')).length;
                    $('#'+parent_id).popup('close');
                    clearpopup();
                    if (check_len == 1)
                    {
                        $('#'+remove_event_from_calander).parent().find('.event').remove();
                    }
                    else {
                        $('#' + remove_event_desc_from_calander).remove();
                    }
                    alert('Event Deleted');
                }
            },
            error: function (request, error) {
                console.log("error");
            }
        });

    });
}


// Get unique code for event id
function get_uniqe()
{
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    var uni_id = components.join("");
    return uni_id
}


function calanderhover()
{
    //After Plot Calander
    $("#calendar .days li:not(.other-month)").unbind('hover');
    $("#calendar .days li:not(.other-month)").mouseenter(function () {
        $(this).find(".event .event-desc").addClass("event-desc-hover");
        //$(this).find("div").addClass("date-hover");

    }).mouseleave(function(){
        $(this).find(".event .event-desc").removeClass("event-desc-hover");
        $(this).find(".event .event-desc").children().removeClass("event-desc-hover");
        //$(this).find("div").removeClass("date-hover");

    });
}