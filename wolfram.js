var request = require('request');
var parser = require('xml2js'); 

var Wolfram = function Wolfram(app_key) {
	this.key = app_key;
}

Wolfram.prototype.query = function(input, assumptions, context, cb){
	if(!this.key){
		console.log('No key set!');
		return;
	}
	var url = 'http://api.wolframalpha.com/v2/query?input=';
	var inp = encodeURIComponent(input);
	console.log(inp);
	url += inp + '&primary=true'  + '&appid=' + this.key; 
	console.log(url);
	if (assumptions) {
		// implement assumptions
	}
	request(url, function (error, response){
		if(error){
				console.log(error);
				context.text ='There was an error!'; 
			return;
		}
		console.log (response.statusCode);
		// var xml = response.split(' ');
		// console.log(xml);
		var findpod = function (item, output, pods) {
		 	for (i = 0; i < pods.length; i++){
		 		if(pods[i]['$']['title'] == item ){
		 			return pods[i]['subpod'][0][output];
		 		}
		 	}
		 	for (i = 0; i < pods.length; i++){
		 		if(pods[i]['$'].primary ){
		 			return pods[i]['subpod'][0][output];
		 		}
		 	}
		 	return pods[1]['subpod'][0][output];
		}
		var res = parser.parseString(response.body, function (err, result){
			if (err) {
				console.log(err);
			}
			var pods = result['queryresult']['pod'];
			var img = findpod('Result', 'img', pods)[0]['$']['src'];
			var ret = {'text': findpod('Result', 'plaintext', pods)[0], 'image': img};
			console.log(ret);
			context.image = ret.image;
			context.text = ret.text; 
			cb(context);
			return ret;		
		}); 
	});
};

module.exports.Wolfram = Wolfram;
