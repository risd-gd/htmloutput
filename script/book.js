// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var trimmer = document.getElementById("trimpages");
var bleeder = document.getElementById("fixbleeds");

toggler.addEventListener("click", toggleprint);
trimmer.addEventListener("click", function(){
  trimRegions('content-flow')
});
bleeder.addEventListener("click", function(){
  allowBleeds('content-flow')
});

// -------------------------

// Toggle guides

// -------------------------

function toggleprint(e) {
  e.preventDefault();
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

function allowBleeds(flowName) {
  var flow = document.getNamedFlows().namedItem(flowName);
  var bleeders = document.querySelectorAll("._fullbleed");

  document.documentElement.classList.add("_bleed-enabled")

  console.log(bleeders);
  for (var i = 0; i < 1; i++) {
    var regions = flow.getRegionsByContent(bleeders[i]);
    console.log(regions);
    for (var j = 0; j < regions.length; j++) {
      if (regions[j]) {
        regions[j].classList.add("_bleed");
      }
    }
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
      alert("Can't. Wait until page splitting is finished?");
      return(false); // no empty regions?
    }
    // remove first empty region &amp; all thereafter:
    for (var i = index; i < regions.length; i++) {
        regions[i].parentNode.parentNode.removeChild(regions[i].parentNode);
    }
    alert("Trimmed to " + index + " pages");
    return(true);
}

// Create Footnotes of hyperlink URLs
$(document).ready(function(){
  var num_links = $("a").length; // to be the number of footnotes
  for(i=0; i<num_links; i++){
    var url = $("a").eq(i).attr("href");
    var page_outer = $("a").eq(i).parents(".page-outer").index();

    alert("are footnotes working? answer: " + page_outer);
    //$("footnotes").eq(pg_num-1).append("["+i+"] " + url + " <br />");
  }
});


