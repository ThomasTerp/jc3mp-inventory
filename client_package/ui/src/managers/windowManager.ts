"use strict";
import {Window} from "./../classes/windows/window";


const windowsHTML = $(".windows");
const windowsMap: Map<string, Window> = new Map();


$(window).on("resize", (event) =>
{
	this.forEach((uniqueName, window) =>
	{
		window.onResize();
	});
});


/** Add a window and give it a unique name */
export function add(uniqueName: string, window: Window): Window
{
	remove(uniqueName);
    
	window.uniqueName = uniqueName;
	
    windowsMap.set(uniqueName, window);
	
    window.html.appendTo(windowsHTML);
	
    return window;
}

/** Delete a window from the manager and detach its HTML */
export function remove(uniqueName: string): void
{
    let window = get(uniqueName);
	
    if(window !== undefined)
	{
        window.uniqueName = null;
        
        window.html.detach();
		
        windowsMap.delete(uniqueName);
    }
}

/** Get a window by its unique name */
export function get(uniqueName: string): Window
{
    return windowsMap.get(uniqueName)
}

/** Loop through all windows, return true to break */
export function forEach(callback: (uniqueName: string, window: Window) => any): void
{
    for(let [uniqueName, window] of windowsMap.entries())
	{
        if(callback(uniqueName, window))
		{
            break;
        }
    }
}

/** Returns true if any window is open */
export function isAnyWindowVisible(): boolean
{
	let isAnyWindowVisible = false;
	
	forEach((uniqueName, window) =>
	{
		if(window.isVisible)
		{
			isAnyWindowVisible = true;
			
			return true;
		}
	});
	
	return isAnyWindowVisible;
}
