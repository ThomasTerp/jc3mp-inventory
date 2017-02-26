# Just Cause 3 Multiplayer - Grid Inventory
This is a grid inventory for Just Cause 3 Multiplayer. It is NOT finished yet, do not use unless you know what you are doing.
This is made with TypeScript, so don't edit the .js files, edit the .ts files and compile.

## Demo
I got a browser version of my inventory if you want to try it (please use Chrome browser): http://thomasterp.com/justcause3inventory/  
Controls are `I` to open inventory, `O` to open admin menu. While dragging items you can use arrows keys to rotate and flip them. To drag multiple items at once you can do a box drag select (like when selecting files in windows), or ctrl click them. Controls might be changed in the future.


## Installing
1. Put the`jc3mp-inventory` folder inside your servers `packages` folder
1. Open the command line in the root of the package
2. `npm install`
3. `npm install grunt -g`


## Compiling
Since there is 3 seperate JavaScript environments in Just Cause 3 Multiplayer (server, client and UI), I made a grunt file to compile them separately in different ways. Server compiles to multiple JavaScript files in the root and the scripts folder. Client compiles to a single JavaScript file in client_package/main.js. UI compiles to a single JavaScript file in client_package/ui/scripts/index.js.

To compile everything, do `grunt --force` in the command line.  
To compile server only, do `grunt server`.  
To compile client only, do `grunt client`.  
To compile UI only, do `grunt ui`.  
