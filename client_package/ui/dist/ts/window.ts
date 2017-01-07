"use strict";


//Class for a draggable window
abstract class Window
{
	html: JQuery;
	titleHTML: JQuery;
	contentHTML: JQuery;
	
	private _uniqueName: string;
	set uniqueName(value: string)
	{
		this._uniqueName = value;
		
		this.html.attr("id", "window-" + this.uniqueName);
	}
	get uniqueName(): string
	{
		return this._uniqueName;
	}
	
	private _isVisible: boolean;
	set isVisible(value: boolean)
	{
		this._isVisible = value;
		
		if(this.isVisible)
		{
			this.html.show();
		}
		else
		{
			this.html.hide();
		}
	}
	get isVisible(): boolean
	{
		return this._isVisible;
	}
	
	constructor(titleHTML: string)
	{
		this.createHTML();
		
		this.uniqueName = null;
		this.titleHTML.html(titleHTML);
		
		this.show();
	}
	
	destroy(): void
	{
		this.html.remove();
	}
	
	protected createHTML() : JQuery
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
	
	moveToFront(): void
	{
		$(".window").css("z-index", "");
		this.html.css("z-index", "1");
	}
	
	show(): void
	{
		this.isVisible = true;
	}

	hide(): void
	{
		this.isVisible = false;
	}
	
	toggle(): void
	{
		this.isVisible = !this.isVisible;
	}
	
	onResize(): void
	{
		
	}
}
export {Window};
