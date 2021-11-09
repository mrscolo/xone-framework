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

async function EspecialDatosOnline_identificador() {

          	if(param == 1){
          		self.MAP_IDENTIFICADOR = appData.getGlobalMacro("##DEVICEID##");
          	}else{
          		(await self.getContents("DatosOnlineWS")).setFilter("stPIN=" + self.MAP_IDENTIFICADOR.toString());
          		await (await self.getContents("DatosOnlineWS")).loadAll();
          	}
		
}

function EspecialDatosOnline_buscar() {

          	if (param==="1") {
          		// No filtra bien porque los campos de busqueda, no pierden el foco correctamente al dar al boton de buscar
          		self.getContents("DatosOnlineJSON").setFilter("");
          		if (len(self.MAP_FILTRONOMBRE)!==0)
          			self.getContents("DatosOnlineJSON").setFilter("NOMBRE like '%" + cstr(self.MAP_FILTRONOMBRE) + "%'");
          		
          		if (len(self.MAP_FILTRODIRECCION)!==0)
          			if (len(self.getContents("DatosOnlineJSON").getFilter())=0)
          				self.getContents("DatosOnlineJSON").setFilter("DIRECCION like '%" + cstr(self.MAP_FILTRODIRECCION) + "%'");
          			else
          				self.getContents("DatosOnlineJSON").setFilter(self.getContents("DatosOnlineJSON").getFilter() + " AND DIRECCION like '%" + cstr(self.MAP_FILTRODIRECCION) + "%'");
          	} else {
          		if (self.MAP_ORDEN==="ASC") {
          			self.MAP_ORDEN="DESC";
          			self.MAP_BTORDEN="sortZA.png";
					self.MAP_BTORDENCLICK="sortZA_click.png";
          		} else {
          			self.MAP_ORDEN="ASC";
          			self.MAP_BTORDEN="sortAZ.png";
					self.MAP_BTORDENCLICK="sortAZ_click.png";
          		}
          		self.getContents("DatosOnlineJSON").setSort("NOMBRE " + cstr(self.MAP_ORDEN));          		
          	}
      		self.getContents("DatosOnlineJSON").unlock();
          	self.getContents("DatosOnlineJSON").loadAll();
			self.getContents("DatosOnlineJSON").lock();
			
}

async function EspecialDatosOnline_before_edit() {
	
			//Poner lo del comprobar conexión, y si no tenemos conexión, dar error, si todo OK, entonces seguir
			if( await ComprobarConexion() == 1 ){
			    switch(self.TIPO){
			        case "JSON":
			            self.MAP_GROUP = 1;
						self.MAP_ORDEN = "ASC";
						self.MAP_BTORDEN = "sortAZ.png";
						self.MAP_BTORDENCLICK = "sortAZ_click.png";
						(await self.getContents("DatosOnlineJSON")).setSort("NOMBRE ASC");
						await (await self.getContents("DatosOnlineJSON")).loadAll();
						(await self.getContents("DatosOnlineJSON")).lock();
			            break;
			        case "WEBSERVICE":
	      				self.MAP_GROUP = 2;
			            break;
		        	case "SQLDINAMIC":
	      				self.MAP_GROUP = 3;
			            break;
			        default:
						self.MAP_GROUP = 1;
			            break;
			        
			    }    
			}else{
				self.MAP_GROUP = 99;
			}
		
}

function EspecialDatosOnline_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

