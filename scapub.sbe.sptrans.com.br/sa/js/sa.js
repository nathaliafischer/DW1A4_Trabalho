//SCA - Scripts Gerais

//******************************************************************************
//TRATAMENTO DE EVENTOS
//******************************************************************************
//Remove caracteres invalidos de um campo do form
//evt: evento que disparou este metodo, de onde sera obtido o elemento que
//o capturou.
//validChars: string contendo os caracteres validos
//doUpperCase: coloca os caracteres minusculos dos campos em maiusculos.
function removeInvalidChars(evt, validChars, doUpperCase) {
  var vKeyCode;
  if (evt.target) {
    sourceElement = evt.target;
    vKeyCode = evt.which;
  }
  else { //IE
    sourceElement =  event.srcElement;
    vKeyCode = event.keyCode;
  }

  //Para n�o "engolir" a navega�ao pela tecla "tab":
  if (vKeyCode != 9) {
      removeInvalidCharsFromField(sourceElement, validChars, doUpperCase);
  }
}//function removeInvalidChars(evt, validChars, doUpperCase)


//******************************************************************************
//MANIPULACAO DE STRINGS e FORMATACAO DE CAMPOS
//******************************************************************************

function removeInvalidCharsFromField(formField, validChars, doUpperCase) {
    var vFieldValue = formField.value;

    if (trim(doUpperCase).toUpperCase() == "TRUE") {
            vFieldValue = vFieldValue.toUpperCase();
    }

    var vNewValue = "";
    for (vIdx=0; vIdx < vFieldValue.length; vIdx++) {
          if (validChars.indexOf(vFieldValue.substr(vIdx, 1)) != -1) {
             vNewValue = vNewValue + vFieldValue.substr(vIdx, 1);
          }
    }

    formField.value = vNewValue;
}

//Remove espa�os em branco do inicio e do fim das Strings.
//Remove tambem espa�os dublos do meio das strings.
function trim(vValue) {
	var vNewValue = "";
	saParts = vValue.split(" ");

	for (index = 0; index < saParts.length; index++) {
        if(saParts[index] != "") {
			if (vNewValue == "") {
				vNewValue = saParts[index];
			}
			else {
				vNewValue = vNewValue + " " + saParts[index];
			}
		}
	}//for

	return vNewValue;
}//function trim(vValue)

//Coloca vChar a esquerda de vField em quantidade suficiente para que vField
//deixe de ser menor que o valor num�rico vLength.
function padLeftWithChar(vFieldValue, vLength, vChar) {
    vFieldValue = trim(vFieldValue);
    while (vFieldValue.length < parseInt(vLength, 10)) {
        vFieldValue = vChar+vFieldValue;
    }
    return vFieldValue;
}//function padLeftWithChar(vField, vLength, vChar)

function areOnlyZeroes(vString) {
    vString = trim(vString);
    var vZeroes = padLeftWithChar("", vString.length, "0");

    return (vZeroes == vString);
}

function isNumber(vString) {
    var vResult = true;
    vString = trim(vString);
    for(idx = 0; idx < vString.length;  idx++) {
        if ("0123456789".indexOf(vString.substr(idx, 1)) <= -1) {
            vResult = false;
        }
    }
    return vResult;
}

//******************************************************************************
//OPERACOES SOBRE DATA E HORA
//******************************************************************************

function isValidDate(cData) {
    var arrData = cData.split("/");

    if ( arrData.length != 3 ){
    	return false;
    }

    day = parseInt(arrData[0], 10);
    month = parseInt(arrData[1], 10);
    year = parseInt(arrData[2], 10);

    if (month < 1 || month > 12) {
      return false;
    }
    else if (day < 1 || day > 31) {
      return false;
    }
    else if (day > getNumberOfDaysInMonth(month, year)) {
      return false;
    }
    else {
      return true;
    }
}//function isValidDate(day, month, year)


//--Verifica se a primeira data � posterior � segunda.
//Retorna < 0 se a primeira data � posterior � segunda
//Retorna 0 se for igual
//Retorna > 0 se a primeira data for anterior � segunda
function compareDates(firstDay, firstMonth, firstYear, secondDay, secondMonth, secondYear) {
        return (calculateDateInDays(secondDay, secondMonth, secondYear, 1900)
            - calculateDateInDays(firstDay, firstMonth, firstYear, 1900));
}//compareDates


//Retorna true se o ano informado for bissexto
function isLeapYear(year) {
  if ((year % 400)==0) {
    return true;
  }
  else if ((year % 4) == 0 && (year % 100) != 0) {
    return true;
  }
  else {
    return false;
  }
}//isLeapYear

//Calcula a quantidade de dias decorridos desde 01/01/referenceYear ate
//day/month/year
function calculateDateInDays(day, month, year, referenceYear) {
    var vDay = parseInt(day, 10);
    var vMonth = parseInt(month, 10);
    var vYear = parseInt(year, 10);
    var vReferenceYear = parseInt(referenceYear, 10);

    var vDifference = 0;

    for (i = vReferenceYear; i < vYear; i++) {
        if (isLeapYear(i)) {
            vDifference = vDifference + 366;
        }//if (isLeapYear(i))
        else {
            vDifference = vDifference + 365;
        }//else
    }//for

    for (i = 1; i < vMonth; i++) {
        vDifference = vDifference + getNumberOfDaysInMonth(i, vYear);
    }

    vDifference = vDifference + vDay;

    return vDifference;
}//function calculateDateInDays

//Retorna o numero de dias do mes month no ano year.
function getNumberOfDaysInMonth(month, year) {
    var vMonth = parseInt(month, 10);
    var vYear = parseInt(year, 10);

if (vMonth == 1 || vMonth == 3 || vMonth == 5 || vMonth == 7 || vMonth == 8
            || vMonth == 10 || vMonth == 12) {
        return 31;
    }//if (vMonth == 1 || vMonth == 3 || vMonth == 5 || vMonth == 7 || vMonth == 8
    else if (vMonth == 4 || vMonth == 6 || vMonth == 9 || vMonth == 11) {
        return 30;
    }//else if (vMonth == 4 || vMonth == 6 || vMonth == 9 || vMonth == 11)
    else if (vMonth == 2) {
        if (isLeapYear(vYear)) {
            return 29;
        }//if (isLeapYear(vYear))
        else {
            return 28;
        }//else [if (isLeapYear(vYear))]
    }//else if (vMonth == 2)
    else {
        return 0;
    }//else
}//function getNumberOfDaysInMonth(month, year)

/******************************************************************************
* OUTRAS FUNCOES
*******************************************************************************/
function pausecomp(timeInMillis){
    dtBegin = new Date();
    while (1){
      dtNow=new Date();
      diff = dtNow-dtBegin;
      if( diff >= timeInMillis){
          break;
      }
    }//while
}

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };
function getEnderecoByCep(obj){
	var cep = obj.value;
	CepSpAjax.findCepByCep(cep ,
		function(cep){
			if(cep != null){
			    $('endereco').value = cep.tipoLogradouro.trim() + " " + cep.logradouro.trim();
			    $('bairro').value = cep.bairro.trim();
			    $('cidade').value = cep.local.trim();

				var comboEstado = $('estado');
    			for (var opcombo=0;opcombo < comboEstado.length;opcombo++){
		       		if(comboEstado[opcombo].value == cep.estado){
	      				comboEstado.selectedIndex = opcombo;
       				}
			    }
    			$('numero').focus();
   			} else {
   				$('endereco').value = "";
   				$('bairro').value = "";
   				$('cidade').value = "";
				alert("CEP n�o encontrado !");
				obj.focus();
   			}
		}
	);
}

function validaCpf(obj){
	var cpf = obj.value;
	if ( ! isNumber( cpf )){
		alert( 'C.P.F. invalido' );
		obj.focus();
		return;
	}
	Validacoes.validaCpf(cpf,
		function(retorno){
			if(retorno == false) {
				alert("C.P.F. invalido !");
				obj.focus();
			}
		}
	)
}

function onlyNumbers( keypress, object ){
  	if (( keypress < 48) || (keypress > 57)) {
     	event.returnValue = false;
     	alert('Digite somente numeros!');
  	}
}

function verificaNumero(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
}

function sem_acento(e)
{
    var evt = (typeof e.which == "number") ? e.which : e.keyCode;
    var valid_chars = '0123456789abcdefghijlmnopqrstuvxzwykABCDEFGHIJLMNOPQRSTUVXZWYK';
    var chr= String.fromCharCode(evt);      // pegando a tecla digitada
    if (valid_chars.indexOf(chr)>-1 ){
    	return true;
    } // se a tecla estiver na lista de permiss�o permite-a

    // para permitir teclas como <BACKSPACE> adicionamos uma permiss�o para
    // c�digos de tecla menores que 09 por exemplo (geralmente uso menores que 20)
    if (valid_chars.indexOf(chr)>-1 || evt < 9){return true;}
    if (valid_chars.indexOf(chr)>30 || evt <35){return true;} //permite a tecla espa�o

	 mensagemErrors(400, 210, "Aten&ccedil;&atilde;o", "S&oacute; &eacute; permitida a digita&ccedil;&atilde;o de caracteres num&eacute;ricos e letras sem acento." );
	 return false;   // do contr�rio nega
}

function so_numero(e)
{
    var evt = (typeof e.which == "number") ? e.which : e.keyCode;
    var valid_chars = '0123456789';
    var chr= String.fromCharCode(evt);      // pegando a tecla digitada
    if (valid_chars.indexOf(chr)>-1 ){
    	return true;
    } // se a tecla estiver na lista de permiss�o permite-a

    // para permitir teclas como <BACKSPACE> adicionamos uma permiss�o para
    // c�digos de tecla menores que 09 por exemplo (geralmente uso menores que 20)
    if (valid_chars.indexOf(chr)>-1 || evt < 9){return true;}
    if (valid_chars.indexOf(chr)>30 || evt <35){return true;} //permite a tecla espa�o
	 mensagemErrors(400, 210, "Aten&ccedil;&atilde;o", "S&oacute; &eacute; permitida a digita&ccedil;&atilde;o de caracteres num&eacute;ricos." );

    return false;   // do contr�rio nega
}

function SomenteNumero(e){
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return true;
    else{
    	if (tecla==8 || tecla==0) return true;
	else  return false;
    }
}

function validarCPF(cpf)
{
	
	cpf = cpf.split('.').join("");
	cpf = cpf.split('-').join("");
	
	if ( ! isNumber( cpf )){
		return false;
	}
	
	
  var numeros, digitos, soma, i, resultado, digitos_iguais;
  digitos_iguais = 1;
  if (cpf.length < 11)
        return false;
  for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1))
              {
              digitos_iguais = 0;
              break;
              }
  if (!digitos_iguais)
        {
        numeros = cpf.substring(0,9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
              soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
              return false;
        numeros = cpf.substring(0,10);
        soma = 0;
        for (i = 11; i > 1; i--)
              soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
              return false;
        return true;
        }
  else
      return false;
}

function initFacebook() {
	window.fbAsyncInit = function() {
		FB.init({
			appId: '627011407734919',
			cookie: true,
			xfbml: true,
			version: 'v3.2'
	    });
	      
		FB.AppEvents.logPageView();
	};
	
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = 'https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v3.2&appId=627011407734919&autoLogAppEvents=1';
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

function attachSignin(element, callback) {
	auth2.attachClickHandler(element, {},
		function(googleUser) {
			callback(googleUser);
        }, function(error) {
			console.log(JSON.stringify(error, undefined, 2));
		});
}

function initGoogle(element, callback) {
	gapi.load('auth2', function() {
		auth2 = gapi.auth2.init({
			client_id: '502033960324-2d1q5un20gn5oftfd114b2ctsd3foh6n.apps.googleusercontent.com',
			cookiepolicy: 'single_host_origin'
		});
      
		attachSignin(element, callback);
	});
}

function goBack() {
    window.history.back()
}


