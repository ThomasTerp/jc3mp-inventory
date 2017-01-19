"use strict";
import {Inventory} from "./../classes/inventory";


const inventoriesMap: Map<string, Inventory> = new Map();


//Add a window and give it a unique name
export function add(uniqueName: string, inventory: Inventory): Inventory
{
	remove(uniqueName);
    
	inventory.uniqueName = uniqueName;
	
    inventoriesMap.set(uniqueName, inventory);
	
    return inventory;
}

//Delete a window from the manager and detach its HTML
export function remove(uniqueName: string): void
{
    let inventory = get(uniqueName);
	
    if(inventory)
	{
        inventory.uniqueName = undefined;
		
        inventoriesMap.delete(uniqueName);
    }
}

//Get a window by its unique name
export function get(uniqueName: string): Inventory
{
    return inventoriesMap.get(uniqueName);
}

//Loop through all windows, return true to break
export function forEach(callback: ForEachCallbackFunction): void
{
    for(let [uniqueName, inventory] of inventoriesMap.entries())
	{
        if(callback(uniqueName, inventory))
		{
            break;
        }
    }
}
export interface ForEachCallbackFunction
{
	(uniqueName: string, inventory: Inventory): any
}
