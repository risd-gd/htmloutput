/*jshint laxcomma:true, multistr: true */

//
// B I N D E R Y . J S
//
// version 0.2
// Evan Brooks 2014
//
// Depends on a custom version of 
//
// Developed through the course HTML Output,
// taught by John Caserta at RISD in Spring 2014.
//
// ----------------------------------------------



// Block polyfill from beginning to run automatically
window.cssRegionsManualTrigger = false;

// Block polyfill from running another time
// after completing a full layout.
// (because our polyfill is listening to
// all sorts of resize events)
window.HAS_COMPLETED_ONE_LAYOUT = false;


(function() {
  var Bindery = function() {

    // Allows user to add various passes
    // without worrying about all the outher stuff.
    this.preBindFuncs = [];
    this.postBindFuncs = [];

    // A beforeBind function receives as an argument
    // the DOM Node for the content flow and makes
    // whatever changes it wants
    this.beforeBind = function(preProc) {
      this.preBindFuncs.push(preProc);
    }

    // An afterBind function receives as an argument
    // both the DOM Node for each page in turn,
    // and a global 'state' object.
    // the state object is shared among
    // all of the afterBind functions so they (could)
    // conceivably communicate.
    //
    // Really the only reason to support separate afterBind
    // functions is for the sake of organization in the hopes
    // of some future modularity...
    //
    // afterBind functions change sizes/etc at
    // their own risk because the pages will not
    // reflow a second time.
    //
    this.afterBind = function(postProc) {
      this.postBindFuncs.push(postProc);
    }


    this.bind = function() {
      for (var i = 0; i < this.preBindFuncs.length; i++) {
        this.preBindFuncs[i]();
      }
    }

    this.bindComplete = function() {

      HAS_COMPLETED_ONE_LAYOUT = true;

      document.documentElement.classList.add("_bleed-enabled");
      document.body.classList.add("_regions-loaded");
      stat.innerHTML = "Book is ready.";

      // Feed each page through all postBind functions...
      var state = {
        head: "",
        headUrl: "",
        pageKind: "",
        intervName: "",
      };

      var pages = document.querySelectorAll(".page-inner");

      for (var i = 0; i < pages.length; i++) {
        for (var j = 0; j < this.postBindFuncs.length; j++) {
          this.postBindFuncs[j](pages[i], state);
        }
      }

      // Trim unused pages from the end
      trimRegions('content-flow');
    }

  }

  // Export Bindery object
  window.Bindery = new Bindery();
})();



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

// Post-process to detect bleeds, running heads

// _________________________

function postProcessPages(){

  document.documentElement.classList.add("_bleed-enabled");

  // Persists as we loop through pages
  // var head  = ""
  //   , headUrl = ""
  //   , pageKind = ""
  //   , intervName;

  // var pages = document.querySelectorAll(".page-inner");
  // for (var i = 0; i < pages.length; i++) {
  //   var pg = pages[i];
  //   var isRecto = pg.parentNode.classList.contains("_recto") ? true : false;

  //   // [A] Detect bleeds
  //   var hasBleeds = pg.querySelector("[data-fullbleed]");
  //   if (hasBleeds) {
  //     pg.classList.add("_bleed");
  //   }

  //   // [B] If there is an in-page heading designed to trigger a new running head
  //   var heading = pg.querySelector("[data-change-running-head]");
  //   var pagekindchange = pg.querySelector("[data-change-page-kind]");

  //   if (pagekindchange) {
  //     pageKind = pagekindchange.getAttribute("data-category");
  //   }

  //   if (heading) {
  //     headUrl = heading.getAttribute("data-pageurl");

  //     // If it was an interview heading, it's a special case
  //     if (heading.getAttribute("data-category") == "interview") {
  //       head = heading.getAttribute("data-interviewee") + " & " + heading.getAttribute("data-interviewer");
  //       intervName = heading.getAttribute("data-interviewee");
  //     }
  //     else {
  //       head = heading.innerText;
  //     }

  //     // Add this page to the table of contents
  //     var id = heading.getAttribute("data-id");
  //     if (id) {
  //       var num = pg.parentNode.getAttribute("data-page");
  //       var tocLine = document.querySelector('.page-inner [data-toc="' + id + '"]');
  //       if (tocLine) tocLine.innerText = num;
  //     }
  //   }

  //   // [C] Set this page's page kind
  //   pg.parentNode.setAttribute("data-page-kind", pageKind);
  //   pg.parentNode.setAttribute("data-page-interv", intervName);

  //   // [D] Set this page's running head to the current running head
  //   var runner = pg.parentNode.querySelector("._running-head ._section");
  //   if (runner) {
  //     if (!isRecto) {
  //       runner.innerHTML = "<span>" + head + "</span>";
  //     }
  //     else {
  //       runner.innerHTML = "<span class='_headurl'>" + headUrl + "</span>";
  //     }
  //   }

  //   // [F] Footnotes
  //   var footnotes = pg.querySelectorAll("[data-footnote]");
  //   if(footnotes){
  //     var notes = ""; // don't make this more than 3 lines or so!
  //     for (var j = 0; j < footnotes.length; j++){
  //       var material = footnotes[j].getAttribute("data-footnote");
  //       var temp = material;

  //       // strip "http://"
  //       var start = temp.indexOf("://");
  //       var end = temp.length;
  //       if(start !== -1){
  //         start = start + 3;
  //         temp = temp.substring(start,end);
  //       }

  //       // strip "www."
  //       start = temp.indexOf("www.");
  //       end = temp.length;
  //       if(start !== -1){
  //         start = start + 4;
  //         temp = temp.substring(start,end);
  //       }

  //       footnotes[j].innertext = j; // set footnote number (instead of 'x'), each page starts at 0.
  //       $("sup[data-footnote='"+material+"']").html(j);
  //       notes += "&rarr;&nbsp;<i>"+j+"</i>&nbsp;"+temp+"<br />";
  //     }
  //     pg.parentNode.querySelector("._footer").innerHTML = notes;
  //   }

  //   $(".toc [type=checkbox]").replaceWith("&#10005;"); // replaces checkboxes with X

  // }
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
