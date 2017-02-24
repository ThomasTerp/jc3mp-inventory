"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = require("./../item");
var itemFactory_1 = require("./../../itemFactory");
var inventory_1 = require("./../../inventories/inventory");
var vector2Grid_1 = require("./../../vector2Grid");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var BackpackItem = (function (_super) {
    __extends(BackpackItem, _super);
    function BackpackItem() {
        var _this = _super.call(this) || this;
        _this.backpackInventoryWindow = new inventory_1.Inventory("Backpack", new vector2Grid_1.Vector2Grid(4, 6));
        _this.destroyOnUse = false;
        _this.name = "Backpack";
        _this.defaultSlots = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ];
        return _this;
    }
    return BackpackItem;
}(item_1.Item));
exports.BackpackItem = BackpackItem;
itemFactoryManager.add(BackpackItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new BackpackItem();
}));
