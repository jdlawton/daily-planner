var events = [];
var bufEventTime = "";
var bufEventTxt = "";

//display current date at the top of the app
var today = moment().format("dddd, MMMM Do, YYYY");
//console.log(today);
$("#currentDay").text(today);

//loads events from localStorage
var loadEvents = function() {
    events = JSON.parse(localStorage.getItem("events"));
    //console.log("Inside loadEvents");
    //console.log(events);
    if (!events){
        events = [];
    }
    for (var i = 0; i < events.length; i++){
        //console.log ("looping through the loaded events: " + i);
        //console.log(events[i].time);
        //console.log(events[i].text);
        var loadingBlock = $(".hour:contains('"+ events[i].time +"')");
        //console.log(loadingBlock);
        loadingBlock.siblings(".text-box").children(".event-text").text(events[i].text);

    }

    //when the events are loaded from localStorage, call the auditEvents function
    //for each timeBlock so we can set the initial color coding.
    $(".hour").each(function() {
        auditEvents(this);
    })

};

//saves the current events array to localStorage
var saveEvents = function(){
    localStorage.setItem("events", JSON.stringify(events));
};



//event listener for the middle text area of the time block. When the text-box is clicked
//it converts the <p> element to a <textarea> element to allow event creating/editing
$(".time-block").on("click", ".text-box", function () {
    var text = $(this).text().trim();
    //console.log(this);

    var textInput = $("<textarea>").addClass("form-control").val(text);
    var replaceP = $("p", this);
    replaceP.replaceWith(textInput);
    textInput.trigger("focus");
    //these if statments will check to see if the parent text-box has the past, present, or fiture class
    //it will then add a class specifically to style the background of the textarea while it is in focus
    //there may be a more efficient way of writing this using the existing past present and future classes
    if ($(this).hasClass("past")) {
        textInput.addClass("past-textarea");
    }
    else if ($(this).hasClass("present")) {
        textInput.addClass("present-textarea");
    }
    else if ($(this).hasClass("future")) {
        textInput.addClass("future-textarea");
    }
});

//event listener for the Save button. It replaces the <textarea> with a <p> element
//keeping the values from the <textarea>. If the event that is being saved is one that already exists
//in the array, it is ignored. If the user clicks on an existing event and edits the text, the edited
//text is updated to the schedule and the array. If the user deletes all of the text in the <textarea>
//the event is deleted from the array. After any changes to the array are made, the saveEvents function
//is called to save the array to localStorage
$(".save-btn").on("click", function() {
    //get the value of the text in the <textarea> you are saving
    var eventText = $(this).siblings(".text-box").children("textarea").val();
    //if eventText is undefined then it means either the user clicked save on an empty event or they clicked save on an event
    //that did not have a <textarea> element, i.e. one that was not being edited, in either case, we just want to return and
    //not do anything further.
    if(eventText === undefined) {
        return;
    }
    //get the string indicating which time block was clicked on, i.e. 7 am
    var eventTime = $(this).siblings(".hour").text();

    //i want to only push the event to the array if it is truly a new event. If the user just 
    //updates the text, then I want to update the text in the existing array element and 
    //not add another event.

    //as we iterate through the array, if we find the event being saved is not an actual new event, i.e. one being 
    //edited or deleted, then newEvent will be flipped to false so the later push to the array will not happen.
    var newEvent = true;
    //loop through each element of the array
    for (var i = 0; i < events.length; i++) {
        //this will evaluate to true if we find an event in the array that has a matching time (7 am) with the 
        //event that is being saved
        if (events[i].time === eventTime) {
                /*if (!eventText){
                    console.log("no text");
                    newEvent = false;
                    //break;
                }*/
            newEvent = false;
            //update the text in the array with the text that is being saved, this allows us to edit the text for an existing event
            events[i].text = eventText;
            //next we check to see if the event being saved should be deleted. eventText will be "" if the user deleted all of the text in 
            //an existing event and saved it, so we check for that and splice the corresponding array element out of the array.
            if (eventText === ""){
                events.splice(i, 1);
                break;
            }
        }
    }

    //after we are done iterating through the array of existing events, if the saved event was not found, we can push it to the array
    if (newEvent === true) {
        events.push({time: eventTime, text: eventText});
    }


    //replace the <textarea> element with a <p> element
    var replaceP = $("<p>").addClass("event-text").text(eventText);
    $(this).siblings(".text-box").children("textarea").replaceWith(replaceP);

    //call the saveElements function to write to localStorage.
    saveEvents();
});

//event listener for when the user is creating/editing an event. I wanted to have the text in the <textarea> revert back to a <p> element
//in the event the <textarea> lost focus. I didn't want this to trigger a save, like clicking on the Save button, but rather discard any changes.
//Unfortunately, I had too much trouble with the button "click" event handler and the textarea "blur" event handler stepping on each other's toes.
//Ultimately, I had to remove the blur functionality and the <textarea> stays in place on the page until the Save button is pressed.
/*$(".text-box").on("blur", "textarea", function() {
    var eventText = $(this).val().trim();
    var eventTime = $(this).parent(".text-box").siblings(".hour").text();
    bufEventTime = eventTime;
    bufEventTxt = eventText;
    for (var i = 0; i < events.length; i++) {
        if (events[i].time === eventTime){
            eventText = events[i].text;
        }
    }
    var textInput = $("<p>").addClass("event-text").text(eventText);
    $(this).replaceWith(textInput);
})*/



//this function compares each timeBlock on the schedule and color codes it
//gray = this timeBlock has already passed
//green = this timeBlock is in the future
//red = this is timeBlock you are currently in

//eventEl is the element on the page that contains the timeBLock label, i.e. the 
//column that contains the text "7 am".
var auditEvents = function (eventEl) {

    //get the text of the element
    var timeBlock = $(eventEl).text();
    //take the time from the label and split it into an array
    //the [0] element will be the time, i.e. 7
    //the [1] element will be either "am" or "pm"
    timeBlock = timeBlock.split(" ");
    
    //we want to convert the time to a 24 hour clock and make sure timeBlock[0] is an int and not a string
    //Noon is a special case since even though it is "pm", we don't watn to add 12 to it, so our if
    //statement specifically excludes the noon event.
    if (timeBlock[1] === "pm" && timeBlock[0] !== "12"){
        timeBlock[0] = parseInt(timeBlock[0]);
        //if timeBlock[0] is after noon, add 12 to get the hour on a 24 hour clock
        timeBlock[0] += 12;
    }

    //get a jQuery object for the div with class .text-box, this is what will be changing colors
    var colorBox = $(eventEl).siblings(".text-box");
    //strip out any classes that may be changing when we audit each event
    colorBox.removeClass("past present future");

    //compare the current hour with the timeBlock related to the event we are checking.
    //depending on whether it is past, present, or future, assign the appropriate class
    //that will use CSS to determine the appropriate color.

    if (moment().isAfter(moment().hour(timeBlock[0]))) {
        //console.log("The timeBlock is in the past");
        colorBox.addClass("past");
    }
    else if (moment().isBefore(moment().hour(timeBlock[0]))) {
        //console.log("The timeBlock is in the future");
        colorBox.addClass("future");
    }
    else if (moment().isSame(moment().hour(timeBlock[0]))) {
        //console.log("The timeBLock is NOW!");
        colorBox.addClass("present");
    }   
};

loadEvents();

//sets a timer to evaluate the events and make color coding adjustments
//it is set to run every 5 minutes
var timer = setInterval(function() {
    $(".hour").each(function() {
        auditEvents(this);
        //clearInterval(timer);
    });
}, 300000);