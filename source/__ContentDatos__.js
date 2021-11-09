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

function ContentDatos_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function ContentDatos_before_edit() {
			
			self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=1;
			self.MAP_COLORACTIVO = "#666666";
		
}

async function ContentDatos_accion() {

      		if (param==="capturar") {      			
      			await GetPosGPS ("Actual",self); 
      			if (parseInt(self.LATITUD)===0 || parseInt(self.LONGITUD)===0) {
      				await ui.msgBox ("La latitud o longitud obtenida no son correctas y por ello se dejará la que tiene actualmente el cliente.","AVISO",0);
      				self.LATITUD=self.MAP_LATITUD_GRID;
      				self.LONGITUD=self.MAP_LONGITUD_GRID;
      			} else {
	      			if (parseInt(self.LATITUD)===0)
	      				self.LATITUD=self.MAP_LATITUD_GRID;
	      			else
	      				self.MAP_LATITUD_GRID=self.LATITUD;
	      			
	      			if (parseInt(self.LONGITUD)===0)
	      				self.LONGITUD=self.MAP_LONGITUD_GRID;
	      			else
	      				self.MAP_LONGITUD_GRID=self.LONGITUD;
      			}
      		} else {
      			await self.save();
                ui.getView(self.getOwnerCollection().getOwnerObject()).refresh("@content1");
      			appData.failWithMessage (-11888,"##EXIT##");
      		}
		
}

