var twitterKeys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


var liriCommands = process.argv[2];
var title = process.argv;
title = title.splice(3, process.argv.length - 1);
title = title.join(',')

if(liriCommands === 'my-tweets'){
	tweet();
}
else if(liriCommands === 'spotify-this-song'){
	spotifyApi();
}
else if(liriCommands === 'movie-this'){
	omdbMovie();
}
else if(liriCommands == 'do-what-it-says'){
	doSays();
}

function tweet(){
	var client = new Twitter(twitterKeys);
	var params = {screen_name: 'spoofer2018'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for(let i = 0; i < tweets.length; i++){
				console.log("Tweet Text: " + tweets[i].text);
				console.log("Tweet Date: " + tweets[i].created_at);
			}
		}
});
}

function spotifyApi(){
	var spotify = new Spotify({
	  id: 'dc4622ac19ed4c21901ad462b22948ca',
	  secret: '5633c97e245f4ffa9dae4fcddc01934e'
});
 
spotify.search({ type: 'track', query: title }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  else if(data.tracks.items.length > 1){
	for(let i = 0; i < data.tracks.items.length; i++){
		var artists = [];
		for(var counter = 0; counter < data.tracks.items[i].artists.length; counter++){
                    artists.push(data.tracks.items[i].artists[counter].name)
                }
        console.log('Artists: ' + artists.join(', ') + "; ")
        console.log('Song: ' + data.tracks.items[i].name); 
        console.log('Spotify Link: ' + data.tracks.items[i].preview_url); 
        console.log('Album: ' + data.tracks.items[i].album.name);
        console.log('');
	}
  }
  else{
  	title = "The Sign";
  	spotifyApi();
  }
});
}

function omdbMovie(){
    request('http://www.omdbapi.com/?apikey=940c1089&t=' + title, function (error, response, body) {
        var parsed = JSON.parse(body);
        if(error){
            console.log('error:', error);
        }
        else if(parsed.Response == 'True'){
            console.log('Title: ' + parsed.Title); 
            console.log('Year: ' + parsed.Year); 
            console.log('IMDB Rating: ' + parsed.imdbRating);
            if(parsed.Ratings[1]){
                console.log('Rotten Rating: ' + parsed.Ratings[1].Value); 
            }
            else{
                console.log('No Rating Found')
            }
            console.log('Countries: ' + parsed.Country); 
            console.log('Languages: ' + parsed.Language); 
            console.log('Plot: ' + parsed.Plot); 
            console.log('Actors: ' + parsed.Actors); 
        }
        else {
            title = 'Mr. Nobody';
            movies()
        }
    });
}

function doSays(){
    fs.readFile('./random.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    title = data.split(',')[1];
    spotifyApi();
    });
}