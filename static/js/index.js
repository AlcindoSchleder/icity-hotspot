function adjustHeightOfPage(pageNo) {

    // Get the page height
    var totalPageHeight = 15 + $('.cd-slider-nav').height()
                            + $(".cd-hero-slider li:nth-of-type(" + pageNo + ") .js-tm-page-content").height() + 160
                            + $('.tm-footer').height();

    // Adjust layout based on page height and window height
    if(totalPageHeight > $(window).height())
    {
        $('.cd-hero-slider').addClass('small-screen');
        $('.cd-hero-slider li:nth-of-type(' + pageNo + ')').css("min-height", totalPageHeight + "px");
    }
    else
    {
        $('.cd-hero-slider').removeClass('small-screen');
        $('.cd-hero-slider li:nth-of-type(' + pageNo + ')').css("min-height", "100%");
    }

}

/*
    Everything is loaded including images.
*/
$(window).on('load', function() {

    adjustHeightOfPage(1); // Adjust page height

    /* Gallery pop up
    -----------------------------------------*/
    $('.tm-img-gallery').magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image',
        gallery:{enabled:true}
    });

    /* Collapse menu after click
    -----------------------------------------*/
    $('#tmNavbar a').click(function(){
        $('#tmNavbar').collapse('hide');

        adjustHeightOfPage($(this).data("no")); // Adjust page height
    });

    /* Browser resized
    -----------------------------------------*/
    $( window ).resize(function() {
        var currentPageNo = $(".cd-hero-slider li.selected .js-tm-page-content").data("page-no");
        adjustHeightOfPage( currentPageNo );
    });

    // Remove preloader
    // https://ihatetomatoes.net/create-custom-preloading-screen/
    $('body').addClass('loaded');

});
