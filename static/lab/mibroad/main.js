$(document).on("click", "a[smoothscroll]", function() {
    if( this.origin + this.pathname != location.origin + location.pathname ) return true;
    var target = $(this.hash);
    if( target.length != 1 ) return true;

    var time = this.getAttribute("smoothscroll")/1,
        offset = target.offset().top;
    if( Math.floor( offset ) === document.body.scrollTop ) return true;
    if( time == "" ) time = 500;

    $("html, body").animate({scrollTop:offset}, time, "swing");
});
$("#about").waypoint(function(direction) {
    if( direction != "down" ) return true;
    var footer = $("#about .card-footer");
    if( !footer.hasClass("opacity") ) return true;
    setTimeout( function() {$("#about .card-footer").removeClass("opacity")}, 500)
}, { offset: "50%" });
$(".about-icon").waypoint(function(direction) {
    if( direction != "down" ) return true;
    var time = 0, delta = 200;
    $(".about-icon ul a").each(function() {
        var anchor = $(this);
        if( !anchor.hasClass("opacity") ) return true;
        setTimeout( function() {anchor.removeClass("opacity")}, time = time+delta );
    });
}, { offset: "50%" });
$(".team-icon").waypoint(function(direction) {
    if( direction != "down" ) return true;
    var timer = [300, 100, 100, 300, 300, 100, 100, 300];
    $(".team-icon ul a").each(function(seq) {
        var anchor = $(this);
        if( !anchor.hasClass("paused") ) return true;
        setTimeout( function() {anchor.removeClass("paused")}, timer[seq] );
    })
}, { offset: "50%" })
$("footer .description").waypoint(function(direction) {
    if( direction != "down" ) return true;
    $(".chart i").each(function() {
        var counter = $(this), count = counter.data("counter");
        if(counter.hasClass("animated")) return true;

        counter.countTo({
            from: 0,
            to: count,
            speed: 2000,
            refreshInterval: 100,
            onComplete: function() {$(this).addClass("animated")}
        })
        // 把 SVG 当 Canvas 使真是罪过
        var timer = 0, delta = 10, colors =["#7c94be", "#ff895b", "#ffe349", "#00cc0a", "#78c8e6"], angel = [50, 90, 40, 30, 150];
        var animated = setInterval(function() {
            var s = new svg(105, 105);
            timer += delta;
            if( timer === 100 ) clearInterval( animated );
            var angels = [];
            angel.reduce(function(a,b){
                angels.push({start:a, end:a+b*timer/100});
                return a+b;
            }, 0);
            angels.forEach(function(angel, seq){
                s.appendCircleArc({cx:52.5,cy:52.5,r:47.5}, angel, {fill:"none", stroke: colors[seq], strokeWidth:5});
            }); 
            s.renderTo( counter.prev()[0] )
        }, 100);
    })
    $("footer .contact li").hover(
        function() { $(this).removeClass("paused")},
        function() { $(this).addClass("paused")}
    );
    $("footer .qrcode.paused").removeClass("paused");
}, { offset: "50%" });
$("#case .case-icon").sliphover({
    fontColor: "#FFF",
    backgroundColor: "rgba(219,33,76,0.7)"
});

$(function() {
    function flipper(e) {
        var target = $(e.target);
        if( !target.hasClass("quickFlip") ) target = target.parent();
        target.quickFlipper();
    }    
    $('.quickFlip').quickFlip();
    $('.quickFlip').hover(flipper, flipper);
});

/** Loader Page */
$(document).ready(function() {
    $('#fullPage').fullpage({
        //Navigation
        menu: false,
        navigation: true,
        navigationPosition: 'right',  
        
        //Scrolling
        css3: true,
        scrollingSpeed: 700,
        autoScrolling: true,
        fitToSection: true,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        normalScrollElements: '#seventh',
        scrollOverflow: false,
        touchSensitivity: 15,
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        fixedElements: '',
        resize : false,
        responsive: 1,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '',

        //events
        onLeave: function(index, nextIndex, direction){
        },
        afterLoad: function(anchorLink, index){
            // if( index != 7 ) return;
            // $("#fullPage").addClass("disable");
            // $("#fp-nav").addClass("disable");
        },
        afterRender: function(){
        },
        afterResize: function(){},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
        onSlideLeave: function(anchorLink, index, slideIndex, direction){}
    });
});