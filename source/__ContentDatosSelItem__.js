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

function ContentDatosSelItem_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function ContentDatosSelItem_before_edit() {
			
			self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=1;
		
}

function ContentDatosSelItem_selecteditem() {
	
          	self.getOwnerCollection().getOwnerObject().MAP_NOMBRESEL=self.NOMBRE;
			self.getOwnerCollection().getOwnerObject().MAP_IDLINEA=self.getOwnerCollection().getObjectIndex(self);
			self.getOwnerCollection().getOwnerObject().MAP_SELECTEDID=self.ID;
		
		
}

