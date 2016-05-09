$(document).ready(function(){
  console.log('locked/loaded');

  var deselectAll = function() {
    $('.pics').removeClass('.selected');
  }

  $('.pics').click(function(e){
    e.preventDefault();
    console.log('clicked pic!');
    deselectAll();
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

  $('.delete').click(function(e){
    e.preventDefault;

    var art = $(this);
      $.ajax({
        url: '/art/',  
        method: 'DELETE',
        //anything in data here ends up req.body
  }).done(function(res){
    console.log(res);
    window.location = '/user'
    });
  });

var navbarHeight = $('.navbar').height(); 

$(window).scroll(function() {
  var navbarColor = "62,195,246";//color attr for rgba
  var smallLogoHeight = $('.small-logo').height();
  var bigLogoHeight = $('.big-logo').height();
  
  
  var smallLogoEndPos = 0;
  var smallSpeed = (smallLogoHeight / bigLogoHeight);
  
  var ySmall = ($(window).scrollTop() * smallSpeed); 
  
  var smallPadding = navbarHeight - ySmall;
  if (smallPadding > navbarHeight) { smallPadding = navbarHeight; }
  if (smallPadding < smallLogoEndPos) { smallPadding = smallLogoEndPos; }
  if (smallPadding < 0) { smallPadding = 0; }
  
  $('.small-logo-container ').css({ "padding-top": smallPadding});
  
  var navOpacity = ySmall / smallLogoHeight; 
  if  (navOpacity > 1) { navOpacity = 1; }
  if (navOpacity < 0 ) { navOpacity = 0; }
  var navBackColor = 'rgba(' + navbarColor + ',' + navOpacity + ')';
  $('.navbar').css({"background-color": navBackColor});
  
  var shadowOpacity = navOpacity * 0.4;
  if ( ySmall > 1) {
    $('.navbar').css({"box-shadow": "0 2px 3px rgba(0,0,0," + shadowOpacity + ")"});
  } else {
    $('.navbar').css({"box-shadow": "none"});
  }
  
  
  
});

});