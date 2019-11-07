/**
 * Init main page components.
 *
 * Inicialização dos componebtes da página principal
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var IndexComponents = function () {

    var autoBackGroud = function () {
        /*====================================
        VEGAS SLIDESHOW SCRIPTS
        ======================================*/
        $.vegas('slideshow', {
            backgrounds: [
            //    {src: './templates/img/1.jpg', fade: 1000, delay: 9000},
            //    {src: './templates/img/2.jpg', fade: 1000, delay: 9000},
            //    {src: './templates/img/3.jpg', fade: 1000, delay: 9000},
                {src: PSYS.CONST.HOME + '/templates/img/4.jpg', fade: 1000, delay: 9000}
            ]
        })('overlay', {
            /** SLIDESHOW OVERLAY IMAGE **/
            src: 'assets/js/vegas/overlays/06.png' // THERE ARE TOTAL 01 TO 15 .png IMAGES AT THE PATH GIVEN, WHICH YOU CAN USE HERE
        });
    };
    var autoScroll = function () {
        /*====================================
         SCROLLING SCRIPTS
        ======================================*/
        $('.scroll-me a').bind('click', function (event) { //just pass scroll-me in design and start scrolling
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1200, 'easeInOutExpo');
            event.preventDefault();
        });
    };
    var autoSlider = function () {
        /*====================================
         SLIDER SCRIPTS
        ======================================*/
        $('#carousel-slider').carousel({
            interval: 2000 //TIME IN MILLI SECONDS
        });
    };
    var fancyMedia = function () {
        /*====================================
         POPUP IMAGE SCRIPTS
         ======================================*/
        $('.fancybox-media').fancybox({
            openEffect: 'elastic',
            closeEffect: 'elastic',
            helpers: {
                title: {
                    type: 'inside'
                }
            }
        });
    };
    var select2Idx = function () {
        $('.post-category').select2();
    };
    var verticalTabsIdx = function () {
        $('.vertical-tabs').verticalTabs({
            top: '20px',
            left: '25px',
            bgColorTab: '255, 100, 0',
            bgColorBox: '50, 50, 50',
            css: PSYS.CONST.TEMPLATES + '/css/components/bootstrap-verticaltabs/bootstrap.verticaltabs.css',
            bgOpacity: 0.7
        }); // #ff6400 color of tabs
    };
    var owlCarrouselIdx = function () {
        $("#customers-list").owlCarousel({
            autoPlay: 3000, //Set AutoPlay to 3 seconds
            stopOnHover: true,
            items: 3,
            itemsDesktop: [1200, 3],
            itemsDesktopSmall: [991, 3],
            itemsTablet: [767, 2],
            itemsTabletSmall: [625, 2],
            itemsMobile: [479, 1]
        });
    };
    var promotionalPages = function () {
        $('#page-dynamic').modal('show');
    };
    return {
        //main function to initiate the module
        init: function () {
            autoBackGroud();
            autoScroll();
            autoSlider();
            fancyMedia();
            select2Idx();
            verticalTabsIdx();
            owlCarrouselIdx();
            promotionalPages();
        },
        startFilters: function () {
            /*====================================
            FILTER FUNCTIONALITY SCRIPTS
            ======================================*/
            var $container = $('#page-work');
            $container.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            $('.caegories a').click(function () {
                $('.caegories .active').removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter');
                $container.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });
        }
    };
}();

/**
 * Handle main page Events.
 *
 * Manipulação dos eventos da página principal
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */

var IndexEvents = function () {

    var documentEvents = function () {
        $(document).on('scroll', function () {
            if ($(window).scrollTop() > 100) {
                $('.scroll-top-wrapper').addClass('show');
            } else {
                $('.scroll-top-wrapper').removeClass('show');
            }
        });
    };
    var handleDynamicLinks = function () {
        /*-----------------------------------
         * objects with data-link attributes
         ------------------------------------*/
        $('[data-link]').click(function (e) {
            Common.handleAjaxReqs('.' + $(this).attr('data-target'), $(this).attr('data-link'));
            e.preventDefault();
        });
        /*-----------------------------------
         * Menu Buttons Clinck
         ------------------------------------*/
        $('.btn-menu').on('click', function (e) {
            IndexEvents.handleMenuClick(e, $(this));
        });
        /*-----------------------------------
         * Especific Menu Buttons Clinck
         ------------------------------------*/
        // Profile Menu (Aobout US -> Sobre)
        $('.menu').on('click', 'div.profile-btn', function () {
            setTimeout(function () {
                $('.count').each(function () {
                    $(this).prop('Counter', 0).animate({
                        Counter: $(this).text()
                    }, {
                        duration: 1500,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
                });
            }, 100);
        });
        // Portfolio Menus (PortFolio -> Produtos)
        $('.menu').on('click', 'div.portfolio-btn', function () {
            setTimeout(function () {
                $('#projects').mixItUp();
            }, 100);
        });
        //-----------------------------------
        // Close Button, Hide Menu
        //-----------------------------------
        $('body').on('click', '.close-btn', function () {
            IndexEvents.handleCloseButtonClick();
        });
    };
    var handleActiveMenu = function () {
//        var pageId = (($("section").not(".page").attr('id') === '') ? $("section").not(".page").attr('id') : false);
        var pageId = $(".section-content").not(".page").attr('id');
        if (pageId) {
            if (PSYS.FLAGS.isDebug())
                console.log('Active Page: ' + pageId);
            if ((pageId) && (pageId !== 'page-menu')) {
                $('.page-menu').css({top: '110vw'});
                showPage(pageId, '');
            }
        } else {
            if (PSYS.FLAGS.isDebug())
                console.log('Active Page: seletor não encontrou a página!');
        };
    };
    var autoScrollEvent = function () {
        $('.scroll-top-wrapper').on('click', function () {
            IndexEvents.scrollToTop();
        });
    };
    var popStateEvent = function (e) {
        PSYS.FLAGS.setFlags(PSYS.CONST.FLAG_BKFW, true);
        // if the event has our history data on it, load the page fragment with AJAX
        var state = e.originalEvent.state;
        if (state) {
            var pages = IndexEvents.getMenuPageFromUrl(state.path);
            if (pages.page === PSYS.CONST.HOME) { // page goes to main menu
                IndexEvents.handleCloseButtonClick();
            } else if (($('#' + pages.page)) && ((Object.keys(pages).length === 3))) { // page goes to menu page
                IndexEvents.hideMenuEvent(pages.page, pages.url);
            } else if (Object.keys(pages).length > 3) { // page goes to a script php menu
                IndexEvents.hideMenuEvent(pages.page, pages.url); // now load php script to show data 
                // set the last link of array page and show it
                //$('.' + pages[1] + '-btn').click();
            }
        }
        PSYS.FLAGS.setFlags(PSYS.CONST.FLAG_BKFW, false);
    };
    var setPopStateEvent = function () {
        $(window).bind('popstate', popStateEvent);
    };
    var unsetPopStateEvent = function () {
        $(window).unbind('popstate');
    };
    var setDocumentHistory = function (path, url, replace = true, hash = '') {
        url = ((typeof url === 'undefined') ? PSYS.CONST.HOME : url);
        path = ((typeof path === 'undefined') ? PSYS.CONST.HOME : path);
        hash = ((typeof hash === 'undefined') ? PSYS.CONST.HOME : hash);
        if (PSYS.FLAGS.isDebug())
            console.log('creating a history object for ' + PSYS.CONST.HOME);
        unsetPopStateEvent();
        window.location.hash = hash;
        if (replace) {
            window.history.replaceState({path: url}, document.title, url);
        } else {
            window.history.pushState({path: path}, document.title, url);
        }
        setPopStateEvent();
    };
    var showPage = function (page, url) {
        if (PSYS.FLAGS.isDebug())
            console.log('Selected Page: ' + page);
        if (!PSYS.FLAGS.isFlagSet(PSYS.CONST.FLAG_BKFW)) {
            setDocumentHistory(url, url, true, page);
        }
        $('#' + page).removeClass('page');
        $('#' + page).animate(
                {visibility: 'visible', top: 1, left: 1}, 1000, 'easeOutQuart',
                function () {
                    $(this).attr('data-active_data', 'active');
                }
        );
    };

    return {
        //main function to initiate the module
        init: function () {
            documentEvents();
            handleDynamicLinks();
            PSYS.FLAGS.setFlags(PSYS.CONST.FLAG_BKFW, true);
            handleActiveMenu();
            PSYS.FLAGS.setFlags(PSYS.CONST.FLAG_BKFW, false);
            autoScrollEvent();
        },
        getMenuPageFromUrl: function (url) {
            url = ((typeof url === 'undefined') ? '' : url);
            url = url.replace(PSYS.CONST.HOME, '');
            var links = url.split('/');
            if (links[0] === '') {
                links.splice(0, 1);
            }
            var res = {page: (((links.length > 0) && (links[0] in PSYS.CONST.MENUS)) ? PSYS.CONST.MENUS[links[0]] : PSYS.CONST.HOME),
                       url: ((links.length > 0) ? links[0] : '')};
            for (i = 0; i < links.length; i++) {
                if (links[i] !== '') {
                    res[i] = links[i];
                }
            }
            return res;
        },
        activeMenuEvent: function () {
            handleActiveMenu();
        },
        scrollToTop: function () {
            var T = $('body').offset.top;
            $('html, body').animate({scrollTop: 0}, 900, 'linear');
        },
        showButtonClose: function (page) {
//            var T = $('#' + page).offset().top - 8;
//            var L = $('#' + page).outerWidth() + $('.close-btn').outerWidth();
            var T = $('#' + page).offset().top + ($('.close-btn').height() / 2) - 15;
//            var T = $('#' + page).offset().top;
            var L = $('#' + page).offset().left + ($('.close-btn').outerWidth() / 2);
            if (PSYS.FLAGS.isDebug())
                console.log('Topo do Close: ' + T + ' Left do Close: ' + L);
            $('.close-btn').animate({top: T, left: L}, 500, 'easeInOutExpo');
        },
        hideMenuEvent: function (page, url) {
            $('.page-menu').addClass('page');
            showPage(page, url);
        },
        hideMenu: function (page, url) {
            //var menuWidth = $('.page-menu').height();
            $('.page-menu').animate(
                    {left: '110vw', visibility: 'hidden'}, 1000, 'easeOutQuart',
                    function () {
                        $(this).addClass('page');
                        showPage(page, url);
                    }
            );
        },
        handleCloseButtonClick: function () {
            $('section[data-active_data=active]').animate({
                left: '110vw', top: '110vh', visibility: 'hidden'}, 1000,
                    function () {
                        $(this).attr('data-active_data', '');
                        $(this).addClass('page');
                    }
            );
            $('.page-menu').removeClass('page');
            $('.page-menu').animate({visibility: 'visible', left: 0, top: 0}, 1000, 'easeOutQuart');
            if (!PSYS.FLAGS.isFlagSet(PSYS.CONST.FLAG_BKFW)) {
                setDocumentHistory(PSYS.CONST.HOME, PSYS.CONST.HOME, false);
            }
            $(window).scrollTop(0);
        },
        handleMenuClick: function (e, _this) {
            if ((typeof _this !== 'undefined')) {
                if (PSYS.FLAGS.isDebug())
                    console.log('menu click: ' + $(_this).data('url_addr'));
                var url = ((window.location.href.match(/\/$/)) ? $(_this).data('url_addr') : '/' + $(_this).data('url_addr'));
//                var url = '/' + $(_this).data('url_addr');
                if (PSYS.FLAGS.isDebug())
                    console.log('url: ' + url);
                var txtPat = url + '/?$';
                var re = new RegExp(txtPat);
                url = ((window.location.href.match(re)) ? window.location.href : window.location.href + url);
                if (PSYS.FLAGS.isDebug())
                    console.log('Url original: ' + window.location.href + ' - Url tranformed: ' + url);
                IndexEvents.hideMenu($(_this).data('url_target'), url);
//                return false;
                $(_this).attr('data-active_data', '');
                if ((e) && (typeof e !== 'undefined')) {
                    e.preventDefault();
                }
            }
        }
    };
}();

$(document).ready(function () {
    // Portal Settings
    PSYS.CONST.createFlagConst('FLAG_BKFW', 1);
    PSYS.FLAGS.setFlags(PSYS.CONST.FLAG_BKFW, false);
    // PSYS.FLAGS.setDebug(); // Uncomment this to turn debug on
    IndexComponents.init(); // starting home page compponents
});

$(window).load(function () {
    IndexLoginForm.init(); // starting login form validation and submission
    IndexFormContact.init(); // starting contact form validation and submission
    IndexEvents.init(); // starting home page events
    IndexComponents.startFilters();
});
