"use strict";
import redis = require("redis");
import {Item} from "./classes/items";
import {Inventory} from "./classes/inventories/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";


export const client = redis.createClient();

//Error handling
client.on("error", function (err) {
    console.log(`[jc3mp-inventory] Redis database error: ${err}`);
});

export function saveInventory(inventory: Inventory, saveItems: boolean, callback?: () => void)
{
	if(inventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName`;
	}
	else
	{
		Promise.all([
			new Promise((resolve, reject) =>
			{
				client.hmset(`inventory:${inventory.uniqueName}`,
					"type", inventory.constructor.name,
					"name", inventory.name,
				(err, reply) =>
				{
					if(err != undefined)
					{
						reject(err);
					}
					else
					{
						resolve();
					}
				});
			}),
			new Promise((resolve, reject) =>
			{
				client.hmset(`inventory:${inventory.uniqueName}:size`,
					"cols", inventory.size.cols,
					"rows", inventory.size.rows,
					(err, reply) =>
					{
						if(err != undefined)
						{
							reject(err);
						}
						else
						{
							resolve();
						}
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
			
			if(callback != undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback();
			}
			
			if(err != undefined)
			{
				console.log(err)
			}
		});;
	}
}

//Save all items in an inventory
export function saveInventoryItems(inventory: Inventory, callback?: () => void)
{
	if(inventory.uniqueName == undefined)
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
			if(callback != undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback();
			}
			
			if(err != undefined)
			{
				console.log(err)
			}
		});;
	}
}

export function loadInventory(uniqueName: string, loadItems: boolean, assemble: (type, name, size) => Inventory, callback?: (inventory?: Inventory) => void)
{
	let inventory: Inventory;
	let type: string;
	let name: string;
	let size: Vector2Grid;
	
	Promise.all([
		new Promise((resolve, reject) =>
		{
			client.hvals(`inventory:${uniqueName}`,	(err, replies) =>
			{
				if(err != undefined)
				{
					reject(err);
				}
				else
				{
					if(replies.length > 0)
					{
						type = replies[0];
						name = replies[1];
						
						resolve();
					}
					else
					{
						reject();
					}
				}
			});
		}),
		new Promise((resolve, reject) =>
		{
			client.hvals(`inventory:${uniqueName}:size`, (err, replies) =>
			{
				if(err != undefined)
				{
					reject(err);
				}
				else
				{
					if(replies.length > 0)
					{
						size = new Vector2Grid(parseFloat(replies[0]), parseFloat(replies[1]));
						
						resolve();
					}
					else
					{
						reject();
					}
				}
			});
		})
	]).then(() =>
	{
		inventory = assemble(type, name, size);
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
		if(callback != undefined)
		{
			callback(inventory);
		}
	}).catch((err) =>
	{
		if(callback != undefined)
		{
			callback();
		}
		
		if(err != undefined)
		{
			console.log(err)
		}
	});
}

export function loadInventoryItems(inventory, callback: () => void)
{
	if(inventory.uniqueName == undefined)
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
							if(item == undefined)
							{
								console.log(`[jc3mp-inventory] Redis database warning: Could not load item (${itemID}) from inventory (${inventory.uniqueName})`);
								
								reject();
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
			if(callback != undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback();
			}
			
			if(err != undefined)
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
		if(item.id == undefined)
		{
			client.incr("item:id", (err, reply) =>
			{
				item.id = parseFloat(reply);
				
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
		
		if(item.inventory != undefined && item.inventory.uniqueName != undefined && item.inventoryPosition != undefined)
		{
			promises.push(
				new Promise((resolve, reject) =>
				{
					client.hmset(`item:${item.id}`,
						"type", item.constructor.name,
						"rotation", item.rotation,
						"isFlipped", item.isFlipped ? 1: 0,
						"inventoryUniqueName", item.inventory.uniqueName,
						(err, reply) => {
							resolve();
						}
					);
				}),
				new Promise((resolve, reject) =>
				{
					client.hmset(`item:${item.id}:inventoryPosition`,
						"cols", item.inventoryPosition.cols,
						"rows", item.inventoryPosition.rows,
						(err, reply) => {
							resolve();
						}
					);
				}),
				new Promise((resolve, reject) =>
				{
					client.sadd(`inventory:${item.inventory.uniqueName}:items`, item.id, (err, reply) =>
					{
						resolve();
					});
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
						"isFlipped", item.isFlipped ? 1 : 0,
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
		itemManager.add(item);
		
		if(callback != undefined)
		{
			callback();
		}
	}).catch((err) =>
	{
		if(callback != undefined)
		{
			callback();
		}
		
		if(err != undefined)
		{
			console.log(err)
		}
	});
}

//Get and construct an item from the database
//Item gets added to the item manager once its loaded
export function loadItem(id: number, callback?: (item?: Item) => void): void
{
	let item: Item;
	let type: string;
	let rotation: number;
	let isFlipped: boolean;
	let inventory: Inventory;
	let inventoryUniqueName: string;
	let inventoryPosition: Vector2Grid;
	
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
					
					if(inventoryUniqueName != undefined)
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
					inventoryPosition = new Vector2Grid(parseFloat(replies[0]), parseFloat(replies[1]));
					
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
			const itemFactory = itemFactoryManager.get(type, "default");
			
			if(itemFactory == undefined)
			{
				reject(`[jc3mp-inventory] Redis database error: Item type (${type}) does not have a default factory in the item factory manager`);
			}
			else
			{
				item = itemFactory.assemble();
				item.id = id;
				item.rotation = rotation;
				item.isFlipped = isFlipped;
				item.updateSlots();
				
				itemManager.add(item);
				
				if(inventory != undefined && inventoryPosition != undefined)
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
	}).catch((err) =>
	{
		if(callback != undefined)
		{
			callback();
		}
		
		if(err != undefined)
		{
			console.log(err)
		}
	});
}

export function loadItemInventory(item: Item, loadInventoryItems: boolean, assemble: (type, name, size) => Inventory, callback?: (inventory?: Inventory) => void): void
{
	if(item.inventory == undefined || item.inventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Item (${item.id != undefined ? item.id : "NO ID"}) does not have an inventory`;
	}
	else
	{
		loadInventory(item.inventory.uniqueName, loadInventoryItems, assemble, (inventory) =>
		{
			if(callback != undefined)
			{
				callback(inventory);
			}
		});
	}
}

/** Remove an item from its old inventory and save the item. This should be called after moving the item locally */
export function moveItem(item: Item, oldInventory: Inventory, callback?: () => void): void
{
	if(item.id == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Item does not have an id`;
	}
	else if(oldInventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: oldInventory does not have an uniqueName`;
	}
	else if(item.inventory == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Item does not have an inventory`;
	}
	else if(item.inventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Item inventory does not have an uniqueName`;
	}
	else
	{
		new Promise((resolve, reject) =>
		{
			if(oldInventory !== item.inventory)
			{
				client.srem(`inventory:${oldInventory.uniqueName}:items`, item.id, (err, reply) =>
				{
					resolve();
				});
			}
			else
			{
				resolve();
			}
		}).then(() =>
		{
			return new Promise((resolve, reject) =>
			{
				saveItem(item, () =>
				{
					resolve();
				});
			});
		}).then(() =>
		{
			if(callback != undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback();
			}
			
			if(err != undefined)
			{
				console.log(err)
			}
		});
	}
}

export function deleteItem(item: Item, callback?: () => void): void
{
	if(item.id == undefined)
	{
		throw `[jc3mp-inventory] Redis database error: Item does not have an id`;
	}
	else
	{
		Promise.all([
			new Promise((resolve, reject) =>
			{
				client.del(`item:${item.id}`, (err, replies) =>
				{
					resolve();
				});
				
			}),
			new Promise((resolve, reject) =>
			{
				client.del(`item:${item.id}:inventoryPosition`, (err, replies) =>
				{
					resolve();
				});
			}),
			new Promise((resolve, reject) =>
			{
				if(item.inventory != undefined && item.inventory.uniqueName != undefined)
				{
					client.srem(`inventory:${item.inventory.uniqueName}:items`, item.id)
					
					resolve();
				}
				else
				{
					resolve();
				}
			})
		]).then(() =>
		{
			if(callback != undefined)
			{
				callback();
			}
		}).catch((err) =>
		{
			if(callback != undefined)
			{
				callback();
			}
			
			if(err != undefined)
			{
				console.log(err)
			}
		});
	}
}
