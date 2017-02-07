"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var item_1 = require("./../item");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var GrapplingHookItem = (function (_super) {
    __extends(GrapplingHookItem, _super);
    function GrapplingHookItem() {
        var _this = _super.call(this) || this;
        _this.destroyOnUse = false;
        _this.name = "Grappling Hook";
        _this.defaultSlots = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];
        return _this;
    }
    return GrapplingHookItem;
}(item_1.Item));
exports.GrapplingHookItem = GrapplingHookItem;
itemFactoryManager.add(GrapplingHookItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new GrapplingHookItem();
}));
