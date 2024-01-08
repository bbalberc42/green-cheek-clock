import clock from "clock";
import * as document from "document";
import { me } from "appbit";
import { preferences } from "user-settings";
import { today, goals } from "user-activity";
import { battery } from "power";
import { charger } from "power";

const BATTERY_LVL_NORMAL    = 50;
const BATTERY_LVL_LOW       = 25;

if (me.permissions.granted("access_activity")) 
{
    console.log(`${today.adjusted.steps} Steps`);
}

function zeroPad(i) 
{
    if (i < 10) 
    {
        i = "0" + i;
    }
    return i;
}

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const myLabel           = document.getElementById("myLabel");
const step_icon         = document.getElementById("step_icon");
const step_count        = document.getElementById("step_count");
const batt_icon         = document.getElementById("batt_icon");
const batt_bar          = document.getElementById("batt_bar");
const batt_bar_shine    = document.getElementById("batt_bar_shine");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => 
{
    let today = evt.date;
    let hours = today.getHours();
    // let flicker = true;

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
    myLabel.text = `${hours}:${mins}`;

    // Update Battery Bar
    battery.onchange(charger, evt);

    // Update Steps
    let steps = getSteps();
    step_count.text = `${steps}`;
}

// Battery Power Bar Handler
battery.onchange = (charger, evt) => 
{
    // Update Battery Bar
    batt_bar.width = (battery.chargeLevel / 4);

    if (battery.chargeLevel >= BATTERY_LVL_NORMAL)
    {
        batt_bar.style.fill = "lightgreen";
    }
    else if (battery.chargeLevel < BATTERY_LVL_NORMAL 
        &&   battery.chargeLevel >= BATTERY_LVL_LOW)
    {
        batt_bar.style.fill = "lightsalmon";
    }
    else if (battery.chargeLevel < BATTERY_LVL_LOW)
    {
        batt_bar.style.fill = "red";
    }
}

// Get the current Step Count
function getSteps()
{
    let steps = (today.adjusted.steps || 0);

    return steps;
}