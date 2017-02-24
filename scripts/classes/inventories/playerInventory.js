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
var inventory_1 = require("./inventory");
var PlayerInventory = (function (_super) {
    __extends(PlayerInventory, _super);
    function PlayerInventory(name, size, player) {
        var _this = _super.call(this, name, size) || this;
        _this.player = player;
        return _this;
    }
    PlayerInventory.prototype.hasAccess = function (player) {
        return player === this.player;
    };
    return PlayerInventory;
}(inventory_1.Inventory));
exports.PlayerInventory = PlayerInventory;
