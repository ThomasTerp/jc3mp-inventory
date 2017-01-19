"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vehicleRepairItem_1 = require("./vehicleRepairItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var SmallWrenchItem = (function (_super) {
    __extends(SmallWrenchItem, _super);
    function SmallWrenchItem() {
        var _this = _super.call(this) || this;
        _this.repairAmount = 20;
        _this.name = "Small Wrench";
        _this.defaultSlots = [
            [1, 1],
        ];
        return _this;
    }
    return SmallWrenchItem;
}(vehicleRepairItem_1.VehicleRepairItem));
exports.SmallWrenchItem = SmallWrenchItem;
itemFactoryManager.add(SmallWrenchItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new SmallWrenchItem();
}));
