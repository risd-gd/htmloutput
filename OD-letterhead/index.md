---

layout: page
title: Ojus Letterhead Experiment
description: cool jquery rando letters
category: project

---
<link rel="stylesheet" href="css/main.css">

<div class="letter-margins">

            <div class="letter-main">
                <div class="top">
                    <p>Title</br>
                        Organization</br>
                        Address</br>
                        City, State, Zip Code</p>

                </div>

                <div class="text">

                    <p>Dear Mr./Ms. Last Name:</p>

                    <p>I am interested in the assistant position advertised in XXX. I am currently employed as Legislative Director for Assemblywoman XXXX, Chairperson of the NYS Assembly XXX. I accepted this position because of the emphasis on the writing and research skills which are applicable to your requirements for an author’s assistant. My experience in the NYS Assembly has afforded me the opportunity to become familiar with the consolidated and unconsolidated laws of the State of New York. I also have extensive experience in legal and policy research.</p>

                    <p>In my position as Legislative Director for Ms. XXX, I prepare her personal legislation which deals with issues relative to her position as Senior Member of the NYS Assembly Standing Committee on XXXX. In as much as she is Chairperson of the XXX Committee I am, of course, heavily involved in the current welfare and Medicaid reform movement.</p>

                    <p>In response to your search for an assistant, I believe my experience in the Legislature, and my research and writing skills qualify me for consideration. If you would like, I can provide you with current samples of my work.</p>

                    <p>To further acquaint you with the specifics of my background I am enclosing my resume. I hope you will consider me for this position. I look forward to meeting with you and discussing my qualifications in more detail.</p>

                

                    <p>Sincerely,</br>
                    Ojus Doshi</p>

                </div>

                <div class="footer">
                    <p>ojusdoshi.com | @yoshi22g | 717-574-1894 | ojus.doshi@gmail.com</p>
                </div>
            </div>

        </div>
<script src="js/jquery-2.1.0.min.js"></script>
<script>

            //////////////////////////////////////////////////////
            var quasi_random = function(index,base){
                // HALTON SEQUENCE CODE TAKEN FROM WIKIPEDIA LOL
                var f = 1/base;
                var i = index;
                var result = 0;
                while(i > 0){
                    result = result + f*(i%base);
                    i = Math.floor(i/base);
                    f = f/base;
                }
                return result;
            }

            //////////////////////////////////////////////////////
            var random_color = function(){
                var num = Math.random()*16;
                //return "random color element of hex code";

                if(0 <= num && num < 1){
                    return "0";
                }else if(1 <= num && num < 2){
                    return "1";
                }else if(2 <= num && num < 3){
                    return "2";
                }else if(3 <= num && num < 4){
                    return "3";
                }else if(4 <= num && num < 5){
                    return "4";
                }else if(5 <= num && num < 6){
                    return "5";
                }else if(6 <= num && num < 7){
                    return "6";
                }else if(7 <= num && num < 8){
                    return "7";
                }else if(8 <= num && num < 9){
                    return "8";
                }else if(9 <= num && num < 10){
                    return "9";
                }else if(10 <= num && num < 11){
                    return "a";
                }else if(11 <= num && num < 12){
                    return "b";
                }else if(12 <= num && num < 13){
                    return "c";
                }else if(13 <= num && num < 14){
                    return "d";
                }else if(14 <= num && num < 15){
                    return "e";
                }else if(15 <= num && num < 16){
                    return "f";
                }
            }

            //////////////////////////////////////////////////////

            var random_size = function(){
                return Math.round(Math.random()*100+10);
            }

            //////////////////////////////////////////////////////

            var random_rotation = function(){
                return Math.floor(Math.random()*360);
            }

            //////////////////////////////////////////////////////

            var random_skew = function() {
                return Math.floor(Math.random()*360);
            }

            //////////////////////////////////////////////////////

            var random_margins = function(){
                var margins = [];
                margins[0] = Math.floor(Math.random()*110 - 10);
                margins[1] = Math.floor(Math.random()*110 - 10);
                // the idea is for them to be in percents
                return margins;
            }

            //////////////////////////////////////////////////////

            var random_div = function(){
                var n_divs = 10;
                return Math.floor(Math.random()*n_divs);
            }

            //////////////////////////////////////////////////////

            $(document).ready(function(){
                var win_w = $(window).width();
                var win_h = $(window).height();

                var words_n_stuff = $(".letter-main").text();
                var n_letters = words_n_stuff.length;

                var new_html = "";
                for(var j = 0; j < n_letters; j++){
                    new_html = new_html + "<span>"+words_n_stuff.substr(j,1)+"</span>";
                    // Wraps each letter in <span> </span>
                }

                $(".letter-margins").append(new_html);

                var n_spans = $("span").length;
                for(var i = 0; i < n_spans; i++){

                    var x = Math.floor(Math.random()*win_w);
                    var y = Math.floor(Math.random()*win_h);

                    $("span").eq(i).css("top",y+"px");
                    $("span").eq(i).css("left",x+"px");
                    $("span").eq(i).css("-webkit-transform", "rotate(" + random_rotation() + "deg) skew(" + random_skew() + "deg)" );
                    $("span").eq(i).css("-moz-transform", "rotate(" + random_rotation() + "deg) skew(" + random_skew() + "deg)" );
                    $("span").eq(i).css("transform", "rotate(" + random_rotation() + "deg) skew(" + random_skew() + "deg)" );
                    $("span").eq(i).css("color","#"+random_color()+random_color()+random_color());
                    $("span").eq(i).css("font-size",random_size()+"pt");
                    $("span").eq(i).css("margin",random_margins()+"px");
                }
            });

        
</script>

        