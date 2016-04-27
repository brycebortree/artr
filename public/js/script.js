$(document).ready(function(){
  console.log('locked/loaded');

  $('.pics').click(function(e){
    e.preventDefault();
    console.log('clicked pic!');
    $(this).toggleClass('selected');
    $(this).click(function(){console.log("already clicked a pic bro");})
  });

  $('.cards').click(function(e){
    e.preventDefault();
    { console.log('clicked tweet!');}
    $(this).toggleClass('selected');
    $(this).click(function(){console.log("already clicked a tweet bro");})

  });




});