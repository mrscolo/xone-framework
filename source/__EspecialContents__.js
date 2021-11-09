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

function EspecialContents_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function EspecialContents_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

async function EspecialContents_before_edit() {
			
			self.MAP_GROUP = 1;
			self.MAP_TOTAL_PAGES = 7;			
			//Para controlar el 4 content, de tal forma que toda ejecucion a la base de datos la controlamos por script
			self.MAP_ORDEN = "ASC";	
			self.MAP_BTORDEN = "sortAZ.png";
			self.MAP_BTORDENCLICK = "sortAZ_click.png";
			(await self.getContents("content4")).setSort("NOMBRE ASC");
			await (await self.getContents("content4")).loadAll();
			(await self.getContents("content4")).lock();
			ui.startGps();
			self.MAP_NOMBRESEL = "";
		
}

async function EspecialContents_TestMacro() {

              let cnt =  await self.getContents("content1");
              cnt.setMacro("##MACRO1", "7=9");
              await cnt.loadAll();
              ui.refresh("@content1");
            
}

async function EspecialContents_newRegistro() {

                let coll = await self.getContents("cosasDelContent");
                let obj = await coll.createObject();
                appData.pushValue(obj);
            
}

async function EspecialContents_editar() {

      		if(self.MAP_SELECTEDID >= 1) {
				var obj = await self.getContents("content3")("ID", self.MAP_SELECTEDID.toString());
				if(obj != null) {
					appData.pushValue(obj);
				}
			} else {
				ui.showToast("No hay ningún elemento seleccionado");
			}
		
}

function EspecialContents_EjecutaVolverBoton() {

      		 self.MAP_NOMBRESEL = "";
      		 self.MAP_SELECTEDID = 0;
      		 self.MAP_IDLINEA = 0;
		
}

async function EspecialContents_nuevo() {

          	var coll = await self.getContents("content1");
      		var obj = await coll.createObject();
      		coll.addItem(obj);
			appData.pushValue(obj);
		
}

async function EspecialContents_eliminar() {

            await ui.msgBox("Se elimina el registro correctamente. Para la demo no se borra realmente","AVISO",0);
          	//Codigo para eliminar el registro del content. 
          	//Se rellena el valor del indice de la linea, para poder eliminarlo con dicho indice.
          	//self.Contents("content3").deleteitem(cint(self.MAP_IDLINEA")))
		
}

async function EspecialContents_buscar() {

          	if ( param == "1"){
          		if (self.MAP_FILTRO.length == 0){
          			(await self.getContents("content4")).setFilter("");
          		}else{
          			(await self.getContents("content4")).setFilter("NOMBRE like '%" + self.MAP_FILTRO.toString() + "%' OR DIRECCION like '%"+ self.MAP_FILTRO.toString() + "%'");
          		}
          	}else{
          		if( self.MAP_ORDEN == "ASC" ){
          			self.MAP_ORDEN = "DESC";
          			self.MAP_BTORDEN = "sortZA.png";
					self.MAP_BTORDENCLICK = "sortZA_click.png";
          		}else{
          			self.MAP_ORDEN = "ASC";
          			self.MAP_BTORDEN = "sortAZ.png";
					self.MAP_BTORDENCLICK = "sortAZ_click.png";
          		}
          		(await self.getContents("content4")).setSort("NOMBRE " + self.MAP_ORDEN.toString());
          	}
          	(await self.getContents("content4")).unlock();
          	await (await self.getContents("content4")).loadAll();
			(await self.getContents("content4")).lock();
			ui.getView(self).refresh("@content4,BTORDENAR");
		
}

function EspecialContents_checkAll() {

                var objContent = self.getContents("ContentDatosFiltroMultiseleccion");
                if (activo == 1) {
                    var vres = userMsgBox("OPCIONES", "Confirme que desea marcar todos los registros", "2");
                else
                    var vres = userMsgBox("OPCIONES", "Confirme que desea DESmarcar todos los registros", "2");
                }
    	        if (vres == 1) {
                    for ( var i=0; i < objContent.count(); i++) {
                        var item = objContent.get(i);  
                        if (activo == 1) {
                            if ( item.MAP_SELECTED == 1 && item.REALIZADA == 0 ) {
                                ReportarTareaPendiente2(item);
                                item.MAP_SELECTED = 0;
                            }
                        } else {
                            if (item.MAP_SELECTED == 1 && item.REALIZADA == 1 ) {
                                DesregistrarPendiente2(item);
                                item.MAP_SELECTED = 0;
                            }

                        }
                    }
    	        }
                self.executeNode("applyfilter");
            
}

async function EspecialContents_applyfilter() {

                (await self.getContents("ContentDatosFiltroMultiseleccion")).clear();
                await (await self.getContents("ContentDatosFiltroMultiseleccion")).loadAll();
                ui.refresh("@ContentDatosFiltroMultiseleccion");
            
}

