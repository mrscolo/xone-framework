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

async function ContentmapaDatos_selecteditem() {

          var collGPS = await appData.getCollection("GPSColl");
          	await collGPS.loadAll();
          	var objGPS = collGPS.getObject(0);
          	collGPS.clear();
          	if(objGPS == undefined) {
          		ui.showToast("No hay objeto GPS todavía. ¿Se ha llamado a ui.startGps() ya?");
          	} else {
				if(objGPS.STATUS != 1) {
					//ui.showToast("El campo STATUS vale " + objGPS.STATUS);
				} else {

                  		if ( appData.getGlobalMacro("##DEVICE_OS##") == "IOS"){
                  			self.getOwnerCollection().getOwnerObject().MAP_VERDATOS2 = 1;
                  			self.getOwnerCollection().getOwnerObject().MAP_TL = "Pinche para ver ruta en el navegador";
                  			if( appData.getCurrentEnterprise().getVariables("MIUBICACION") == 1){
        						ui.drawMapRoute("@mapa",self.LATITUD,self.LONGITUD,"","","","");
                  			}
        				}else{
        					//ui.drawMapRoute("@mapa",self.LATITUD,self.LONGITUD,"","");
        					ui.drawMapRoute("@mapa", self.LATITUD, self.LONGITUD, objGPS.LATITUD, objGPS.LONGITUD, "driving", "#FF0000");
        				}    		
				}
          	}
          	
          	self.getOwnerCollection().getOwnerObject().MAP_VERDATOS = 1;
          	self.getOwnerCollection().getOwnerObject().MAP_NOMBRE = "Nombre: " + self.NOMBRE.toString();
      		self.getOwnerCollection().getOwnerObject().MAP_DIRECCION = "Dirección: " + self.DIRECCION.toString();
			ui.refresh("frmflotante", "flo2", "MAP_NOMBRE", "MAP_DIRECCION");
          
}

