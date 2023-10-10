$(function () {
    init();
    eventos();
    ValidarCheckName();
});

function init() {
	$('[data-toggle="tooltip"]').tooltip();  
}

function eventos() {
	// Animación abrir-cerrar registros
	$('.frame .flecha').click(function() {
		var el = $(this).parent().next();
		if( el.height() == 0 ) {
			$(this).find('div')
				.removeClass('flecha-cerrado')
				.addClass('flecha-abierto');
			el.height(el.find("table").height());
		} else {
			$(this).find('div')
				.removeClass('flecha-abierto')
				.addClass('flecha-cerrado');
			el.height(0);
		}
		return false;
	});

	// Clic método de pago
	$('.metodo-pago').click(function(){
		$('.metodo-pago').removeClass('seleccion');
		$(this).addClass('seleccion');
		// Botón
		$('.metodos-pago .boton').removeClass('boton-seleccion');
		$(this).parent().parent().find('.boton').addClass('boton-seleccion');
	});

	// Eliminar registro
	$('.registros .eliminar').click(function(){
		var tr = $(this).parent().parent();

		$.confirm({
		    title: '¡Confirmación!',
		    content: '¿Estás seguro de eliminar el registro?',
		    confirmButton: 'Aceptar',
	    	cancelButton: 'Cancelar',
		    confirm: function(){
		        tr.hide('slow', function(){
					tr.remove();
					// Actualizar total
					var total = 0;
					$("[data-importe]").each(function(index) {
						total += parseFloat($(this).attr('data-importe'));
					});
					$('.total-pagar').text(formatNumber(total));
				});
		    },
		    cancel: function(){}
		});
	});

	// Editar monto
	$('.contenedor-editar-monto').click(function(){
		$(this).find('span').hide();
		$(this).find('input').show().focus();
	});
	// Validar monto input
	$('.contenedor-editar-monto input')
	.keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))
            e.preventDefault();
    })
	.blur(function(){
		var minimo = parseFloat($(this).attr('data-minimo'));
		var pagar = parseFloat($(this).val());

		$(this).parent().find('input')
			.hide()
			.val(pagar < minimo ? minimo : pagar);
		$(this).parent().find('span')
			.show()
			.text('$' + formatNumber(pagar < minimo ? minimo : pagar));
		
        $(this).parent().parent().attr('data-total', pagar < minimo ? minimo : pagar)

		if (pagar < minimo)
			$.alert({
			    title: '¡Alerta!',
			    content: 'No puedes pagar menos del monto mínimo.',
			    confirmButton: 'Aceptar'
			});
	});
}

/*
 * Funcionar para convertir un numero en decimal con dos decimales
 * Agregando el signo $
 */
function formatNumber(num,prefix){
    prefix = prefix || '';
    num += '';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1
    	? '.' + new String(parseFloat('.' + splitStr[1]).toFixed(2)).split('.')[1]
    	: '.00';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
    }
    return prefix + splitLeft + splitRight;
}

function ValidarCheckName() {

    $("input:checkbox").on('click', function () {
        var $box = $(this);
        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });
}

function Notificacion(titulo, contenido, btnAceptar) {
    $.alert({
        columnClass: 'col-md-8 col-md-offset-2',
        title: titulo,
        content: contenido,
        confirmButton: btnAceptar
    });
}