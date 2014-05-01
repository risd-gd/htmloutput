// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var regionizer = document.getElementById("regionize");
// var trimmer = document.getElementById("trimpages");
// var bleeder = document.getElementById("fixbleeds");
// var postproc = document.getElementById("postproc");

if (toggler) toggler.addEventListener("click", toggleprint);
if (regionizer) regionizer.addEventListener("click", regionize);
// if(trimmer) trimmer.addEventListener("click", function(){
//   trimRegions(this, 'content-flow')
// });
// if (bleeder) bleeder.addEventListener("click", function(){
//   allowBleeds(this, 'content-flow')
// });
// if (postproc) postproc.addEventListener("click", function(){
//   postProcessPages(this);
// });





// ==================
// First scroll to top. 

window.scrollTo(0,0);

// Then block polyfill from running unless we say so.

window.cssRegionsManualTrigger = false;

// ---------------
// Load polyfill when we know all images have loaded

imagesLoaded( document.body, function( instance ) {
  regionizer.removeAttribute("disabled");
});

function regionize() {
  cssRegions.enablePolyfill();
  regionizer.style.display = "none";
  document.getElementById("status").style.display = "inline";
}


var HAS_COMPLETED_ONE_LAYOUT = false;

function finallyTheLayoutIsDone() {
  document.body.classList.add("_regions-loaded");
  document.getElementById("status").innerHTML = "Book is ready.";

  HAS_COMPLETED_ONE_LAYOUT = true;

  postProcessPages();
}

var progbar = document.getElementById("progbar");
var pages = document.querySelectorAll(".page-outer").length;
function reportPagesLeft(p) {
  var done = pages - p;
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
}

preProcessPages();





// _________________________

// Post-process to detect bleeds, running heads

// _________________________

function postProcessPages(){

  document.documentElement.classList.add("_bleed-enabled")

  // Persists as we loop through pages
  var head = "";

  var pages = document.querySelectorAll(".page-inner");
  for (var i = 0; i < pages.length; i++) {
    var pg = pages[i];

    // Detect bleeds
    var hasBleeds = pg.querySelector("[data-fullbleed]");
    if (hasBleeds) {
      pg.classList.add("_bleed");
    }

    // If there is an in-page heading designed to trigger a new running head
    var heading = pg.querySelector("[data-change-running-head]");
    if (heading) {
      // If it was an interview heading, it's a special case
      if (heading.getAttribute("data-category") == "interview") {
        head = heading.getAttribute("data-interviewee") + " & " + heading.getAttribute("data-interviewer");
      }
      else {
        head = heading.innerText;
      }
    }

    // Set this page's running head to the current running head
    var runner = pg.parentNode.querySelector("._running-head ._section");
    if (runner) runner.innerText = head;
  }

  trimRegions('content-flow');
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

// ENABLE BLEED
// --
// Remove margins of any region
// that is part of a full-bleed
// image spread

// -------------------------

// function allowBleeds(btn, flowName) {
//   var flow = document.getNamedFlows().namedItem(flowName);
//   var spreads = document.querySelectorAll("._fullbleed");

//   document.documentElement.classList.add("_bleed-enabled")
//   btn.setAttribute("disabled", true);

//   console.log(spreads);
//   for (var i = 0; i < 2; i++) {
//     var regions = flow.getRegionsByContent(spreads[i]);
//     console.log(regions);
//     for (var j = 0; j < regions.length; j++) {
//       if (regions[j]) {
//         regions[j].classList.add("_bleed");
//       }
//     }
//   }
// }

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

// Endnotes
var num_links = $("a").length;

for(i=0; i<num_links; i++){

  var temp = $("a").eq(i).html();
  var url = $("a").eq(i).attr("href");
  $("a").eq(i).html(temp+" <span class='url'>["+url+"]</span>");

}


