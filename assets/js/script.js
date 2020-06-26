var events = [];

//display current date at the top of the app
var today = moment().format("dddd, MMMM Do, YYYY");
//console.log(today);
$("#currentDay").text(today);

//loads events from localStorage
var loadEvents = function() {

};

//creates a new event
var createEvent = function(){

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

$(".save-btn").on("click", function() {
    //console.log("Clicked on a button");
    //console.log(this);
    //get <textarea>'s current text/value
    var text = $(this).siblings(".text-box").children("textarea").val();
    console.log(text);

    var textInput = $("<p>").addClass("event-text").text(text);
    var replaceTxt = $(this).siblings(".text-box").children("textarea");
    replaceTxt.replaceWith(textInput);
    

    
});

