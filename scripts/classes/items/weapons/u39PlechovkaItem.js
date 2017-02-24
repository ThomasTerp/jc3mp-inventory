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
var U39PlechovkaItem = (function (_super) {
    __extends(U39PlechovkaItem, _super);
    function U39PlechovkaItem() {
        var _this = _super.call(this) || this;
        _this.category = "Weapons";
        _this.destroyOnUse = false;
        _this.name = "U-39 Plechovka";
        _this.defaultSlots = [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0],
        ];
        return _this;
    }
    return U39PlechovkaItem;
}(item_1.Item));
exports.U39PlechovkaItem = U39PlechovkaItem;
itemFactoryManager.add(U39PlechovkaItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new U39PlechovkaItem();
}));
