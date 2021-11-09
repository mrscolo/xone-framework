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

function ContentdatosCalendario_befored_edit() {

				self.MAP_COLORACTIVO = "#666666";
			
}

function ContentdatosCalendario_create() {

				self.MAP_COLORACTIVO = "#666666";
			
}

async function ContentdatosCalendario_ondateselected() {

                var monthName = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
				selfDataColl.getOwnerObject().MAP_FECHA = DATEVALUE;
				selfDataColl.getOwnerObject().MAP_TITLE_NAME_MES = monthName[DATEVALUE.getMonth()].toString().toUpperCase();
				selfDataColl.getOwnerObject().MAP_TITLE_ANO = DATEVALUE.getFullYear().toString();
				var coll = await appData.getCollection("ContentTareas");
				var obj;
				if (appData.getGlobalMacro("##DEVICE_OS##")==="web") {
				    obj = await coll.findObject("DATE_FORMAT(t1.FECHA, '%M %d %Y')=DATE_FORMAT('" + DATEVALUE.toString() + "','%M %d %Y')");
				} else {
				    obj = await coll.findObject("strftime('%Y-%m-%d',t1.FECHA)=strftime('%Y-%m-%d','" + DATEVALUE.toString() + "')");
				}
				
				
				if ( obj == null){
					selfDataColl.getOwnerObject().MAP_IDTAREASELECTED= 0;
					selfDataColl.getOwnerObject().MAP_VER= 0;
				}else{
					selfDataColl.getOwnerObject().MAP_IDTAREASELECTED = obj.ID;
					selfDataColl.getOwnerObject().MAP_SELECCIONADO = obj.MAP_DESCRIPCION;
					selfDataColl.getOwnerObject().MAP_VER = 1;
				}
			
}

function ContentdatosCalendario_onpageselected() {

				var monthName = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
				selfDataColl.getOwnerObject().MAP_FECHA = DATEVALUE;
				selfDataColl.getOwnerObject().MAP_TITLE_NAME_MES = monthName[DATEVALUE.getMonth()].toString().toUpperCase();
				selfDataColl.getOwnerObject().MAP_TITLE_ANO = DATEVALUE.getFullYear().toString();
				selfDataColl.getOwnerObject().MAP_VER = 0;
			
}

function ContentdatosCalendario_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

async function ContentdatosCalendario_guardar() {

				await self.save();
				appData.failWithMessage(-11888,"##EXIT##");
			
}

