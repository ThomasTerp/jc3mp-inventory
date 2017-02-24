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
var ToolboxItem = (function (_super) {
    __extends(ToolboxItem, _super);
    function ToolboxItem() {
        var _this = _super.call(this) || this;
        _this.repairAmount = 100;
        _this.name = "Toolbox";
        _this.defaultSlots = [
            [1, 1, 1],
            [1, 1, 1],
        ];
        return _this;
    }
    return ToolboxItem;
}(vehicleRepairItem_1.VehicleRepairItem));
exports.ToolboxItem = ToolboxItem;
itemFactoryManager.add(ToolboxItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new ToolboxItem();
}));
