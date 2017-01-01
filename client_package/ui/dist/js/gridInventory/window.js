"use strict";
window.gridInventory = window.gridInventory || {};


//Class for a draggable window
gridInventory.Window = class
{
	constructor(titleHTML, contentHTML)
	{
		this._createHTML();
		
		this.uniqueName = null;
		this.windowManager = null;
		this.titleHTML.html(titleHTML);
		this.contentHTML.html(contentHTML);
	}
	
	destroy()
	{
		this._removeHTML();
	}
	
	set uniqueName(value)
	{
		this._uniqueName = value;
		
		this.html.attr("id", "window-" + this.uniqueName);
	}
	
	get uniqueName()
	{
		return this._uniqueName;
	}
	
	_createHTML()
	{
		if(!this.html)
		{
			this.html = $(`
				<div class="window">
					<div class="top-bar">
						<div class="title"></div>
						<div class="close">✖</div>
					</div>
					<div class="content"></div>
				<div>
			`);
			this.html.data("window", this);
			
			//Move window to front when it gets pressed
			this.html.on("mousedown", (event) =>
			{
				this.moveToFront();
			});
			
			//Close inventory when clicking on close button
			this.html.find(".close").on("click", (event) =>
			{
				this.hide();
			});
			
			//Make window draggable
			this.html.draggable({
				handle: ".top-bar",
				snap: ".window",
				snapTolerance: 10,
				containment: "body",
				scroll: false
			});
			
			this.titleHTML = this.html.find(".top-bar .title");
			this.contentHTML = this.html.find(".content");
		}
		
		return this.html;
	}
	
	_removeHTML()
	{
		if(this.html)
		{
			this.html.remove();
			this.html = undefined;
		}
	}
	
	moveToFront()
	{
		$(".window").css("z-index", "");
		this.html.css("z-index", "1");
	}
	
	show()
	{
		this.html.show();
	}

	hide()
	{
		this.html.hide();
	}
	
	onResize()
	{
		
	}
}
