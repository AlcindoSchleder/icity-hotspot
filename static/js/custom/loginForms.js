/**
 * Login Form validation.
 *
 * Validação e submissão do formulário de Login
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */

var IndexLoginForm = function () {

    var handleLogin = function () {
        $('.form-login').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true,
                    minlength: 6
                },
                password: {
                    required: true,
                    minlength: 6
                },
                remember: {
                    required: false
                }
            },
            messages: {
                username: {
                    required: "Preencha o nome do usuário."
                },
                password: {
                    required: "Preencha a senha do usuário."
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
//                $(".vTab, .close-message").click();
                $(".vTab").click();
                Common.showBoxSyncMessage(true, 'body');
                var url = $(form).attr('data-action');
                //url = url.replace('http:', 'https:');
                $.post(url, $(form).serialize(), function (data) {
                    Common.showBoxSyncMessage(false);
                    if ((data.code === PSYS.CONST.STT_OK) && (data.data.redirect_site)) {
                        $('#sessionID').val('');
                        var OnCloseLoginMessage = function (r) {
                            window.location = data.data.redirect_site + '?i=' + data.data.i + '&h=' + data.data.h; // redireciona para o link retornado em data
                        };
                        Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 5, data.status.color, undefined, OnCloseLoginMessage, false);
                    } else {
                        $('#sessionID').val(data.data.pk_users_sessions);
                        Common.boxMessage(PSYS.CONST.GENERAL_TITLE, 'Login!', data.message, 0, data.status.color);
                    }
                }, 'json');
            }
        });

        $('.form-login input').keypress(function (e) {
            if (e.which === 13) {
                if ($('.form-login').validate().form()) {
                    $('.form-login').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

        $('.link-forget').click(function (e) {
            $('.link-forget').attr("disabled", "disabled");
            e.preventDefault();
            $('.aside-news').fadeOut(400, function () {
                $('.aside-forget').fadeIn(400, function () {
                    $('.forget-form #aCripto').click();
                    $('html, body').animate({
                        scrollTop: $(".aside-forget").offset().top
                    }, 1000);
                });
            });
        });

        $('.link-contact').click(function (e) {
            $('.link-contact').attr("disabled", "disabled");
            e.preventDefault();
            $('.page-new').fadeOut(400, function () {
                $('.page-contact').fadeIn(400, function () {
                    $('.contact-form #aCripto').click();
                    $('html, body').animate({
                        scrollTop: $(".page-contact").offset().top
                    }, 1000);
                });
            });
        });

    };
    return {
        init: function () {
            handleLogin();
        }
    };
}();

/**
 * Contact Form Validation.
 *
 * Validação e submissão do formulário de Contato
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var IndexFormContact = function () {
    
    var handleContact = function () {

        $('.form-contact').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            rules: {
                name_user: {
                    minlength: 6,
                    required: true
                },
                title_msg: {
                    minlength: 6,
                    required: true
                },
                email_user: {
                    required: true,
                    email: true
                },
                fk_type_messages: {
                    required: true
                },
                msg_user: {
                    required: true,
                    minlength: 10
                },
                auth_user: {
                    required: true
                }
            },
            messages: {
                name_user: {
                    minlength: "Campo Nome do Usuário deve conter no mínimo 6 carateres!",
                    required: "Campo Nome do Usuário deve ser preenchido!"
                },
                title_msg: {
                    minlength: "Campo Título da Mensagem deve conter no mínimo 6 caracteres!",
                    required: "Campo Título da Mensagem deve ser preenchido!"
                },
                email_user: {
                    required: "Campo e-mail do Usuário deve ser preenchido!",
                    email: "Campo e-mail deve ter o formato: email@dominio.com!"
                },
                fk_type_messages: {
                    required: "Selecione um Tipo de Mensagem válido!"
                },
                msg_user: {
                    required: "Campo Mensagem deve ser preenchido!",
                    minlength: "Campo Mensagem deve conter no mínimo 10 caracteres!"
                },
                auth_user: {
                    required: "Campo Autehticação deve ser preenchido!"
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit              

            },
            errorPlacement: function (error, element) { // render error placement for each input type
                error.insertAfter(element.closest('.input-icon'));
            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight

            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            submitHandler: function (form) {
                Common.showBoxSyncMessage(true, '.formContact');
                $.post($(form).attr('data-action'), $(form).serialize(), function (data) {
                    Common.showBoxSyncMessage(false);
                    if (data.code !== PSYS.CONST.STT_OK) {
                        $('.form-contact #aCrypto').click();
                        $('#auth_user').val('');
                    } else {
                        $('.form-contact input:text').each(function () {
                            $(this).val('');
                        });
                        $('.form-contact #email_user').val('');
                        $('.form-contact #msg_user').val('');
                        $('.form-contact #aCrypto').click();
                    }
                    Common.boxMessage(PSYS.CONST.GENERAL_TITLE, data.status.title, data.Message, 5, data.status.color, '.formContact');
                }, 'json');
            }

        });
        //apply validation on select dropdown value change, this only needed for chosen dropdown integration.
        $('.form-contact #fk_type_messages').change(function () {
            $('.form-contact').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
        });

        $('.form-contact input').keypress(function (e) {
            if (e.which === 13) {
                if ($('.form-contact').validate().form()) {
                    $('.form-contact').submit();
                }
                return false;
            }
        });

        $('.page-contact #cep_user').mask('00.000-000', {placeholder: "__.___-___"});
        $('.page-contact #phone_user').mask('(00) 0000-0000', {placeholder: "(__) ____-____"});
        var options = {
            onKeyPress: function (obj, e, field, options) {
                var masks = ['(00) 00000-0000', '(00) 0000-0000'];
                mask = (obj.length > 10) ? masks[1] : masks[0];
                $('.page-contact #cel_user').mask(mask, options);
            },
            placeholder: "(__) _____-____"
        };
        $('.page-contact #cel_user').mask('(00) 0000-0000', options);

    };
    
    return {
        init: function () {
            handleContact();
        }
    };
}();

/**
 * Forget Password fotm Validation.
 *
 * Validação e Submissão do formulátio "Esqueci da Senha"
 *
 * @version    1.0.0
 * @package    VocatioTelecom
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var IndexFormForget = function () {
    
    var handleForgetPassword = function () {

        $('.form-forget').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                },
                fgAuth_user: {
                    required: true
                }
            },
            messages: {
                email: {
                    required: "campo e-mail deve ser preenchido."
                },
                fgAuth_user: {
                    required: "campo autenticação deve ser preenchido"
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit   

            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                Common.showBoxSyncMessage(true, '.formForget');
                $.post($(form).attr('data-action'), {a: 'password', q: $('#email').val(), c: $('#fgAuth_user').val()}, function (data) {
                    Common.showBoxSyncMessage(false);
                    if (data.code === PSYS.CONST.STT_OK) {
                        $('#email').val('');
                        $('#fgAuth_user').val('');
                        $('.form-forget #aCrypto').clicforget - formk();
                    }
                    Common.boxMessage(PSYS.CONST.GENERAL_TITLE, data.status.title, data.Message, 5, data.status.color, undefined, false, false);
                }, 'jsonp');
            }
        });

        $('.forget-form input').keypress(function (e) {
            if (e.which === 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        $('.forget-back-btn').click(function () {
            handleBackBtn('aside-forget');
        });

    };

    return {
        //main function to initiate the module
        init: function () {
            handleForgetPassword();
        }
    };
}();
