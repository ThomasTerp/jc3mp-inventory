"use strict";


jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) =>
{
    jcmp.localPlayer.controlsEnabled = !isVisible;
});
