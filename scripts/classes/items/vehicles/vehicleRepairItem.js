"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var item_1 = require("./../item");
var VehicleRepairItem = (function (_super) {
    __extends(VehicleRepairItem, _super);
    function VehicleRepairItem() {
        var _this = _super.call(this) || this;
        _this.repairAmount = 100;
        _this.category = "Vehicles";
        return _this;
    }
    return VehicleRepairItem;
}(item_1.Item));
exports.VehicleRepairItem = VehicleRepairItem;
