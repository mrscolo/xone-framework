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

function EspecialRefresh_before_edit() {

				appData.getCurrentEnterprise().setVariables("MAP_REFRESCOPOSONCHANGE",0); // asigna valor a variable global
				
			    self.MAP_GROUP = 1;
				self.NUM1 = 20;
				self.NUM2 = 30;
				self.NUM = 0;
				self.NUM1_2 = 10;
				self.NUM2_2 = 60;
				self.MAP_TOTAL_PAGES = 5;
				self.MAP_IMAGEN = "negativo.png";
				self.MAP_IMAGEN2 = "negativo.png";
				self.MAP_IMAGEN3 = "negativo.png";
				self.MAP_IMAGEN4 = "negativo.png";
				self.MAP_IMAGEN5 = "negativo.png";
				self.MAP_IMAGEN6 = "negativo.png";
				self.MAP_IMAGEN7 = "negativo.png";
				self.MAP_IMAGEN8 = "negativo.png";
				self.MAP_IMAGEN9 = "negativo.png";
				self.MAP_IMAGEN10 = "negativo.png";
				self.MAP_IMAGEN11 = "negativo.png";
				self.MAP_IMAGEN12 = "negativo.png";
				self.MAP_IMAGEN13 = "negativo.png";
				self.MAP_IMAGEN14 = "negativo.png";
				self.MAP_IMAGEN15 = "negativo.png";
				self.MAP_IMAGEN16 = "negativo.png";
				self.MAP_COLOR2 = "#000000";
				ui.refresh("MAP_IMAGEN");
			
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_T");
					if(self.TEXTREFRESH_T.length > 0){
						self.MAP_IMAGEN = "positivo.png";
					}else{
						self.MAP_IMAGEN = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN);
					ui.refresh("BOT_TEXTREFRESH_T");
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN16 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_NT");
					if(self.TEXTREFRESH_NT.length > 0){
						self.MAP_IMAGEN16 = "positivo.png";
					}else{
						self.MAP_IMAGEN16 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN16);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN2 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_N");
					if(self.TEXTREFRESH_N > 0){
						self.MAP_IMAGEN2 = "positivo.png";
					}else{
						self.MAP_IMAGEN2 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN2);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN4 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_N2");
					if(self.TEXTREFRESH_N2 > 0){
						self.MAP_IMAGEN4 = "positivo.png";
					}else{
						self.MAP_IMAGEN4 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN4);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN3 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_NC");
					if(self.TEXTREFRESH_NC != 0){
						self.MAP_IMAGEN3 = "positivo.png";
					}else{
						self.MAP_IMAGEN3 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN3);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN5 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_D");
					if(self.TEXTREFRESH_D != 0){
						self.MAP_IMAGEN5 = "positivo.png";
					}else{
						self.MAP_IMAGEN5 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN5);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN6 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_X");
					if(self.TEXTREFRESH_X != 0){
						self.MAP_IMAGEN6 = "positivo.png";
					}else{
						self.MAP_IMAGEN6 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN6);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN9 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_TT");
					if(self.TEXTREFRESH_TT != 0){
						self.MAP_IMAGEN9 = "positivo.png";
					}else{
						self.MAP_IMAGEN9 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN9);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN10 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_NPHONE");
					if(self.TEXTREFRESH_NPHONE != 0){
						self.MAP_IMAGEN10 = "positivo.png";
					}else{
						self.MAP_IMAGEN10 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN10);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN11 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_TDESPLE");
					if(self.TEXTREFRESH_TDESPLE != 0){
						self.MAP_IMAGEN11 = "positivo.png";
					}else{
						self.MAP_IMAGEN11 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN11);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN12 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_TLUPA");
					if(self.TEXTREFRESH_TLUPA != 0){
						self.MAP_IMAGEN12 = "positivo.png";
					}else{
						self.MAP_IMAGEN12 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN12);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN7 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_AT");
                    if(self.TEXTREFRESH_AT != null){
    					if(self.TEXTREFRESH_AT.length > 0){
    						self.MAP_IMAGEN7 = "positivo.png";
    					}else{
    						self.MAP_IMAGEN7 = "negativo.png";
    					}
                    }else{
                        self.MAP_IMAGEN7 = "negativo.png";
                    }
					//ui.showToast(self.MAP_IMAGEN7);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN8 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_PH");
    				if(self.TEXTREFRESH_PH != null){
        				if(self.TEXTREFRESH_PH.length > 0){
    						self.MAP_IMAGEN8 = "positivo.png";
    					}else{
    						self.MAP_IMAGEN8 = "negativo.png";
    					}
    				}else{
    				     self.MAP_IMAGEN8 = "negativo.png";
    				}
					//ui.showToast(self.MAP_IMAGEN8);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN13 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_VD");
					if(self.TEXTREFRESH_VD != null){
        				if(self.TEXTREFRESH_VD.length > 0){
    						self.MAP_IMAGEN13 = "positivo.png";
    					}else{
    						self.MAP_IMAGEN13 = "negativo.png";
    					}
					}else{
    				     self.MAP_IMAGEN13 = "negativo.png";
    				}
					//ui.showToast(self.MAP_IMAGEN13);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN14 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_DR");
                    if(self.TEXTREFRESH_DR.length > 0){
						self.MAP_IMAGEN14 = "positivo.png";
					}else{
						self.MAP_IMAGEN14 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN14);
				
}

function EspecialRefresh_field() {

                    self.MAP_IMAGEN15 = "";
                    //ui.showToast("se ejecuta el onchange probocado al campo TEXTREFRESH_WEB");
					if(self.TEXTREFRESH_WEB.length > 0){
						self.MAP_IMAGEN15 = "positivo.png";
					}else{
						self.MAP_IMAGEN15 = "negativo.png";
					}
					//ui.showToast(self.MAP_IMAGEN15);
				
}

function EspecialRefresh_clear() {

                self[param1] = 0;
                self[param2] = 0;
                // si ejecutamos el refresh sin pasarle parametros refrescará toda la pantalla.
                ui.refresh();
			
}

function EspecialRefresh_clear2() {

                self[param1] = -1;
                self[param2] = -1;
                // el refresh all se suele usar para refrescar un frame y todos sus hijos si tener que indicarle cada unos del os props contenidos por el frame.
                ui.getView(self).refreshAll("frmonchange2");
			
}

async function EspecialRefresh_contentRow() {

				//Para obtener una referencia a un contents lo hacemos por el NAME de la etiqueta contents
				var mRefreshContentRow = await self.getContents("content2");
				//mRefreshContentRow.loadAll();
	 			var mObjItem = mRefreshContentRow.getItem(Number(self.MAP_LINEA));
	 			if(mObjItem != null){
	 			    var sNombre = mObjItem.NOMBRE;
	 			    if(sNombre.toString().indexOf("-->modificado") == -1){
				        mObjItem.NOMBRE=sNombre + "-->modificado";
	 			    }else{
	 			        var iend = sNombre.toString().indexOf("-->modificado");
	 			        iend = sNombre.length - iend;
	 			        mObjItem.NOMBRE=sNombre.substring(0,iend-1);
	 			    }
	 			}
	 			//ui.msgBox(cstr(mObjItem),"mObjItem",0);
	 			//ui.msgBox(cstr(mObjItem.NOMBRE),"mObjItem.NOMBRE",0);
	 			//ui.msgBox(cstr(self.MAP_LINEA),"MAP_LINEA",0);
	 			//ui.msgBox(cstr(index),"index",0);
				//A la hora de refrescar lo hacemos siempre a nodos prop
				ui.refreshContentRow("CONTENT2", self.MAP_LINEA);
			
}

async function EspecialRefresh_BorrarIndex() {

	            var collCont = await self.getContents("content2");
	            if( collCont != null) {
		            collCont.deleteItem(self.MAP_LINEA);
		            collCont.clear();
	                ui.refresh("CONTENT2");
	            }
    		
}

function EspecialRefresh_cambiarFondo() {

				if( self.MAP_COLOR1 != "#39902B"){
					self.MAP_COLOR1 = "#39902B";
				}else{
					self.MAP_COLOR1 = "#00FFFFFF";
				}
			
}

function EspecialRefresh_cambiarFuente() {

                if( self.MAP_COLOR2 != "#F0283C"){
					self.MAP_COLOR2 = "#F0283C";
				}else{
					self.MAP_COLOR2 = "#000000";
				}
				ui.refresh();
			
}

function EspecialRefresh_calculaTotal() {

          		self.NUM3 = parseInt(num1) + parseInt(num2);
			
}

function EspecialRefresh_calculaTotal2() {

          		self.NUM3_2 = parseInt(num1) + parseInt(num2);
          		ui.refreshValue("NUM3_2");
			
}

function EspecialRefresh_onfocusgrupo() {

          		self.MAP_GROUP = index;
		    
}

async function EspecialRefresh_pulsar() {

	          	var collection = await appData.getCollection(coll);
				var det = await collection.createObject();
				det.MAP_OBJETOPADRE=self; // mandamos el objeto padre
				appData.pushValue(det);
		    
}

function EspecialRefresh_postpulsar() {

          		self.NUM = self.NUM + 50;
          		ui.getView(self).refreshValue("NUM"); // refrescamos el campo que queremos
                //ui.msgBox("refrequito rico 22","ver cuantos refrescos",0);
			
}

async function EspecialRefresh_pulsaronchange() {

	          	var collection = await appData.getCollection(coll);
				var det = await collection.createObject();
				appData.pushValue(det);
		    
}

function EspecialRefresh_postpulsaronchange() {

          		if (appData.getCurrentEnterprise().getVariables("MAP_REFRESCOPOSONCHANGE")==1)
          		{
          		    self.NUM = self.NUM + 100;
                   // ui.msgBox("refrequito rico","ver cuantos refrescos",0);
                    appData.getCurrentEnterprise().setVariables("MAP_REFRESCOPOSONCHANGE",0);
          		}
			
}

function EspecialRefresh_onback() {

				appData.failWithMessage(-11888, "##EXIT##");
			
}

