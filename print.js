$('document').ready(function(){

  // The gist is to make a print-ready CSS file that gets slipped into the head.

  // Initially for 11x17 prints. Assigns 2cm margins, 300 px/inch
  // 1cm = 118 pixels; 1cm = 28.3 points; 1cm = 2.36 picas
  // Lukas WinklerPrins
  // Updated 7 April 2014

  var reset = "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var,b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {	margin: 0; 	padding: 0; 	border: 0; 	font-size: 100%; 	font: inherit; 	vertical-align: baseline; }/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {	display: block;} body {	line-height: 1;} ol, ul {	list-style: none;} blockquote, q {	quotes: none;} blockquote:before, blockquote:after, q:before, q:after {	content: ''; 	content: none; } table {	border-collapse: collapse; 	border-spacing: 0; }";

  var p_width = 8.5;
  var p_length = 11;
  var p_unit = "in";

  var p_m = "";
  // this will be the string we add all styling to.

  var ok_structure = 1;

  //////////////////////////////////////////////////////
  // Check for a container/wrapper of the entire document
  var wrap_name = $("body > div").eq(0).attr('id');
  var wrap_identifier = "#";
  if(wrap_name == null){
    wrap_name = $("body > div").eq(0).attr('class');
    wrap_identifier = ".";
  }
  if(wrap_name != 'container' && wrap_name != 'wrapper'){
    wrap_name = "body";
    wrap_identifier = "";
  }
  //////////////////////////////////////////////////////

  //////////////////////////////////////////////////////
  var num_cont = $(wrap_identifier+wrap_name+" > div").length;
  //alert("There are "+parseInt(num_cont)+" container divs.");

  for(var i = 0; i < num_cont; i++){

    var cont_identifier = "#"; // Start by assuming the first div on the pattern repeat page is a lil container
    var cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('id');

    if(cont_name == null){
      cont_identifier = ".";
      cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('class');
      if(cont_name == null){
        // still! Just unadorned <div> then
        cont_name = "";
        cont_identifier = wrap_identifier+wrap_name+" div:eq("+i+") > ";

      }else if(0){
        //alert("Please make sure your pattern begins with a container-style div");
        alert("Your document structure might not match print.js' needs.");
        cont_name = null;
        ok_structure = 0;
      }
    }

    // assumes all lil repeated nuggets are just divs or share the same class
    var num_repeat = 0;
    var repeat_name = "";

    repeat_name = $(cont_identifier+cont_name+" > div").eq(0).attr("class"); // class because they're repeats obvi nubcake

    if(repeat_name == null){
      num_repeat = $(cont_identifier+cont_name+" div").length;
      // repeats just unnamed divs
    }else{
      num_repeat = $(cont_identifier+cont_name+" div."+repeat_name).length;
    }
    //alert("There are "+parseInt(num_repeat)+" repeats named "+repeat_name+" in the container "+cont_name+", one of "+num_cont+" containers.");

    //////////////////////////////////////////////////////

    var cont_css = "{width: "+p_width+p_unit+"; height: "+p_length+p_unit+";} ";
    var repeat_css = "{} ";
    p_m = p_m + cont_identifier + cont_name + cont_css;
    if(repeat_name == null){
      p_m = p_m + cont_identifier+cont_name+" > div" + repeat_css;
    }else{
      p_m = p_m + "."+repeat_name+repeat_css;
    }

  }
  //////////////////////////////////////////////////////
  // end the containers loop

  p_m = p_m + "body{background-color: transparent; overflow: hidden; } ";
  p_m = p_m + wrap_name+"{overflow: hidden; width: 4in; } ";

  //////////////////////////////////////////////////////
  // END STUFF—finishes the @media print CSS thingy, assuming all existinc CSS is for screen (could use a check)
  var css = $("style").html();
  // when "screen" media left unspecified, @print just overrules inherited stuff ! good good.
  css = css + "@media print{" + p_m+"}"; // consider adding "reset" ... ? Probably dangerous.
  //css = css + '@page{margin: 2pc; @top-center{content: "hi this is at the top  center";}} '; // thiiiiiiis (@page) doesn't work.

  if($("style").html() == null){
    // if no <style> tag
    $("head").append("<style>"+css+"</style>");
  }else{
    $("style").html(css);
  }


  //$('head').append('<link rel="stylesheet" href="URL to your print.css" type="text/css" media="print" />')
  //$('head').append('<style>'+p_m+'</style>'); // would overrule normal <style> tag

  //window.print();
});

// to add: ///////////////////////////////////////////////////////////////////////
// CHECK looping for multiple containers
// CHECK container wrapping—fix to 11x17 size, now via body
// options for "chunking" vs "overlapping"
// CHECK ouble check .html() command
// CHECK (kinda) convert to picas/points...
// center the material in the page ?
// CHECK accomodate for no existing <style> tag, i.e. external stylesheet
// span, h1, h2, h3 ... cases instead of div
// NOPE turning images off?
// CHECK collab with cathland
// NOPE adjust print output to browser window size ???
// multiple media formats
// CHECK look for total wrapper
// do something with # of repeats (page structuring ...?)
