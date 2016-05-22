var request = require('request');
const fs = require('fs');


module.exports.query = function (searchTerm, context, cb) {
	request('http://api.giphy.com/v1/gifs/search?q=' + searchTerm + '&api_key=dc6zaTOxFJmzC', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	if(JSON.parse(body).data.length == 0) {
	  		api.sendMessage("no results for that search query", message.threadID);
	  		return;
	  	}
	  	var ret = JSON.parse(body).data[0].images.original.url;
	  	context.image = ret;
	  	cb(context);
	  } else {
	  	console.log(error);
	  }
	});
}