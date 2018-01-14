window.$$ = jQuery.noConflict();
var getParam = (function() {
	var params = (function parse(url) {
		if(url.indexOf('?') != -1) {
			var tmp = url.split('?')[1];
			tmp = tmp.split('&');
			for(var i=0,len=tmp.length;i<len;i++)
				tmp[i] = tmp[i].split('=');
			return tmp;
		}
		return [];
	})(location.href);
	return function(param,url) {
		var list = url?parse(url):params;
		for(var i=0,len=list.length;i<len;i++) {
			if(list[i][0].indexOf(param) != -1)
				return list[i][1];
		}
		return null;
	};
})();
function timedRequisition() {
	jQuery.ajax({
		cache:false,
		dataType:'json',
		timeout:10000,
		url:'/snapQuote.html?code=' + (getParam('indice') || getParam('codigo') || '.BVSP'),
		success:success,
		error:function() {success('timeout');}
	});
}

timedRequisition.execute = function(time) {
	window.timedRequisition.interval = setInterval(timedRequisition,time);
	var span = $$('#infoTable span').get(0);
	span.parentNode.title = span.innerHTML;
	window.timestamp = $$('#infoTable tbody tr td:first').text();
};

function listToSelect(list,id,extras) {
	extras = extras || '';
	list = $$(list);
	var links = $$('a',list),
		select = document.createElement('select'),
		place = list.parent(),
		label = document.createElement('label');
	
	label.htmlFor = select.id = id;
	
	links.each(function() {
		select.options[select.options.length] = new Option(this.textContent || this.innerText, this.href);
	});
	select.onchange = function() {
		var value = this.options[this.options.selectedIndex].value;
		if(extras)
			value += (value.indexOf('?') != -1?'&':'?') + extras;
		location.href = value;
	};
	list.remove();
	label.appendChild(document.createTextNode(place.text()));
	place.empty().append([label,select]);
}

function success(obj) {
	if(obj == 'timeout' || !obj['timestamp'])
		return;
	
	if(obj['timestamp'] != obj['lastUpdate']) {
		if($$('.box-conteudo p.data').length) {
			var time = new Date(obj['lastUpdate']),
				data = [time.getDate(),time.getMonth()+1,time.getFullYear()].join('.'),
				hora = time.toTimeString().split(' ')[0].substr(0,5).replace(':','h'),
				p = $$('.box-conteudo p.last-update');
			
			if(!p.length) {
				p = $$(document.createElement('p'));
				p.addClass('last-update');
				p.hide();
				$$('.box-conteudo p.data').after(p);
			}
			p.text('Última negociação registrada em '+ data +' '+ hora);
			p.show();
		}
	}
	else
		$$('.last-update').hide();
	
	var time = new Date(obj['timestamp']),
		replace = false;
	obj['originalTimestamp'] = time;
	obj['lastUpdate'] = ([time.getDate(),time.getMonth()+1,time.getFullYear()].join('/')) + ' ' + time.toTimeString().substr(0,5);
	obj['timestamp'] = time = time.toTimeString().substr(0,5);
	
	if(window.timestamp == time)
		replace = true;
	window.timestamp = time;
	
	
	
	var intraday = !!$$('#tblIntraday').length;
	
	if(intraday) {
		obj = formatNumbers(obj,['change','pctChange','bid','ask','high','low','open','price']);
		var page = getParam('page');
		if(!page || page == '1')//Caso eu esteja na primeira pagina eu atualizo a tabela
			intradayRefresh(obj,replace);
	}
	else
		obj = formatNumbers(obj,['change','pctChange','high','low','open','price']);
		
	infoRefresh(obj,!!$$('#tag-cotacoes.home').length);
}
//Função para bordas arredondadas
function bordas(elements,callback) {
	if(!elements)
		return;
	var positions = {
			lt:['left','top'],
			lb:['left','bottom'],
			rt:['right','top'],
			rb:['right','bottom']
		};
	$$(elements).each(function(i,element) {
		this.element.css('position','relative');
		if($$.browser.msie && $$.browser.version.toString() == '6.0')
			this.element.css('height',this.element.height() + 'px');
		$$(this.positions).each(function(j) {
			var img = document.createElement('img');
			img.style.position = 'absolute';
			img.src = '/stc/i/' + this + '.gif';
			img.className = this;
			img.style[positions[this][0]] = img.style[positions[this][1]] = '-1px';
			element.element.append(img);
		});
	});
	if(callback) {
		try {
			callback();
		}catch(e){}
	}
}
//bordas([{element:$$('#frm-busca-ativos'),positions:['lt','lb','rt','rb']}]);

function formatNumbers(obj,list) {
	for(var i=0,len=list.length;i<len;i++) {
		var number = obj[list[i]];
		number = number.split(',');
		if(number.length === 1)
			number[number.length] = '00';
		else if(number[1].length < 2)
			number[1] += '0';
		obj[list[i]] = number.join(',');
	}
	return obj;
}
//Função para atualizar a tabela de informações gerais
function infoRefresh(obj) {
	if(!arguments[1]) {
		var columns = ['timestamp','change','pctChange','price','high','low','open','volume'],
			tr = document.createElement('tr'),
			td = document.createElement('th'),
			span = document.createElement('span');
		
		span.appendChild(document.createTextNode(obj['tick']));
		span.className = 'tick';
		td.appendChild(span);
		tr.className = td.title = obj['tick'];
		tr.appendChild(td);
		
		for(var i=0,len=columns.length;i<len;i++) {
			td = document.createElement('td');
			td.appendChild(document.createTextNode(obj[columns[i]]));
			if(columns[i] == 'price')
				td.className = 'ultima';
			tr.appendChild(td);
		}
		$$('#infoTable table:first').fadeOut('fast',function() {
			$$('tbody tr',this).replaceWith(tr);
			$$(this).fadeIn('fast');
		});
	}
	else {
		$$('#infoTable table:first tbody tr').fadeOut('fast',function() {
			$$('td',this).text(obj['price']);
			$$('th',this).attr('title',obj['tick']);
			$$('th span',this).text(obj['pctChange'] + ' %');
			this.className = obj['tick'];
			$$(this).fadeIn('fast');
		});
		var span = $$('#infoTable > span'),
			time = obj['originalTimestamp'];
		time = ([time.getDate(),['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][time.getMonth()],time.getFullYear()].join('.')) + ' ' + time.toTimeString().substr(0,5).replace(':','h');
		if(span.length)
			span.text(time);
		else
			$$('#infoTable').append('<span>' + time + '</span>');
	}
	
}