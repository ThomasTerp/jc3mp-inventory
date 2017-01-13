"use strict";
var redis = require("redis");
var inventory_1 = require("./classes/inventory");
var itemTypeManager = require("./managers/itemTypeManager");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
exports.client = redis.createClient();
exports.client.on("error", function (err) {
    console.log("[jc3mp-inventory] Redis database error: " + err);
});
function saveInventory(inventory, saveItems, callback) {
    if (inventory.uniqueName === null) {
        throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
    }
    else {
        Promise.all([
            new Promise(function (resolve, reject) {
                exports.client.hmset("inventory:" + inventory.uniqueName + ":size", "x", inventory.size.x, "y", inventory.size.y, function (err, reply) {
                    resolve();
                });
            }),
            new Promise(function (resolve, reject) {
                if (saveItems) {
                    saveInventoryItems(inventory, function () {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            })
        ]).then(function () {
            inventoryManager.add(inventory.uniqueName, inventory);
            if (callback !== undefined) {
                callback();
            }
        });
    }
}
exports.saveInventory = saveInventory;
function saveInventoryItems(inventory, callback) {
    if (inventory.uniqueName === null) {
        throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
    }
    else {
        var itemSavePromises_1 = [];
        var itemIDs_1 = [];
        inventory.items.forEach(function (item, itemIndex) {
            itemSavePromises_1.push(new Promise(function (resolve, reject) {
                saveItem(item, function () {
                    itemIDs_1.push(item.id);
                    resolve();
                });
            }));
        });
        Promise.all(itemSavePromises_1).then(function () {
            return new Promise(function (resolve, reject) {
                exports.client.sadd("inventory:" + inventory.uniqueName + ":items", itemIDs_1, function (err, reply) {
                    resolve();
                });
            });
        }).then(function () {
            if (callback !== undefined) {
                callback();
            }
        });
    }
}
exports.saveInventoryItems = saveInventoryItems;
function loadInventory(uniqueName, loadItems, callback) {
    var inventory;
    var size;
    new Promise(function (resolve, reject) {
        exports.client.hvals("inventory:" + uniqueName + ":size", function (err, replies) {
            if (replies.length > 0) {
                size = new Vector2(parseFloat(replies[0]), parseFloat(replies[1]));
                resolve();
            }
            else {
                reject();
            }
        });
    }).then(function () {
        inventory = new inventory_1.Inventory(size);
        inventoryManager.add(uniqueName, inventory);
        if (loadItems) {
            return new Promise(function (resolve, reject) {
                loadInventoryItems(inventory, function (items) {
                    resolve();
                });
            });
        }
    }).then(function () {
        if (callback != undefined) {
            callback(inventory);
        }
    }).catch(function (reason) {
        if (callback != undefined) {
            callback();
        }
    });
}
exports.loadInventory = loadInventory;
function loadInventoryItems(inventory, callback) {
    if (inventory.uniqueName == null) {
        throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
    }
    else {
        var itemLoadPromises_1 = [];
        var items_1 = [];
        new Promise(function (resolve, reject) {
            exports.client.smembers("inventory:" + inventory.uniqueName + ":items", function (err, replies) {
                replies.forEach(function (reply, replyIndex) {
                    var itemID = reply;
                    itemLoadPromises_1.push(new Promise(function (resolve, reject) {
                        loadItem(itemID, function (item) {
                            if (item === undefined) {
                                console.log("[jc3mp-inventory] Redis database warning: Tried to load item (" + itemID + ") from inventory (" + inventory.uniqueName + "), but the item does not exist in the database");
                            }
                            else {
                                items_1.push(item);
                                resolve();
                            }
                        });
                    }));
                });
                resolve();
            });
        }).then(function () {
            return Promise.all(itemLoadPromises_1);
        }).then(function () {
            if (callback != undefined) {
                callback(items_1);
            }
        });
    }
}
exports.loadInventoryItems = loadInventoryItems;
function saveItem(item, callback) {
    new Promise(function (resolve, reject) {
        if (item.id === null) {
            exports.client.incr("item:id", function (err, reply) {
                item.id = reply;
                resolve();
            });
        }
        else {
            resolve();
        }
    }).then(function () {
        var promises = [];
        if (item.inventory !== null && item.inventoryPosition !== null) {
            promises.push(new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id, "type", item.constructor.name, "rotation", item.rotation, "isFlipped", item.isFlipped, "inventoryUniqueName", item.inventory.uniqueName, function (err, reply) {
                    resolve();
                });
            }), new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id + ":inventoryPosition", "x", item.inventoryPosition.x, "y", item.inventoryPosition.x, function (err, reply) {
                    resolve();
                });
            }));
        }
        else {
            promises.push(new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id, "type", item.constructor.name, "rotation", item.rotation, "isFlipped", item.rotation, function (err, reply) {
                    resolve();
                });
            }));
        }
        return Promise.all(promises);
    }).then(function () {
        itemManager.add(item.id, item);
        if (callback !== undefined) {
            callback();
        }
    });
}
exports.saveItem = saveItem;
function loadItem(id, callback) {
    var item;
    var type;
    var rotation;
    var isFlipped;
    var inventory;
    var inventoryUniqueName;
    var inventoryPosition;
    Promise.all([
        new Promise(function (resolve, reject) {
            exports.client.hvals("item:" + id, function (err, replies) {
                if (replies.length > 0) {
                    type = replies[0];
                    rotation = parseFloat(replies[1]);
                    isFlipped = replies[2] === "1" ? true : false;
                    inventoryUniqueName = replies[3];
                    resolve();
                }
                else {
                    reject();
                }
            });
        }),
        new Promise(function (resolve, reject) {
            exports.client.hvals("item:" + id + ":inventoryPosition", function (err, replies) {
                if (replies.length > 0) {
                    inventoryPosition = new Vector2(parseFloat(replies[0]), parseFloat(replies[1]));
                    resolve();
                }
                else {
                    reject();
                }
            });
        })
    ]).then(function () {
        return new Promise(function (resolve, reject) {
            var constructor = itemTypeManager.get(type)[0];
            if (constructor === undefined) {
                console.log("[jc3mp-inventory] Redis database warning: Item type (" + type + ") does not have a constructor in the item type manager");
                reject();
            }
            else {
                item = constructor();
                item.rotation = rotation;
                item.isFlipped = isFlipped;
                itemManager.add(id, item);
                if (inventory !== undefined && inventoryPosition !== undefined) {
                    inventory.addItem(item, inventoryPosition);
                }
                resolve();
            }
        });
    }).then(function () {
        if (callback != undefined) {
            callback(item);
        }
    }).catch(function (reason) {
        if (callback != undefined) {
            callback();
        }
    });
}
exports.loadItem = loadItem;
function loadItemInventory(item, loadInventoryItems, callback) {
    if (item.inventory === null || item.inventory.uniqueName === null) {
        throw "[jc3mp-inventory] Redis database error: Item (" + (item.id !== null ? item.id : "NULL ID") + ") does not have an inventory";
    }
    else {
        loadInventory(item.inventory.uniqueName, loadInventoryItems, function (inventory) {
            if (callback !== undefined) {
                callback(inventory);
            }
        });
    }
}
exports.loadItemInventory = loadItemInventory;
