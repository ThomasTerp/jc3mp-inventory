"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var vector2Grid_1 = require("./classes/vector2Grid");
var itemFactoryManager = require("./managers/itemFactoryManager");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
exports.client = redis.createClient();
exports.client.on("error", function (err) {
    console.log("[jc3mp-inventory] Redis database error: " + err);
});
function saveInventory(inventory, saveItems, callback) {
    if (inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
    }
    else {
        Promise.all([
            new Promise(function (resolve, reject) {
                exports.client.hmset("inventory:" + inventory.uniqueName, "type", inventory.constructor.name, "name", inventory.name, function (err, reply) {
                    if (err != undefined) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }),
            new Promise(function (resolve, reject) {
                exports.client.hmset("inventory:" + inventory.uniqueName + ":size", "cols", inventory.size.cols, "rows", inventory.size.rows, function (err, reply) {
                    if (err != undefined) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
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
            if (callback != undefined) {
                callback();
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback();
            }
            if (err != undefined) {
                console.log(err);
            }
        });
        ;
    }
}
exports.saveInventory = saveInventory;
function saveInventoryItems(inventory, callback) {
    if (inventory.uniqueName == undefined) {
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
            if (callback != undefined) {
                callback();
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback();
            }
            if (err != undefined) {
                console.log(err);
            }
        });
        ;
    }
}
exports.saveInventoryItems = saveInventoryItems;
function loadInventory(uniqueName, loadItems, assemble, callback) {
    var inventory;
    var type;
    var name;
    var size;
    Promise.all([
        new Promise(function (resolve, reject) {
            exports.client.hvals("inventory:" + uniqueName, function (err, replies) {
                if (err != undefined) {
                    reject(err);
                }
                else {
                    if (replies.length > 0) {
                        type = replies[0];
                        name = replies[1];
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
            });
        }),
        new Promise(function (resolve, reject) {
            exports.client.hvals("inventory:" + uniqueName + ":size", function (err, replies) {
                if (err != undefined) {
                    reject(err);
                }
                else {
                    if (replies.length > 0) {
                        size = new vector2Grid_1.Vector2Grid(parseFloat(replies[0]), parseFloat(replies[1]));
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
            });
        })
    ]).then(function () {
        inventory = assemble(type, name, size);
        inventoryManager.add(uniqueName, inventory);
        if (loadItems) {
            return new Promise(function (resolve, reject) {
                loadInventoryItems(inventory, function () {
                    resolve();
                });
            });
        }
    }).then(function () {
        if (callback != undefined) {
            callback(inventory);
        }
    }).catch(function (err) {
        if (callback != undefined) {
            callback();
        }
        if (err != undefined) {
            console.log(err);
        }
    });
}
exports.loadInventory = loadInventory;
function loadInventoryItems(inventory, callback) {
    if (inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Redis database error: Inventory does not have an uniqueName";
    }
    else {
        var itemLoadPromises_1 = [];
        new Promise(function (resolve, reject) {
            exports.client.smembers("inventory:" + inventory.uniqueName + ":items", function (err, replies) {
                replies.forEach(function (reply, replyIndex) {
                    var itemID = parseFloat(reply);
                    itemLoadPromises_1.push(new Promise(function (resolve, reject) {
                        loadItem(itemID, function (item) {
                            if (item == undefined) {
                                console.log("[jc3mp-inventory] Redis database warning: Could not load item (" + itemID + ") from inventory (" + inventory.uniqueName + ")");
                                reject();
                            }
                            else {
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
                callback();
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback();
            }
            if (err != undefined) {
                console.log(err);
            }
        });
        ;
    }
}
exports.loadInventoryItems = loadInventoryItems;
function saveItem(item, callback) {
    new Promise(function (resolve, reject) {
        if (item.id == undefined) {
            exports.client.incr("item:id", function (err, reply) {
                item.id = parseFloat(reply);
                resolve();
            });
        }
        else {
            resolve();
        }
    }).then(function () {
        var promises = [];
        if (item.inventory != undefined && item.inventory.uniqueName != undefined && item.inventoryPosition != undefined) {
            promises.push(new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id, "type", item.constructor.name, "rotation", item.rotation, "isFlipped", item.isFlipped ? 1 : 0, "inventoryUniqueName", item.inventory.uniqueName, function (err, reply) {
                    resolve();
                });
            }), new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id + ":inventoryPosition", "cols", item.inventoryPosition.cols, "rows", item.inventoryPosition.rows, function (err, reply) {
                    resolve();
                });
            }), new Promise(function (resolve, reject) {
                exports.client.sadd("inventory:" + item.inventory.uniqueName + ":items", item.id, function (err, reply) {
                    resolve();
                });
            }));
        }
        else {
            promises.push(new Promise(function (resolve, reject) {
                exports.client.hmset("item:" + item.id, "type", item.constructor.name, "rotation", item.rotation, "isFlipped", item.isFlipped ? 1 : 0, function (err, reply) {
                    resolve();
                });
            }));
        }
        return Promise.all(promises);
    }).then(function () {
        itemManager.add(item);
        if (callback != undefined) {
            callback();
        }
    }).catch(function (err) {
        if (callback != undefined) {
            callback();
        }
        if (err != undefined) {
            console.log(err);
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
                    if (inventoryUniqueName != undefined) {
                        inventory = inventoryManager.get(inventoryUniqueName);
                    }
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
                    inventoryPosition = new vector2Grid_1.Vector2Grid(parseFloat(replies[0]), parseFloat(replies[1]));
                    resolve();
                }
                else {
                    reject();
                }
            });
        })
    ]).then(function () {
        return new Promise(function (resolve, reject) {
            var itemFactory = itemFactoryManager.get(type, "default");
            if (itemFactory == undefined) {
                reject("[jc3mp-inventory] Redis database error: Item type (" + type + ") does not have a default factory in the item factory manager");
            }
            else {
                item = itemFactory.assemble();
                item.id = id;
                item.rotation = rotation;
                item.isFlipped = isFlipped;
                item.updateSlots();
                itemManager.add(item);
                if (inventory != undefined && inventoryPosition != undefined) {
                    inventory.addItem(item, inventoryPosition);
                }
                resolve();
            }
        });
    }).then(function () {
        if (callback != undefined) {
            callback(item);
        }
    }).catch(function (err) {
        if (callback != undefined) {
            callback();
        }
        if (err != undefined) {
            console.log(err);
        }
    });
}
exports.loadItem = loadItem;
function loadItemInventory(item, loadInventoryItems, assemble, callback) {
    if (item.inventory == undefined || item.inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Redis database error: Item (" + (item.id != undefined ? item.id : "NO ID") + ") does not have an inventory";
    }
    else {
        loadInventory(item.inventory.uniqueName, loadInventoryItems, assemble, function (inventory) {
            if (callback != undefined) {
                callback(inventory);
            }
        });
    }
}
exports.loadItemInventory = loadItemInventory;
function moveItem(item, oldInventory, callback) {
    if (item.id == undefined) {
        throw "[jc3mp-inventory] Redis database error: Item does not have an id";
    }
    else if (oldInventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Redis database error: oldInventory does not have an uniqueName";
    }
    else if (item.inventory == undefined) {
        throw "[jc3mp-inventory] Redis database error: Item does not have an inventory";
    }
    else if (item.inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Redis database error: Item inventory does not have an uniqueName";
    }
    else {
        new Promise(function (resolve, reject) {
            if (oldInventory !== item.inventory) {
                exports.client.srem("inventory:" + oldInventory.uniqueName + ":items", item.id, function (err, reply) {
                    resolve();
                });
            }
            else {
                resolve();
            }
        }).then(function () {
            return new Promise(function (resolve, reject) {
                saveItem(item, function () {
                    resolve();
                });
            });
        }).then(function () {
            if (callback != undefined) {
                callback();
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback();
            }
            if (err != undefined) {
                console.log(err);
            }
        });
    }
}
exports.moveItem = moveItem;
function deleteItem(item, callback) {
    if (item.id == undefined) {
        throw "[jc3mp-inventory] Redis database error: Item does not have an id";
    }
    else {
        Promise.all([
            new Promise(function (resolve, reject) {
                exports.client.del("item:" + item.id, function (err, replies) {
                    resolve();
                });
            }),
            new Promise(function (resolve, reject) {
                exports.client.del("item:" + item.id + ":inventoryPosition", function (err, replies) {
                    resolve();
                });
            }),
            new Promise(function (resolve, reject) {
                if (item.inventory != undefined && item.inventory.uniqueName != undefined) {
                    exports.client.srem("inventory:" + item.inventory.uniqueName + ":items", item.id);
                    resolve();
                }
                else {
                    resolve();
                }
            })
        ]).then(function () {
            if (callback != undefined) {
                callback();
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback();
            }
            if (err != undefined) {
                console.log(err);
            }
        });
    }
}
exports.deleteItem = deleteItem;
