"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var AppleItem = (function (_super) {
    __extends(AppleItem, _super);
    function AppleItem() {
        var _this = _super.call(this) || this;
        _this.hunger = 30;
        _this.thirst = 20;
        _this.name = "Apple";
        _this.defaultSlots = [
            [1],
        ];
        return _this;
    }
    return AppleItem;
}(foodItem_1.FoodItem));
exports.AppleItem = AppleItem;
itemFactoryManager.add(AppleItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new AppleItem();
}));
