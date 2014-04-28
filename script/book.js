// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var trimmer = document.getElementById("trimpages");

toggler.addEventListener("click", toggleprint);
trimmer.addEventListener("click", function(){
  trimRegions('content-flow')
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
  // TODO
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
    var pg_num = $("a").eq(i).parent().attr("data-page"); //.parent().data("page");
    alert(pg_num);
    //$("footnotes").eq(pg_num-1).append("["+i+"] " + url + " <br />");
  }
});


