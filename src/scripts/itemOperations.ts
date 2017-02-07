import {Item} from "./classes/items";
import {Inventory} from "./classes/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";
import * as database from "./database";
import * as network from "./network";


export function moveItem(item: Item, toInventory: Inventory, position: Vector2Grid, callback?: (success: boolean) => void): void
{
	if(toInventory.isItemWithinInventory(item, position) && toInventory.canItemBePlaced(item, position))
	{
		if(item.inventory != undefined)
		{
			item.inventory.removeItem(item);
		}
		
		toInventory.addItem(item, position);
		
		//TODO: Save move to database
		
		if(callback != undefined)
		{
			callback(true);
		}
	}
	else
	{
		if(callback != undefined)
		{
			callback(false);
		}
	}
}

export function destroyItem(item: Item, callback?: (success: boolean) => void): void
{
	new Promise((resolve, reject) =>
	{
		if(item.id == undefined)
		{
			resolve();
		}
		else
		{
			database.deleteItem(item, () =>
			{
				resolve();
			});
		}
	}).then(() =>
	{
		if(item.inventory != undefined)
		{
			item.inventory.removeItem(item);
		}
		
		itemManager.remove(item);
		item.destroy();
		
		if(callback != undefined)
		{
			callback(true);
		}
	}).catch((err) =>
	{
		if(callback != undefined)
		{
			callback(false);
		}
		
		if(err != undefined)
		{
			console.log(err)
		}
	});
}

export function playerMoveItem(item: Item, toInventory, player: Player, callback?: (success: boolean) => void): void
{
	
}

export function playerUseItem(item: Item, player: Player, callback?: (success: boolean) => void): void
{
	if(item.canUse(player))
	{
		item.use(player);
		
		new Promise((resolve, reject) =>
		{
			if(item.destroyOnUse)
			{
				destroyItem(item, (success) =>
				{
					if(success)
					{
						resolve();
					}
					else
					{
						reject();
					}
				});
			}
			else
			{
				resolve();
			}
		}).then(() =>
		{
			network.sendItemUse(player, item);
			
			if(callback != undefined)
			{
				callback(true);
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback(false);
			}
			
			if(err != undefined)
			{
				console.log(err)
			}
		});
	}
	else
	{
		if(callback != undefined)
		{
			callback(false);
		}
	}
}

export function playerDestroyItem(item: Item, player: Player, callback?: (success: boolean) => void): void
{
	if(item.canDestroy(player))
	{
		destroyItem(item, () =>
		{
			network.sendItemDestroy(player, item);
			
			if(callback != undefined)
			{
				callback(true);
			}
		});
	}
	else
	{
		if(callback != undefined)
		{
			callback(false);
		}
	}
}
