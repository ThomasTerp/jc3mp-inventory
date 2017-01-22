"use strict";
import {Item} from "./../classes/items";
import {ItemFactory} from "./../classes/itemFactory";


const itemFactoriesMap: Map<string, Map<string, ItemFactory>> = new Map();


/** Add an ItemFactory to an item class */
export function add(itemName: string, factoryName: string, itemFactory: ItemFactory): ItemFactory
{
    remove(itemName, factoryName);
	
	if(itemFactoriesMap.get(itemName) == undefined)
	{
		itemFactoriesMap.set(itemName, new Map());
	}
    
	itemFactoriesMap.get(itemName).set(factoryName, itemFactory);
	
    return itemFactory;
}

/** Delete a ItemFactory from an item class */
export function remove(itemName: string, factoryName: string): void
{
	if(itemFactoriesMap.get(itemName) != undefined)
	{
    	itemFactoriesMap.get(itemName).delete(factoryName);
		
		if(itemFactoriesMap.get(itemName).size === 0)
		{
			itemFactoriesMap.delete(itemName);
		}
	}
}

/** Get a ItemFactory from an item class */
export function get(itemName: string, factoryName: string): ItemFactory
{
	if(itemFactoriesMap.get(itemName) != undefined)
	{
		return itemFactoriesMap.get(itemName).get(factoryName);
	}
}

/** Loop through all item factory maps, return true to break */
export function forEach(callback: (itemName: string, itemFactories: Map<string, ItemFactory>) => any): void
{
    for(let [itemName, itemFactories] of itemFactoriesMap.entries())
	{
        if(callback(itemName, itemFactories))
		{
            break;
        }
    }
}
