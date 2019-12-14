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

    var startTootips = function () {
        $('[data-toggle="tooltip"]').tooltip();
    };
    return {
        //main function to initiate the module
        init: function () {
            startTootips();
        },
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

    var handleDynamicLinks = function () {
        $('.navbar-items').on('click', '.mnu-login', function () {
           this.preventDefault()
            console.log('clicou no menu Login');
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            handleDynamicLinks();
        },
    };
}();

$(document).ready(function () {
    IndexComponents.init(); // starting home page compponents
});

$(window).on('load', function () {
    IndexEvents.init(); // starting home page events
});
