$(document).ready(function(){

  $(".hello").click(function() {
    $('html, body').animate({
      scrollTop: $("#about").offset().top
    }, 800);

  });

});
