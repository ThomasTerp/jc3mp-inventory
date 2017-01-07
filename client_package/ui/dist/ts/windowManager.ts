"use strict";
import {Window} from "./window";


let windowsHTML = $(".windows");
let windowsMap: Map<string, Window> = new Map();

$(window).on("resize", (event) =>
{
	this.forEach((uniqueName, window) =>
	{
		window.onResize();
	});
});


interface ForEachCallbackFunction
{
	(uniqueName: string, window: Window): any
}
export {ForEachCallbackFunction}

//Add a window and give it a unique name
export function add(uniqueName: string, window: Window): Window
{
	window.uniqueName = uniqueName;
    
    remove(uniqueName);
	
    windowsMap.set(uniqueName, window);
	
    window.html.appendTo(windowsHTML);
	
    return window;
}

//Delete a window from the manager and detach its HTML
export function remove(uniqueName: string): void
{
    let window = get(uniqueName);
	
    if(window)
	{
        window.uniqueName = null;
        
        window.html.detach();
		
        windowsMap.delete(uniqueName);
    }
}

//Get a window by its unique name
export function get(uniqueName: string): Window
{
    return windowsMap.get(uniqueName)
}

//Loop through all windows, return true to break
export function forEach(callback: ForEachCallbackFunction): void
{
    for(let [uniqueName, window] of windowsMap.entries())
	{
        if(callback(uniqueName, window))
		{
            break;
        }
    }
}
