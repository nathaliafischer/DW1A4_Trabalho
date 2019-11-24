/************************************************************************************************************
*	DHTML modal dialog box
*
*	Created:						August, 26th, 2006
*	@class Purpose of class:		Display a modal dialog box on the screen.
*
*	Css files used by this script:	modal-message.css
*
*	Demos of this class:			demo-modal-message-1.html
*
* 	Update log:
*
************************************************************************************************************/


/**
* @constructor
*/

DHTML_modalMessage = function()
{
	var url;								// url of modal message
	var htmlOfModalMessage;					// html of modal message

	var divs_transparentDiv;				// Transparent div covering page content
	var divs_content;						// Modal message div.
	var iframe;								// Iframe used in ie
	var layoutCss;							// Name of css file;
	var width;								// Width of message box
	var height;								// Height of message box

	var existingBodyOverFlowStyle;			// Existing body overflow css
	var dynContentObj;						// Reference to dynamic content object
	var cssClassOfMessageBox;				// Alternative css class of message box - in case you want a different appearance on one of them
	var shadowDivVisible;					// Shadow div visible ?
	var shadowOffset; 						// X and Y offset of shadow(pixels from content box)
	var MSIE;

	this.url = '';							// Default url is blank
	this.htmlOfModalMessage = '';			// Default message is blank
	this.layoutCss = 'modal-message.css';	// Default CSS file
	this.height = 200;						// Default height of modal message
	this.width = 400;						// Default width of modal message
	this.cssClassOfMessageBox = false;		// Default alternative css class for the message box
	this.shadowDivVisible = true;			// Shadow div is visible by default
	this.shadowOffset = 5;					// Default shadow offset.
	this.MSIE = false;
	if(navigator.userAgent.indexOf('MSIE')>=0) this.MSIE = true;


}

DHTML_modalMessage.prototype = {
	// {{{ setSource(urlOfSource)
    /**
     *	Set source of the modal dialog box
     *
     *
     * @public
     */
	setSource : function(urlOfSource)
	{
		this.url = urlOfSource;

	}
	// }}}
	,
	// {{{ setHtmlContent(newHtmlContent)
    /**
     *	Setting static HTML content for the modal dialog box.
     *
     *	@param String newHtmlContent = Static HTML content of box
     *
     * @public
     */
	setHtmlContent : function(newHtmlContent)
	{
		this.htmlOfModalMessage = newHtmlContent;

	}
	// }}}
	,
	// {{{ setSize(width,height)
    /**
     *	Set the size of the modal dialog box
     *
     *	@param int width = width of box
     *	@param int height = height of box
     *
     * @public
     */
	setSize : function(width,height)
	{
		if(width)this.width = width;
		if(height)this.height = height;
	}
	// }}}
	,
	// {{{ setCssClassMessageBox(newCssClass)
    /**
     *	Assign the message box to a new css class.(in case you wants a different appearance on one of them)
     *
     *	@param String newCssClass = Name of new css class (Pass false if you want to change back to default)
     *
     * @public
     */
	setCssClassMessageBox : function(newCssClass)
	{
		this.cssClassOfMessageBox = newCssClass;
		if(this.divs_content){
			if(this.cssClassOfMessageBox)
				this.divs_content.className=this.cssClassOfMessageBox;
			else
				this.divs_content.className='modalDialog_contentDiv';
		}

	}
	// }}}
	,
	// {{{ setShadowOffset(newShadowOffset)
    /**
     *	Specify the size of shadow
     *
     *	@param Int newShadowOffset = Offset of shadow div(in pixels from message box - x and y)
     *
     * @public
     */
	setShadowOffset : function(newShadowOffset)
	{
		this.shadowOffset = newShadowOffset

	}
	// }}}
	,
	// {{{ display()
    /**
     *	Display the modal dialog box
     *
     *
     * @public
     */
	display : function()
	{
		if(!this.divs_transparentDiv){
			this.__createDivs();
		}

		// Redisplaying divs
		this.divs_transparentDiv.style.display='block';
		this.divs_content.style.display='block';
		this.divs_shadow.style.display='block';
		if(this.MSIE)this.iframe.style.display='block';
		this.__resizeDivs();

		/* Call the __resizeDivs method twice in case the css file has changed. The first execution of this method may not catch these changes */
		window.refToThisModalBoxObj = this;
		setTimeout('window.refToThisModalBoxObj.__resizeDivs()',150);

		this.__insertContent();	// Calling method which inserts content into the message div.
	}
	// }}}
	,
	// {{{ ()
    /**
     *	Display the modal dialog box
     *
     *
     * @public
     */
	setShadowDivVisible : function(visible)
	{
		this.shadowDivVisible = visible;
	}
	// }}}
	,
	// {{{ close()
    /**
     *	Close the modal dialog box
     *
     *
     * @public
     */
	close : function()
	{
		//document.documentElement.style.overflow = '';	// Setting the CSS overflow attribute of the <html> tag back to default.

		/* Hiding divs */
		this.divs_transparentDiv.style.display='none';
		this.divs_content.style.display='none';
		this.divs_shadow.style.display='none';
		if(this.MSIE)this.iframe.style.display='none';

	}
	// }}}
	,
	// {{{ __addEvent()
    /**
     *	Add event
     *
     *
     * @private
     */
	addEvent : function(whichObject,eventType,functionName,suffix)
	{
	  if(!suffix)suffix = '';
	  if(whichObject.attachEvent){
	    whichObject['e'+eventType+functionName+suffix] = functionName;
	    whichObject[eventType+functionName+suffix] = function(){whichObject['e'+eventType+functionName+suffix]( window.event );}
	    whichObject.attachEvent( 'on'+eventType, whichObject[eventType+functionName+suffix] );
	  } else
	    whichObject.addEventListener(eventType,functionName,false);
	}
	// }}}
	,
	// {{{ __createDivs()
    /**
     *	Create the divs for the modal dialog box
     *
     *
     * @private
     */
	__createDivs : function()
	{
		// Creating transparent div
		this.divs_transparentDiv = document.createElement('DIV');
		this.divs_transparentDiv.className='modalDialog_transparentDivs';
		this.divs_transparentDiv.style.left = '0px';
		this.divs_transparentDiv.style.top = '0px';

		document.body.appendChild(this.divs_transparentDiv);
		// Creating content div
		this.divs_content = document.createElement('DIV');
		this.divs_content.className = 'modalDialog_contentDiv';
		this.divs_content.id = 'DHTMLSuite_modalBox_contentDiv';
		this.divs_content.style.zIndex = 100000;

		if(this.MSIE){
			this.iframe = document.createElement('<IFRAME src="about:blank" frameborder=0>');
			this.iframe.style.zIndex = 90000;
			this.iframe.style.position = 'absolute';
			document.body.appendChild(this.iframe);
		}

		document.body.appendChild(this.divs_content);
		// Creating shadow div
		this.divs_shadow = document.createElement('DIV');
		this.divs_shadow.className = 'modalDialog_contentDiv_shadow';
		this.divs_shadow.style.zIndex = 95000;
		document.body.appendChild(this.divs_shadow);
		window.refToModMessage = this;
		this.addEvent(window,'scroll',function(e){ window.refToModMessage.__repositionTransparentDiv() });
		this.addEvent(window,'resize',function(e){ window.refToModMessage.__repositionTransparentDiv() });


	}
	// }}}
	,
	// {{{ __getBrowserSize()
    /**
     *	Get browser size
     *
     *
     * @private
     */
	__getBrowserSize : function()
	{
    	var bodyWidth = document.documentElement.clientWidth;
    	var bodyHeight = document.documentElement.clientHeight;

		var bodyWidth, bodyHeight;
		if (self.innerHeight){ // all except Explorer

		   bodyWidth = self.innerWidth;
		   bodyHeight = self.innerHeight;
		}  else if (document.documentElement && document.documentElement.clientHeight) {
		   // Explorer 6 Strict Mode
		   bodyWidth = document.documentElement.clientWidth;
		   bodyHeight = document.documentElement.clientHeight;
		} else if (document.body) {// other Explorers
		   bodyWidth = document.body.clientWidth;
		   bodyHeight = document.body.clientHeight;
		}
		return [bodyWidth,bodyHeight];

	}
	// }}}
	,
	// {{{ __resizeDivs()
    /**
     *	Resize the message divs
     *
     *
     * @private
     */
    __resizeDivs : function()
    {

    	var topOffset = Math.max(document.body.scrollTop,document.documentElement.scrollTop);

		if(this.cssClassOfMessageBox)
			this.divs_content.className=this.cssClassOfMessageBox;
		else
			this.divs_content.className='modalDialog_contentDiv';

    	if(!this.divs_transparentDiv)return;

    	// Preserve scroll position
    	var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
    	var sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);

    	window.scrollTo(sl,st);
    	setTimeout('window.scrollTo(' + sl + ',' + st + ');',10);

    	this.__repositionTransparentDiv();


		var brSize = this.__getBrowserSize();
		var bodyWidth = brSize[0];
		var bodyHeight = brSize[1];

    	// Setting width and height of content div
      	this.divs_content.style.width = this.width + 'px';
    	this.divs_content.style.height= this.height + 'px';

    	// Creating temporary width variables since the actual width of the content div could be larger than this.width and this.height(i.e. padding and border)
    	var tmpWidth = this.divs_content.offsetWidth;
    	var tmpHeight = this.divs_content.offsetHeight;


    	// Setting width and height of left transparent div






    	this.divs_content.style.left = Math.ceil((bodyWidth - tmpWidth) / 2) + 'px';;
    	this.divs_content.style.top = (Math.ceil((bodyHeight - tmpHeight) / 2) +  topOffset) + 'px';

 		if(this.MSIE){
 			this.iframe.style.left = this.divs_content.style.left;
 			this.iframe.style.top = this.divs_content.style.top;
 			this.iframe.style.width = this.divs_content.style.width;
 			this.iframe.style.height = this.divs_content.style.height;
 		}

    	this.divs_shadow.style.left = (this.divs_content.style.left.replace('px','')/1 + this.shadowOffset) + 'px';
    	this.divs_shadow.style.top = (this.divs_content.style.top.replace('px','')/1 + this.shadowOffset) + 'px';
    	this.divs_shadow.style.height = tmpHeight + 'px';
    	this.divs_shadow.style.width = tmpWidth + 'px';



    	if(!this.shadowDivVisible)this.divs_shadow.style.display='none';	// Hiding shadow if it has been disabled


    }
    // }}}
    ,
	// {{{ __insertContent()
    /**
     *	Insert content into the content div
     *
     *
     * @private
     */
    __repositionTransparentDiv : function()
    {
    	this.divs_transparentDiv.style.top = Math.max(document.body.scrollTop,document.documentElement.scrollTop) + 'px';
    	this.divs_transparentDiv.style.left = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft) + 'px';
		var brSize = this.__getBrowserSize();
		var bodyWidth = brSize[0];
		var bodyHeight = brSize[1];
    	this.divs_transparentDiv.style.width = bodyWidth + 'px';
    	this.divs_transparentDiv.style.height = bodyHeight + 'px';

    }
	// }}}
	,
	// {{{ __insertContent()
    /**
     *	Insert content into the content div
     *
     *
     * @private
     */
    __insertContent : function()
    {
		if(this.url){	// url specified - load content dynamically
			ajax_loadContent('DHTMLSuite_modalBox_contentDiv',this.url);
		}else{	// no url set, put static content inside the message box
			this.divs_content.innerHTML = this.htmlOfModalMessage;
		}
    }
}

var modalObj = new DHTML_modalMessage();
modalObj.setShadowOffset(20);

function showMessage( width, height ){
    msg = '<h2 align="center">Aviso</h2><hr><table border="1" width="100%" align="center"><tr><td><table border="0" bgcolor="#ECEAE6" width="100%" align="center"><tr><td><p><font size="2pt"><div id="divMessage"></div></font></p></td></tr></table></td></tr></table><p><center><input id=\'btFechar\'type=button onclick=\'fecharMessage();return false\' value=\'  OK  \' class=\'botao\'></center></p>';
    modalObj.setSource(false);
    modalObj.setHtmlContent(msg);
    modalObj.setSize(width,height);
    modalObj.setCssClassMessageBox(false);
    modalObj.setShadowDivVisible(true);
    modalObj.display();
    $('divMessage').appendChild($('divMessageError'));
}

function fecharMessage(){
	modalObj.close();
}

var modalSA = new DHTML_modalMessage();
modalSA.setShadowOffset(20);

/**
 * Cria uma janela pop-up de confirma��o. Semelhante ao objeto "Confirm" do JS.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 * @param {Object} funcao - fun��o a ser chamada no retorno do pop-up
 */
function confirma( width, height, titulo, mensagem, funcao ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_warning.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<br/>' +
				'		<p>' + mensagem + '</p>' +
				'		<br/>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" class="botao" style="width: 80px;" id="btnMMSim" value="Sim" onclick="modalSA.close(); ' + funcao + '( true )" />' +
				'		<input type="button" class="botao" style="width: 80px;" value="N&atilde;o" onclick="modalSA.close(); ' + funcao + '( false )" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
    $('btnMMSim').focus();
}

/**
 * Cria uma janela pop-up de confirma��o. Semelhante ao objeto "Confirm" do JS.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 * @param {Object} funcao - fun��o a ser chamada no retorno do pop-up
 */
function confirmaCustom( width, height, titulo, mensagem, funcao, botao1, botao2 ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_warning.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<div style="overflow: auto;height: 100px">' +
				'			<p>' + mensagem + '</p>' +
				'		</div>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" class="botao" value="' + botao1 + '" onclick="modalSA.close(); ' + funcao + '( 1 )" />' +
				'		<input type="button" class="botao" value="' + botao2 + '" onclick="modalSA.close(); ' + funcao + '( 2 )" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
}

/**
 * Cria uma janela pop-up de aviso. Semelhante ao objeto "Alert" do JS.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 */
function mensagem( width, height, titulo, mensagem ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_information.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<div style="overflow: auto;height: 100px">' +
				'			<p>' + mensagem + '</p>' +
				'		</div>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" id="btnMMOK" class="botao" style="width: 80px;" value="OK" onclick="modalSA.close();" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
    $('btnMMOK').focus();

}

/**
 * Cria uma janela pop-up de aviso. Semelhante ao objeto "Alert" do JS, com tamanho do Div vari�vel.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 */
function mensagemErrors( width, height, titulo, mensagem ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_information.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<div style="overflow: auto;height: 100px">' +
				'			<p>' + mensagem + '</p>' +
				'		</div>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" id="btnMMOK" class="botao" style="width: 80px;" value="OK" onclick="modalSA.close();" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
    $('btnMMOK').focus();

}

function mensagemErrors2( width, height, titulo, mensagem ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_information.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<div style="overflow: auto;height: 150px">' +
				'			<p>' + mensagem + '</p>' +
				'		</div>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" id="btnMMOK" class="botao" style="width: 80px;" value="OK" onclick="modalSA.close();" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
    $('btnMMOK').focus();

}

/**
 * Cria uma janela pop-up de aviso. Semelhante ao objeto "Alert" do JS.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 * @param {Object} funcao - fun��o JS que ser� chamada assim que o usu�rio clicar o bot�o OK
 */
function mensagemFuncao( width, height, titulo, mensagem, funcao ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/icon_information.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<br/>' +
				'		<p>' + mensagem + '</p>' +
				'		<br/>' +
				'	</center>' +
				'	<br/>' +
				'	<center>' +
				'		<input type="button" class="botao" id="btnMMOK" style="width: 80px;" value="OK" onclick="modalSA.close();' + funcao + ';" />' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();
    $('btnMMOK').focus();

}


/**
 * Cria uma janela pop-up de aviso. Semelhante ao objeto "Alert" do JS.
 *
 * @param {Object} width - largura da janela
 * @param {Object} height - altura da janela
 * @param {Object} titulo - t�tulo da janela
 * @param {Object} mensagem - mensagem descritiva
 */
function aguarde( width, height, titulo, mensagem ){
    var msg = 	'<div id="divMessageDialog" align=center>' +
			  	'	<table width="100%" class="mensagem">' +
				'		<tr><td><table width="100%">' +
				'			<tr>' +
				'				<td width="5%">&nbsp;</td>' +
				'				<td width="10%" align="left"><img src="/sa/img/ajax-loader.gif" /></td>' +
				'				<td width="70%" class="mensagem_modal">' + titulo + '</td>' +
				'				<td width="15%">&nbsp;</td>' +
				'			</tr>' +
				'		</table></td></tr>' +
				'	</table>' +
				'	<br/>' +
				'	<center class="confirm">' +
				'		<div style="overflow: auto;height: 100px">' +
				'			<p>' + mensagem + '</p>' +
				'		</div>' +
				'	</center>' +
				'</div>';

    modalSA.setSource(false);
    modalSA.setHtmlContent(msg);
    modalSA.setSize(width,height);
    modalSA.setCssClassMessageBox(false);
    modalSA.setShadowDivVisible(true);
    modalSA.display();

}

function modalMensagemErros(){
	j( "#divMessageError").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function(){
				j( this ).dialog("close");
	        }
        }
	});
}

function modalMensagem( titulo, texto ){
	j( "#divMensagem").html( '<center>' + texto + '</center>');
	j( "#divMensagem").attr( "title", titulo );
	j( "#divMensagem").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function(){
				j( this ).dialog("close");
	        }
        }
	});
}

function modalAguarde( titulo, texto ){
	j( "#divMensagem").html( '<center>' + texto + '<br/><img src="/sa/img/ajax-loader.gif" />' + '</center>');
	j( "#divMensagem").attr( "title", titulo );
	j( "#divMensagem").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        dialogClass: "no-close",
        width: 400
	});
}

function modalConfirma( titulo, texto, funcao){
	j( "#divMensagem").html( '<center>' + texto + '</center>');
	j( "#divMensagem").attr( "title", titulo );
	j( "#divMensagem").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function(){
            	funcao();
            	
				j( this ).dialog("close");
	        },
	        "Cancelar": function(){
				j( this ).dialog("close");
	        }
        }
	});
}
