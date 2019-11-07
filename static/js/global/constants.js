/**
 * constants.js.
 *
 * Este script manipula a criação de constates e flags bit a bit para clientes 
 * que desejam utilizar esta funcionalidade em suas páginas web
 *
 * @language   javascript
 * @version    1.0.0
 * @package    Agencie.me
 * @subpackage js
 * @author     Alcindo Schleder <alcindoschleder@gmail.com>
 *
 */
var PSYS;

//PSYS Namespace
(function (PSYS) {
    
    //PSYS.FLAGS Namespace
    (function (FLAGS) {
        //Private
        FLAGS.flags = 0; // set flags to variable that store bits on / off
      
        function convertToHex() {
            return '0x' + FLAGS.flags.toString(16);
        }
        
        function convertToBin(nMask) {
            // nMask must be between -2147483648 and 2147483647
            for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32; nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
            return sMask;
        }
        
        // Public
        FLAGS.setFlags = function (flag, val) {
            if ((typeof(val) === 'boolean') && ((typeof(flag) === 'number') && ((flag % 1) === 0)) && (flag > 0) && (flag <= PSYS.CONST.FLAG_ALL)) {
                if (val) {
                    PSYS.FLAGS.flags |= flag;
                } else {
                    PSYS.FLAGS.flags &= ~flag;
                }
                
            }
        };

        FLAGS.isFlagSet = function (flag) {
            if (((typeof (flag) === 'number') && ((flag % 1) === 0)) && (flag > 0) && (flag <= PSYS.CONST.FLAG_ALL)) {
                var intNumber = PSYS.FLAGS.flags & flag; // esta operação retorna um número negativo quando o valor é acima do bit 16, pois o int no javascrip é signed
                return ((intNumber < 0) ? ((intNumber * -1) === flag) : (intNumber === flag));
            } else {
                return false;
            }
        };
        
        FLAGS.setDebug = function () {
            FLAGS.setFlags(PSYS.CONST.FLAG_DEBUG, true);
        };
        
        FLAGS.unsetDebug = function () {
            FLAGS.setFlags(PSYS.CONST.FLAG_DEBUG, false);
        };
        
        FLAGS.setAll = function () {
            FLAGS.setFlags(PSYS.CONST.FLAG_ALL, true);
        };
        
        FLAGS.unsetAll = function () {
            FLAGS.flags = 0;
        };
        
        FLAGS.isDebug = function () {
            return FLAGS.isFlagSet(PSYS.CONST.FLAG_DEBUG);
        };
        
        FLAGS.toDec = function () { return FLAGS.flags; };
        FLAGS.toHex = function () { return convertToHex(); };
        FLAGS.toBin =  function () { return convertToBin(FLAGS.flags); };
        
        PSYS.FLAGS = FLAGS;
    })(PSYS.FLAGS || (PSYS.FLAGS = {}));
    
    //PSYS.CONST Namespace
    (function (CONST) {
        //Private
        function createConst(name, val) {
            Object.defineProperty(PSYS.CONST, name, {
                value: val,
                writable: false
            });
        }

        //Public STATUS values
        CONST.STT_OK = createConst("STT_OK", 134217728);
        CONST.STT_NOTICE = createConst("STT_NOTICE", 268435456);
        CONST.STT_WARNING = createConst("STT_WARNING", 536870912);
        CONST.STT_ERROR = createConst("STT_ERROR", 1073741824);
        CONST.FLAG_DEBUG = createConst("FLAG_DEBUG", 2147483648);
        CONST.FLAG_ALL = createConst("FLAG_ALL", 4294967295);
     
        CONST.createFlagConst = function (flagName, flagVal) {
            if (((typeof (flagName) === 'string') && ((typeof (flagVal) === 'number') && ((flagVal % 1) === 0))) && 
                ((flagVal > 0) && (flagVal < PSYS.CONST.STT_OK)) && 
                (((flagVal in {1: 1, 2: 2, 4: 4, 8: 8}) || (flagVal % 16 === 0)))) {
                flagName = flagName.toUpperCase();
                CONST[flagName] = createConst(flagName, flagVal);
                PSYS.FLAGS.setFlags(CONST[flagName], true);
            }
        };
        
        CONST.createNewConst = function (constName, constVal) {
            if ((typeof(constName) === 'string') && (typeof(constVal) !== 'undefined')) {
                constName = constName.toUpperCase();
                CONST[constName] = createConst(constName, constVal);
            }
        };
     
        CONST.HOME = createConst("HOME", 'https://www.vocatiotelecom.com.br'); // change it to real http address

        CONST.MENUS = createConst("MENUS", { //Public Menu ajax links
            'sobre_nos': 'page-profile',
            'cadastre_se': 'page-signup',
            'produtos_servicos': 'page-ecommerce',
            'noticias': 'page-news',
            'metodologia': 'page-method',
            'projetos': 'page-projects',
            'contatos': 'page-contact'
        });
        CONST.PROFILE = createConst("PROFILE", 'sobre_nos=page-profile');
        CONST.SIGNUP = createConst("SIGNUP", 'cadastre_se=page-signup');
        CONST.ECOMMERCE = createConst("ECOMMERCE", 'produtos_servicos=page-ecommerce');
        CONST.NEWS = createConst("NEWS", 'noticias=page-news');
        CONST.METHOD = createConst("METHOD", 'methodologia=page-method');
        CONST.PROJECTS = createConst("PROJECTS", 'projetos=page-projects');
        CONST.CONTACT = createConst("CONTACT", 'contatos=page-contact');
        
        //Locations Constants
        CONST.INCLUDE = createConst("INCLUDE", CONST.HOME + '/include');
        CONST.TEMPLATES = createConst("TEMPLATES", CONST.HOME + '/templates');
        CONST.SITE_NAME = createConst("SITE_NAME", "<b>Vocatio Telcom</b>");
        CONST.GENERAL_TITLE = createConst("GENERAL_TITLE", CONST.SITE_NAME + " - Portal das Comunicações");
        
        PSYS.CONST = CONST;
    })(PSYS.CONST || (PSYS.CONST = {}));
})(PSYS || (PSYS = {}));
/****************************
 *   usage of this script   *
 ****************************

PSYS.CONST.createFlagConst('flag_ex', 8); cria uma constante com o nome de FLAG_EX com valor 8 no namespace CONST e seta o bit 4 de FLAGS
PSYS.CONST.createFlagConst('flag_novo', 512); cria uma constante com o nome de FLAG_EX com valor 512 no namespace CONST e set o bit 10 de FLAGS
PSYS.CONST.createNewConst('CONTANTE_QUALQUER', 'VALOR_QUALQUER'); cria uma nova constante no sistema
uso: var A = PSYS.CONST.CANSTANTE_QUALQUER; valor de A = 'VALOR QUALQUER'
if (PSYS.FLAGS.isFlagSet(PSYS.CONST.FLAG_EX)) { testa se o bit 4 (FLAG_EX) está setado em FLAGS
    ... comandos para true 
}
if (PSYS.FLAGS.isFlagSet(PSYS.CONST.FLAG_NOVO)) { testa se o bit 10 (FLAG_NOVO) está setado em FLAGS
    ... comandos para true
}
PSYS.FLAGS.setDebug(); Liga o flag 32 de FLAGS podendo ser utilizado para mostrar mensagens na console ou alert();
PSYS.FLAGS.unsetDebug(); Desliga o flag 32 de FLAGS podendo ser utilizado para mostrar mensagens na console ou alert();
if (PSYS.FLAGS.isDebug()) { Verifica se o FLAG_DEBUG está ligado
    ... comandos para true
}
*/
