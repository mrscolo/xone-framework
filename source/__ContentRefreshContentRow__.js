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

function ContentRefreshContentRow_selecteditem() {

				self.getOwnerCollection().getOwnerObject().MAP_TITULO2 = self.NOMBRE;
				self.getOwnerCollection().getOwnerObject().MAP_LINEA = self.getOwnerCollection().getObjectIndex(self);
				self.getOwnerCollection().getOwnerObject().MAP_LINEA2 = self.ID;
			//	self.getOwnerCollection().getOwnerObject().MAP_OBJETO_HIJO = self;
			
}

