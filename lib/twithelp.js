twitter = require('twitter');

var twit = new twitter({
    consumer_key: process.env.twitkey,
    consumer_secret: process.env.twitsecret,
    access_token_key: process.env.twitaccess,
    access_token_secret: process.env.twittoken
});

module.exports = {
  getTweetWords: function(searchTerm,callback){
    twit.get('search/tweets', {q: searchTerm +'-RT', 'result_type': 'mixed', lang: 'en', count: 200}, function(error, data, response) {

      // console.log(error);
      if (error) throw error;
      var twitResults = data.statuses.filter(function(tweet){
        return true;//(tweet.text.indexOf("@") === -1);
      }).map(function(tweet) {
        return tweet.text;
      }).join(' ').split(" ").map(function(word){
        return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '');
      }).filter(function(word){
        return (word.length > 3 && word.indexOf("://") === -1);
      });
      callback(twitResults.join(' '));
    });
  },