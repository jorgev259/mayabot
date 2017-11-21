const getter = require('./index');
const parseString = require('xml2js').parseString;
require('request').debug = true;

let loli = new getter();

let randomPage = Math.floor(Math.random() * 1320)
console.log(randomPage);

let parseIt = function(data){
	//console.log(data);
	//console.log(data);	
	var cleanedString = data.text.replace("\ufeff", "");
	parseString(cleanedString, function(err, result) {
		console.log("Error", err);
		console.log(result.posts.post[0]);//Math.floor(Math.random() * result.posts.post.length)]);//.$.file_url.replace("//",""));
		
	});
}

let data = loli.get(1, randomPage, "loli", parseIt);//.then((data) => {parseIt(data) })

