'use strict';
var bot = require('./bot');
const _ = require('underscore');
const fs = require('fs')
const path = require('path')

var commandsPath = path.join(__dirname);
var commandsFiles = fs.readdirSync(commandsPath); 
commandsFiles.forEach( function(filename) {
		let fileparts = filename.split('.'); 
		let type = fileparts[fileparts.length -1];
		if(type === "js"){
			let command = require("./commands/" + filename);
			if(command.command && _.isFunction(command.handler)){
				bot.addCommand(command.command, command.handler);
			}
		}

});
var utilsPath = path.join(__dirname, 'utilities');
var utilFiles = fs.readdirSync(utilsPath); 
utilFiles.forEach( function(filename) {
		let fileparts = filename.split('.'); 
		let type = fileparts[fileparts.length -1];
		if(type === "js"){
			let util = require("./utilities/" + filename);
			if(util.name && _.isFunction(util.information)){
				bot.addUtil(util);
			}
		}
});
 