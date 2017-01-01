"use strict";
window.gridInventory = window.gridInventory || {};


//Library for helping with description text and style
gridInventory.labels = {
	//Returns a span string with a css class
	spanClass(className, html)
	{
		return `<span class="` + className + `">` + html + `</span>`;
	},
	
	//Returns a span string with a css color
	spanColor(color, html)
	{
		return `<span style="color: ` + color + `;">` + html + `</span>`;
	},
	
	//Adds a percentage sign (%) after the number. If the number is positive, it will be green, if not, it will be red.
	percentage(number)
	{
		return this.spanClass(number >= 0 ? "label-percentage-positive" : "label-percentage-negative", Math.abs(number) + `%`);
	},
	
	//Returns the health in red
	health(html = `health`)
	{
		return this.spanClass("label-health", html);
	},
	
	//Returns the hunger in green
	hunger(html = `hunger`)
	{
		return this.spanClass("label-hunger", html);
	},
	
	//Returns the thirst in blue
	thirst(html = `thirst`)
	{
		return this.spanClass("label-thirst", html);
	},
	
	//Returns the repair in yellow
	repair(html = `repair`)
	{
		return this.spanClass("label-repair", html);
	},
};
