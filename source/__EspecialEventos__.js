let appData,self,ui;
module.exports.__SCRIPT_WRAPPER = function(appData, ui, self, functionString, Arguments) {
    appData=appDataVal;
    ui = uiVal;
    self = selfVal;
    if (typeof functionString == 'string') eval(functionString);
     else functionString.call(this,Arguments);
}

module.exports.__SCRIPT_WRAPPERASYNC = async function(appDataVal,uiVal, selfVal, functionString,Arguments) {
    appData=appDataVal;
    ui = uiVal;
    self = selfVal;
    if (typeof functionString == 'string') await eval(functionString);
    else await functionString.call(this,Arguments);
}

function EspecialEventos_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

function EspecialEventos_before_edit_0() {

          	ui.getView(self).bind ("SCVB","onClick","testClick");
          
}

function EspecialEventos_before_edit_1() {

            self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=3;
			
			var v=ui.getView(self);
			
			//Le podemos poner una funcion que exista en un .js nuestro.
			//v.bind("MAP_ONTEXTCHANGED", "onTextChanged", eventoOnTextChanged);
			v.bind("MAP_ONTEXTCHANGED", "onTextChanged", eventoOnTextChanged);
          	v.bind("MAP_ONFOCUSCHANGED01", "onFocusChanged", eventoOnFocusChanged);
          	self.MAP_DESCRIPCIONEVENTO="Esto es un campo bloqueado, que tiene texto en varias lineas. Se ha puesto dentro de un frame con scroll y con tamaño fijo, donde el usuario pueda realizar el scroll en lugar fijo. Por ello este texto es para demostrar su uso y asi los programadores puedan ver como seris el codigo para realizar este desarrollo.";
						
          	// Demo inline
          	v.bind ("SCJAVA","onClick",
          	{title:'valor desde fuera',msg:'LLamada inline. No abre collecion'},
          	function (e) {
          			ui.msgBox (e.target+":"+e.data.msg,e.data.title,0);
          		});            
            
            // Demo function con parametro de texto
      		v.bind ("SCJAVA1","onClick","EspecialcollTest1",jstestClick);
      		
      		// Demo function multiples parametros
          	v.bind ("SCJAVA2","onClick",
          	{title:'valor desde fuera',msg:'Abre un nuevo objeto', collName: 'EspecialcollTest2'},
          	jstestClick);          	
          	v.bind("sctop","onScroll", function (e) {
          		if (e.dy<=10 && self.MAP_SCSHOWOVERSCROLL==1) {
	          		self.MAP_SCSHOWOVERSCROLL=0;
	          		ui.getView(self).refresh("scfroverscroll");
          		} else if (e.dy>10 && self.MAP_SCSHOWOVERSCROLL==0) {
	          		self.MAP_SCSHOWOVERSCROLL=1;
	          		ui.getView(self).refresh("scfroverscroll");
	          		
          		}   	
          	});
          	self.MAP_SCSHOWOVERSCROLL=1;
          	self.MAP_ATTSHOWOVERSCROLL=1;    	
          
}

function EspecialEventos_btrefresh() {

            	self.MAP_DESCRIPCIONEVENTO="Esto es un campo bloqueado, que tiene texto en varias lineas. Se ha puesto dentro de un frame con scroll y con tamaño fijo, donde el usuario pueda realizar el scroll en lugar fijo. Por ello este texto es para demostrar su uso y asi los programadores puedan ver como seris el codigo para realizar este desarrollo.";
            	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO");
		  
}

function EspecialEventos_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

