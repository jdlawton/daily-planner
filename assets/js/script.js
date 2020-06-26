var events = [];

//display current date at the top of the app
var today = moment().format("dddd, MMMM Do, YYYY");
//console.log(today);
$("#currentDay").text(today);

//loads events from localStorage
var loadEvents = function() {
    events = JSON.parse(localStorage.getItem("events"));
    console.log("Inside loadEvents");
    console.log(events);
    if (!events){
        events = [];
    }
    for (var i = 0; i < events.length; i++){
        console.log ("looping through the loaded events: " + i);
        console.log(events[i].time);
        console.log(events[i].text);
        var loadingBlock = $(".hour:contains('"+ events[i].time +"')");
        console.log(loadingBlock);
        loadingBlock.siblings(".text-box").children(".event-text").text(events[i].text);

    }
};

//creates a new event
var saveEvents = function(){
    console.log("inside saveEvents");
    localStorage.setItem("events", JSON.stringify(events));
};



//event listener for the middle text area of the time block. When the text-box is clicked
//it converts the <p> element to a <textarea> element to allow event creating/editing
$(".time-block").on("click", ".text-box", function () {
    var text = $(this).text().trim();

    var textInput = $("<textarea>").addClass("form-control").val(text);
    var replaceP = $("p", this);
    replaceP.replaceWith(textInput);
    textInput.trigger("focus");
});

$("textarea").on("blur", function() {
    console.log("Inside event listener for textarea blur");
});

$(".save-btn").on("click", function() {
    //get the value of the text in the <textarea> you are saving
    var text = $(this).siblings(".text-box").children("textarea").val();
    console.log(text);

    //create a <p> element, save the <textarea> value to it and then replace
    //the <textarea>
    var textInput = $("<p>").addClass("event-text").text(text);
    var replaceTxt = $(this).siblings(".text-box").children("textarea");
    replaceTxt.replaceWith(textInput);
    
    //get the text indicating which time block was clicked on, i.e. 7am
    var blockLabel = $(this).siblings(".hour").text();
    //console.log(blockLabel);
    console.log("time: " + blockLabel);
    console.log("text: " + text);
    events.push({time: blockLabel, text: text});
    console.log(events);
    saveEvents();
});

loadEvents();