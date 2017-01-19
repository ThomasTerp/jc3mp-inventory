"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var MilkGallonItem = (function (_super) {
    __extends(MilkGallonItem, _super);
    function MilkGallonItem() {
        var _this = _super.call(this) || this;
        _this.thirst = 85;
        _this.name = "Milk Gallon";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return MilkGallonItem;
}(foodItem_1.FoodItem));
exports.MilkGallonItem = MilkGallonItem;
itemFactoryManager.add(MilkGallonItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new MilkGallonItem();
}));
