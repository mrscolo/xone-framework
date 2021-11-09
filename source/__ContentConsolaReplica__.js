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

async function ContentConsolaReplica_before_edit() {

            self.MAP_GROUP = 1;
			self.MAP_TOTAL_PAGES = 7;
			self.MAP_ESPECIAL = 0;
			await self.executeNode("grupos(1)");
            self.MAP_RECORDSRX = replica.getRecordsRX().toString() + "/" + replica.getTotalRecordsRX().toString();
            self.MAP_RECORDSTX = replica.getRecordsTX().toString() + "/" + replica.getTotalRecordsTX().toString();
            self.MAP_RECORDSPEND = replica.getRecordsPend();
            self.MAP_LOG = replica.getLog();
            ui.executeActionAfterDelay("refresh",10);
            if( self.MAP_VERSIONXONELIVE == "##LIVEUPDATE_VERSION##"){
              self.MAP_VERSIONXONELIVE = "No Instalado";
            }
            if( self.MAP_MID.indexOf("'",1) > 0){
              self.MAP_MID = self.MAP_MID.replace(/'/gi,"");
            }
          
}

function ContentConsolaReplica_refresh() {

                self.MAP_RECORDSRX = replica.getRecordsRX().toString() + "/" + replica.getTotalRecordsRX().toString();
                self.MAP_RECORDSTX = replica.getRecordsTX().toString() + "/" + replica.getTotalRecordsTX().toString();
                self.MAP_RECORDSPEND = replica.getRecordsPend();
                self.MAP_LOG = replica.getLog();
                ui.executeActionAfterDelay("refresh",10);
            
}

async function ContentConsolaReplica_field() {

					var coll = await appData.getCollection("ContentFileManagerImagen");
					var obj = await coll.createObject();
					obj.FOTO = self.MAP_FOTO;
					obj.IDINCIDENCIA = 0;
					obj.FECHA = formatDateTime(new Date(),0);
					await obj.save();
            		ui.refresh();
				
}

function ContentConsolaReplica_camera() {

	          	ui.startCamera("MAP_FOTO","photo");
	          	ui.refresh();
		  
}

function ContentConsolaReplica_onback() {

              appData.failWithMessage(-11888,"##EXIT##");
          
}

function ContentConsolaReplica_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

function ContentConsolaReplica_ir() {

      		ui.showGroup (index,"##ALPHA_IN##",500,"##ALPHA_OUT##",500);
      		self.MAP_GROUP = index;
		
}

async function ContentConsolaReplica_anterior() {

				if (self.MAP_ESPECIAL > 3) {
					await self.executeNode ("ir",3);
					self.MAP_ESPECIAL = 0;
				} else {
					if (self.MAP_GROUP > 1) {
						await self.executeNode ("ir", self.MAP_GROUP - 1);
				    }
				}
			
}

async function ContentConsolaReplica_siguiente() {

				if (self.MAP_ESPECIAL > 3) {
					await self.executeNode ("ir",3);
					self.MAP_ESPECIAL = 0;
				} else {
					if (self.MAP_GROUP < self.MAP_TOTAL_PAGES) {
						await self.executeNode ("ir", self.MAP_GROUP + 1);
					}
				}
			
}

function ContentConsolaReplica_ProbarConexion() {

                testReplica();
			
}

async function ContentConsolaReplica_borrar() {

	          	var a = await ui.msgBox("¿Esta seguro que desea borrar todos las lineas de las cuales no existen los ficheros en su dispositivo?","¡¡¡ATENCION!!!",1);
	          	if( a === 1){
	            	var coll = await self.getContents("ReplicaFiles");
	            	var fso = createObject("filemanager");
	            	var borrados = 0;
	            	var cantidad = coll.getCount();
	            	if( cantidad <= 0){
	            		await coll.loadAll();
	            		cantidad = coll.count - 1;
	            	}
                    for (var i = 0; i < cantidad; i++) {
                        var fichero = coll[i].FILENAME.toString();
	            		var fic = fso.fileExists(fichero);		
						if( fic == -1){
							coll[i].deleteObject();
							cantidad--;
							borrados++;
						}
	            	}
					fso=null;
					fic=null;
					await ui.msgBox("Se han borrado " + cstr(borrados) + " lineas por no existir los ficheros asociados.","Información",0);
	          	}
	          
}

async function ContentConsolaReplica_borrar2() {

		          	var a=await ui.msgBox ("¿Esta seguro que desea borrar todos las fotos del terminal que ya han sido enviadas a la central?","¡¡¡ATENCION!!!",1);
		          	if (a===1) {
		            	var coll=await self.getContents("ReplicaFilesenviados");
		            	var fso = createObject("filemanager");
		            	var fic;
		            	var borrados=0;
		            	var borrados2=0;
		            	var cantidad=coll.getCount();
		            	if (cantidad<=0) {
		            		await coll.loadAll();
		            		cantidad=coll.getCount();
		            	}
		            	for (var i=0;i<cantidad;i++) {
		            		fichero=cstr(coll.get(i).FILENAME);
		            		fic = fso.fileExists(fichero);		
							if (fic===0) {
								fso.delete(fichero);
								coll.get(i).deleteObject();
								cantidad--;
								borrados++;
							} else {
								coll.get(i).deleteObject();
								cantidad--;
								borrados2++;
							}
		            	}
						fso=null;
						fic=null;
						await ui.msgBox ("Se han borrado " + cstr(borrados) + " fotos del terminal y sus registros.  Se han borrado " + cstr(borrados2) + " registros de fotos que no existen en el terminal.","Información",0);
		          	}
					
}

async function ContentConsolaReplica_replicar() {

            		replica.start();
            		await ui.msgBox ("Proceso de réplica iniciado. Se necesita buena cobertura o wifi para garantizar el envío de las fotos.","Información",0);
            	
}

function ContentConsolaReplica_salir() {

            		appData.failWithMessage (-11888,"##EXIT##");
            	
}

function ContentConsolaReplica_grupos() {

				self.MAP_ESPECIAL = parametro;
				ui.showGroup (parametro,"##ZOOM_IN##",300,"##ZOOM_OUT##",300);
			
}

