"use strict";

export class ContextMenu
{
	html: JQuery;
	options: ContextMenuOption[];
	
	constructor(options: ContextMenuOption[])
	{
		this.options = options;
		
		this.createHTML();
	}
	
	destroy()
	{
		this.html.remove();
	}
	
	createHTML()
	{
		this.html = $(`<div class="context-menu"></div>`);
	}
}

export class ContextMenuOption
{
	contextMenu: ContextMenu;
	html: JQuery;
	nameHTML: JQuery;
	onClick: () => void;
	
	constructor(nameHTML, onClick)
	{
		this.createHTML();
		
		this.nameHTML.html(nameHTML);
		this.onClick = onClick;
	}
	
	createHTML()
	{
		this.html = $(`
			<div class="option">
				<div class="name">
			</div>
		`);
	}
}
