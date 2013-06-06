$(function(){

    function getPos(el){
        for(var lx=0, ly=0;
            el != null;
            lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return {x: lx, y:ly};
    }
    
    /*
     *                Page
     *    +---------------------------+   |                +
     *    |                           |   |                |  headerHeight
     *    |                           |   |                |
     *    |   +-------------------+   |   |  scrollY       +
     *    |   |                   |   |   v                |
     *    +---+-------------------+---+   +                |  imageHeight   +
     *    |   |                   |   |   |                |                |  frameOffset
     *    |   +-------------------+   |   |                +                +     
     *    |   |                   |   |   |
     *    |   |     curFrame      |   |   |  screenHeight
     *    |   |                   |   |   |
     *    |   +-------------------+   |   |
     *    |   |                   |   |   |
     *    |   |                   |   |   |
     *    +---+-------------------+---+   +
     *    |   +-------------------+   |                    +
     *    |                           |                    |  footerHeight
     *    |                           |                    |
     *    +---------------------------+                    +
     *
     */

    var images = $('.image');
    function getImageHeight(){
        return $(images[0]).outerHeight(true);
    }
    function getHeaderHeight(){
        return getPos(images[0]).y;
    }
    
    function getFrameIndex(){
        var y = scrollY - getHeaderHeight();
        return Math.floor(y/getImageHeight());
    }

    function getFrameOffset(){
        return getFrameIndex()*getImageHeight() - scrollY;
    }

    var playstate = 'paused';

    function goToFrame(index){
        scrollTo(scrollX,getHeaderHeight() + getImageHeight() * index - getFrameOffset());
    }
        
    function nextFrame(){
        var screenHeight = $(window).height();
        var pageHeight = $(document).height();
        var imageHeight = getImageHeight();
        console.log(imageHeight);
        if(scrollY + screenHeight + imageHeight > pageHeight){
            //goToFrame(0); not working yet
            scrollTo(scrollX,0);
        }else{
            scrollTo(scrollX,scrollY + imageHeight);
        }
    }

    function prevFrame(){
        var screenHeight = $(window).height();
        var pageHeight = $(document).height();
        var imageHeight = getImageHeight();
        if(scrollY === 0){
            //goToFrame(images.length - 1);
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
            }else if(event.which === 2){
                prevFrame();
                event.preventDefault();
            }
        }else{
            pause();
        }
    });
});
