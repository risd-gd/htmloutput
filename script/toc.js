$(document).ready(function(){

  // strip urls of their / / marks
  for(var i = 0; i < $(".nav_link").length; i++){
    var temp = $(".nav_link").eq(i).attr("name");
    //alert(temp);
    var end = temp.length - 1;
    temp = temp.substring(1,end);
    $(".nav_link").eq(i).attr("name",temp);
    $(".name").eq(i).attr("id",temp);
  }

  var scrollTop = $(document).scrollTop();

  $(".nav_link").click(function() {
    var scroll_to = $(this).attr("name");
    $('html, body').animate({
      scrollTop: $("#"+scroll_to).offset().top -20
    }, 800);
  });

});
