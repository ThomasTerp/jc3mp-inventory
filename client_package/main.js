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
	__webpack_require__(2);
	__webpack_require__(3);
	jcmp.localPlayer.wingsuit.boostEnabled = true;
	jcmp.localPlayer.wingsuit.boostCooldown = 7;
	jcmp.localPlayer.wingsuit.boostDuration = 999999999;
	jcmp.localPlayer.wingsuit.boostPower = 999999999;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
	exports.ui.autoResize = true;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	    jcmp.localPlayer.controlsEnabled = !isVisible;
	});


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function sendItemOperations(itemOperationsData) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
	}
	exports.sendItemOperations = sendItemOperations;
	function sendItemCreate(itemData) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemCreate", JSON.stringify(itemData));
	}
	exports.sendItemCreate = sendItemCreate;
	function sendItemUse(itemID) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemUse", itemID);
	}
	exports.sendItemUse = sendItemUse;
	function sendItemDestroy(itemID) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemDestroy", itemID);
	}
	exports.sendItemDestroy = sendItemDestroy;
	function sendUIReady() {
	    jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
	}
	exports.sendUIReady = sendUIReady;
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryAndItemsData) => {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", inventoryAndItemsData);
	});
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemUse", (itemID) => {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/itemUse", itemID);
	});
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemDestroy", (itemID) => {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/itemDestroy", itemID);
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemCreate", (itemData) => {
	    sendItemCreate(JSON.parse(itemData));
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemUse", (itemID) => {
	    sendItemUse(itemID);
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemDestroy", (itemID) => {
	    sendItemDestroy(itemID);
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemOperations", (itemOperationsData) => {
	    sendItemOperations(JSON.parse(itemOperationsData));
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () => {
	    sendUIReady();
	});


/***/ }
/******/ ]);