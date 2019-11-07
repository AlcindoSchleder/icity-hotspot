/**
 * jquery.messagebox.js.
 *
 * PlugIn do Jquery para implementar uma caixa de mensagens com header e botão close,  
 * ícone, texto de título, texto de mensagens, botões Não, Sim, Cancel, Ok e personalizáveis,
 * auto fechamento com contador decremental e pode ser visualizada com modal, ou no corpo do
 * componente em destaque (ex: um form).
 * 
 * @language   javascript
 * @version    1.0.0
 * @requires   jquery 1.6.x or later, bootstrap 4 (to buttons, backgrounds, text colors)
 * @package    Agencie.me
 * @subpackage sysprg
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 * @param {object} $ jquery object
 *
 */
(function ($) {

    var defaults = {
        autoClose: 0,                           // autoclose. eq 0 = not autoclose
        modal: true,                            // afficle la dialogbox en mode modal
        cbClose: false,                         // call when window is closed
        cbReady: false,                         // call this function when msgbox is ready
        inPlace: false,                         // the box is showing into element and wait close it...  
        focus: true,                            // auto scroll to the alert after shown
        caption: 'Mensagem do sistema',         // caption on box header
        title: '',                              // title of text Message
        text: '',                               // text message to display into element
        buttons: [],                            // array of buttons to create into messageBox
        delay: 0,
        locale: {                              // string localization
            NO: 'Não',
            YES: 'Sim',
            CANCEL: 'Cancelar',
            OK: 'Ok',
            textAutoClose: 'Fechar em [%d]'
        }
    };

    $.fn.messageBox = function (options) {
        var $container = $(this);

        var opts = {};
        $.extend(true, opts, defaults);
        $.extend(true, opts, options);
        $.extend(true, options, opts);
        options.autoClose = (((typeof options.autoClose === 'undefined') || (options.autoClose < 0)) ? 0 : options.autoClose);

        var BTN_NO     = 0x0;
        var BTN_YES    = 0x1;
        var BTN_CANCEL = 0x2;
        var BTN_OK     = 0x4;
        
        var icons = {
            'danger'  : 'fa-exclamation-triangle',
            'warning' : 'fa-exclamation-circle',
            'info'    : 'fa-info-circle',
            'primary' : 'fa-info',
            'question': 'fa-question-circle',
            'default' : 'fa-info',
            'exclam'  : 'fa-exclamation',
            'success' : 'fa-check-circle'
        };
        
        var tpl_message =   '\n  <header class="box-header">\n ' +
                            '       <div class="header-caption">\n' +
                            '           <h6></h6>\n' +
                            '       </div>\n' +
                            '       <div class="close-message-box" data-type="2">\n' +
                            '           <i class="fa fa-close"></i>\n' +
                            '       </div>\n' +
                            '       <div class="clearfix"></div>\n' +
                            '   </header>\n ' +
                            '   <div class="box-container">\n' +
                            '       <div class="box-icon"></div>\n' +
                            '       <div class="box-title"></div>\n' +
                            '       <div class="box-text"></div>\n' + // multiline here with list tags (ul, li)
                            '       <div class="box-toolbar"></div>\n' +
                            '       <div class="box-caption"></div>\n' +
                            '   </div>\n';
                    
        var button      =   '<button class="btn btn-secondary btn-sm" data-type="%type%">%text%</button>';
        
        var boxID       =   Math.floor(Math.random() * (new Date()).getTime()); // create unique id
        var modalID     =   'modalMsgBox_' + boxID;
        boxID           =   'messageBox_' + boxID;
        
        var template    =   '<div class="bg-white" id="' + boxID + '"></div>\n';
        
        var modal       =   '<div class="messageBox-modal" id="' + modalID + '"></div>\n';

        boxID   = '#' + boxID;
        modalID = '#' + modalID;
        $container.prepend(template);
        if (options.modal) {
            $container.prepend(modal);
        }
        $(boxID).on('click', 'button', function () {
            doCloseBox($(this));
        });
        $(boxID).on('click', '.close-message-box', function () {
            doCloseBox($(this));
        });
        if (options.cbReady) {
            options.cbReady();
        }
        var showDialog = function (style) {
            $(boxID).html(tpl_message);
            $(boxID).find('.box-icon').html('<i class="fa ' + icons[style] + '"></i>');
            $(boxID).find('.box-header .header-caption h6').html(options.caption);
            $(boxID).find('.box-title').html(options.title);
            $(boxID).find('.box-text').html(options.text);
            if (options.autoClose === 0) {
                $(boxID).find('.box-toolbar').html(createButton(BTN_OK));
            }

            var bg_style = "";
            if (style === "question" || style === "default") {
                bg_style = " bg-white";
            } else {
                bg_style = " bg-" + style;
            }
            if (options.inPlace) {
                $(boxID).addClass("inPlaceBox");
            } else {
                $(boxID).addClass("messageBox");
            }
            $(boxID).find('.box-container').addClass(bg_style + ' text-' + style);
            if (!options.inPlace) {
                centerWin();
            }
            $(boxID).fadeIn(1000);
            if (options.modal) {
                $(modalID).fadeIn(1000);
            }
            if (options.autoClose === 0) {
                $(boxID).find('.box-toolbar').show();
            } else if (options.autoClose > 0) {
                doAutoClose();
            };
        };
        var doCloseBox = function (obj) {
            if ((options.delay > 0) && (typeof options.inter !== undefined)) {
                clearInterval(options.inter);
                options.inter = null;
            }
            $(boxID).fadeOut(1000);
            if (options.modal) {
                $(modalID).fadeOut(1000);
            }
            if (options.cbClose) {
                options.cbClose((typeof obj === 'undefined') ? 1 : $(obj).attr("data-type"));
            }
            $(boxID).remove();
            if (options.modal) {
                $(modalID).remove();
            }
        };
//            alert('autoClose: ' + options.autoClose);
        var doAutoClose = function () {
            options.delay = parseInt(options.autoClose);
            var s = options.locale.textAutoClose.replace(/%d/, options.delay);
            $(boxID).find(".box-caption").html(s);
            $(boxID).find(".box-caption").show();
            options.inter = setInterval(function () {
                options.delay--;
                var s = options.locale.textAutoClose.replace(/%d/, options.delay);
                $(boxID).find(".box-caption").html(s);
                if (options.delay <= 0) {
                    clearInterval(options.inter);
                    options.inter = null;
                    doCloseBox();
                }
            }, 1000);
        };
        var createButton = function (type, text) {
            var s = '';
            if (type === BTN_NO) {
                s = button.replace(/%type%/g, type).replace(/%text%/g, options.locale.NO);
            } else if (type === BTN_YES) {
                s = button.replace(/%type%/g, type).replace(/%text%/g, options.locale.YES);
            } else if (type === BTN_CANCEL) {
                s = button.replace(/%type%/g, type).replace(/%text%/g, options.locale.CANCEL);
            } else if (type === BTN_OK) {
                s = button.replace(/%type%/g, type).replace(/%text%/g, options.locale.OK);
            } else {
                s = button.replace(/%type%/g, type).replace(/%text%/g, text);
            }
            return s;
        };
        var createAllButtons = function (buttons) {
            var s = '';
            buttons.forEach(function (elem) {
                s += createButton(elem.return, elem.text) + "&nbsp;";
            });
            return s;
        };
        var centerWin = function () {
            $(boxID).css("top", ($(window).outerHeight() - $(boxID).outerHeight()) / 2 + $(window).scrollTop() + "px")
                    .css("left", ($(window).width() - $(boxID).outerWidth()) / 2 + $(window).scrollLeft() + "px");
        };
        var checkParams = function (text, title, caption) {
            options.text = ((typeof text === 'undefined') ? options.text : text);
            options.title = ((typeof title === 'undefined') ? options.title : title);
            options.caption = ((typeof caption === 'undefined') ? options.caption : caption);
        };

        return {
            boxDanger: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('danger');
                    return $(boxID);
                });
            },
            boxWarning: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('warning');
                    return $(boxID);
                });
            },
            boxInfo: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('info');
                    return $(boxID);
                });
            },
            boxDefault: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('default');
                    return $(boxID);
                });
            },
            boxSuccess: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('success');
                    return $(boxID);
                });
            },
            boxYesNo: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('question');
                    $(boxID).find('.box-toolbar').empty();
                    var s = createAllButtons([{return: BTN_YES, text: options.locale.YES}, {return: BTN_NO, text: options.locale.NO}]);
                    $(boxID).find('.box-toolbar').html(s);
                    return $(boxID);
                });
            },
            boxYesNoCancel: function (text, title, caption) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('question');
                    $(boxID).find('.box-toolbar').empty();
                    var s = createAllButtons([{return: BTN_YES, text: options.locale.YES}, {return: BTN_NO, text: options.locale.NO}, {return: BTN_CANCEL, text: options.locale.CANCEL}]);
                    $(boxID).find('.box-toolbar').html(s);
                    return $(boxID);
                });
            },
            boxQuestion: function (text, title, caption, buttons) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('question');
                    $(boxID).find('.box-toolbar').empty();
                    var s = createAllButtons(buttons);
                    $(boxID).find('.box-toolbar').html(s);
                    return $(boxID);
                });
            },
            boxExclamation: function (text, title, caption, buttons) {
                $(this).each(function () {
                    checkParams(text, title, caption);
                    showDialog('exclam');
                    $(boxID).find('.box-toolbar').empty();
                    var s = createAllButtons(buttons);
                    $(boxID).find('.box-toolbar').html(s);
                    return $(boxID);
                });
            }
        };
    };
})(jQuery);
