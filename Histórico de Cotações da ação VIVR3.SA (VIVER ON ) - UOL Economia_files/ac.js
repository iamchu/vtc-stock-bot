$$(document).ready(function() {
	var campo = $$('#searchParameter');
	if(campo.length)
		window.campo = new autoComplete(campo);
	else {
		campo = $$('#cpoBusca');
		if(campo.length)
			window.campo = new autoComplete(campo);
	}
});


function voidDefault(evt) {
	evt.preventDefault && evt.preventDefault();
	evt.returnValue = false;
	evt.stopPropagation && evt.stopPropagation();
	evt.cancelBubble = true;
}


function autoComplete(field) {
	field.attr('autocomplete','off');//Removendo auto-complete do navegador
	this.field = field;
	this.value = field.val();//Guardando o value do input
	this.selected = false;//flag de seleção
	this.wait = false;//flag de exibição
	
	//Teclas
	this.enter = 13;
	this.up = 38;
	this.down = 40;
	this.esc = 27;
	
	//Box que ficarão as listas
	var list = this.list = $$(document.createElement('div'));
	list.addClass('autoCompleteList');//class pra formatar no CSS
	var pos = field.position();
	list.css({
		'position':'absolute',
		'left':pos.left,
		'top':pos.top + field.height() + 4,
		'display':'none',
		'z-index':'10'
	});
	field.parent().append(list);
	
	
	this.filterEvent = function(evt) {
		var type = evt.type,
			field = evt.target,
			key = evt.originalEvent.keyCode;
		evt = evt.originalEvent;
		
		//Filtro de teclas
		if(type == 'keyup') {//Ação padrão
			if(this.value != $$.trim(field.value)) {//Caso mude o valor do campo, faço uma nova consulta
				this.hide();
				this.value = $$.trim(field.value);
				this.execute();
			}
			else {
				voidDefault(evt);
				switch(key) {
					case this.up://Cima
						this.navigation('up');
						break;
					case this.down://Baixo
						this.navigation('down');
						break;
					case this.esc://Esc
						this.hide();
						break;
					case this.enter://Enter
						this.confirm();
				}	
			}
		}
		else {//Tem navegador que da o submit no keydown do Enter
			key == this.enter && voidDefault(evt);
		}
	};
	
	
	this.hide = function() {//Ocultar a lista
		this.list.hide('fast');
		$$('#iframeBack').remove();
	};
	this.confirm = function() {//"Submitar" o formulario da busca
		if(this.selected) {
			var selected = $$('.' + this.selected + ' :first',this.list);
			
			selected.length && this.field.val(selected.text());
		}
		field.get(0).form.submit();
		this.hide();
	};
	this.navigation = function(direction) {//Navegação pelo teclado
		if(this.list.css('display') == 'none')//Caso não esteja aparecendo a lista
			return this.execute();
		var list = $$('li',this.list),
			active = $$('.ativo',this.list);
		
		if(list.length <= 1)//Se tiver um item só, não precisa ter navegação
			return;
		
		if(this.selected === false || !active.length) {//Geralmente a primeira vez q a lista é criada
			if(direction == 'down') {
				this.selected = list.get(0).className;
				$$(list.get(0)).addClass('ativo');
			}
			else {
				this.selected = list.get(list.length - 1).className;
				$$(list.get(list.length - 1)).addClass('ativo');
			}
			return;
		}
		
		active = active.removeClass('ativo').get(0);
		
		
		active = direction=='down'?//Ação dependendo da tecla
			active.nextSibling || active.parentNode.firstChild://Seta pra baixo
			active.previousSibling || active.parentNode.lastChild;//Seta pra cima
		
		this.selected = active.className;//adicionando a classe da LI no selected
		$$(active).addClass('ativo');
	};
	
	this.execute = function() {//Executar Verificação
		if((this.value = $$.trim(this.value)) == '')//Não podemos exibir uma lista vazia
			return this.hide();
		
		$$.getJSON('/acao/busca.html',{resp:'json',searchParameter:this.value},binder(this,this.createList));//Requisição do valor do campo
		this.wait = true;
	};
	
	this.createList = function(values) {//Gerando lista
		this.wait = false;
		if($$('ul',this.list).length) {//Caso a lista ja exista
			var list = $$('ul',this.list),
				a = $$('a',this.list),
				li;
			
			a.attr('href','/acao/busca.html?resp=list&showAllResults=-1&searchParameter=' + this.value);//Link "Ver todos"
			a.text('Ver todos os resultados para "' + this.value + '"');
			a.attr('target','_top');
			list.empty();//Preciso limpar o conteudo da lista
		}
		else {//Caso seja a primeira vez que estamos gerando a lista
			var list = $$(document.createElement('ul')),
				a = $$(document.createElement('a')),
				li,span;
			
			list.addClass('clear-box');
			a.attr('href', '/acao/busca.html?resp=list&showAllResults=-1&searchParameter=' + this.value);//Link "Ver todos"
			a.text('Ver todos os resultados para "' + this.value + '"');
			a.attr('target','_top');
			
			this.list.append(list);//Adiciono a lista no box dela
			this.list.append(a);//Adicionando link "Ver Todos"
		}
		
		if(values.length && this.value) {//Evitando Bugs
			var re = new RegExp('(^|\\s)(' + this.value + ')','gi');//Busca pelo texto pra deixar em negrito
			for(var i=0,len=values.length,value,code,company;i<len;i++) {
				value = values[i];
				code = value['code'];
				company = value['company'];
				
				li = $$(document.createElement('li'));
				li.addClass(code.replace(/\./g,'').replace(/\s/g,'').toLowerCase());//Adicionando a classe de identificação na li
				
				//Código da empresa
				span = $$(document.createElement('span'));
				code = code.replace(re,'<strong>$1$2<\/strong>');
				span.html(code);
				span.addClass('code');
				li.append(span);
				
				//Nome da Empresa
				span = $$(document.createElement('span'));
				company = company.replace(re,'<strong>$1$2<\/strong>');
				span.html(company);
				span.addClass('company');
				li.append(span);
				//Efeito de mouseover
				li.bind('mouseover',this,function(evt) {
					var that = this;
					if(that.tagName.toLowerCase() != 'li') {
						while(that.tagName.toLowerCase() != 'li')
							that = that.parentNode;
					}
						
					$$('.ativo',evt.data.list).removeClass('ativo');
					evt.data.selected = that.className;
					$$(that).addClass('ativo');
				});
				
				li.bind('click',this,function(evt) {evt.data.confirm.apply(evt.data);})
				
				//adicionando li a lista
				list.append(li);
			}
			
			if(this.selected) {
				$$('li',this.list).removeClass('ativo');
				var ativo = $$('.' + this.selected,list);
				if(ativo.length)//Se o ativo ja existia antes
					ativo.addClass('ativo');
			}
			
			this.list.show('fast',binder(this,function() {
				if($$.browser.msie && $$.browser.version.toString() == '6.0') {
					var pos = this.list.position();
					bgIframe({
						width:(this.list.width() + 18) + 'px',
						height:(this.list.height() + 18) + 'px',
						left:pos.left + 'px',
						top:pos.top + 'px',
						'z-index':9,
						position:'absolute'
					},this.list);
				}
			}));//Exibe a lista
		}
		else
			this.hide();//Ocultando por motivos de Bug (eu acho)
	};
	
	
	
	field.bind('blur',this,function(evt) {
		setTimeout(function() {evt.data.hide.apply(evt.data)},100);//Da problemas nas funcionalidades, pq o evento é disparado antes do submit
	});
	field.bind('keyup keydown',this,function(evt) {evt.data.filterEvent.apply(evt.data,[evt]);});
	if($$.browser.opera)//o Opera "submita" no onkeypress do Enter
		field.keypress(function(evt) {if(evt.keyCode == 13)voidDefault(evt);});
}
function binder(scope,fn) {//Função pra alterar escopo de eventos
	return function() {
		for(var i=0,a=[];i<arguments.length;i++)
			a[a.length] = arguments[i];
		fn.apply(scope,a);
	};
}
function bgIframe(cfg,ref) {
	var iframe = document.createElement('iframe');
	$$(iframe).attr({'src':'j avascript:"<html></html>";','id':'iframeBack'}).css(cfg);
	iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
	$$(ref).parent().append(iframe);
}