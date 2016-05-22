'use strict'


var request = require('request');
const fs = require('fs');

module.exports.command = 'imgur';
module.exports.usage = '<test>';
module.exports.description = '';
var client_secret = ' b58225eb9fa856f98e70b7008c2d453345263d94';

module.exports.handler = (api, args, message) =>{
	if(args.length == 0){
		request({
		  url: 'https://api.imgur.com/3/topics/defaults' ,
		  method: 'GET',
		  headers:{ Authorization: 'Client-ID 5e2dc40e95a2697'}
		}, function(err, res) {
		  if(err){
		  	console.log(err);
		  }
		var createTop = (body) => {
		  	var top = JSON.parse(res.body)['data'][Math.floor((Math.random() * 10) + 1)]['topPost'];
		  	if(top != null){
		  		return top;
		  	}
		  	else{
		  		return createTop(body);
		  	}
		}
		  var topPost = createTop(res.body);

		  console.log(topPost);
		  var link = topPost['link'];
		  var t = topPost['type'];
		  var arr;
		  if(type == undefined){
		  	t = topPost['link']
		  	arr = t.split('.');
		  }
		  var arr = t.split('/');
		  var type = arr[arr.length - 1];
		  if(type != 'gif' && type!='png'){
		  	  type = 'jpeg';
		  }
		  var download = function(uri, filename, callback){
	        request.head(uri, function(err, res, body){
			    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
			  });
			};
			download(link, 'imugr.' + type, function(){
		  		var msg = {
			      body: topPost['title'],
			      attachment: fs.createReadStream(__dirname + '/../imugr.' + type)
			    }
			    api.sendMessage(msg, message.threadID); 	
			});
	 });
	}
	
}					