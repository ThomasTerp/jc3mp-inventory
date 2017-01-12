"use strict";
var InventorySlot = (function () {
    function InventorySlot(inventoryWindow, position) {
        this.inventory = inventoryWindow;
        this.position = position;
        this.item = null;
    }
    return InventorySlot;
}());
exports.InventorySlot = InventorySlot;
