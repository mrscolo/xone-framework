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

function ContentFileManager_create() {

				self.MAP_COLORACTIVO = "#666666";
			
}

function ContentFileManager_before_edit() {

				self.MAP_COLORACTIVO = "#666666";
			
}

async function ContentFileManager_field() {

					var cImagen = await self.getContents("imagenes");
					var objImagen = await cImagen.createObject();
					objImagen.FOTO = self.MAP_FOTO;
					objImagen.FECHA = formatDateTime(new Date(),0);
					if ( self.ID > 0 ){
						objImagen.IDINCIDENCIA = self.ID;
					}
					cImagen.addItem(objImagen);
					await objImagen.save();
            		ui.getView(self).refresh("MAP_IMAGENES");
				
}

function ContentFileManager_camera() {

	          	ui.startCamera("MAP_FOTO","photo");
		  
}

function ContentFileManager_pick() {

                //Solo los 2 primeros son obligatorios
                //ui.pickFile('Prop destino','Extensiones permitidas',Solo fotos,'Ruta inicial',No permite rutas superiores a la inicial;
                //ui.pickFile("MAP_ADJUNTORESPUESTA","*.jpg;*.png",false,"##FILESPATH##",1);
                //ui.pickFile("MAP_ADJUNTORESPUESTA","*.jpg;*.png",false,"/sdcard/DCIM/Camera",1);
                ui.pickFile('MAP_FOTO','', true);
		  
}

async function ContentFileManager_guardar() {

				await self.save();
				appData.failWithMessage(-11888,"##EXIT##");
			
}

async function ContentFileManager_eliminarFoto() {

				var collCont = await self.getContents("imagenes");
	            if( collCont != null && collCont != "undefined"){
		            var obj = createObject("FileManager");
		            var res = obj.fileExists(self.MAP_NOMBREFOTO);
					if(res == 0){
						  obj.delete(self.MAP_NOMBREFOTO);
						  //si se pasa una cadena borra el id 
						  //si se pasa un entero borra el indice del array del contents (Empieza por 0)
						  //En este caso el parámetro viene como cadena
						  collCont.deleteItem(index);
					}else{
						await ui.msgBox("El fichero no existe","Aviso",0)
					}
		          	ui.getView(self).refresh("MAP_IMAGENES");
	            }
			
}

function ContentFileManager_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

