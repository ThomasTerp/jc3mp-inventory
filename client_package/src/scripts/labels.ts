"use strict";


/** Returns a span string with a css class */
export function spanClass(className: string, html: string): string
{
	return `<span class="` + className + `">` + html + `</span>`;
}

/** Returns a span string with a css color */
export function spanColor(color: string, html: string): string
{
	return `<span style="color: ` + color + `;">` + html + `</span>`;
}

/** Adds a percentage sign (%) after the number. If the number is positive, it will be green, if not, it will be red. */
export function percentage(amount: number): string
{
	return this.spanClass(amount >= 0 ? "label-percentage-positive" : "label-percentage-negative", Math.abs(amount) + `%`);
}

/** Returns the health in red */
export function health(html = `health`): string
{
	return this.spanClass("label-health", html);
}

/** Returns the hunger in green */
export function hunger(html = `hunger`): string
{
	return this.spanClass("label-hunger", html);
}

/** Returns the thirst in blue */
export function thirst(html = `thirst`): string
{
	return this.spanClass("label-thirst", html);
}

/** Returns the repair in yellow */
export function repair(html = `repair`): string
{
	return this.spanClass("label-repair", html);
}
