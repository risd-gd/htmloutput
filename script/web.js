$(document).ready(function(){

  highlightCode();

});

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