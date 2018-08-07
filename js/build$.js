'use strict';

console.log('Hi');

function init() {

    setTimeout(function(){
        // $('h1').innerHTML = 'Baba';
        $('h1').html('Hi There');
    }, 1500)

    // setTimeout(function(){
    //     $('h1').hide();
    // }, 3000)

}


function doAnimate() {
    console.log('ANimating');

    $('h1').doAnimate();
    
}

function $(selector) {
    var el = document.querySelector(selector);
    var wrapper = {};
    wrapper.doAnimate = function() {
        el.classList.add('animated', 'rubberBand')
 
         setTimeout(function(){
             el.classList.remove('animated', 'rubberBand')
             
         }, 1000)     
    }

    wrapper.html = function(strHtml) {
        el.innerHTML = strHtml;
    }

    wrapper.show = function() {
        el.style.display = 'block';
    }
    wrapper.hide = function() {
        el.style.display = 'none';
    }

    return wrapper;
}