"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var item_1 = require("./../item");
var FoodItem = (function (_super) {
    __extends(FoodItem, _super);
    function FoodItem() {
        var _this = _super.call(this) || this;
        _this.health = 0;
        _this.hunger = 0;
        _this.thirst = 0;
        _this.category = "Food";
        return _this;
    }
    return FoodItem;
}(item_1.Item));
exports.FoodItem = FoodItem;
