require("dotenv").config();
var keys = require("./keys.js");

// pull node-spotify-api module
var Spotify = require('node-spotify-api');
// key js variable
var spotify = new Spotify(keys.spotify);
// pull axios
var axios = require("axios");
// pull moment
var moment = require("moment");
// pull random.text file
var fs = require("fs");

// get user input action set to var
var action = process.argv[2];
// everything after action set to a var
var obj = process.argv.slice(3).join(" ");


function spotifyThis() {
    // if no input
    if (!obj) {
        spotify
            .search({ type: 'track', query: "the sign" })
            .then(function (response) {
                console.log("\n--------\n");
                console.log("The album name is " + response.tracks.items[8].album.name);
                console.log("The artist name is " + response.tracks.items[8].album.artists[0].name);
                console.log("Click this link if you want a preview of the song " + response.tracks.items[8].preview_url);
                console.log("Song title: " + response.tracks.items[8].name);

            })
    }
    // if user input, search user input
    else {
        spotify
            .search({ type: 'track', query: obj })
            .then(function (response) {
                for (let i = 0; i < response.tracks.items.length; i++) {
                    console.log("\n--------\n");
                    console.log("The album name is " + response.tracks.items[i].album.name);
                    console.log("The artist name is " + response.tracks.items[i].album.artists[0].name);
                    console.log("Click this link if you want a preview of the song " + response.tracks.items[i].preview_url);
                    console.log("Song title: " + response.tracks.items[i].name);
                };

            })
    };
};

function movieThis() {
    // if no movie is entered
    if (!obj) {
        axios.get("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("\n--------------------\n")
                console.log(response.data.Title);
                console.log("Movie release date: " + response.data.Year);
                console.log("IMDB rating: " + response.data.imdbRating);
                console.log("Rotten tomatoes rating: " + response.data.Ratings[1].Value);
                console.log("Movie production location: " + response.data.Country)
                console.log("Movie language: " + response.data.Language);
                console.log("Movie plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
                console.log("\n--------------------\n");
            })
    }
    // else search user input
    else {
        axios.get("http://www.omdbapi.com/?t=" + obj + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("\n--------------------\n");
                console.log(response.data.Title);
                console.log("Movie release date: " + response.data.Year);
                console.log("IMDB rating: " + response.data.imdbRating);
                console.log("Rotten tomatoes rating: " + response.data.Ratings[1].Value);
                console.log("Movie production location: " + response.data.Country)
                console.log("Movie language: " + response.data.Language);
                console.log("Movie plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("\n--------------------\n");
            })
    };
};

function concertThis() {
    // take the user input and search bandsintown
    axios.get("https://rest.bandsintown.com/artists/" + obj + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (let i = 0; i < response.data.length; i++) {
                console.log("\n--------\n");
                console.log(obj + " is playing on " + moment(response.data[i].datetime).format('L')
                 + " at " + response.data[i].venue.name + " in " + response.data[i].venue.city
                  + " " + response.data[0].venue.region);
            };
        }
    )
};
// add user input to log.txt
function addFile(){
fs.appendFile("log.txt",","+action+ ","+"'" + obj + "'",function(err){
    if(err){
        console.log(err);
    } else {
        console.log("Added to the log!");
    };
});
};


// concert-this action
if (action == "concert-this") {
    concertThis();
    addFile();
};

// spotify-this action
if (action == "spotify-this-song") {
    spotifyThis();
    addFile();
};

// movie-this action
if (action == "movie-this") {
    movieThis();
    addFile();
};

// do-what-it-says action
if (action == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        };
        // split the data by commas
        var output = data.split(",");
        // loop through the index and separate
        for (let index = 0; index < output.length; index += 2) {
            let item = index + 1;
            action = output[index]
            obj = output[item]
            if (action === "spotify-this-song") {
                spotifyThis();
            };
            if (action === "movie-this") {
                movieThis();
            };
        };
    }
    )
};