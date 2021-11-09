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

function ContentDatosFiltro_onback() {

	      	appData.failWithMessage(-11888,"##EXIT##");
	      
}

function ContentDatosFiltro_before_edit() {
			
			self.MAP_GROUP = 1;
			self.MAP_TOTAL_PAGES = 1;
		
}

async function ContentDatosFiltro_accion() {

      		if ( param == "capturar"){      			
      			await GetPosGPS("Actual",self);
      			if ( self.LATITUD == 0 || self.LONGITUD == 0){
      				await ui.msgBox("La latitud o longitud obtenida no son correctas y por ello se dejará la que tiene actualmente el cliente.","AVISO",0);
      			}else{
	      			if (self.LATITUD == 0){
	      				self.LATITUD = self.MAP_LATITUD_GRID;
	      			}else{
	      				self.MAP_LATITUD_GRID = self.LATITUD;
	      			}
	      			if ( self.LONGITUD == 0){
	      				self.LONGITUD = self.MAP_LONGITUD_GRID;
	      			}else{
	      				self.MAP_LONGITUD_GRID = self.LONGITUD;
	      			}
      			}
      		}else{
      			await self.save();
      			appData.failWithMessage(-11888,"##EXIT##");
      		}
		
}

