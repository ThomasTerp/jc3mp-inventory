"use strict";
import redis = require("redis");
import {Item} from "./classes/items"
import {Inventory} from "./classes/inventory"
import * as itemTypeManager from "./managers/itemTypeManager";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";


export const client = redis.createClient();

//Error handling
client.on("error", function (err) {
    console.log(`[jc3mp-inventory] Redis database error: ${err}`);
});

export function saveInventory(inventory: Inventory, saveItems: boolean, callback?: () => void)
{
	if(inventory.uniqueName === null)
	{
		throw `[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName`;
	}
	else
	{
		Promise.all([
			new Promise((resolve, reject) =>
			{
				client.hmset(`inventory:${inventory.uniqueName}:size`,
					"x", inventory.size.x,
					"y", inventory.size.y,
					(err, reply) =>
					{
						resolve();
					}
				);
			}),
			new Promise((resolve, reject) =>
			{
				if(saveItems)
				{
					saveInventoryItems(inventory, () =>
					{
						resolve();
					});
				}
				else
				{
					resolve();
				}
			})
		]).then(() =>
		{
			inventoryManager.add(inventory.uniqueName, inventory);
			
			if(callback !== undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback !== undefined)
			{
				callback();
			}
			
			if(err !== undefined)
			{
				console.log(err)
			}
		});;
	}
}

//Save all items in an inventory
export function saveInventoryItems(inventory: Inventory, callback?: () => void)
{
	if(inventory.uniqueName === null)
	{
		throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
	}
	else
	{
		const itemSavePromises = [];
		const itemIDs = [];
		
		inventory.items.forEach((item, itemIndex) =>
		{
			itemSavePromises.push(new Promise((resolve, reject) =>
			{
				saveItem(item, () =>
				{
					itemIDs.push(item.id);
					
					resolve();
				});
			}));
		});
		
		Promise.all(itemSavePromises).then(() =>
		{
			return new Promise((resolve, reject) =>
			{
				client.sadd(`inventory:${inventory.uniqueName}:items`, itemIDs, (err, reply) =>
				{
					resolve();
				});
			});
		}).then(() =>
		{
			if(callback !== undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback !== undefined)
			{
				callback();
			}
			
			if(err !== undefined)
			{
				console.log(err)
			}
		});;
	}
}

export function loadInventory(uniqueName: string, loadItems: boolean, callback?: (inventory?: Inventory) => void)
{
	let inventory;
	let size;
	
	new Promise((resolve, reject) =>
	{
		client.hvals(`inventory:${uniqueName}:size`, (err, replies) =>
		{
			if(replies.length > 0)
			{
				size = new Vector2(parseFloat(replies[0]), parseFloat(replies[1]));
				
				resolve();
			}
			else
			{
				reject();
			}
		});
	}).then(() =>
	{
		inventory = new Inventory(size);
		inventoryManager.add(uniqueName, inventory);
		
		if(loadItems)
		{
			return new Promise((resolve, reject) =>
			{
				loadInventoryItems(inventory, () =>
				{
					resolve();
				});
			});
		}
	}).then(() =>
	{
		if(callback !== undefined)
		{
			callback(inventory);
		}
	}).catch((err) =>
	{
		if(callback !== undefined)
		{
			callback();
		}
		
		if(err !== undefined)
		{
			console.log(err)
		}
	});
}

export function loadInventoryItems(inventory, callback: () => void)
{
	if(inventory.uniqueName == null)
	{
		throw `[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName`;
	}
	else
	{
		const itemLoadPromises = [];
		
		new Promise((resolve, reject) =>
		{
			client.smembers(`inventory:${inventory.uniqueName}:items`, (err, replies) =>
			{
				replies.forEach((reply, replyIndex) =>
				{
					const itemID = parseFloat(reply);
					
					itemLoadPromises.push(new Promise((resolve, reject) =>
					{
						loadItem(itemID, (item) =>
						{
							if(item === undefined)
							{
								console.log(`[jc3mp-inventory] Redis database warning: Tried to load item (${itemID}) from inventory (${inventory.uniqueName}), but the item does not exist in the database`);
							}
							else
							{
								resolve();
							}
						});
					}));
				});
				
				resolve();
			});
		}).then(() =>
		{
			return Promise.all(itemLoadPromises);
		}).then(() =>
		{
			if(callback !== undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback !== undefined)
			{
				callback();
			}
			
			if(err !== undefined)
			{
				console.log(err)
			}
		});;
	}
}

//Save an item to the database, it will be assigned a new id if it didn't have one
export function saveItem(item: Item, callback?: () => void)
{
	new Promise((resolve, reject) =>
	{
		if(item.id === null)
		{
			client.incr("item:id", (err, reply) =>
			{
				item.id = reply;
				
				resolve();
			});
		}
		else
		{
			resolve();
		}
	}).then(() =>
	{
		const promises = [];
		
		if(item.inventory !== null && item.inventoryPosition !== null)
		{
			promises.push(
				new Promise((resolve, reject) =>
				{
					client.hmset(`item:${item.id}`,
						"type", item.constructor.name,
						"rotation", item.rotation,
						"isFlipped", item.isFlipped,
						"inventoryUniqueName", item.inventory.uniqueName,
						(err, reply) => {
							resolve();
						}
					);
				}),
				new Promise((resolve, reject) =>
				{
					client.hmset(`item:${item.id}:inventoryPosition`,
						"x", item.inventoryPosition.x,
						"y", item.inventoryPosition.y,
						(err, reply) => {
							resolve();
						}
					);
				})
			);
		}
		else
		{
			promises.push(
				new Promise((resolve, reject) =>
				{
					client.hmset(`item:${item.id}`,
						"type", item.constructor.name,
						"rotation", item.rotation,
						"isFlipped", item.rotation,
						(err, reply) =>
						{
							resolve();
						}
					);
				})
			);
		}
		
		return Promise.all(promises);
	}).then(() =>
	{
		itemManager.add(item.id, item);
		
		if(callback !== undefined)
		{
			callback();
		}
	}).catch((err) =>
	{
		if(callback !== undefined)
		{
			callback();
		}
		
		if(err !== undefined)
		{
			console.log(err)
		}
	});;
}

//Get and construct an item from the database, inventory for the item has to be loaded or this function will return null.
//Item gets added to the item manager once its loaded
export function loadItem(id: number, callback?: (item?: Item) => void): void
{
	let item: Item;
	let type: string;
	let rotation: number;
	let isFlipped: boolean;
	let inventory: Inventory;
	let inventoryUniqueName: string;
	let inventoryPosition: Vector2;
	
	Promise.all([
		new Promise((resolve, reject) =>
		{
			client.hvals(`item:${id}`, (err, replies) =>
			{
				if(replies.length > 0)
				{
					type = replies[0];
					rotation = parseFloat(replies[1]);
					isFlipped = replies[2] === "1" ? true : false;
					inventoryUniqueName = replies[3];
					
					if(inventoryUniqueName !== undefined)
					{
						inventory = inventoryManager.get(inventoryUniqueName);
					}
					
					resolve();
				}
				else
				{
					reject();
				}
			});
		}),
		new Promise((resolve, reject) =>
		{
			client.hvals(`item:${id}:inventoryPosition`, (err, replies) =>
			{
				if(replies.length > 0)
				{
					inventoryPosition = new Vector2(parseFloat(replies[0]), parseFloat(replies[1]));
					
					resolve();
				}
				else
				{
					reject();
				}
			});
		})
	]).then(() =>
	{
		return new Promise((resolve, reject) =>
		{
			const constructors = itemTypeManager.get(type);
			const constructor = constructors !== undefined ? constructors[0] : undefined;
			
			if(constructor === undefined)
			{
				reject(`[jc3mp-inventory] Redis database error: Item type (${type}) does not have a constructor in the item type manager`);
			}
			else
			{
				item = constructor();
				item.rotation = rotation;
				item.isFlipped = isFlipped;
				
				item.updateSlots();
				
				itemManager.add(id, item);
				
				if(inventory !== undefined && inventoryPosition !== undefined)
				{
					inventory.addItem(item, inventoryPosition)
				}
				
				resolve();
			}
		});
	}).then(() =>
	{
		if(callback !== undefined)
		{
			callback(item);
		}
	}).catch((err) =>
	{
		if(callback !== undefined)
		{
			callback();
		}
		
		if(err !== undefined)
		{
			console.log(err)
		}
	});
}

export function loadItemInventory(item: Item, loadInventoryItems: boolean, callback?: (inventory?: Inventory) => void): void
{
	if(item.inventory === null || item.inventory.uniqueName === null)
	{
		throw `[jc3mp-inventory] Redis database error: Item (${item.id !== null ? item.id : "NULL ID"}) does not have an inventory`;
	}
	else
	{
		loadInventory(item.inventory.uniqueName, loadInventoryItems, (inventory) =>
		{
			if(callback !== undefined)
			{
				callback(inventory);
			}
		});
	}
}
