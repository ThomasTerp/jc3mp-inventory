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
	const ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
	ui.autoResize = true;
	jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	    jcmp.localPlayer.controlsEnabled = !isVisible;
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	function requestInventoryItems(inventoryUniqueName) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/requestInventoryItems", inventoryUniqueName);
	}
	exports.requestInventoryItems = requestInventoryItems;
	function sendChanges(changesData) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/sendChanges", JSON.stringify(changesData));
	}
	exports.sendChanges = sendChanges;
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendInventory", (inventoryData) => {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/sendInventory", inventoryData);
	    inventoryData = JSON.parse(inventoryData);
	    requestInventoryItems(inventoryData.uniqueName);
	});
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendItems", (itemsData) => {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/sendItems", itemsData);
	});
	jcmp.ui.AddEvent("jc3mp-inventory/network/sendChanges", (changesData) => {
	    sendChanges(JSON.parse(changesData));
	});


/***/ }
/******/ ]);