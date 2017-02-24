"use strict";
import {Inventory} from "./inventory";
import {Vector2Grid} from "./../vector2Grid";


/** Class for player inventories */
export class PlayerInventory extends Inventory
{
	player: Player;
	
	constructor(name: string, size: Vector2Grid, player: Player)
	{
		super(name, size);
		
		this.player = player;
	}
	
	hasAccess(player: Player): boolean
	{
		return player === this.player;
	}
}
