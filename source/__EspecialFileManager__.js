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

function EspecialFileManager_before_edit() {

			self.MAP_GROUP = 1;	
			self.MAP_TOTAL_PAGES = 3;
		
}

function EspecialFileManager_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

function EspecialFileManager_ListarDirectorios() {

				var filemanager01 = createObject("FileManager");
				var lst = filemanager01.listDirectories(appData.getAppPath());
				if ( lst != null ){
					self.MAP_LISTADO = " Los directorios son: \r\n";
					for ( var i = 0; i < lst.length; i++){
						self.MAP_LISTADO = self.MAP_LISTADO + lst[i].toString().replace(appData.getAppPath()," - ") + "\r\n";
					}
				}else{
					ui.showToast("No hay carpetas...");
				}
			
}

function EspecialFileManager_ListarFicheros() {

				var filemanager01 = createObject("FileManager");
				var lst = filemanager01.listFiles();
				if ( lst != null ){
					self.MAP_LISTADO = " Los ficheros son:  \r\n";
					for ( var i = 0; i < lst.length; i++){
						//self.MAP_LISTADO")=self.MAP_LISTADO")+replace(lst(i),appData.apppath+"files/"," - ")+chr(13) + chr(10)+chr(13) + chr(10)
						self.MAP_LISTADO = self.MAP_LISTADO + lst[i].toString() + "\r\n";
					}
				}else{
				    ui.showToast("No hay ficheros...");
				}
			
}

async function EspecialFileManager_nuevo() {

				var coll = await self.getContents("incidencia");
				var obj = await coll.createObject();
				coll.addItem(obj);
				appData.pushValue(obj);
			
}

async function EspecialFileManager_descargarFicheros() {

				var objFile = createObject("FileManager");
				if( objFile.fileExists(appData.getFilesPath() + "/ribera_del_guadiana.pdf") == 0 ){
					await self.executeNode("pdf");
				}else{
					objFile.download("http://www.xoneisp.com/XOneJSONDemoRiberaGuadiana/files/ribera_del_guadiana.pdf","ribera_del_guadiana.pdf");
					if( objFile.fileExists("ribera_del_guadiana.pdf") != 0){
						await ui.msgBox("No se ha podido descargar el fichero, o el fichero no existe en el servidor.","",0);
					}else{
						await self.executeNode("pdf");
					}
				}
			
}

function EspecialFileManager_pdf() {

      			ui.openFile(appData.getFilesPath() + "/ribera_del_guadiana.pdf");
		
}

function EspecialFileManager_onback() {

				appData.failWithMessage(-11888, "##EXIT##");
			
}

