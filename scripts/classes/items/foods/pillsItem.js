"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var PillsItem = (function (_super) {
    __extends(PillsItem, _super);
    function PillsItem() {
        var _this = _super.call(this) || this;
        _this.health = 20;
        _this.name = "Pills";
        _this.defaultSlots = [
            [1],
        ];
        return _this;
    }
    return PillsItem;
}(foodItem_1.FoodItem));
exports.PillsItem = PillsItem;
itemFactoryManager.add(PillsItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new PillsItem();
}));
