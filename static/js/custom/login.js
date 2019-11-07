/**
 * Init Login page components.
 *
 * Inicialização dos componebtes da página principal
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
let LoginComponents = function () {

    let startSliders = function () {
        $('#bannerHeader').carousel({
            interval: 3000,
            pause: "hover"
        });
        $('#bannerFooter').carousel({
            interval: 3000,
            pause: "hover"
        });
    };
    let initSelect = function () {
        $(".selectpicker").selectpicker();
    };
    let initState = function () {
        $('#btnLogin').prop('disabled', true);
    };
    let setLogedUser = function (name, email, appType, appId) {
        $('#form-title').html('<h3 class="text-success">Olá ' + name + '!!!</h3>');
        $('#name_user').val(name);
        $('#email_user').val(email);
        $('#app_type').val(appType);
        $('#app_id').val(appId);
    };
    let setTokenSignature = function (accessToken, signedRequest, userID) {
        $('#app_access_token').val(accessToken);
        $('#app_signed_request').val(signedRequest);
        $('#app_user_id').val(userID);
    };
    let checkMediaType = function (aMedia) {
        if ((aMedia) && (aMedia.attr('data-show') === '1')) {
            showMediaComponent(aMedia);
        }
    };
    let prepareMedia = function () {
        if ($('.pre-login-adverts').attr('data-show') === '1') {
            hideMediaComponent($('.social-login-section'));
            showMediaComponent($('.pre-login-adverts'));
        } else {
            hideMediaComponent($('.pre-login-adverts'));
            showMediaComponent($('.social-login-section'));
        }
        $('html, body').animate({
            scrollTop: $("#preLoginImages").offset().top
        }, 1000);
    };
    let prepareLogin = function () {
        hideMediaComponent($('.pre-login-adverts'));
        showMediaComponent($('.social-login-section'));
    };
    let hideMediaComponent = function (aObj) {
        if (aObj) {
            aObj.animate({
                height: '0'
            }, {
                duration: 800,
                easing: 'linear',
                complete:  function () {
                    aObj.hide();
                }
            });
        }
    };
    let showMediaComponent = function (aObj) {
        if (aObj) {
            aObj.animate({
                height: '100%'
            }, {
                duration: 1000,
                easing: 'linear',
                start:  function () {
                    aObj.show();
                }
            });
        }
    };
    let showModalHelp = function(){
        $('#modal_help').css('display', 'block');
    };
    let hideModalHelp = function(){
        $('#modal_help').css('display', 'none');
    };
    
    return {
        //main function to initiate the module
        init: function () {
            initState();
            initSelect();
            startSliders();
            prepareMedia();
        },
        showMedia: function () {
            prepareMedia();
        },
        hideMedia: function () {
            prepareLogin();
        },
        showLogedUser: function (name, email, appType, appId) {
            setLogedUser(name, email, appType, appId);
        },
        saveTokenUser: function (accessToken, signedRequest) {
            setTokenSignature(accessToken, signedRequest);
        }
    };
}();

/**
 * Handle Lagin page Events.
 *
 * Manipulação dos eventos da página de login
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var LoginEvents = function () {

    var handleExternalLogin = function () {
        $('#form-extlogin').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'text-danger', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                name_user: {
                    required: true,
                    minlength: 6
                },
                email_user: {
                    required: true,
                    minlength: 6
                },
                doc_user: {
                    required: true,
                    minlength: 11
                },
                fkCountries: {
                    required: true
                },
                fkStates: {
                    required: true
                },
                fkCities: {
                    required: true
                },
                add_user: {
                    required: true,
                    minlength: 10
                },
                num_addr: {
                    required: true
                },
                zip_code: {
                    required: true
                }
            },
            messages: {
                name_user: {
                    required: "Você deve informar o seu nome."
                },
                email_user: {
                    required: "Você deve informar o seu e-mail."
                },
                doc_user: {
                    required: "Você deve informar um documento válido (mín. 11 digitos - ex: C.P.F.)."
                },
                fkCountries: {
                    required: "Você deve selecionar um País para prosseguir!"
                },
                fkStates: {
                    required: "Você deve selecionar um Estado para prosseguir!"
                },
                fkCities: {
                    required: "Você deve selecionar uma Cidade para prosseguir!"
                },
                addr_user: {
                    required: "Você deve informar o seu endereço (mín. 10 carateres)."
                },
                num_addr: {
                    required: "Você deve informar o número do prédio do seu endereço."
                },
                zip_code: {
                    required: "Você deve informar o cep seu endereço."
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Erro na Validação!', 'Não foi possível validar os campos do formulário', 0, 'danger');
            },
            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                Common.showBoxSyncMessage(true, '.form-header');
                var url = $(form).attr('data-action');
                $('#app_tp').val('manual');
                $.post(url, $(form).serialize(), function (data) {
                    Common.showBoxSyncMessage(false);
                    if ((data.code === PSYS.CONST.STT_OK) && (data.data.redirect_site)) {
                        $('#sessionID').val('');
                        var OnCloseLoginMessage = function (r) {
                            window.location =  data.data.redirect_site + '?' + data.data.strQry; // redireciona para o link retornado em data
                        };
                        Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 5, data.status.color, undefined, OnCloseLoginMessage, false);
                    } else {
                        $('#sessionID').val(data.data.pk_users_sessions);
                        Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 0, data.status.color);
                    }
                }, 'json');
            }
        });
        $('#doc_user').mask('000.000.000-00', {placeholder: "___.___.___-__"});
        $('#zip_code').mask('00.000-000', {placeholder: "__.___-___"});
//        $('#phone_user').mask('(00) 0000-0000', {placeholder: "(__) ____-____"});
//        var options = {
//            onKeyPress: function (obj, e, field, options) {
//                var masks = ['(00) 00000-0000', '(00) 0000-0000'];
//                mask = (obj.length > 10) ? masks[1] : masks[0];
//                $('#cel_user').mask(mask, options);
//           },
//            placeholder: "(__) _____-____"
//        };
    };

    var onClickEvents = function () {
        $('#accept_terms').click(function () {
            Common.showBoxSimpleMessage(false);
            if ($(this).prop('checked')) {
                $("#accept_terms").val('1');
                $('#btnLogin').prop('disabled', false);
            } else {
                $("#accept_terms").val('0');
                $('#btnLogin').prop('disabled', true);
            }
        });
        var msg = 'Você deve aceitar a Política de Privacidade e os Termos de Uso antes de Continuar.';
        $("#btnLogin").click(function () {
            if ($("#accept_terms").prop('checked')) {
               return true;
            } else {
                Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', msg, 0, 'danger');
                return false;
            }
        });
        $('a.btn').click(function () {
            if (!$("#accept_terms").prop('checked')) {
                let visCont = '.social-login-section';
                if ($('.social-login-section').hasClass('page')) {
                    visCont = '.form-section';
                };
                Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', msg, 0, 'danger', visCont);
                $('#acceptTerms').removeClass('text-primary').addClass('text-danger font-dstk');
                return false;
            }
            $('#acceptTerms').removeClass('text-danger font-dstk').addClass('text-primary');
/*
            var btn = $(this).attr('id');
            switch(btn) { 
                case 'btn-facebook': return (($('#is_logged').val() === '1') ? false : true);
                case 'btn-twitter': return false;
                case 'btn-instagram': return false;
                case 'btn-youtube': return false;
                case 'btn-linkedin': return false;
            }
*/
        });
        $("#show-form").click(function() {
            $('.social-login-section').addClass('page');
            $('.form-section').removeClass('page');
            $('#title-header').html('Fazer Login com Cadastro Manual');
            $('#btnLogin').prop('disabled', false);
        });
        $("#hide-form").click(function() {
            $('.form-section').addClass('page');
            $('.social-login-section').removeClass('page');
            $('#title-header').html('Fazer Login pela Rede Social');
            $('#btnLogin').prop('disabled', true);
        });
    };
    var grantClientAccess = function(url, data) {
        window.location.replace(url + data);
    };
    var sendAndRedirect = function () {
        $.ajax({
            url: $('#form-extlogin').attr('data-action'),
            type: 'POST',
            data: $('#form-extlogin').serialize(),
            dataType: 'json',
            success: function (data) {
                console.log('retornou do handle_login.php... ');
                if ((data) && (data.code === PSYS.CONST.STT_OK)) {
                    console.log('Sucesso: Login Realizado');
                    alert('Sistema em Testes!!! Login Realizado com Sucesso!');
                } else {
                    console.log('Erro: ' + data.message);
                    alert("Sistema em Testes!!! \n" + data.message + "\nLiberando o acesso do hotspot");
//                    Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 0, data.status.color, undefined, OnCloseAjaxMessage, false);
                }
                var url = data.address.url + data.address.port + data.address.end_point;
                grantClientAccess(url, data.address.qry);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', 'Erro na busca dos dados: [textStatus: "' + textStatus + '"] [Erro: ' + errorThrown + ']', 0, 'danger');
            }
        });
    };
    var getCitiesFromDB = function(fkCountry, fkState) {
        var url = '../include/system/getCities.php';
        var dtSnd = 'fkCountries=' + fkCountry + '&fkStates=' + fkState;
        $('#fkCities').empty();
        $.post(url, dtSnd, function (data) {
            if (data.code === PSYS.CONST.STT_OK) {
                $('#fkCities').html(data.htmlContent);
            } else {
                Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 0, data.status.color);
            }
        }, 'json');
    };
    let handleMediaEvents = function (e) {
        if ((e) && (e.type === 'ended')) {
            LoginComponents.hideMedia(); 
            if ($('#is_logged').val() === '1') {
               window.location.replace($('a.btn').attr('href'));
            }
        }
    };
    let prepareMediaEvents = function ()  {
        let mediaTime = ((isNaN($('.pre-login-adverts').attr('duration'))) ? 0 : Number($('.pre-login-adverts').attr('duration')));
        handleMediaTime(mediaTime, 1);
    };
    let handleMediaTime = function (mt, t) {
        $('.time-media').html(t);
        if ((mt <= t) || (t > 120)) {
            handleMediaEvents({type: 'ended'});
            return true;
        }
        setTimeout(function () {
            handleMediaTime(mt, t + 1);
        }, 2000);
    };

    return {
        //main function to initiate the module
        init: function () {
            handleExternalLogin();
            onClickEvents();
            prepareMediaEvents();
        },
        mediaEvents: function (e) {
            handleMediaEvents(e);
        },
        setMediaTime: function (mt) {
            if (isNaN(mt)) {
                mt = 3;
            }
        },
        stateChange: function () {
            getCitiesFromDB($('#fkCountries').val(), $('#fkStates').val());
        }
    };
}();
$(document).ready(function () {
    // Portal Settings
    // PSYS.FLAGS.setDebug(); // Uncomment this to turn debug on
    LoginComponents.init(); // starting home page compponents
});

$(window).on('load', function ()  {
    LoginEvents.init();
    $('#name_user').focus();
});
