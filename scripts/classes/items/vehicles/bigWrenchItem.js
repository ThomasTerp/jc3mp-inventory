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
var vehicleRepairItem_1 = require("./vehicleRepairItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var BigWrenchItem = (function (_super) {
    __extends(BigWrenchItem, _super);
    function BigWrenchItem() {
        var _this = _super.call(this) || this;
        _this.repairAmount = 40;
        _this.name = "Big Wrench";
        _this.defaultSlots = [
            [1, 1, 1],
        ];
        return _this;
    }
    return BigWrenchItem;
}(vehicleRepairItem_1.VehicleRepairItem));
exports.BigWrenchItem = BigWrenchItem;
itemFactoryManager.add(BigWrenchItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new BigWrenchItem();
}));
