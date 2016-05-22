
const Wit = require('node-wit').Wit;
var config = require('./config');
var app = require('./app.js');
var token = config.wit_token;
var yelp = require('./yelp.js');
var wolfram = require('./wolfram.js');
var giphy = require('./giphy');
const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};


const actions = {
	say(sessionId, context, message, cb) {
		var response = {image : '', text: ''};
		if(context.image){
			response.image = context.image; 
		}
		response.text =  message;	
		if(context.GIF  && context.wolfram_query){
			delete(response.text);
			giphy.query(context.wolfram_query, context, function(context) {
				response.image = context.image;
				app.send(app.sessions[sessionId].fbid, response);
			});
		}
		else{
			app.send(app.sessions[sessionId].fbid, response);	
		}
	    console.log('message sent!');
	    cb();
	},
	merge(sessionId, context, entities, message, cb) {
		const loc = firstEntityValue(entities, 'location');
		const query = firstEntityValue(entities, 'local_search_query');
		const wolfram_query = firstEntityValue(entities, 'wolfram_search_query');
		console.log(entities);
		if(loc){
			context.loc = loc;
		}
		if(query){
			context.query = query;
		}
		if(wolfram_query){
			context.wolfram_query = wolfram_query;
		}
		if(message.includes('GIF')){
			context.GIF = true;
		}
		if(message.includes('imgur')){
			context.imgur = true;
		}	
	    cb(context);
	},
	yelp(sessionId, context, cb){
		context.text = true;
		var suggestions = yelp.wit(context['query'], context['loc'], context, cb);
	},
	giphy(sessionId, context, cb){
		giphy.query(context.search_query, context, cb);
	},
	wolfram(sessionId, context, cb){
		var wolf = new wolfram.Wolfram(config.wolfram_token);
		if(context.GIF){
			context.image = '';
			context.text = '';
			cb(context);
			return;
		}
		var ret = wolf.query(context.wolfram_query, '', context, cb);
	}, 
	error(sessionId, context, error) {
		console.log(context);
	    console.log(error.message);
	}
}
const wit = new Wit(token, actions);

module.exports.wit = wit; 