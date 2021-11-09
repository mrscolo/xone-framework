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

function EspecialMapa_onback() {

	      	appData.failWithMessage(-11888,"##EXIT##");
	      
}

async function EspecialMapa_before_edit() {
	
          		appData.getCurrentEnterprise().setVariables("MIUBICACION",0);
				var ok = await ui.msgBox("¿Desea acceder al Geoposicionamiento de su dispositivo?","Aviso",4);
        		if ( ok == 6 ){
					appData.getCurrentEnterprise().setVariables("MIUBICACION",1);
        		}
				self.MAP_VERDATOS = 0;
				if ( appData.getCurrentEnterprise().getVariables("MIUBICACION") == 1){
					ui.startGps();
					await PosicionamientoGPS();
					if ( appData.getCurrentEnterprise().getVariables("MIUBICACION") == 10 ){
						await ui.msgBox("No se ha podido posicionar el dispositivo.","",0);
					}
				}
		
}

