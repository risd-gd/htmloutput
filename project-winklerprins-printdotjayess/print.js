$('document').ready(function(){

  var p_width = 4.5; // 4.25 crop
  var p_length = 7.13; // 6.88 crop
  var p_unit = "in";
  var kind = "fixed"; // scroller or fixed pattern.
  // (i.e. you scroll down a page, or changes as you scroll with fixed positioned elements)

  var browser_window_sizing = 0;

  if(browser_window_sizing){
    p_width = $(window).width();
    p_length = $(window).height();
    p_unit = "px"; //
  }

  var p_m = ""; // String of all Print Media styling.

  //////////////////////////////////////////////////////
  // Check for a container/wrapper of the entire document
  var wrap_name = $("body > div").eq(0).attr('id');
  var wrap_identifier = "#";
  var no_wrap;
  if(wrap_name == null){
    wrap_name = $("body > div").eq(0).attr('class');
    wrap_identifier = ".";
    no_wrap = 0;
  }
  if(wrap_name != 'container' && wrap_name != 'wrapper'){
    // there isn't a wrapper. Let's make one! (happens later)
    no_wrap = 1;
    wrap_name = "body >";
    wrap_identifier = "";
  }

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  var num_cont = $(wrap_identifier+wrap_name+" > div").length;
  for(var i = 0; i < num_cont; i++){

    var cont_identifier = "#"; // Start by assuming the first div is a container.
    var cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('id');

    if(cont_name == null){
      cont_identifier = ".";
      cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('class');
      if(cont_name == null){
        // still! Just unadorned <div> then
        cont_name = "";
        cont_identifier = wrap_identifier+wrap_name+" div:eq("+i+")";

      }
    }
    var num_repeat = 0;
    var repeat_name = "";

    repeat_name = $(cont_identifier+cont_name+" > div").eq(0).attr("class");

    if(repeat_name == null){
      num_repeat = $(cont_identifier+cont_name+" > div").length;
    }else{
      num_repeat = $(cont_identifier+cont_name+" > div."+repeat_name).length;
    }

    //////////////////////////////////////////////////////
    // Styling each container, and repeat if appropriate.

    var cont_p_width = 2+p_width;
    var cont_p_length = 1+p_length;
    // these dimensions structure the overflow. one unit on either side, one unit on top.

    var cont_css = "{ overflow: hidden; width: "+cont_p_width+p_unit+"; ";
    if(kind == "scroll"){
      cont_css = cont_css + "position: absolute; ";
    }else if(kind=="fixed"){
      cont_css = cont_css + "height: "+cont_p_length+p_unit+"; position: fixed; ";
    }
    cont_css = cont_css + "top: -1"+p_unit+"; left: -1"+p_unit+"; } ";

    var repeat_css = "{} ";
    // content can go in here as user desires.

    p_m = p_m + cont_identifier + cont_name + cont_css;

    if(repeat_name == null){
      p_m = p_m + cont_identifier+cont_name+" > div" + repeat_css;
    }else{
      p_m = p_m + "."+repeat_name+repeat_css;
      // must be a class, not ID
    }

  }
  //////////////////////////////////////////////////////
  // end the containers loop. Style body & wrapper.
  var wrap_css = "{";
  if(no_wrap){
    // let's wrap this shit
    wrap_name = "printjswrapper";
    wrap_identifier = "#";
    var temp_prewrap = $("body").html();
    var temp_postwrap = "<div id='printjswrapper'>"+temp_prewrap+"</div>";
    $("body").html(temp_postwrap);
  }

  wrap_css = wrap_css + "overflow: hidden; width: "+p_width+p_unit+"; ";

  if(kind == "scroll"){
    wrap_css = wrap_css + "";
    // length can be full, go over multiple pages.
  }else if(kind=="fixed"){
    wrap_css = wrap_css + "height: "+p_length+p_unit+"; ";
  }
  wrap_css = wrap_css + "} ";
  p_m = p_m + wrap_identifier+wrap_name+wrap_css;

  p_m = p_m + "body{height: "+p_length+p_unit+"; width: "+p_width+p_unit+"; overflow: hidden;} ";

  //////////////////////////////////////////////////////
  // Finishes the @media print CSS
  var css = $("style").html();
  // when "screen" media left unspecified, @print just writes on top of the normal style
  css = css + "@media print{" + p_m+"} ";
  //css = css + p_m; // for testing purposes only

  if($("style").html() == null){
    // if no <style> tag, e.g. no css or just a linked stylesheet
    $("head").append("<style>"+css+"</style>");
  }else{
    $("style").html(css);
  }

  window.print();
});
