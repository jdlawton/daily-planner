# Work Day Scheduler Starter

The live application deployment link is:
https://jdlawton.github.io/daily-planner/

The GitHub repo link is:
https://github.com/jdlawton/daily-planner


Beginning with the supplied starter code, I added the following to the application:
    * Added the current date to the top of the planner
    * Created time blocks for each hour of the work day (I oped to go from 6am to 5pm to allow for a wider array of work schedules).
    * Each block is color coded depending on if has already past, is the curent time block, or is a block in the future.
    * Users can click into a time block to enter text, then click on the save button to revert the textarea back to non-editable text.
    * Clicking the save button additionally stores the entered item to localStorage.
    * When the application is opened or refreshed, the events saved to localStorage are loaded into the schedule.
    * Users can click on an existing item on the schedule and update the text. Clicking on save will update the exiting schedule item both on the schedule and in localStorage.
    * Users can click on an item to edit and delete all of the text, then click save to delete the item entirely from the application and from localStorage.
    * Clicking Save on an existing schedule item that is not in the process if being edited will not cause any "bad" schedule items to be created in the application.
    * Clicking Save on a blank schedule item will not cause any "bad" schedule items to be created in the application.


Screenshot:
![Project Screenshot1](/dailyplannerscreen.png?raw=true)