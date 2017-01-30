"use strict";
import {Vector2} from "./vector2";


let currentContextMenu;


export class ContextMenu
{
	/** Append a ContextMenu to document.body, current ContextMenu will be destroyed if it exists */
	static open(contextMenu: ContextMenu): void
	{
		ContextMenu.close();
		
		currentContextMenu = contextMenu
		
		$(document.body).append(contextMenu.html);
	}
	
	/** Close the current ContextMenu */
	static close(): void
	{
		if(currentContextMenu != undefined)
		{
			currentContextMenu.destroy();
			currentContextMenu = undefined;
		}
	}
	
	
	html: JQuery;
	
	private _options: ContextMenuOption[];
	set options(value)
	{
		this._options = value;
		
		this.options.forEach((option, optionIndex) => {
			this.html.append(option.html);
		});
	}
	get options()
	{
		return this._options;
	}
	
	private _position: Vector2;
	set position(value)
	{
		this._position = value;
		
		this.html.offset({
			left: this.position.x,
			top: this.position.y
		})
	}
	get position()
	{
		return this._position;
	}
	
	constructor(position: Vector2, options: ContextMenuOption[])
	{
		this.createHTML();
		
		this.position = position;
		this.options = options;
	}
	
	destroy()
	{
		this.html.remove();
	}
	
	createHTML()
	{
		this.html = $(`<div class="context-menu"></div>`);
		this.html.data("contextMenu", this);
	}
	
	addOption(option: ContextMenuOption)
	{
		option.contextMenu = this;
		
		this.html.append(option.html);
	}
}

export class ContextMenuOption
{
	contextMenu: ContextMenu;
	html: JQuery;
	nameHTML: JQuery;
	onClick: () => void;
	
	constructor(nameHTML: string, onClick: () => void)
	{
		this.createHTML();
		
		this.nameHTML.html(nameHTML);
		this.onClick = onClick;
	}
	
	destroy()
	{
		this.html.remove();
	}
	
	createHTML(): void
	{
		this.html = $(`
			<div class="option">
				<div class="name"></div>
			</div>
		`);
		this.html.data("contextMenuOption", this);
		
		this.nameHTML = this.html.find(".name");
		
		this.html.on("mouseup", (event) => {
			this.onClick();
			
			ContextMenu.close();
		});
	}
}

$(document.body).on("mousedown", (event) =>
{
	const contextMenuOption = $(event.target).data("contextMenuOption");
	
	if(contextMenuOption == undefined)
	{
		ContextMenu.close();
	}
});
