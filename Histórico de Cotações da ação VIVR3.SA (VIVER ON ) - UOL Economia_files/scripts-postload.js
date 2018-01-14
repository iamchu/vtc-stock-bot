// barra UOL //
writeUOLBar(BarraNumero,BarraCor1,BarraCor2);

// copyright //
writeCopyright();

// colunas que serao ajustadas pelo equalize() //
cols = [ 'col-centro','col-centro-full','col-direita','col-esquerda' ]

var bFs = ($('barrauol')) ? $('barrauol').offsetWidth/76 : 0 ;
/*function equalize() {
	maxHeight = 0;
	for(i=0,n=arguments.length;i<n;i++) cols.push(arguments[i]);
	for(i=0,n=cols.length;i<n;i++) if($(cols[i])) if($(cols[i]).clientHeight > maxHeight) maxHeight = $(cols[i]).clientHeight;
	for(i=0,n=cols.length;i<n;i++) if($(cols[i])) $(cols[i]).style.height = maxHeight/bFs  +'em';
}*/

function equalize() {
	maxHeight = 0;
	div = document.getElementById("col-centro");
	for(i=0,n=arguments.length;i<n;i++) cols.push(arguments[i]);
	for(i=0,n=cols.length;i<n;i++) if($(cols[i])) if(($(cols[i]).clientHeight + $(cols[i]).offsetTop) > maxHeight) maxHeight = $(cols[i]).clientHeight + $(cols[i]).offsetTop;
	for(i=0,n=cols.length;i<n;i++) if($(cols[i])) $(cols[i]).style.height = (maxHeight - $(cols[i]).offsetTop)/bFs  +'em';
}

equalize();

function reequalize(){
  for( var i in cols ) if($(cols[i])) $(cols[i]).style.height = "";
  equalize(); 
}

// encontra posição de elementos //
function findPos(bId, sum) {
	obj = $(bId);
	var curtop = 0;
	if(obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if(obj.y) curtop += obj.y;
	return curtop;
}

// posiciona elementos na tela //
function placePos(bId, pos, sum) {
	if(bFs != 0) $(bId).style.top = (sum+pos)/bFs+'em';
}

// uol busca //
var ultimaBarraSel = $('abas').getElementsByTagName('a')[1];
var docForm = $('form1');
function UOLBusca(s){
    if(ultimaBarraSel!="" && ultimaBarraSel!=s){
        ultimaBarraSel.className="";
        ultimaBarraSel.nextSibling.style.visibility=ultimaBarraSel.previousSibling.style.visibility='visible';
    }

    s.nextSibling.style.visibility=s.previousSibling.style.visibility='hidden';
    s.blur();
    s.className="sel";
    ultimaBarraSel=s;
    dC.formb.skin.disabled=dC.formb.id.disabled=dC.formb.rd.disabled = (s.innerHTML=='Notícias') ? "" : "disabled" ;
    
    if(s.innerHTML=='Web') dC.formb.action = "http://busca.uol.com.br/www/index.html";
    else if(s.innerHTML=='Notícias') dC.formb.action = "http://noticias.uol.com.br/busca";
    else if(s.innerHTML=='Imagens') dC.formb.action = "http://busca.uol.com.br/imagem/index.html";
    else if(s.innerHTML=='Vídeo') dC.formb.action = "http://busca.uol.com.br/video/index.html";
    else if(s.innerHTML=='Preços') dC.formb.action = "http://shopping.uol.com.br/busca.html";

    docForm.getElementsByTagName('input')[0].focus();
}

function getSubchan() {
	var dir = [ 'impostoderenda', 'ultnot', 'cotacoes', 'financas', 'negocios' ];
	var canal = [ 'economiair', 'economianoticias', 'cotacoes', 'economiafin', 'economianegocios' ];
	for(var i=0;i<dir.length;i++) 
		if (location.href.indexOf('economia.uol.com.br/'+dir[i]) != -1)
		{
			return canal[i];
		}
		else if (location.href == 'http://economia.uol.com.br/' || location.href == 'http://economia.uol.com.br/index.jhtm') {
			return 'capa';
		}
	return 'outros';
}

// config banners
var DEpopcfg ="POPecon"; // Popup
var DEsite="uolbr";		// Site, este valor tambem é usado no parametro affiliate
var DEchan="economia";	// Canal
var DEsubc=getSubchan();
var Expble=1;	
var Expble=1;
var DEconn=document.body; DEconn.style.behavior='url(#default#clientCaps)'; DEconn=(DEconn.connectionType=='lan')?1:0;

// mostra banners //
var DEt=new Date(); DEt=DEt.getTime(); DErand=Math.floor(DEt*1000*Math.random());
var scw=0,sch=0; if(screen.height){scw=screen.width;sch=screen.height;}
function DEshow(ad,pos,sum){
if(document.getElementById('banner-'+ad+'-area') && ((ad=='218x174' && screen.width>1000) || ad!='218x174') ) {
	document.write('<'+'scr'+'ipt type="text/javascript" src="http://bn.uol.com.br/js.ng/site='+DEsite+'&amp;chan='+DEchan+'&amp;subchan='+DEsubc+'&amp;affiliate='+DEsite+DEchan+'&amp;size='+ad+'&amp;page='+pos+'&amp;conntype='+DEconn+'&amp;expble='+Expble+'&amp;reso='+scw+'x'+sch+'&amp;tile='+DErand+'?"><\/scr'+'ipt>');
		if(ad!='1x1'&&ad!='300x250') placePos('banner-'+ad, findPos('banner-'+ad+'-area'), sum); // se não é popup, posiciona na tela
		// adição de javascript para solucionar espaço vazio do banner 180x150 das matérias
		if(ad=="180x150") { 
			var loadBanner=window.setInterval( function() { 
			  var banner=document.getElementById('banner-'+ad).childNodes;
			  var width = document.getElementById('banner-'+ad+'-area').offsetWidth;

			  for(var i=0; i<banner.length;i++) {
				document.getElementById('banner-'+ad+'-area').appendChild(banner[i]);
			  }

			  if( width != document.getElementById('banner-'+ad+'-area').offsetWidth){
				  reequalize();
				  window.clearInterval(loadBanner);
			  }		  
			}, 500 );
		}			
	}
}

// popup //
if(document.cookie.indexOf(DEpopcfg)==-1) { 
	document.cookie=DEpopcfg+"0"; 
	DEshow('1x1',11); 
}
	
// xiculira js
function setBordas()
{
  var div = document.getElementsByTagName("div");
  var cls = ["top-left","top-right","bottom-left","bottom-right"];
  
  function createDiv( cls )
  {
    var div = document.createElement("div");
    
    div.className = "canto " + cls;
    return div
  }
  
  for( var i =0; i<div.length; i++)
  {
    if( div[i].className.indexOf("borda")>=0 )
    {
          for( var j in cls )
          {
            div[i].appendChild( createDiv( cls[j] ) );
          }
    }
  }
}
setBordas();

// GetMethodParserJS ////
L=location.href;
d=L.substring(L.indexOf("?")+1);
c=v=new Array(); c=d.split("&"); cl=c.length;
for(i=0;i<cl&&cl>0;i++) {
v=c[i].split("="); if(v.length>1)
eval(v[0]+"=unescape('"+v[1].replace(/\+/g," ")+"')");}
/////////////////////////

// Busca do Glassário
function standardizeString( str )
{
  var re1 = /[¹]/gi;
  var re2 = /[²]/gi;
  var re3 = /[³]/gi;
  var reA = /[áàãâäª]/gi;
  var reC = /[ç¢]/gi;
  var reE = /[éèêë&]/gi;
  var reI = /[íìîï]/gi;
  var reN = /[ñ]/gi;
  var reO = /[óòõôöº]/gi;
  var reU = /[úùûü]/gi;
  
  str = str.toLowerCase();
  
  str = str.replace( re1, "1" );
  str = str.replace( re2, "2" );
  str = str.replace( re3, "3" );
  str = str.replace( reA, "a" );
  str = str.replace( reC, "c" );
  str = str.replace( reE, "e" );
  str = str.replace( reI, "i" );
  str = str.replace( reN, "n" );
  str = str.replace( reO, "o" );
  str = str.replace( reU, "u" );
  
  return str;
}

function doSearch( termo )
{
  termo = standardizeString( termo );
   
  var re = eval( "/(" + termo.replace(/ /g,"|") + ")/i" );
  var ocorrencias = 0;
  
  ul.innerHTML = "";
  
  for( var i in lista )
  {
    if( standardizeString( lista[i].getElementsByTagName("a")[0].innerHTML ).match( re ) )
    {
      ul.appendChild( lista[i] );
      ocorrencias++;
    }
  }
  document.getElementById("ocorrencias").innerHTML = ocorrencias.toString() + " ";
  document.getElementById("ocorrencias").innerHTML += (ocorrencias==1)?"ocorrência":"ocorrências"
  reequalize();
}

var ul;
var li;
var lista;

function loadGlossario() 
{
  if (typeof termo != "undefined" )
  {
    lista = new Array();
    ul = document.getElementById("glossario").getElementsByTagName("ul")[0];
    li = ul.getElementsByTagName("li");
    var len = li.length; 
    removeClass( ul, "ready" );
    addClass( ul, "loading" );
    for( var i = 0; i < len; i++ )
    {
      lista.push( li[0] );
      ul.removeChild( li[0] );
    }
    addClass( ul, "ready" );
    removeClass( ul, "loading" );
  
    doSearch( termo );
  } 
}



function changeLinks()
{
  var link = document.getElementsByTagName("a");
  for( var i = 0; i < link.length; i++ )
  {
    link[i].href = link[i].href.replace(/http:\/\/noticias\.uol\.com\.br\/economia/i,"http://economia.uol.com.br");
  }
}
changeLinks();


// copyright agencias //
function writeCopyrightAgencias()
{
	var l = document.location.href;
	var p = document.createElement("p");
	var txt = new String();
	var copyright = document.getElementById("copyright");
	var parent = copyright.parentNode;
	
	if(l.indexOf('/afp')>=0){
		txt = "Todos os direitos de reprodução e representação reservados. 2000 Agence France-Presse. Todas as informações reproduzidas são protegidas por direitos de propriedade intelectual detidos pela AFP. Por conseguinte, nenhuma destas informações pode ser reproduzida, modificada, armazenada, redifundida, traduzida, explorada comercialmente ou reutilizada sem o consentimento prévio por escrito da AFP.";	
	} else if(l.indexOf('/efe')>=0){
		txt = "\"© Agencia Efe\". Todos os direitos reservados. É proibido todo tipo de reprodução sem autorização escrita da Agencia Efe.";
	} else if(l.indexOf('/reuters')>=0){
		txt = "Reuters Limited - todos os direitos reservados. O conteúdo Reuters é de propriedade intelectual da Reuters Limited. Qualquer cópia, republicação ou redistribuição do Conteúdo Reuters, inclusive por armazenamento rápido, enquadramento ou outros meios semelhantes, estão expressamente proibidas sem o consentimento prévio por escrito da Reuters. A Reuters não será responsável por quaisquer erros ou atrasos no Conteúdo, ou por quaisquer medidas tomadas na ocorrência dos fatos ora descritos.";
	}
	p.innerHTML = txt;
	parentNode.insertBefore( copyright, p );
	
}

function removeCodes()
{
  if( !$("box-enquete") && $("materia") )
  {
    $("materia").innerHTML = $("materia").innerHTML.replace(/( *)?&lt;[a-z0-9 \._=-]*&gt;( *)?/gi," ") 
  }
}
removeCodes();

formatVaricao();

//equaliza coluna de UL
function equalizeCols()
{
  var ul = document.getElementsByTagName("ul");
  var li;
  var cols;
  var resto;
   
  for( var i = 0; i < ul.length; i++ )
  {
    if( existsClass( ul[i], "equalizeCols" ) )
    {
      cols = Math.floor( ul[i].offsetWidth / ul[i].getElementsByTagName("li")[0].offsetWidth );
      resto = Math.round( ul[i].getElementsByTagName("li").length % cols );
      if( resto > 0 )
      {
        for( var j = 0; j < ( cols - resto ); j++ )
        {
          li = document.createElement("li");
          ul[i].appendChild( li );
        }
      }
    }
  }
}
window.setTimeout( "equalizeCols();", 200 );

