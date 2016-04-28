$(document).ready(function(){
  console.log('locked/loaded');

  function deselectAll() {
    $('.pics').removeClass('.selected');
  }

  $('.pics').click(function(e){
    e.preventDefault();
    console.log('clicked pic!');
    // $('.pics').deselectAll();
    $(this).toggleClass('selected');
    $(this).click(function(){console.log("already clicked a pic bro");})
  });

  $('.card').click(function(e){
    e.preventDefault();
    { console.log('clicked tweet!');}
    // $('.card').deselectAll();
    // $('.card').each(function(card){
    //   console.log(card);
    //   card.removeClass('.selected');
    // });

    $(this).toggleClass('selected');
    $(this).click(function(){console.log("already clicked a tweet bro");})
  });


  $('.saveArt').click(function(e){
    e.preventDefault;
    var flickrURL = $('.selected img')[0].src;
    var tweetStatement = $('.selected.card .statement').text();
    var query = $('.selected.card .query').text();
    var twitUser = $('.selected.card .user').text();

      $.ajax({
        url: '/art/',  
        method: 'POST',
        //anything in data here ends up req.body
        data: {
          flickrURL:flickrURL,
          tweetStatement:tweetStatement,
          query:query,
          twitUser:twitUser
    }
  }).success(function(res){
    console.log(res);
    window.location = '/user'
    });
  });
});