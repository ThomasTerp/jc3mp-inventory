"use strict";
window.gridInventory = window.gridInventory || {};


//Object for holding item types
gridInventory.itemTypes = {
    initialize()
    {
        this.map = new Map();
    },
	
    //Add constructors array for an item type, each constructor should return a new item
    //item constructor()
    add(itemType, constructors)
    {
        this.delete(itemType);
		
        this.map.set(itemType, constructors);
		
        return itemType;
    },
	
    //Delete the constructors array for an item type
    delete(itemType)
    {
        let constructors = this.get(itemType);
		
        if(constructors)
		{
            this.map.delete(itemType);
        }
    },
	
    //Get the constructors array for an item type
    get(itemType)
    {
        return this.map.get(itemType)
    },
	
    //Loop through all item types
    //shouldBreak callback(itemType, constructors)
    forEach(callback)
    {
        for(let [itemType, constructors] of this.map.entries())
		{
            if(callback(itemType, constructors))
			{
                break;
            }
        }
    },
}
gridInventory.itemTypes.initialize();
