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
var FirstAidKitItem = (function (_super) {
    __extends(FirstAidKitItem, _super);
    function FirstAidKitItem() {
        var _this = _super.call(this) || this;
        _this.health = 100;
        _this.name = "First Aid Kit";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return FirstAidKitItem;
}(foodItem_1.FoodItem));
exports.FirstAidKitItem = FirstAidKitItem;
itemFactoryManager.add(FirstAidKitItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new FirstAidKitItem();
}));
