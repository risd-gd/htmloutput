// Block polyfill from running unless we say so.
window.cssRegionsManualTrigger = false;
window.HAS_COMPLETED_ONE_LAYOUT = false;

// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var regionizer = document.getElementById("regionize");
var restyle = document.getElementById("restyle");
var postproc = document.getElementById("postproc");

if (toggler) toggler.addEventListener("click", toggleprint);
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
    $(elt).nextUntil("[data-id]").andSelf().attr("data-remove-before-print", true);
  }
  else {
    $(elt).nextUntil("[data-id]").andSelf().removeAttr("data-remove-before-print");
  }

});
// First lets uncheck them all!
$(".toc [type=checkbox]").attr("checked", false).change();;

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

  window.onbeforeunload = function() {
    return "Are you in a hurry? If you leave this page it will need to be rebuilt again. That'll take a minute.";
  }

  postProcessPages();
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

// _________________________


function preProcessPages() {


  var imageSpreads = document.querySelectorAll("[data-imagespread]");
  for (var i = 0; i < imageSpreads.length; i++) {
    var oldNode = imageSpreads[i];
    var src = oldNode.querySelector("img").src;

    var splitImageHtml = ' \
      <div class="_page-break"></div>\
      <div class="_book-spread-l" data-fullbleed>\
        <img src="' + src + '"/>\
      </div>\
      <div class="_book-spread-r" data-fullbleed>\
        <img src="' + src + '"/>\
      </div> ';

    $(splitImageHtml).insertAfter(oldNode);
    oldNode.parentNode.removeChild(oldNode);
  }

  // [B] Detect hrefs and insert
  var links = document.querySelectorAll("a[href]");
  if (links) {
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      $("<sup data-href='" + href + "'>x</sup>").insertAfter(links[i]);
    }
  }


}




// _________________________

// Post-process to detect bleeds, running heads

// _________________________

function postProcessPages(){

  document.documentElement.classList.add("_bleed-enabled")

  // Persists as we loop through pages
  var head  = ""
    , pageKind = "";

  var pages = document.querySelectorAll(".page-inner");
  for (var i = 0; i < pages.length; i++) {
    var pg = pages[i];

    // [A] Detect bleeds
    var hasBleeds = pg.querySelector("[data-fullbleed]");
    if (hasBleeds) {
      pg.classList.add("_bleed");
    }

    // [B] If there is an in-page heading designed to trigger a new running head
    var heading = pg.querySelector("[data-change-running-head]");
    var pagekindchange = pg.querySelector("[data-change-page-kind]");
    if (heading) {
      // If it was an interview heading, it's a special case
      if (heading.getAttribute("data-category") == "interview") {
        head = heading.getAttribute("data-interviewee") + " & " + heading.getAttribute("data-interviewer");
        pageKind = heading.getAttribute("data-interviewee");
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
    else if (pagekindchange) {
      pageKind = pagekindchange.getAttribute("data-change-page-kind");
    }

    // [C] Set this page's page kind
    pg.parentNode.setAttribute("data-page-kind", pageKind);

    // [D] Set this page's running head to the current running head
    var runner = pg.parentNode.querySelector("._running-head ._section");
    if (runner) runner.innerHTML = "<span>" + head + "</span>";


    // [E] Set footnotes
    var links = pg.querySelectorAll("[data-href]");
    if (links) {
      var notes = "";
      for (var j = 0; j < links.length; j++) {
        var href = links[j].getAttribute("data-href");
        links[j].innerText = j;
        notes += "<div><i>"+ j +"</i> — "+ href +"</div>";

        //var temp = $("a").eq(j).html();
        //$("a").eq(j).html(temp + "<span class='url'>["+j+"] "+href+"</span>");

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

function toggleprint(e) {
  // e.preventDefault();
  if (document.documentElement.classList.contains("_guides")) {
    document.documentElement.classList.remove("_guides");
  }
  else {
    document.documentElement.classList.add("_guides");
  }
};


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

// URLs in Book
var num_links = $("a").length;

for(i=0; i<num_links; i++){

  var temp = $("a").eq(i).html();
  var url = $("a").eq(i).attr("href");

  // strip "http://"
  var start = url.indexOf("://") + 3;
  var end = url.length;
  if(start !== -1){
    url = url.substring(start,end);
  }



  $("a").eq(i).html(temp + "<span class='url'>"+url+"</span>");

}


