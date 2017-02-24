"use strict";
import * as Util from "./../util";
import {Item} from "./../classes/items";


const items: Array<Item> = [];
const itemsMap: Map<number, Item> = new Map();


export function add(item: Item): Item
{
    remove(item);
	
	if(item.id != undefined)
	{
	    itemsMap.set(item.id, item);
	}
	
    items.push(item);
	
    return item;
}

export function remove(item: Item): void
{
    if(exists(item))
	{
		if(item.id != undefined)
		{
	        itemsMap.delete(item.id);
		}
		
		delete items[getItemIndex(item)];
    }
}

/** Get an item by its id */
export function getByID(id: number): Item
{
    return itemsMap.get(id)
}

export function getByItemIndex(itemIndex: number): Item
{
	return items[itemIndex];
}

export function getItemIndex(item: Item): number
{
	return items.indexOf(item);
}

export function exists(item: Item): boolean
{
	if(getByID(item.id) != undefined)
	{
		return true;
	}
	
	if(getItemIndex(item) !== -1)
	{
		return true;
	}
	
	return false;
}

/** Loop through all items, return true to break */
export function forEach(callback: (itemIndex: number, item: Item) => any): void
{
	for(var itemIndex = 0; itemIndex < items.length; itemIndex++)
	{
		const item = items[itemIndex];
		
		if(item != undefined && callback(itemIndex, item))
		{
            break;
        }
	};
}
