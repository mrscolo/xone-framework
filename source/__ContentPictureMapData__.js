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

function ContentPictureMapData_selecteditem() {

            var parent = self.getOwnerCollection().getOwnerObject();
  			parent.MAP_ID=self.ID;
  			parent.MAP_NOMBRE = self.TITULO;
  			parent.MAP_DESCRIPCION = self.DESCRIPCION;
  			//ui.refresh("MAP_NOMBRE,MAP_DESCRIPCION");
  			ui.getView(parent).refresh("MAP_NOMBRE","MAP_DESCRIPCION");
  		
}

