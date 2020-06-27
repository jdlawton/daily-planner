var events = [];

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
    console.log(this);

    var textInput = $("<textarea>").addClass("form-control").val(text);
    var replaceP = $("p", this);
    replaceP.replaceWith(textInput);
    textInput.trigger("focus");
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
//copying over the value/text and also storing the timeBlock, i.e. 7 am as well as the event text
$(".save-btn").on("click", function() {
    //get the value of the text in the <textarea> you are saving
    var text = $(this).siblings(".text-box").children("textarea").val();

    //create a <p> element, save the <textarea> value to it and then
    //replace the <textarea>
    var textInput = $("<p>").addClass("event-text").text(text);
    var replaceTxt = $(this).siblings(".text-box").children("textarea");
    replaceTxt.replaceWith(textInput);
    
    //get the text indicating which time block was clicked on, i.e. 7 am
    var blockLabel = $(this).siblings(".hour").text();
    //add the new object to the events array.
    events.push({time: blockLabel, text: text});
    //call the saveElements function to write to localStorage.
    saveEvents();
});

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
//it is set to run every 10 minutes
var timer = setInterval(function() {
    $(".hour").each(function() {
        auditEvents(this);
        //clearInterval(timer);
    });
}, 600000);