/**
 * common.js.
 *
 * Este script contém manipuladores para mensagens de sincronismo,
 * box message, requisições Ajax, manipulador de atualização do captcha
 *
 * @language   javascript
 * @version    1.0.0
 * @package    Agencie.me
 * @subpackage sysprg
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var Common = function () {

    var boxSyncMessage = function (options) {
        options = $.extend(true, {
            container: '', // alerts parent container(by default placed after the page breadcrumbs)
            type: 'success', // alert's type
            icon: '', // put icon before the message
            width: '50%'
        }, options);
        var html = '<div class="boxText' + ((options.type) ? ' text-' + options.type : '') + ' round" id="boxTempText"> ' +
                '    <span><i class="fa fa-' + ((options.icon) ? options.icon : 'refresh') + ' spinning"></i> Sincronizando Conteúdo...</span> ' +
                '</div>';
        options.container = ((!options.container) || (typeof options.container === 'undefined') ? 'body' : options.container);
        $(options.container).append(html);
        $('#boxTempText').show(5000);
    };

    var boxSimpleMessage = function (options) {
        options = $.extend(true, {
            container: 'body', // alerts parent container(by default placed after the page breadcrumbs)
            type: 'success', // alert's type
            icon: 'check', // put icon before the message
            width: '50%',
            msg: '...'
        }, options);
        var html =  '<div class="boxSingleText' + ((options.type) ? ' text-' + options.type : '') + ' round" id="boxSingleText"> ' +
                    '    <span><i class="fa fa-' + ((options.icon) ? options.icon : 'refresh') + '"></i></span> ' + ((options.msg) ? options.msg : '...') +
                    '</div>';
        options.container = ((!options.container) || (typeof options.container === 'undefined') ? 'body' : options.container);
        $(options.container).append(html);
        $('#boxTempText').show(5000);
    };

    return {
        // Scroll onto top of element
        objToStr: function (obj) {
            obj = ((typeof obj === 'undefined') ? null : obj);
            var output = '';
            if (obj) {
                for (var property in obj) {
                    output += property + ': ' + obj[property]+"\n";
                }
            }
            return output;
        },
        scrollTo: function (el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;
            if (el) {
                pos = pos + (offeset ? offeset : -1 * el.height());
                $('html, body').animate({
                    scrollTop: pos
                }, 1000);
            }
        },
        boxMessage: function (header, title, msgText, counter, type, blockCt, onClose, inPlace) {
            header  = ((typeof header  !== 'undefined') ? header  : '<b>Agencie.Me</> - Gestor de Sistemas');
            title   = ((typeof title   !== 'undefined') ? title   : 'Operação realizada com sucesso!');
            msgText = ((typeof msgText !== 'undefined') ? msgText : '');
            counter = ((typeof counter !== 'undefined') ? counter : 0);
            type    = ((typeof type    !== 'undefined') ? type    : 'success');
            blockCt = ((typeof blockCt !== 'undefined') ? blockCt : 'body');
            onClose = ((typeof onClose !== 'undefined') ? onClose : false);
            if (typeof inPlace === 'undefined') {
                if (counter === 0) {
                    inPlace = false;
                } else {
                    inPlace = true;
                }
            }
            var msgOpts = {
                autoClose: counter,                       // autoclose. eq 0 = not autoclose
                modal: ((!inPlace) ? true : false),       // afficle la dialogbox en mode modal
                cbClose: onClose,                         // call when box is closed
                inPlace: inPlace,                         // the box is showing into element and wait close it...  
                focus: ((counter === 0) ? false : true),  // auto scroll to the alert after shown
                caption: header,                          // caption on box header
                title: title,                             // title of text Message
                text: msgText                             // text message to display into element
            };
            switch (type) {
                case 'danger': {
                    $(blockCt).messageBox(msgOpts).boxDanger(msgText, title, header); 
                    break;
                }
                case 'warning': {
                    $(blockCt).messageBox(msgOpts).boxWarning(msgText, title, header); 
                    break;
                }
                case 'info': {
                    $(blockCt).messageBox(msgOpts).boxInfo(msgText, title, header); 
                    break;
                }
                case 'success': {
                    $(blockCt).messageBox(msgOpts).boxSuccess(msgText, title, header); 
                    break;
                }
                default:
                    $(blockCt).messageBox(msgOpts).boxDefault(msgText, title, header); 
            };
        },
        handleAjaxReqs: function (targetHtml, targetLink) {
            $.post(targetLink, function (data) {
                if (data.code === PSYS.CONST.STT_OK) {
                    if (data.hasOwnProperty('url')) {
                        var url = ((window.location.href.match(/\/$/)) ? data.url : '/' + data.url);
                        var re = '/' + url + '\/?$/';
                        url = ((window.location.href.match(re)) ? window.location.href : window.location.href + url);
                        window.history.pushState({path: window.location.href}, document.title, url);
                    }
                    $(targetHtml).fadeIn(400, function () {
                        $(targetHtml).html(data.data);
                        $('html, body').animate({
                            scrollTop: $(targetHtml).offset().top
                        }, 1000);
                    });
                    $('[data-toggle="tooltip"]').tooltip();
                } else {
                    Common.boxMessage(PSYS.CONST.GENERAL_TITLE, data.status.title, data.Message, 15, data.status.color, targetHtml);
                }
            }, 'json');
        },
        handleRefreshCaptcha: function (imgID, inputID, formID, captchaType, url) {
            imgID = typeof imgID !== 'undefined' ? imgID : '';
            inputID = typeof inputID !== 'undefined' ? inputID : '';
            formID = typeof formID !== 'undefined' ? formID : '';
            captchaType = typeof captchaType !== 'undefined' ? captchaType : 0;
            url = typeof url !== 'undefined' ? url : PSYS.CONST.INCLUDE + '/libs/captcha/securimage_refresh.php';
            var captchaId = $('#captchaId').val();
            var data = "captchaId=" + captchaId + "&inputID=" + inputID + "&imageID=" + imgID + "&formID=" + formID + "&captcha_type=" + captchaType;
            // $('siIconAudio_' + imgID).removeClass('glyphicon-volume-up');
            // $('siIconAudio_' + imgID).addClass('glyphicon-cog spinning');
            // set spinning to image button
            $('.siIconRefresh_' + imgID).addClass('spinning');
            $.get(url, data, function (data) {
                // unset spinning to image button
                $('.siIconRefresh_' + imgID).removeClass('spinning');
                if (data.code !== PSYS.CONST.STT_OK) {
                    Common.boxMessage(PSYS.CONST.GENERAL_TITLE, data.status.title, data.Message, 5, data.status.color, '.captcha_container_' + inputID);
                } else {
                    $('.captcha_container_' + inputID).html(data.imgObj);
                    $('#captchaId').val(data.captchaId);
                }
            }, 'json');
        },
        showBoxSyncMessage: function (flag, container, type, icon) {
            flag = typeof flag !== 'undefined' ? flag : false;
            type = typeof type !== 'undefined' ? type : 'success';
            icon = typeof icon !== 'undefined' ? icon : 'refresh';
            container = (typeof container !== 'undefined' ? container : 'body');
            if (flag) {
                boxSyncMessage({
                    type: type,
                    icon: icon,
                    container: container
                });
            } else {
                $('.boxTempText').remove();
            }
        },
        showBoxSimpleMessage: function (flag, msg, container, type, icon) {
            flag = typeof flag !== 'undefined' ? flag : false;
            type = typeof type !== 'undefined' ? type : 'success';
            icon = typeof icon !== 'undefined' ? icon : 'check';
            msg  = typeof msg  !== 'undefined' ? msg  : '...';
            container = (typeof container !== 'undefined' ? container : 'body');
            if (flag) {
                boxSimpleMessage({
                    container: container,
                    type: type,
                    icon: icon,
                    width: '100%',
                    msg: msg
                });
            } else {
                $('.boxSingleText').remove();
            }
        }
    };

}();