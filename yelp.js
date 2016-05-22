

const Yelp = require('yelp');
const _ = require('underscore');

var yelp = new Yelp({
  consumer_key: '-Kz-oJQA9ckr6Bml2B_m-Q',
  consumer_secret: 'mlmMZA_BeyXY2jOakh_mfgkkV9Y',
  token: 'DFJVjfItJeFk361bhaarPdFz7qLsM2_d',
  token_secret: 'i55norVbJcTb9HBHVw1nDDtL6o4',
});

module.exports.command = 'yelp';

module.exports.usage = '<command, zipcode, cuisine>';
module.exports.description = '';


module.exports.wit = (term, place, context, callback) => {
  yelp.search({ term: term, location: place, sort: 2 })
      .then(function (data) {
        var restaurants = [];
        for(var i = 0; i < data.businesses.length; i++) {
          restaurants.push(data.businesses[i].name);
        }
        context['suggestions'] =  restaurants.slice(0,10).join(", ");
        callback(context); 
      })
      .catch(function (err) {
        console.log(err);
        context['suggestions'] =  "Sorry. There are no results for that entry";
        callback(context);
      });
     
};

module.exports.handler = (event, callback) => {
  var text = event.message.text;
  var args = text.substring(1).split(' ');
  args.shift();
  if(args.length <= 1) {
  	callback(event, "<command, zipcode, cuisine>");
  } else if(args.length == 2) {
      yelp.search({ term: 'food', location: args[0], sort: 2 })
      .then(function (data) {
        var restaurants = [];
        for(var i = 0; i < data.businesses.length; i++) {
          restaurants.push(data.businesses[i].name);
        }
        if(args[0] == 'search') {
          callback(event, restaurants.slice(0,10).join(", "));
        } else if(args[0] == 'random') {
          var randomInt = Math.floor(Math.random()*10);
          callback(event, restaurants[randomInt]);
        } else {
          callback(event, 'Invalid command');
        }
      })
      .catch(function (err) {
        console.log(err);
        callback(event, "Sorry. There are no results for that entry");
      });
  } else {
  	var cmd = args[0];
    var zip = args[1];
  	args.shift();
    args.shift();
  	var cuisine = args.join(' ');
  	yelp.search({ term: cuisine, location: zip, sort: 2 })
      .then(function (data) {
        var restaurants = [];
        for(var i = 0; i < data.businesses.length; i++) {
          restaurants.push(data.businesses[i].name);
        }
        if(cmd == 'search') {
          callback(event, restaurants.slice(0,10).join(", "));
        } else if(cmd == 'random') {
          var randomInt = Math.floor(Math.random()*10);
          callback(event, restaurants[randomInt]);
        } else {
          callback(event, 'Invalid command');
        }
      })
      .catch(function (err) {
        console.log(err);
        callback(event, "Sorry. There are no results for that entry");
      });
  }
};


