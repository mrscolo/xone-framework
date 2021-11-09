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

function ContentdatosCalendariolista_befored_edit() {

				self.MAP_COLORACTIVO = "#666666";
			
}

function ContentdatosCalendariolista_create() {

				self.MAP_COLORACTIVO = "#666666";
			
}

async function ContentdatosCalendariolista_guardar() {

          		//Peticion de campos obligatorios
          		var mandatory = "";
          		if ( self.FECHA.length == 0){
          			mandatory = "Fecha es obligatorio";
          		}
          		if ( self.TIPO.length == 0 && mandatory == ""){
          			mandatory = "Tipo es obligatorio";
          		}
          		if ( self.HORAINI.length == 0 && mandatory == ""){
          			mandatory = "Hora Inicio es obligatorio";
          		}
          		if ( self.DESCRIPCION.length == 0 && mandatory == ""){
          			mandatory = "Descripción es obligatorio";
          		}
          		if ( mandatory == ""){
					await self.save();
					var coll = await appData.getCollection("ContentTareas");
					var obj;
    				if (appData.getGlobalMacro("##DEVICE_OS##")==="web") {
    				    obj = await coll.findObject("DATE_FORMAT(t1.FECHA, '%M %d %Y')=DATE_FORMAT(" + DATEVALUE.toString() + ",'%M %d %Y')");
    				} else {
    				    obj = await coll.findObject("strftime('%Y-%m-%d',t1.FECHA)=strftime('%Y-%m-%d','" + DATEVALUE.toString() + "')");
    				}		
					if ( obj === null || obj == "undefined" ){
						self.getOwnerCollection().getOwnerObject().MAP_IDTAREASELECTED = 0;
						self.getOwnerCollection().getOwnerObject().MAP_VER = 0;
					}else{
						self.getOwnerCollection().getOwnerObject().MAP_IDTAREASELECTED = obj.ID;
						self.getOwnerCollection().getOwnerObject().MAP_SELECCIONADO = obj.MAP_DESCRIPCION;
						self.getOwnerCollection().getOwnerObject().MAP_VER = 1;
					}
		     		appData.failWithMessage(-11888,"##EXIT##");
				}else{
					appData.failWithMessage(-8100,mandatory);
				}
			
}

function ContentdatosCalendariolista_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

function ContentdatosCalendariolista_selecteditem() {
	
			self.getOwnerCollection().getOwnerObject().MAP_IDLINEA = self.getOwnerCollection().getObjectIndex(self);
			self.getOwnerCollection().getOwnerObject().MAP_IDTAREASELECTED = self.ID;
			self.getOwnerCollection().getOwnerObject().MAP_SELECCIONADO = self.DESCRIPCION;
			self.getOwnerCollection().getOwnerObject().MAP_VER = 1;
			ui.showToast("Seleccionada la tarea: " + self.DESCRIPCION.toString());
		
}

function ContentdatosCalendariolista_addcalendario() {
    	
				var fechainicio = Date.parse(formatDateTime(self.FECHA,2) + " " + self.HORAINI + ":00");
				var fechafin = Date.parse(formatDateTime(self.FECHA,2) + " " + self.HORAFIN + ":00");
	      		ui.addCalendarItem("Titulo Tarea byXOne:" + self.TIPO.toString(),"Descripción: " + self.DESCRIPCION.toString(),"Lugar del Evento",fechainicio,fechafin); 
			
}

