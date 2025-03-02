import clock from "clock";
import * as document from "document";
import { me as appbit } from "appbit";
import { preferences } from "user-settings";
import { today, goals } from "user-activity";
import { battery } from "power";
import { BatteryIcon } from "./battery_icon";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";

// Get a handle for each element
const clock_time        = document.getElementById("clock_time");
const step_icon         = document.getElementById("step_icon");
const step_count        = document.getElementById("step_count");
const heart_rate        = document.getElementById("heart_rate");

let batt_icon = new BatteryIcon();

let hrm;

// Check permissions
if (appbit.permissions.granted("access_activity")) 
{
    console.log(`${today.adjusted.steps} Steps`);
}

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) 
{
    hrm = new HeartRateSensor({ frequency: 1});
    
    hrm.addEventListener("reading", () => 
    {
        heart_rate.text = `${hrm.heartRate}`;
    });

    display.addEventListener("change", () => 
    {
        // Automatically stop the sensor when the screen is off to conserve battery
        display.on ? hrm.start() : hrm.stop();
    });

    hrm.start();
}

if (BodyPresenceSensor) 
{
    const body = new BodyPresenceSensor();

    body.addEventListener("reading", () => 
    {
        if (!body.present) 
        {
            hrm.stop();
            heart_rate.text = '--';
        } 
        else 
        {
            hrm.start();
        }
    });

    body.start();
}

function zeroPad(i) 
{
    if (i < 10) 
    {
        i = "0" + i;
    }
    return i;
}

// Update the clock every second
clock.granularity = "seconds";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => 
{
    let today = evt.date;
    let hours = today.getHours();

    if (preferences.clockDisplay === "12h") 
    {
        // 12h format
        hours = hours % 12 || 12;
    } 
    else 
    {
        // 24h format
        hours = zeroPad(hours);
    }
    let mins = zeroPad(today.getMinutes());

    // Display Time
    clock_time.text = `${hours}:${mins}`;

    // Update Steps
    let steps = getSteps();
    step_count.text = `${steps}`;
}

// Battery Power Bar Handler
battery.onchange = (charger, evt) => 
{
    // Update Battery Bar
    batt_icon.update();
}

// Get the current Step Count
function getSteps()
{
    let steps = (today.adjusted.steps || 0);

    return steps;
}