# Just Cause 3 Multiplayer - Grid Inventory
This is a grid inventory for Just Cause 3 Multiplayer. It is NOT finished yet, do not use unless you know what you are doing.
This is made with TypeScript, so don't edit the .js files, edit the .ts files and compile.


## Installing
You only need to do this if you want to compile it.

1. Open the command line in the root of the package
1. `npm install`
2. `npm install grunt -g`


## Compiling
Since there is 3 seperate JavaScript environments in Just Cause 3 Multiplayer (server, client and UI), I made a grunt file to compile them separately in different ways. Server compiles to multiple JavaScript files in the root and the scripts folder. Client compiles to a single JavaScript file in client_package/main.js. UI compiles to a single JavaScript file in client_package/ui/scripts/index.js.

To compile everything, do `grunt` in the command line.  
To compile server only, do `grunt server`.  
To compile client only, do `grunt client`.  
To compile UI only, do `grunt ui`.  
