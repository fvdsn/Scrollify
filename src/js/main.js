$(function(){
    function getPos(el){
        for(var lx=0, ly=0;
            el != null;
            lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return {x: lx, y:ly};
    }
    window.getPos = getPos;
    
    window.images = $('.image');

    var imageHeight = $(images[0]).outerHeight(true);
    var topImagePos = getPos(images[0]);

    function getImagePos(index){
        return topImagePos + (index * imageHeight);
    }

    var playstate = 'paused';

    function nextFrame(){
        var screenHeight = $(window).height();
        var pageHeight = $(document).height();
        if(scrollY + screenHeight + imageHeight > pageHeight){
            scrollTo(scrollX,0);
        }else{
            scrollTo(scrollX,scrollY + imageHeight);
        }
    }
    function prevFrame(){
        var screenHeight = $(window).height();
        var pageHeight = $(document).height();
        if(scrollY === 0){
            scrollTo(scrollX,pageHeight - imageHeight);
        }else{
            scrollTo(scrollX,scrollY - imageHeight);
        }
    }
    
    function animation(){
        if(playstate == 'playing'){
            nextFrame();
            setTimeout(function(){
                requestAnimationFrame(animation);
            },130);
        }
    };
    function play(){
        playstate = 'playing';
        animation();
    }
    function pause(){
        playstate = 'paused';
    }
    function stop(){
        playstate = 'paused';
        requestAnimationFrame(function(){scrollTo(scrollX,0)});
    }
    window.play = play;
    window.pause = pause;
    window.stop = stop;

    $('.js-play').click(function(){ 
        if( playstate === 'paused'){ 
            play();
        }else{
            pause();
        }
    });
    $('.js-stop').click(stop);
    $('.image').mousedown(function(event){
        if(playstate === 'paused'){
            if(event.which === 1){
                nextFrame();
            }else{
                prevFrame();
                event.preventDefault();
            }
        }else{
            pause();
        }
    });
});
