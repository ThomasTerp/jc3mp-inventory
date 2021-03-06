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
var item_1 = require("./../item");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var MapItem = (function (_super) {
    __extends(MapItem, _super);
    function MapItem() {
        var _this = _super.call(this) || this;
        _this.destroyOnUse = false;
        _this.name = "Map";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return MapItem;
}(item_1.Item));
exports.MapItem = MapItem;
itemFactoryManager.add(MapItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new MapItem();
}));
