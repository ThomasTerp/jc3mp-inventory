import redis = require("redis");
import {Item} from "./classes/items"
import {Inventory} from "./classes/inventory"
import * as itemTypeManager from "./managers/itemTypeManager";
import * as inventoryManager from "./managers/inventoryManager";


export const client = redis.createClient();

//Error handling
client.on("error", function (err) {
    console.log(`[jc3mp-inventory] Redis database error: ${err}`);
});

export function saveInventory(inventory: Inventory, callback?: Function)
{
	if(inventory.uniqueName === null)
	{
		throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
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
				const itemIDs = [];
				
				inventory.items.forEach((item, itemIndex) =>
				{
					if(item.id !== null)
					{
						itemIDs.push(item.id);
					}
				});
				
				client.sadd(`inventory:${inventory.uniqueName}:items`, itemIDs, (err, reply) =>
				{
					resolve();
				});
			})
		]).then(() =>
		{
			if(callback !== undefined)
			{
				callback();
			}
		});
	}
}

export function loadInventory(uniqueName: string, loadItems: boolean, callback?: (Inventory?: Inventory) => void)
{
	let inventory;
	let size;
	const itemPromises = [];
	
	new Promise((resolve, reject) =>
	{
		client.hvals(`inventory:${uniqueName}:size`, (err, replies) =>
		{
			if(replies.length > 0)
			{
				size = new Vector2(replies[0], replies[1]);
				
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
			return new Promise((resolve, reject) => {
				client.smembers(`inventory:${uniqueName}:items`, (err, replies) =>
				{
					replies.forEach((reply, replyIndex) =>
					{
						const itemID = reply;
						
						itemPromises.push(new Promise((resolve, reject) =>
						{
							loadItem(itemID, (item) =>
							{
								if(item === undefined)
								{
									console.log(`[jc3mp-inventory] Redis database warning: Tried to load item (${itemID}) from inventory (${uniqueName}), but the item does not exist`);
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
			});
		}
	}).then(() =>
	{
		return Promise.all(itemPromises);
	}).then(() =>
	{
		if(callback != undefined)
		{
			callback(inventory);
		}
	}).catch((reason) =>
	{
		if(callback != undefined)
		{
			callback();
		}
	});
}

//Save an item to the database, it will be assigned a new id if it didn't have one
export function saveItem(item: Item, callback?: Function)
{
	new Promise((resolve, reject) =>
	{
		if(item.id === undefined)
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
						"isFlipped", item.rotation,
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
						"y", item.inventoryPosition.x,
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
		if(callback !== undefined)
		{
			callback();
		}
	});
}

//Get and construct an item from the database, inventory for the item has to be loaded or this function will return null
export function loadItem(id: number, callback?: (item?: Item) => void): void
{
	let item;
	let type;
	let rotation;
	let isFlipped;
	let inventory;
	let inventoryUniqueName;
	let inventoryPosition;
	
	Promise.all([
		new Promise((resolve, reject) =>
		{
			client.hvals(`item:${id}`, (err, replies) =>
			{
				if(replies.length > 0)
				{
					type = replies[0];
					rotation = replies[1];
					isFlipped = replies[2];
					inventoryUniqueName = replies[3];
					
					if(inventoryUniqueName !== undefined)
					{
						resolve();
					}
					else
					{
						inventory = inventoryManager.get(inventoryUniqueName);
						
						if(inventory === undefined)
						{
							throw `[jc3mp-inventory] Redis database error: Item (${id}) exists and is in an inventory (${inventoryUniqueName}), but the inventory is not loaded`;
						}
						else
						{
							resolve();
						}
					}
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
					inventoryPosition = new Vector2(replies[0], replies[1]);
					
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
			const constructor = itemTypeManager.get(type)[0];
			
			if(constructor === undefined)
			{
				reject();
			}
			else
			{
				item = constructor();
				item.rotation = rotation;
				item.isFlipped = isFlipped;
				
				if(inventory !== undefined && inventoryPosition !== undefined)
				{
					inventory.addItem(item, inventoryPosition)
				}
				
				resolve();
			}
		});
	}).then(() =>
	{
		if(callback != undefined)
		{
			callback(item);
		}
	}).catch((reason) =>
	{
		if(callback != undefined)
		{
			callback();
		}
	});
}

export function loadItemInventory(item: Item, callback: (Item) => void): void
{
	
}
