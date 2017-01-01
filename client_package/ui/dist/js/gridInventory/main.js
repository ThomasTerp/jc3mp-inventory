"use strict";
window.gridInventory = window.gridInventory || {};


let button1 = $('<button type="button">Open player inventory</button>');
button1.on("click", (event) =>
{
	localInventoryWindow.show();
});
$(".windows").append(button1);
$(".windows").append("<br />");

let button2 = $('<button type="button">Open loot crate</button>');
button2.on("click", (event) =>
{
	lootInventoryWindow.show();
});
$(".windows").append(button2);
$(".windows").append("<br />");

let button3 = $('<button type="button">Open loot2 crate</button>');
button3.on("click", (event) =>
{
	loot2InventoryWindow.show();
});
$(".windows").append(button3);
$(".windows").append("<br />");

let button4 = $('<button type="button">Open Administration menu</button>');
button4.on("click", (event) =>
{
	adminWindow.show();
});
$(".windows").append(button4);
$(".windows").append("<br />");


//Local inventory

let localInventoryWindow = new gridInventory.InventoryWindow("Inventory", {
	width: 20,
	height: 12
});
gridInventory.windows.add("local", localInventoryWindow);

let item1 = new gridInventory.AppleItem();
gridInventory.items.add(1, item1);
localInventoryWindow.addItem(item1, {
	x: 0,
	y: 0
});

let item2 = new gridInventory.AppleItem();
gridInventory.items.add(2, item2);
localInventoryWindow.addItem(item2, {
	x: 1,
	y: 0
});

let item3 = new gridInventory.AppleItem();
gridInventory.items.add(3, item3);
localInventoryWindow.addItem(item3, {
	x: 0,
	y: 1
});

let item4 = new gridInventory.AppleItem();
gridInventory.items.add(4, item4);
localInventoryWindow.addItem(item4, {
	x: 1,
	y: 1
});

let item5 = new gridInventory.BackpackItem(gridInventory.windows);
gridInventory.items.add(5, item5);
localInventoryWindow.addItem(item5, {
	x: 2,
	y: 0
});

localInventoryWindow.hide();


//Loot crate 1

let lootInventoryWindow = new gridInventory.InventoryWindow("Loot Crate", {
	width: 10,
	height: 10
});
gridInventory.windows.add("loot1", lootInventoryWindow);

let item6 = new gridInventory.U39PlechovkaItem(4);
gridInventory.items.add(6, item6);
lootInventoryWindow.addItem(item6, {
	x: 0,
	y: 0
});

lootInventoryWindow.hide();



//Loot crate 2

let loot2InventoryWindow = new gridInventory.InventoryWindow("Loot Crate 2", {
	width: 10,
	height: 10
});
gridInventory.windows.add("loot2", loot2InventoryWindow);

loot2InventoryWindow.hide();



//Admin window

let adminWindow = new gridInventory.AdminWindow(gridInventory.items, gridInventory.itemTypes);
gridInventory.windows.add("adminWindow", adminWindow);

adminWindow.hide();
