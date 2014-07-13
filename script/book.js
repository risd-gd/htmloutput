/*jshint laxcomma:true, multistr: true */

// THIS HELPS PREP CONTENT FOR THE BOOK FORMAT.

// Block polyfill from running unless we say so.
window.cssRegionsManualTrigger = false;
window.HAS_COMPLETED_ONE_LAYOUT = false;

// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var togglecrop = document.getElementById("togglecrop");
var regionizer = document.getElementById("regionize");
var restyle = document.getElementById("restyle");
var postproc = document.getElementById("postproc");

if (toggler) toggler.addEventListener("click", toggleGuidesAndBleed);
if (togglecrop) togglecrop.addEventListener("click", toggleCropMarks);
if (regionizer) regionizer.addEventListener("click", regionize);
if (restyle) restyle.addEventListener("click", reloadStylesheets);
if (postproc) postproc.addEventListener("click", function(){
  postProcessPages(this);
});


// ==================
// React to checkbox

$(".toc [type=checkbox]").change(function(e){
  var id = this.parentNode.getAttribute("data-toc");
  var elt = document.querySelector('[data-id="' + id + '"]');

  if (!this.checked) {
    this.parentNode.parentNode.classList.add("_wont-print");
    $(elt).nextUntil("[data-id]").andSelf().attr("data-remove-before-print", true);
  }
  else {
    this.parentNode.parentNode.classList.remove("_wont-print");
    $(elt).nextUntil("[data-id]").andSelf().removeAttr("data-remove-before-print");
  }

});
// First lets uncheck them all!
$(".toc [type=checkbox]").attr("checked", false).change();

// -------------------------------------
// Enable UI when we know all images have loaded

imagesLoaded( document.body, function( instance ) {
  if (regionizer) regionizer.removeAttribute("disabled");
});

// -------------------------------------
//
// R E G I O N I Z E R
//
// Load polyfill when we know all images have loaded

function regionize() {

  // First remove the stuff we don't want to print
  $("[data-remove-before-print]").remove();

  // Then preprocess various stuff
  preProcessPages();

  // Remove global class
  document.documentElement.classList.remove("_notsplityet");

  // Hide button and mess with controls
  regionizer.style.display = "none";
  document.getElementById("postProcessControls").style.display = "inline";

  // Begin regionizing
  cssRegions.enablePolyfill();
}

// -------------------------------------

function finallyTheLayoutIsDone() {
  document.body.classList.add("_regions-loaded");
  stat.innerHTML = "Book is ready.";

  HAS_COMPLETED_ONE_LAYOUT = true;

  // window.onbeforeunload = function() {
  //   return "Are you in a hurry? If you leave this page it will need to be rebuilt again. That'll take a minute.";
  // };

  postProcessPages();
  $(".toc [type=checkbox]").replaceWith("&#10005;"); // replaces checkboxes with X
}

var progbar = document.getElementById("progbar");
var stat = document.getElementById("status");
var pages = document.querySelectorAll(".page-outer").length;
function reportPagesLeft(p) {
  var done = pages - p;
  stat.innerHTML = "Building page " + done;
  progbar.value = done / pages;
}


// _________________________

// Pre-process to detect full-spread images and split them in half
// And also a lot of other thing!

// _________________________


function preProcessPages() {

  // [A] Clone image spreads
  var imageSpreads = document.querySelectorAll("[data-imagespread]");
  for (var i = 0; i < imageSpreads.length; i++) {
    var oldNode = imageSpreads[i];
    var src = oldNode.querySelector("img").src;

    var splitImageHtml = ' \
      <div class="_dontpage-break"></div>\
      <div class="_book-spread-l" data-fullbleed>\
        <img src="' + src + '"/>\
      </div>\
      <div class="_book-spread-r" data-fullbleed>\
        <img src="' + src + '"/>\
      </div> \
      <div class="_dontpage-break"></div>';

    $(splitImageHtml).insertAfter(oldNode);
    oldNode.parentNode.removeChild(oldNode);
  }

  // [B] Clone text spreads
  var textSpreads = document.querySelectorAll("[data-textspread]");
  for (var i = 0; i < textSpreads.length; i++) {
    var baseNode = textSpreads[i];

    var pt2 = baseNode.cloneNode(true);
    pt2.setAttribute("data-sideways-part", "2");

    var pt3 = baseNode.cloneNode(true);
    pt3.setAttribute("data-sideways-part", "3");

    $(baseNode).after([
      $('<div class="_page-break"></div>'),
      pt2,
      $('<div class="_page-break"></div>'),
      pt3
    ]);
  }

  // [B] Detect hrefs and insert
  var links = document.querySelectorAll("a[href]");
  if (links) {
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      $("<sup data-footnote='" + href + "'>x</sup>").insertAfter(links[i]);
    }
  }

  // [C] find foonotes, add superscripts
  var footnotes = $("footnote");
  if(footnotes){
    for(var i=0; i< footnotes.length; i++){
      var material = footnotes.eq(i).html(); // this is working!!!
      $("<sup data-footnote='"+material+"'>x</sup>").insertAfter(footnotes.eq(i));
    }
  }

  // [D] Swap GIFs out for fixed PNG version
  // requires there be a .png version of the frame people want in print.
  var num_images = $("img").length;
  for(i=0; i<num_images; i++){
    var src = $("img").eq(i).attr("src");
    var end = src.length;
    var start = end-4;

    if(src.substring(start,end)==".gif" || src.substring(start,end)==".GIF"){
      //alert("WE FOUND ONE LADDY!");
      // swap out PNG extension with fixed frame for printing
      $("img").eq(i).attr("src",src.substring(0,start)+".png");
    }
  }

  // [E] highlight Code
  highlightCode();

}

// _________________________

// Codemirror code highlighting

// _________________________

function highlightCode(){
  var snippets = document.querySelectorAll(".snippet");
  for (var i = 0; i < snippets.length; i++) {
    var snip = snippets[i];
    var ext = snip.getAttribute("data-mode");
    var mode = getMode(ext);
    var txt = snip.value;
    var insertNode = document.createElement("pre");
    insertNode.className = "snippet-ready cm-s-loop-light cm-mode-" + ext;

    $(insertNode).insertAfter(snip);
    $(snip).remove();

    CodeMirror.runMode(txt, mode, insertNode);
  }
  function getMode(ext) {
    if (ext == "html") return "text/html";
    else if (ext == "css") return ext;
    else if (ext == "scss") return "text/x-scss";
    else if (ext == "styl") return "text/x-scss";
    else if (ext == "md") return "text/x-markdown";
    else if (ext == "js") return "javascript";
  };
}

// _________________________

// Post-process to detect bleeds, running heads

// _________________________

function postProcessPages(){

  document.documentElement.classList.add("_bleed-enabled");

  // Persists as we loop through pages
  var head  = ""
    , headUrl = ""
    , pageKind = ""
    , intervName;

  var pages = document.querySelectorAll(".page-inner");
  for (var i = 0; i < pages.length; i++) {
    var pg = pages[i];
    var isRecto = pg.parentNode.classList.contains("_recto") ? true : false;

    // [A] Detect bleeds
    var hasBleeds = pg.querySelector("[data-fullbleed]");
    if (hasBleeds) {
      pg.classList.add("_bleed");
    }

    // [B] If there is an in-page heading designed to trigger a new running head
    var heading = pg.querySelector("[data-change-running-head]");
    var pagekindchange = pg.querySelector("[data-change-page-kind]");

    if (pagekindchange) {
      pageKind = pagekindchange.getAttribute("data-category");
    }

    if (heading) {
      headUrl = heading.getAttribute("data-pageurl");

      // If it was an interview heading, it's a special case
      if (heading.getAttribute("data-category") == "interview") {
        head = heading.getAttribute("data-interviewee") + " & " + heading.getAttribute("data-interviewer");
        intervName = heading.getAttribute("data-interviewee");
      }
      else {
        head = heading.innerText;
      }

      // Add this page to the table of contents
      var id = heading.getAttribute("data-id");
      if (id) {
        var num = pg.parentNode.getAttribute("data-page");
        var tocLine = document.querySelector('.page-inner [data-toc="' + id + '"]');
        if (tocLine) tocLine.innerText = num;
      }
    }

    // [C] Set this page's page kind
    pg.parentNode.setAttribute("data-page-kind", pageKind);
    pg.parentNode.setAttribute("data-page-interv", intervName);

    // [D] Set this page's running head to the current running head
    var runner = pg.parentNode.querySelector("._running-head ._section");
    if (runner) {
      if (!isRecto) {
        runner.innerHTML = "<span>" + head + "</span>";
      }
      else {
        runner.innerHTML = "<span class='_headurl'>" + headUrl + "</span>";
      }
    }

    // [E] Set footnotes... might not be necessary any more.
    //var links = pg.querySelectorAll("[data-href]");
    //if (links) {
    //  var notes = "";
    //  for (var j = 0; j < links.length; j++) {
    //    var href = links[j].getAttribute("data-href");
    //    links[j].innerText = j;
    //    notes += "&rarr; <div><i>"+ j +"</i>&nbsp;"+ href +"</div><br />";
    //
    //  }
    //  pg.parentNode.querySelector("._footer").innerHTML = notes;
    //}

    // [F] Footnotes
    var footnotes = pg.querySelectorAll("[data-footnote]");
    if(footnotes){
      var notes = ""; // don't make this more than 3 lines or so!
      for (var j = 0; j < footnotes.length; j++){
        var material = footnotes[j].getAttribute("data-footnote");
        var temp = material;

        // strip "http://"
        var start = temp.indexOf("://");
        var end = temp.length;
        if(start !== -1){
          start = start + 3;
          temp = temp.substring(start,end);
        }

        // strip "www."
        start = temp.indexOf("www.");
        end = temp.length;
        if(start !== -1){
          start = start + 4;
          temp = temp.substring(start,end);
        }

        footnotes[j].innertext = j; // set footnote number (instead of 'x'), each page starts at 0.
        $("sup[data-footnote='"+material+"']").html(j);
        notes += "&rarr;&nbsp;<i>"+j+"</i>&nbsp;"+temp+"<br />";
      }
      pg.parentNode.querySelector("._footer").innerHTML = notes;
    }

  }

  trimRegions('content-flow');
}

// -------------------------

// Reload CSS

// -------------------------


function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}

// -------------------------

// Toggle guides

// -------------------------

function toggleGuidesAndBleed(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_guides")) {
    document.documentElement.classList.remove("_guides");
  }
  else {
    document.documentElement.classList.add("_guides");
  }
}


function toggleCropMarks(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_cropmarks")) {
    document.documentElement.classList.remove("_cropmarks");
  }
  else {
    document.documentElement.classList.add("_cropmarks");
  }
}


// -------------------------

// TRIM
// --
// Trim extra pages that have no content

// -------------------------

// From:
// http://docs.webplatform.org/wiki/apis/css-regions/NamedFlow/firstEmptyRegionIndex
// deletes any empty regions from the end of a flow:
function trimRegions(flowName) {
    var flow = document.getNamedFlows().namedItem(flowName);
    var index = flow.firstEmptyRegionIndex;
    var regions = flow.getRegions();
    console.log("removed regions from index: " + index);

    if (index == -1) {
      alert("Can't trim extra pages. Wait until page splitting is finished?");
      return(false); // no empty regions?
    }

    // remove first empty region &amp; all thereafter:
    for (var i = index; i < regions.length; i++) {
        regions[i].parentNode.parentNode.removeChild(regions[i].parentNode);
    }
    // alert("Trimmed to " + index + " pages");
    return(true);
}

// -------------------------

// URL STYLING

// -------------------------
/*
var num_links = $("a").length;

for(i=0; i<num_links; i++){

  var temp = $("a").eq(i).html();
  var url = $("a").eq(i).attr("href");

  // strip "http://"
  var start = url.indexOf("://");
  var end = url.length;
  if(start !== -1){
    start = start + 3;
    url = url.substring(start,end);
  }

  // strip "www."
  start = url.indexOf("www.");
  end = url.length;
  if(start !== -1){
    start = start + 4;
    url = url.substring(start,end);
  }

  //var rot = Math.floor(Math.random()*360);

  //$("a").eq(i).html("<span style='-webkit-transform: rotate("+rot+"deg)' class='url'>"+url+"</span>"+temp);

}
*/
