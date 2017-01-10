/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	console.log("Inventory server initialized");


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	class Inventory {
	    constructor(size) {
	        this.size = size;
	        this.items = [];
	        this.slots = [];
	    }
	    getSlot(position) {
	        return this.slots[position.y][position.x];
	    }
	    setSlotsItem(item) {
	        for (let y = 0; y < item.slots.length; y++) {
	            for (let x = 0; x < item.slots[y].length; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
	                    slot.item = item;
	                }
	            }
	        }
	    }
	    unsetSlotsItem(item) {
	        for (let y = 0; y < item.slots.length; y++) {
	            for (let x = 0; x < item.slots[y].length; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
	                    slot.item = undefined;
	                }
	            }
	        }
	    }
	    addItem(item, position) {
	        this.items[item.id] = item;
	        item.createHTML();
	        item.inventoryWindow = this;
	        item.inventoryPosition = position;
	        item.state = "inventory";
	        this.setSlotsItem(item);
	    }
	    removeItem(item) {
	        this.unsetSlotsItem(item);
	        item.inventoryWindow = null;
	        item.inventoryPosition = null;
	        item.state = "invalid";
	        delete this.items[item.id];
	    }
	    isItemWithinInventory(item, position) {
	        let itemSize = item.getSize();
	        return position.x + itemSize.width <= this.size.x && position.y + itemSize.height <= this.size.y;
	    }
	    canItemBePlaced(item, position) {
	        let itemSize = item.getSize();
	        for (let y = 0; y < itemSize.height; y++) {
	            for (let x = 0; x < itemSize.width; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new Vector2(position.x + x, position.y + y));
	                    if (slot.item) {
	                        return false;
	                    }
	                }
	            }
	        }
	        return true;
	    }
	}
	exports.Inventory = Inventory;


/***/ }
/******/ ]);