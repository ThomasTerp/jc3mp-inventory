"use strict";
window.gridInventory = window.gridInventory || {};


//Object for holding windows
gridInventory.windows = {
    initialize(windowsHTML)
    {
        this.windowsHTML = $(".windows");
        this.map = new Map();
		
		this.bindEvents();
    },
	
	bindEvents()
	{
		this.eventResize = (event) =>
		{
			this.forEach((uniqueName, window) =>
			{
				window.onResize();
			});
		};
		$(window).on("resize", this.eventResize);
	},
	
	unbindEvents()
	{
		$(window).off("resize", this.eventResize);
	},
	
    //Add a window and give it a unique name
    add(uniqueName, window)
    {
		window.uniqueName = uniqueName;
		window.windowManager = this;
        
        this.delete(uniqueName);
		
        this.map.set(uniqueName, window);
		
        window.html.appendTo(this.windowsHTML);
		
        return window;
    },
	
    //Delete a window from the manager and detach its HTML
    delete(uniqueName)
    {
        let window = this.get(uniqueName);
		
        if(window)
		{
            window.uniqueName = null;
            window.windowManager = null;
            
            window.html.detach();
			
            this.map.delete(uniqueName);
        }
    },
	
    //Get a window by its unique name
    get(uniqueName)
    {
        return this.map.get(uniqueName)
    },
	
    //Loop through all windows
    //shouldBreak callback(uniqueName, window)
    forEach(callback)
    {
        for(let [uniqueName, window] of this.map.entries())
		{
            if(callback(uniqueName, window))
			{
                break;
            }
        }
    },
}
gridInventory.windows.initialize();
