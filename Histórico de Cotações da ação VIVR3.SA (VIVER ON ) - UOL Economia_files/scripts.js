// config da barra
var BarraNumero = 24;
var BarraCor1 = '#7F8DA8'; // cor clara
var BarraCor2 = '#667077'; // cor escura

var dC = document;

function $(id) {
	return document.getElementById(id);
}

// conversor de moedas
function gera_lista( nome )
{
	var html="";
	html+="<select class=\"sel-moeda-conv\" id=\""+nome+"\" name=\""+nome+"\">";
	html+="<option value=\"\" selected>escolha uma moeda</option>";
	if(nome=="de")	
	{
		for(i=0;i<nMoeda.length;i++)
		{
			html+="<option value=\""+ vMoeda[i] +"\">"+nMoeda[i]+" - "+tMoeda[i]+"</option>";
		}
	} 
	else if(nome=="para")
	{
		for(i=0;i<nMoeda.length;i++)
		{
			html+="<option value=\""+ vMoeda[i] +"-"+ tMoeda[i] +"-"+pMoeda[i]+"\">"+nMoeda[i]+" - "+tMoeda[i]+"</option>";
		}		
	}	
	html+="</select>";
	document.write( html );
}

function conversor() {
/*var v1 = o1.value;
var v2 = o2.value;
var v3 = o3.value;*/
var v1 = document.getElementById('de').value;
var v2 = document.getElementById('para').value;
var v3 = document.getElementById('valor').value.replace(/\./g,"");
var resp = document.getElementById('resultado');
var com = 0;
var com1 = 0;

//Mensagens
if (v1 =='') {alert('Escolha uma moeda no campo "DE" para realizar a conversão.')} else {
	v1a = v1.split("|");
	v1 = v1a[0];
	tpMoedaV1 = v1a[1];
}
 if (v2 =='') {alert('Escolha uma moeda no campo "PARA" a fim de realizar a conversão.')} else {
	v2a = v2.split("|");
	v2 = v2a[0];
	tpMoedaV2a = v2a[1].split("-");
	tpMoedaV2 = tpMoedaV2a[0];

	//compara moedas
	com = v2+'|'+tpMoedaV2;
	com1 = v1+'|'+tpMoedaV1;
}
if (v3 == '') {alert('Digite um valor para realizar a conversão.')}
else if (com == com1) { alert('Escolher moedas diferentes para realizar a conversão.')}
else {
	//checa se tem virgula (centavos)
	v3a = v3.split(",");
	if (v3a[1] != null) {v3 = v3a[0]+'.'+v3a[1];}

	//realiza o cálculo
	if (tpMoedaV1==1 && tpMoedaV2==1) {
		vtotal = (v2/v1)*v3;
	}
	else if (tpMoedaV1==2 || tpMoedaV2==2) {
		if (tpMoedaV1==2 && tpMoedaV2==3) {
			if (tpMoedaV1==3) {v1 = v1/v1;}
			if (tpMoedaV2==3) {v2 = v2/v2;}
			vtotal = v1*v3;
		} else if (tpMoedaV1==3 && tpMoedaV2==2) {
			if (tpMoedaV1==3) {v1 = v1/v1;}
			if (tpMoedaV2==3) {v2 = v2/v2;}
			vtotal = (1/v2)*v3;
		} else {
			if (tpMoedaV1==2) {v1 = 1/v1;}
			if (tpMoedaV2==2) {v2 = 1/v2;}
			vtotal = (v2/v1)*v3;
		}
	} 
	else if (tpMoedaV1==3 || tpMoedaV2==3) {
		if (tpMoedaV1==3) {v1 = v1/v1;}
		if (tpMoedaV2==3) {v2 = v2/v2;}
		vtotal = (v2/v1)*v3;
	} 

	aux = vtotal;
	aux1 = new String(aux);
	aux1 = aux1.indexOf('.');

	//printa na tela o resultado
	vtotal = vtotal.toString().split(".");
	danilo = vtotal[1];

	if (aux1 > 0) {vtotal = vtotal[0]+','+vtotal[1].substring(0,3);}
	if (aux < 2){resp.value = vtotal+' '+tpMoedaV2a[1];} else {resp.value = vtotal+' '+tpMoedaV2a[2];}
		
}}

// Cotacoes - Graficos
function get_moeda_nome()
{
	b = new Array(
	"BRL=BRBY|Dólar comercial| ", 
	"BRLP=|Dólar paralelo| ",
	"BRLT=|Dólar turismo| ",
	
	"ZAR=X|África do Sul|rand",
	"DZD=X|Argélia|dinar",
	"SAR=X|Arábia Saudita|rial saudita",
	"ARS=X|Argentina|peso",
	"AUD=X|Austrália|dólar australiano",

	"BDT=X|Bangladesh|teca",
	"BYR=X|Belarus|rublo bielo-russo",
	"BGN=X|Bulgária|lev",

	"CAD=X|Canadá|dólar canadense",
	"KZT=X|Cazaquistão|tenge",
	"SGD=X|Cingapura|dólar de Cingapura",
	"CLP=X|Chile|peso",
	"CNY=X|China|yuan",
	//"COP=X|Chipre|libra cipriota",
	"COP=X|Colombia|peso colombiano",
	"KRW=X|Coréia do Sul|won sul-coreano",
	"HRK=X|Croácia|kuna",

	"DKK=X|Dinamarca|coroa dinamarquesa",

	"EGP=X|Egito|libra egípcia",
	"SKK=X|Eslováquia|coroa eslovaca",
	"SIT=X|Eslovênia|tolar",
	"EEK=X|Estônia|coroa estoniana",
	"EUR=X|Euro| ",

	"PHP=X|Filipinas|peso filipino",

	"ISK=X|Groenlândia|coroa da Groenlândia",

	"HKD=X|Hong Kong|dólar de Hong Kong",
	"HUF=X|Hungria|florim",

	"INR=X|Índia|rupia indiana",
	"IDR=X|Indonésia|rupia indonésia",
	"IRR=X|Irã|rial iraniano",
	"ILS=X|Israel|shekel novo",

	"JPY=X|Japão|iene",
	"JOD=X|Jordânia|dinar jordaniano",

	"KWD=X|Kuait|dinar kuaitiano",

  "LAK=X|Laos|kip laosiano",
	"LVL=X|Letônia|lat",
	"LBP=X|Líbano|libra libanesa",
	"LYD=X|Líbia|dinar líbio",
	"LTL=X|Lituânia|litas",

	"MYR=X|Malásia|ringgit",
	"MTL=X|Malta|lira maltesa",
	"MAD=X|Marrocos|dirham marroquino",
	"MXN=X|México|peso novo mexicano",
	"MDL=X|Moldova|leu",

	"NAD=X|Namíbia|dólar namibiano",
	"NIO=X|Nicarágua|cordoba",
  "NOK=X|Noruega|coroa noruequesa",
	"NZD=X|Nova Zelândia|dólar da Nova Zelândia",

	"PKR=X|Paquistão|rupia paquistanesa",
	"PYG=X|Paraguai|guarani",
	"PEN=X|Peru|sol novo",
	"PLN=X|Polônia|zloty",

	"QAR=X|Qatar|rial de Qatar",
	"KES=X|Quênia|xelim queniano",

	"GBP=X|Reino Unido|libra esterlina",
	"CZK=X|República Tcheca|coroa tcheca",
	"RON=X|Romênia|leu",
	"RUB=X|Rússia|rublo",

	"SYP=X|libra síria",
	"LKR=X|Sri Lanka|rupia cingalesa",
	"SEK=X|Suécia|coroa sueca",
	"CHF=X|Suíça|franco suíço",

	"THB=X|Tailândia|baht",
	"TWD=X|Taiwan|dólar taiwanês",
	"TND=X|Tunísia|dinar tunisiano",
	"TRY=X|Turquia|lira",

	"UAH=X|Ucrânia|hrivna",
	"UYU=X|Uruguai|peso uruguaio",

	"ZWD=X|Zimbábue|dólar do Zimbábue");
	
	var nome = "";
	
	for(i=0;i<b.length;i++) 
	{
		c = b[i].split("|");
		if(RIC+"="+parametro == c[0]) 
		{
			nome=b[i];
		}
	}
	
	return nome;
}

function get_nome( bolsa )
{
	nome="";
	switch( bolsa )
	{
		case ".BVSP": nome="Bovespa"; break
		case ".MXX": nome="México"; break
		case ".AORD": nome="Austrália"; break
		case ".IGPA": nome="Chile"; break
		case ".FCHI": nome="França"; break
		case ".ISEQ": nome="Irlanda"; break
		case ".TA100": nome="Israel"; break
		case ".IGRA": nome="Peru"; break
		case ".PX": nome="Rep. Tcheca"; break
		case ".XU100": nome="Turquia"; break
		case ".IBC": nome="Venezuela"; break
		case ".MERV": nome="Argentina"; break
	}
	
	if(nome!="")
	{
		return nome;
	}	
	else
	{
		alert("Bolsa inválida");
		return false;
	}
}

function selectAba( obj )
{
  var list = obj.parentNode.parentNode;
  var li = list.getElementsByTagName("li");
  var body = document.getElementsByTagName("body")[0];
  
  for( var i = 0; i < li.length; i++ )
  {
    if( existsClass( body, li[i].getElementsByTagName("a")[0].id ) )
    {
      removeClass( body, li[i].getElementsByTagName("a")[0].id );
    }
  }
  addClass( body, obj.id );
  return true;
}

// funções para manipular classes de objetos DOM //
function getArrayFromClasses( obj )
{
  var classes = obj.className.split(" ");
  if( classes.length == 1 && classes[0] == "" )
  {
    classes = new Array();
  }  
  
  return classes;
}

function setClassesStringFromArray( classes )
{
  return classes.join(" ");
}

function addClass( obj, className )
{
  var classes = getArrayFromClasses( obj );
  classes.push( className );
  obj.className = setClassesStringFromArray( classes );
}

function removeClass( obj, className )
{
  var classes = getArrayFromClasses( obj );
  for(i in classes)
  {
    if(classes[i] == className)
    {
      classes.splice(i,1);
    }
  }
  obj.className = setClassesStringFromArray( classes );  
}

function clearClasses( obj )
{
  var classes = new Array();
  obj.className = setClassesStringFromArray( classes );
}

function existsClass( obj, className )
{
  var classes = getArrayFromClasses( obj );
  for(i in classes)
  {
    if(classes[i] == className)
    {
      return true;
    }
  }
  return false;
}

// formata variacao
function formatVaricao()
{
  var span = document.getElementsByTagName("span");
  var value;
  var className = new String();
  
  for( var i = 0; i < span.length; i++ )
  {
    if( existsClass( span[i], "variacao" ) )
    {
      value = span[i].innerHTML.replace(/,/,".").replace(/[ %\.]/g,"");
      if( value > 0 )
      {
        className = "alta";
      }
      else if ( value < 0 )
      {
        className = "baixa";
      }
      else if ( value == 0 )
      {
        className = "estavel";
      }
      addClass( span[i], className );
      span[i].innerHTML = span[i].innerHTML.replace(/-/,"");
    }
  }
}
