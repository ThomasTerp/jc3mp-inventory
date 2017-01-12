"use strict";
var redis = require("redis");
var inventory_1 = require("./classes/inventory");
var itemTypeManager = require("./managers/itemTypeManager");
var inventoryManager = require("./managers/inventoryManager");
exports.client = redis.createClient();
exports.client.on("error", function (err) {
    console.log("[jc3mp-inventory] Redis database error: " + err);
});
function saveInventory(inventory, callback) {
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
                var itemIDs = [];
                inventory.items.forEach(function (item, itemIndex) {
                    if (item.id !== null) {
                        itemIDs.push(item.id);
                    }
                });
                exports.client.sadd("inventory:" + inventory.uniqueName + ":items", itemIDs, function (err, reply) {
                    resolve();
                });
            })
        ]).then(function () {
            if (callback !== undefined) {
                callback();
            }
        });
    }
}
exports.saveInventory = saveInventory;
function loadInventory(uniqueName, loadItems, callback) {
    var inventory;
    var size;
    var itemPromises = [];
    new Promise(function (resolve, reject) {
        exports.client.hvals("inventory:" + uniqueName + ":size", function (err, replies) {
            if (replies.length > 0) {
                size = new Vector2(replies[0], replies[1]);
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
                exports.client.smembers("inventory:" + uniqueName + ":items", function (err, replies) {
                    replies.forEach(function (reply, replyIndex) {
                        var itemID = reply;
                        itemPromises.push(new Promise(function (resolve, reject) {
                            loadItem(itemID, function (item) {
                                if (item === undefined) {
                                    console.log("[jc3mp-inventory] Redis database warning: Tried to load item (" + itemID + ") from inventory (" + uniqueName + "), but the item does not exist");
                                }
                                else {
                                    resolve();
                                }
                            });
                        }));
                    });
                    resolve();
                });
            });
        }
    }).then(function () {
        return Promise.all(itemPromises);
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
function saveItem(item, callback) {
    new Promise(function (resolve, reject) {
        if (item.id === undefined) {
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
                exports.client.hmset("item:" + item.id, "type", item.constructor.name, "rotation", item.rotation, "isFlipped", item.rotation, "inventoryUniqueName", item.inventory.uniqueName, function (err, reply) {
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
                    rotation = replies[1];
                    isFlipped = replies[2];
                    inventoryUniqueName = replies[3];
                    if (inventoryUniqueName !== undefined) {
                        resolve();
                    }
                    else {
                        inventory = inventoryManager.get(inventoryUniqueName);
                        if (inventory === undefined) {
                            throw "[jc3mp-inventory] Redis database error: Item (" + id + ") exists and is in an inventory (" + inventoryUniqueName + "), but the inventory is not loaded";
                        }
                        else {
                            resolve();
                        }
                    }
                }
                else {
                    reject();
                }
            });
        }),
        new Promise(function (resolve, reject) {
            exports.client.hvals("item:" + id + ":inventoryPosition", function (err, replies) {
                if (replies.length > 0) {
                    inventoryPosition = new Vector2(replies[0], replies[1]);
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
                reject();
            }
            else {
                item = constructor();
                item.rotation = rotation;
                item.isFlipped = isFlipped;
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
function loadItemInventory(item, callback) {
}
exports.loadItemInventory = loadItemInventory;
