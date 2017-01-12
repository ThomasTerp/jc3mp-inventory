"use strict";
import {Item} from "./../classes/items";


const itemTypeConstructorsMap: Map<string, ItemConstructorFunction[]> = new Map();

export interface ItemConstructorFunction
{
	(): Item;
}

export interface ForEachCallbackFunction
{
	(itemType: string, constructor: ItemConstructorFunction[]): any
}

//Add constructors array for an item type, each constructor should return a new item
//item: Item constructor()
export function add(itemType: string, constructors: ItemConstructorFunction[]): ItemConstructorFunction[]
{
    remove(itemType);
	
    itemTypeConstructorsMap.set(itemType, constructors);
	
    return constructors;
}

//Delete the constructors array for an item type
export function remove(itemType: string): void
{
    let constructors = get(itemType);
	
    if(constructors)
	{
        itemTypeConstructorsMap.delete(itemType);
    }
}

//Get the constructors array for an item type
export function get(itemType: string): ItemConstructorFunction[]
{
    return itemTypeConstructorsMap.get(itemType)
}

//Loop through all item types
//callback(itemType: typeof Item, constructors: ItemConstructorFunction[]): boolean
export function forEach(callback: ForEachCallbackFunction): void
{
    for(let [itemType, constructors] of itemTypeConstructorsMap.entries())
	{
        if(callback(itemType, constructors))
		{
            break;
        }
    }
}
