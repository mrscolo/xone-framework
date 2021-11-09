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

function ContentSonidosNotificaciones_selecteditem() {
			     				
 				self.getOwnerCollection().getOwnerObject().MAP_SONIDO = self.SONIDO.toString();
 				self.getOwnerCollection().getOwnerObject().MAP_BTSONIDOSEL = self.TITULO.toString();
 				self.getOwnerCollection().getOwnerObject().MAP_ID = self.ID;
 				//ui.getview(appData.getCurrentEnterprise().variables("OBJETO")).refresh "MAP_BTSONIDOSEL"
		   
}

