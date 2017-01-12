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
/***/ function(module, exports) {

	"use strict";
	import "./item";
	import "./tooltip";
	import "./itemSelection";
	import * as WindowManager from "./windowManager";
	import { InventoryWindow } from "./inventoryWindow";
	import { AdminWindow } from "./adminWindow";
	import { Vector2 } from "./vector2";
	let localInventoryWindow = new InventoryWindow("Inventory", new Vector2(20, 12));
	WindowManager.add("local", localInventoryWindow);
	let lootInventoryWindow = new InventoryWindow("Loot Crate", new Vector2(10, 10));
	WindowManager.add("loot1", lootInventoryWindow);
	let loot2InventoryWindow = new InventoryWindow("Loot Crate 2", new Vector2(10, 10));
	WindowManager.add("loot2", loot2InventoryWindow);
	let adminWindow = new AdminWindow("Items");
	WindowManager.add("adminWindow", adminWindow);
	let chatIsOpen = false;
	jcmp.AddEvent('chat_input_state', function (state) {
	    chatIsOpen = state;
	});
	jcmp.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	    if (isVisible) {
	        jcmp.ShowCursor();
	    }
	    else {
	        jcmp.HideCursor();
	    }
	});
	$(document).on("keydown", (event) => {
	    if (!chatIsOpen) {
	        switch (event.which) {
	            case 73:
	                localInventoryWindow.toggle();
	                break;
	            case 79:
	                adminWindow.toggle();
	                break;
	            default:
	                return;
	        }
	    }
	});


/***/ }
/******/ ]);