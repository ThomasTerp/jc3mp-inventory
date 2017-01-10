"use strict";


//Modulo
export function mod(number: number, mod: number): number
{
	return ((number % mod) + mod) % mod;
};

//Rotate a 2D array
export function rotateMatrix(matrix: any[][], direction: number): any[][]
{
	direction = mod(direction, 360) || 0;

	//Efficiently builds and fills values at the same time.
	let transpose = function(m)
	{
		let result = new Array(m[0].length);
		
		for (let i = 0; i < m[0].length; i++)
		{
			result[i] = new Array(m.length - 1);
			
			for (let j = m.length - 1; j > -1; j--)
			{
				result[i][j] = m[j][i];
			}
		}
		
		return result;
	};

	let reverseRows = function(m)
	{
		return m.reverse();
	};

	let reverseCols = function(m)
	{
		for(let i = 0; i < m.length; i++)
		{
			m[i].reverse();
		}
		
		return m;
	};

	let rotate90Left = function(m)
	{
		m = transpose(m);
		m = reverseRows(m);
		
		return m;
	};

	let rotate90Right = function(m)
	{
		m = reverseRows(m);
		m = transpose(m);
		
		return m;
	};

	let rotate180 = function(m)
	{
		m = reverseCols(m);
		m = reverseRows(m);
		
		return m;
	};

	if(direction == 90 || direction == -270)
	{
		return rotate90Left(matrix);
	}
	else if(direction == -90 || direction == 270)
	{
		return rotate90Right(matrix);
	}
	else if(Math.abs(direction) == 180)
	{
		return rotate180(matrix);
	}

	return matrix;
};

export function cloneObject(objectToClone: any): any
{
   let objectClone = (objectToClone instanceof Array) ? [] : {};
   
   for(let index in objectToClone)
   {
      if(index == 'clone')
	  {
		  continue;
	  }
	  
      if(objectToClone[index] && typeof objectToClone[index] == "object")
	  {
         objectClone[index] = cloneObject(objectToClone[index]);
      }
	  else
	  {
         objectClone[index] = objectToClone[index];
      }
   }
   
   return objectClone;
};

export function capitalizeFirstLetter(text: string): string
{
    return text.charAt(0).toUpperCase() + text.slice(1);
};
