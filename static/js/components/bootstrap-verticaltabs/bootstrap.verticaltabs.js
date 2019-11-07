/**
 * jquery.verticaltabs.js.
 *
 * PlugIn do Jquery para implementar tabs verticais que ao passar o mouse em cima 
 * mostra um box de conteúdo em destaque, forms, seletores, filtros, etc.
 *
 * @language   javascript
 * @version    1.0.0
 * @package    Agencie.me
 * @subpackage sysprg
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 * @param {object} $ jquery onject
 *
 */
(function ($) {
    $.fn.verticalTabs = function (options) {
        var defaults = {
            top: '20px', // top position of the first tab
            left: '0px', // left position of tabs
            bgColorTab: '255, 100, 0', // Backgroud color to tabs
            bgColorBox: '100, 100, 100', // Backgroud color to Boxes
            ftColorTab: '#FFFFFF',
            opacity: '0.7',
            boxSize: '300px',
            shadow: true,
            bgOpacity: 1
        };
        var intrnOpts = {
            unitBox: 'px',
            unitTop: 'px',
            unitLeft: 'px',
            compShadow: 5,
            rgbTab: {r: 255, g: 100, b: 0},
            rgbBox: {r: 100, g: 100, b: 100},
            bgOpacity: 1
        };
        var opts = {};
        if (options) {
            $.extend(true, opts, defaults);
            $.extend(true, opts, options);
            $.extend(true, options, opts);
        }
        opts = null;

        /*------------------------------------
         * Main Program
         -------------------------------------*/
        return this.each(function () {
            /*------------------------------------
             * Methos 
             -------------------------------------*/
            var setTabBoxShadow = function () {
                if (options.shadow) {
                    // Add .shadow css class to all tabs
                    $('.vTab').addClass('tabShadow');
                    $('.tabContent').addClass('tabShadow');
                    var boxShadow = $('.vTab').css('box-shadow');
                    boxShadow = boxShadow.replace(/(^rgb\([0-9,\s]+\)\s?)/g, '');
                    boxShadow = boxShadow.split(' ');
                    var j = 0;
                    for (var i = 0; i < boxShadow.length; i++) {
                        if (parseInt(boxShadow[i].replace(/[a-fA-F%\s]/g, '')) > j) {
                            j = parseInt(boxShadow[i].replace(/[a-fA-F%\s]/g, ''));
                        }
                    }
                    intrnOpts.compShadow = ((parseInt(j) === 0) ? 5 : parseInt(j));
                } else {
                    intrnOpts.compShadow = +0;
                    $('.vTab').removeClass('tabShadow');
                    $('.tabContent').removeClass('tabShadow');
                }
            };
            // convert decimal param to hex 
            var componentToHex = function (c) {
                var hex = parseInt(c).toString(16);
                hex = hex.replace(/\s/, '');
                return ((hex.length === 1) ? "0" + hex : hex);
            };
            // convert rgb struct to hex color struct
            var rgbToHex = function (r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            };
            // conert a hex color struct to rgb struct
            var hexToRgb = function (hex) {
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return res ? {
                    r: parseInt(res[1], 16),
                    g: parseInt(res[2], 16),
                    b: parseInt(res[3], 16)
                } : null;
            };
            var invertColor = function (hexTripletColor) {
                var color = hexTripletColor;
                color = color.substring(1);           // remove #
                color = parseInt(color, 16);          // convert to integer
                color = 0xFFFFFF ^ color;             // invert three bytes
                color = color.toString(16);           // convert to hex
                color = ("000000" + color).slice(-6); // pad with leading zeros
                color = "#" + color;                  // prepend #
                return color;
            };
            // calculate mask position
            var getMaskPosition = function (tabObj) {
                // position tab bottom mask on bottom of tab and change background color to form color. 
                // This effect erase shadow left form and shadow bottom of tab
                var mTop = parseInt($(tabObj).outerHeight() - 1); // o topo da mascara é a largura da tab -1 da borda de baixo da tab
                var mLeft = -1; // mask bottom tab shadow left position -> positive tab.left - form.border.bottom
                var mWidth = parseInt($(tabObj).outerWidth()); // mask bottom tab shadow top position -> tab.width
                var mHeight = intrnOpts.compShadow + 1; // Largura da máscar é a largura da máscara da tab
                return {top: mTop, left: mLeft, width: mWidth, height: mHeight};
            };
            // calculate Box Position
            var getBoxPosition = function () {
                var bTop = parseInt(options.top) + (intrnOpts.compShadow * 2); // top position of form
                var bLeft = intrnOpts.compShadow; // Left position of form
                var bWidth = options.boxSize;
                return {top: bTop, left: bLeft, width: bWidth, height: 0};
            };
            // calculate tabPosition
            var getTabPosition = function (tWidth, bHeight) {
                // Top position of top tab -> (form.width - tab.width - form.top - (tab.shadow.top + tab.shadow.bottom) - (form.border.top + form.border.bottom)
                var tLeft = parseInt(bHeight) - parseInt(tWidth) + (intrnOpts.compShadow * 2);
                // Left position of top tab -> (form.width + tab.heght - (tab.shadow.bottom + tab.shadow.top + form.shadow.left) - (form.border.right)
                var tTop = options.boxSize + (intrnOpts.compShadow * 2); // position of left tab
                return {top: tTop, left: tLeft, width: 0, height: 0};
            };
            // Change Tab color an Tab Font Color
            var changeTabColor = function (tabObj) {
                $(tabObj).attr('data-fontcolor', $(tabObj).children('.vTabLink').css('color')); // store original font color of tab
                var cl = rgbToHex(intrnOpts.rgbTab.r, intrnOpts.rgbTab.g, intrnOpts.rgbTab.b); // get color of tab to change font color of tab in hexadecimal format
                $(tabObj).css({'background-color': options.bgColorBox}); // change background color of tab object
                $(tabObj).children('.vTabLink').css({'color': cl}); // change font color of link (tag <a>) of tab object
            };
            // handle on mouse Enter event
            var OnMouseEnter = function (objId, tabObj) {
                if ($(tabObj).hasClass('active')) {
                    var maskPos = getMaskPosition(tabObj); // mask Position
                    var boxPos = getBoxPosition(); // Box Position
                    var tabPos = getTabPosition($(tabObj).outerWidth(), $(objId).outerHeight()); // Tab Position
                    // position tab bottom mask on bottom of tab and change background color to form color. This effect erase shadow left form and shadow bottom of tab
                    $(tabObj).children('.bottomTab').css({'left': maskPos.left + 'px', 'top': maskPos.top + 'px', 'height': maskPos.height, 'width': maskPos.width + 'px', 'background-color': options.bgColorBox});
                    $(tabObj).children('.bottomTab').show();
                    // Show Box with animate
                    $(objId).animate({top: boxPos.top + 'px', left: boxPos.left + 'px', width: boxPos.width + 'px', opacity: 1}, {duration: 400, queue: false}); // animate to show form
                    // Animate tab position at left of boxContent
                    $(tabObj).animate({top: '-' + tabPos.top + 'px', left: tabPos.left + 'px', opacity: 1}, {duration: 400, queue: false}); // animate to tab at form position
                    changeTabColor(tabObj);
                }
            };
            // handle on click event to close form
            var OnMouseOut = function (objId, tabObj) {
                var tLeft = $(tabObj).attr('data-orgpos');
                var fc = $(tabObj).attr('data-fontcolor');
                $(objId).animate({left: '-' + options.boxSize + 'px', opacity: 0}, {duration: 400, queue: false});
                $(tabObj).animate({left: tLeft + 'px', top: '0' + 'px', opacity: 1}, {duration: 400, queue: false});
                $(tabObj).children('.bottomTab').hide();
                $(tabObj).css({'background-color': options.bgColorTab});
                $(tabObj).children('.vTabLink').css({'color': options.ftColorTab});
                $(tabObj).css({'left': tLeft + 'px', 'background-color': options.bgColorTab});
            };
            // check a struc of otions.bgColorBox and options.bgColorTab
            var getBgColor = function (p) {
                var a = {r: 100, g: 100, b: 100};
                if ((p) && (typeof p !== 'undefined')) {
                    if (p.match(/[,\s]|[0-9]{1,3}|/g)) {
                        a = p.split(',');
                        if (a.length === 3) {
                            a = {r: a[0], g: a[1], b: a[2]};
                        }
                    } else if ((p.match(/^#|[0-9a-fA-F]{2}/g)) && ((p.length === 4) || (p.length === 7))) {
                        a = hexToRgb(p);
                    }
                }
                return a;
            };
            var showAllTabs = function () {
                var aTop = parseInt(options.top);
                $('.vertical-tabs .vTab').each(function () { // set
                    var aWidth = parseInt($(this).children('a').width()) + 25;
                    $(this).css({'left': aTop + 'px', 'top': '0px', 'width': aWidth + 'px'}); // set tab position
                    $(this).attr('data-orgpos', aTop);
                    aWidth = ((String($(this).outerWidth(true)).match(/-/)) ? String($(this).outerWidth(true)).replace(/-/, '') : $(this).outerWidth(true)); 
                    aTop = aTop + aWidth + (intrnOpts.compShadow * 2);
                });
                $('.vTab').css({'background-color': options.bgColorTab, 'color': options.ftColorTab}); // set tab background-color and font color
                $('.vTabBox').css({'background-color': options.bgColorBox}); // set box color
                // show tabs
                $('.vertical-tabs').css({'top': options.top + 'px', 'width': aTop + 'px'});
                $('.vertical-tabs').show().animate({left: options.left + 'px', opacity: 1}, 700);
            };
            var transformToPixels = function (unit, metric, winSize) {
                var res = parseInt(metric);
                switch (unit.toLowerCase()) {
                    case 'em' :
                        res = res * 16;
                        break;
                    case 'rem':
                        res = res * 16;
                        break;
                    case '%'  :
                        res = parseInt((res * parseInt(winSize)) / 100);
                        break;
                    default   :
                        res = parseInt(metric);
                        break;
                }
                return res;
            };
            var getTabPosInPixels = function () {
                // save unit values of top left (%, em, px, rem, etc.)
                intrnOpts.unitTop = options.top.replace(/([0-9])+/g, '');
                intrnOpts.unitTop = (((typeof intrnOpts.unitTop === 'undefined') || (!intrnOpts.unitTop)) ? 'px' : intrnOpts.unitTop);
                intrnOpts.unitLeft = options.top.replace(/([0-9])+/g, '');
                intrnOpts.unitLeft = (((typeof intrnOpts.unitLeft === 'undefined') || (!intrnOpts.unitLeft)) ? 'px' : intrnOpts.unitLeft);
                intrnOpts.unitBox = options.boxSize.replace(/([0-9])+/g, '');
                intrnOpts.unitBox = (((typeof intrnOpts.unitBox === 'undefined') || (!intrnOpts.unitBox)) ? 'px' : intrnOpts.unitBox);
                // set top and left numeric values only
                options.top = options.top.replace(/([a-zA-Z%])+/g, '');
                options.left = options.left.replace(/([a-zA-Z%])+/g, '');
                options.top = (((typeof options.top === 'undefined') || (!options.top)) ? 20 : options.top);
                options.left = (((typeof options.left === 'undefined') || (!options.left)) ? 0 : options.left);
                options.top = transformToPixels(intrnOpts.unitTop, options.top, $(window).height());
                options.left = transformToPixels(intrnOpts.unitLeft, options.left, $(window).width());
                options.boxSize = options.boxSize.replace(/([a-zA-Z%])+/g, '');
                options.boxSize = (((typeof options.boxSize === 'undefined') || (!options.boxSize)) ? 300 : options.boxSize);
                options.boxSize = transformToPixels(intrnOpts.unitBox, options.boxSize, $(window).height());
            };

            /*-------------------------------------------
             * Main command
             --------------------------------------------*/
            // set or unset shadow to tabs and component box
            setTabBoxShadow();
            // get rgb color object
            intrnOpts.rgbTab = getBgColor(options.bgColorTab);
            intrnOpts.rgbBox = getBgColor(options.bgColorBox);
            options.opacity = ((options.opacity) ? options.opacity : '0.7');
            options.ftColorTab = ((options.ftColorTab) ? options.ftColorTab : '#FFFFFF');
            // set tab background to Tabs
            options.bgColorTab = 'rgba(' + intrnOpts.rgbTab.r + ', ' + intrnOpts.rgbTab.g + ', ' + intrnOpts.rgbTab.b + ', ' + options.bgOpacity + ')';
            // set tab background to form background
            options.bgColorBox = 'rgba(' + intrnOpts.rgbBox.r + ', ' + intrnOpts.rgbBox.g + ', ' + intrnOpts.rgbBox.b + ', ' +  options.bgOpacity + ')';
            // test initial values of top e left options
            options.top = (((typeof options.top !== 'undefined') && (options.top)) ? options.top : '20px');
            options.left = (((typeof options.left !== 'undefined') && (options.left)) ? options.left : '5px');
            // set position of tabs
            getTabPosInPixels();
            showAllTabs();
            // handle windows resize event
            $(window).resize(function () {
                if ((intrnOpts.unitTop !== 'px') || (intrnOpts.unitLeft !== 'px')) {
                    getTabPosInPixels();
                    showAllTabs();
                }
            });
            // handle onMouseEnter event
            $(".vTab").mouseenter(function () {
                var objId = $(this).children('.vTabLink').attr('href');
                $(this).addClass('active');
                $('.vTab').not('.active').animate({top: '200px', opacity: intrnOpts.bgOpacity}, 'fast');
                OnMouseEnter(objId, $(this));
            });
            // handle onClick event to close form 
            $(".vTab, .close-message").click(function (e) {
                var objId = '';
                var tabObj = $(this);
                if ($(this).hasClass('close-message')) { // if close form from button close of form, find tab object on container form
                    $(this).parents().find('.tabContent').each(function () {
                        var tmpObjId = $(this).attr('id');
                        tmpObjId = ((tmpObjId.match(/^#/)) ? tmpObjId : '#' + tmpObjId);
                        var tmpTabObj = $("a[href='" + tmpObjId + "']").parent('.active');
                        if ($(tmpTabObj).size()){
                            objId = tmpObjId;
                            tabObj = tmpTabObj;
                        }
                    });
                } else {
                    objId = $(this).children('.vTabLink').attr('href'); // tab click get form container
                }
                $('.vTab').not('.active').show().animate({top: 0, opacity: 1}, 'fast'); // show all tabs 
                $(tabObj).removeClass('active'); // remove class active from tabform
                OnMouseOut(objId, tabObj); // animate from hidden and tab position
                e.preventDefault();
            });
        });
    };
})(jQuery);
