<!--
**
 * Group Products List
 *
 * Modelo que renderiza a lista dos produtos de um grupo de Produtos.
 *
 * features  : faz o replace dos campos marcados com #nome_do_campo#
 * version   : 1.0.0
 * package   : Vocatio Telecom
 * subpackage: templates
 * author    : Alcindo Schleder <alcindoschleder@gmail.com>
 *
**
-->
            <div class="row page-header animate-in" data-anim-type="fade-in-left">
                <div class="col-md-1">
                    <div class="close-btn"><i class="ion-ios-close-outline"></i></div>
                </div>
                <div class="col-md-11">
                    <h3>#title_group#</h3>
                </div>
            </div>
            <div class="row pad-bottom animate-in" data-anim-type="fade-in-up">
                <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
                    <div class="row db-padding-btm db-attached">
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-4">
                            #grid_product_detail#
                        </div>
                    </div>
                </div>
            </div>
