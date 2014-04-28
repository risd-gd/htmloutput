// ---------------
// User interface

var toggler = document.getElementById("toggleguides");
var trimmer = document.getElementById("trimpages");
var bleeder = document.getElementById("fixbleeds");

toggler.addEventListener("click", toggleprint);
trimmer.addEventListener("click", function(){
  trimRegions(this, 'content-flow')
});
bleeder.addEventListener("click", function(){
  allowBleeds(this, 'content-flow')
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

function allowBleeds(btn, flowName) {
  var flow = document.getNamedFlows().namedItem(flowName);
  var spreads = document.querySelectorAll("._fullbleed");

  document.documentElement.classList.add("_bleed-enabled")
  btn.setAttribute("disabled", true);

  console.log(spreads);
  for (var i = 0; i < 1; i++) {
    var regions = flow.getRegionsByContent(spreads[i]);
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
function trimRegions(btn, flowName) {
    var flow = document.getNamedFlows().namedItem(flowName);
    var index = flow.firstEmptyRegionIndex;
    var regions = flow.getRegions();
    console.log("removed regions from index: " + index);

    if (index == -1) {
      alert("Can't. Wait until page splitting is finished?");
      return(false); // no empty regions?
    }
    else {
    	btn.setAttribute("disabled", true);
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
  var num_links = $("a").length;

  for(i=0; i<num_links; i++){

    var url = $("a").eq(i).attr("href");

    var page_num = $("a").eq(i).closest(".page-outer").html();
    alert(page_num);

    //$("footnotes").eq(i).append("["+i+"] " + url + " <br />");

  }

});

