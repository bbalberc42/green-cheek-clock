// import { me as device } from "device";
import * as document from "document";
import { battery, charger } from "power";

const BATTERY_LVL_NORMAL    = 50;
const BATTERY_LVL_LOW       = 25;

const batt_bar          = document.getElementById("batt_bar");
const batt_percent      = document.getElementById("batt_percent");

export class BatteryIcon
{
    constructor()
    {
        // Do nothing
    }
    
    update()
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

        batt_percent.text = `${battery.chargeLevel}%`;
    }
}