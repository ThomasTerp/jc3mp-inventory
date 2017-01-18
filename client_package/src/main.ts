"use strict";
import "./scripts/network";


const ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;



jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) =>
{
    jcmp.localPlayer.controlsEnabled = !isVisible;
});
