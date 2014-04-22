$('document').ready(function(){



  //alert(w_width);

  $('body').prepend("<div id='scrollybar'></div>");

  var css = $("style").html();

  css = css + " #scrollybar{position: fixed; top: 0; left: 0; width: 100%; height: 10px; border: black 1px solid; background-color: transparent; z-index: 30;} .increment{display: inline-block; float: left; width: 1px; height: 10px; background-color: black;} ";

  $("style").html(css); // updated CSS

  $(document).scroll(function(){

    var w_width = $(window).width();
    var d_length = $(document).height(); // requires <!DOCTYPE HTML>
    var scrollTop = $(document).scrollTop();

    var num_elements = Math.round((scrollTop/d_length)*w_width);
    var num_existing = $("#scrollybar").children().length;
    //alert(num_elements);
    //alert(num_existing);

    // probs need a value check in here somewhere

    if(num_elements > num_existing){
      //alert('added some');
      for(var i = 0; i<num_elements-num_existing; i++){
        $("#scrollybar").append("<div class='increment'></div>");
      }
    }else if(num_elements < num_existing){
      //alert('removed some');
      for(var j = 0; j<num_existing-num_elements; j++){
        $(".increment").eq(j).remove();
      }
    }else{
      // don't do anything duh
    }

    //alert($("#scrollybar").children().length);

  });
});
