"use strict";
import * as Util from "./../util";
import {Item} from "./../classes/items";


const itemsMap: Map<number, Item> = new Map();


export function add(id: number, item: Item): Item
{
	item.id = id;
	
    remove(id);
	
    itemsMap.set(id, item);
	
    return item;
}

export function remove(id: number): void
{
    let item = get(id);
	
    if(item)
	{
        itemsMap.delete(id);
    }
}
	
//Get a window by its unique name
export function get(id: number): Item
{
    return itemsMap.get(id)
}

//Loop through all items, return true to break
export function forEach(callback: (id: number, item: Item) => any): void
{
    for(let [id, item] of itemsMap.entries())
	{
        if(callback(id, item))
		{
            break;
        }
    }
}
