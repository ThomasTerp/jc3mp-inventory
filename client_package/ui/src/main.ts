"use strict";
import "./classes/items";
import "./classes/itemDrag";
import "./itemSelection";
import "./tooltip";
import "./misc";

//Uncomment for browser debugging
/*import {Vector2Grid} from "./classes/vector2Grid";
import {ItemDrag} from "./classes/itemDrag";
import * as items from "./classes/items";
import * as itemManager from "./managers/itemManager";
import * as windowManager from "./managers/windowManager";
window.items = items;
window.itemManager = itemManager;
window.windowManager = windowManager;
window.Vector2Grid = Vector2Grid;
window.ItemDrag = ItemDrag;*/

if(typeof jcmp != "undefined")
{
	jcmp.CallEvent("jc3mp-inventory/client/uiReady");
}
