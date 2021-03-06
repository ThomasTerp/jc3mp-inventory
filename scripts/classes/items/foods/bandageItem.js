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
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var BandageItem = (function (_super) {
    __extends(BandageItem, _super);
    function BandageItem() {
        var _this = _super.call(this) || this;
        _this.health = 50;
        _this.name = "Bandage";
        _this.defaultSlots = [
            [1],
            [1],
        ];
        return _this;
    }
    return BandageItem;
}(foodItem_1.FoodItem));
exports.BandageItem = BandageItem;
itemFactoryManager.add(BandageItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new BandageItem();
}));
