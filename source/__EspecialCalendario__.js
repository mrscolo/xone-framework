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

function EspecialCalendario_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function EspecialCalendario_create() {
    			
	      		self.MAP_CTN_TITLE_FECHA="FECHA";
				self.MAP_CTN_TITLE_TIPO="TIPO";
				self.MAP_CTN_TITLE_DESCRIPCION="DESCRIPCION";
			
}

function EspecialCalendario_before_edit() {
    			
				self.MAP_IDTAREASELECTED=0;
				appData.getCurrentEnterprise().setVariables("PADRE",null);
				self.MAP_GROUP=1;
				self.MAP_TOTAL_PAGES=1;
				self.MAP_VER=0;
			
}

async function EspecialCalendario_nuevo() {
    			
	      		 var cCal=await self.getContents("calendario");
	      		 var objCalendario=await cCal.createObject();
	      		 objCalendario.FECHA=self.MAP_FECHA;
	      		 cCal.addItem(objCalendario);
				 appData.pushValue(objCalendario); 		 
			
}

async function EspecialCalendario_editar() {
    			
	      		var cCal=await self.getContents("Calendariodatos");
	      		cCal.clear();
	      		var objCalendario=await cCal.findObject("ID="+self.MAP_IDTAREASELECTED.toString());
		      	if (objCalendario!==null) {
		      	    objCalendario.MAP_COLORACTIVO = "#666666";
				 	appData.pushValue(objCalendario);
		      	}
			
}

async function EspecialCalendario_eliminar() {
   
				var ok=await ui.msgBox ("¿Desea eliminar el registro seleccionado?","Aviso",4);
        		if (ok===6) {
  					var CollCal=await appData.getCollection("ContentdatosCalendario");
		      		CollCal.deleteItem (self.MAP_IDTAREASELECTED.toString());
		      		self.MAP_IDTAREASELECTED=0;
			    	CollCal=null;
			    	ui.showToast ("Elemento borrado correctamente.");
			    } else {
			    	ui.showToast ("Se ha cancelado la acción y no se borrará el elemento.");
			    }
			
}

async function EspecialCalendario_inicializar() {

				await inicializarCal();
			
}

function EspecialCalendario_onback() {

				appData.failWithMessage (-11888,"##EXIT##");
				//AppData.UserInterface.ShowGroup "1","##ALPHA_IN##",600,"##ALPHA_OUT##",600
			
}

