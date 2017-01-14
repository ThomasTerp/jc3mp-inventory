"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItemTypeManager = require("./../../managers/itemTypeManager");
var item_1 = require("./item");
var GasCanItem = (function (_super) {
    __extends(GasCanItem, _super);
    function GasCanItem() {
        var _this = _super.call(this) || this;
        _this.name = "Gas Can";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return GasCanItem;
}(item_1.Item));
exports.GasCanItem = GasCanItem;
ItemTypeManager.add(GasCanItem.name, [
    function () {
        return new GasCanItem();
    }
]);
