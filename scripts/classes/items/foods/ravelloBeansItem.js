"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var RavelloBeansItem = (function (_super) {
    __extends(RavelloBeansItem, _super);
    function RavelloBeansItem() {
        var _this = _super.call(this) || this;
        _this.hunger = 40;
        _this.name = "Ravello Beans";
        _this.defaultSlots = [
            [1],
            [1],
        ];
        return _this;
    }
    return RavelloBeansItem;
}(foodItem_1.FoodItem));
exports.RavelloBeansItem = RavelloBeansItem;
itemFactoryManager.add(RavelloBeansItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new RavelloBeansItem();
}));
