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

function EspecialBasicosPlus_create() {

				//Inicialización de valores para la pestaña de firma DR
				self.MAP_COLOR_TRAZO = "#000000";
				self.MAP_COLOR_FONDO = "#A58855";
				self.MAP_TAMANO_TRAZO_DESPLEGABLE = "30";
				self.MAP_TOOLBARVISIBILITY = 0;
			
}

function EspecialBasicosPlus_before_edit() {
			
				self.MAP_GROUP=1;
				self.MAP_TOTAL_PAGES=2;
			
}

async function EspecialBasicosPlus_showmsgbox() {

				var vSelected=0;
				// switch (tipo){
				// agrego el toString porque no tengo ni idea ya de lo que enviar en el ExecuteNode, string o int....en cada nodo se manda una cosa diferente
				// ejemplo: en los focus de los grupos hay ExecuteNode con el nº del grupo, y eso necesita entero, sin embargo aqui el ExecuteNode pide un string...no lo entiendo
				switch (tipo){
				case "1":
					vSelected=await userMsgBox("Titulo 1", "Mensaje que queremos mostrar en el medio de la ventana para que lo acepte el usuario", "1");
					break;
				case "2":
					vSelected=await userMsgBox("Titulo 2", "Mensaje que queremos mostrar en el medio de la ventana y que el usuario nos diga SI ó NO a lo que sea", "2");
					break;
				case "4":
					vSelected=await userMsgBox("Titulo 4", "Mensaje que queremos mostrar en el medio de la ventana para que el usuario lo ACEPTE ó CANCELE", "4");
					break;
				default: 
					vSelected=99;
					break;
				}
				self.MAP_VALORDEVUELTO=vSelected.toString();
				ui.refresh("MAP_VALORDEVUELTO");
			
}

function EspecialBasicosPlus_toolbarvisibility() {

				if( self.MAP_TOOLBARVISIBILITY == 0){
					self.MAP_TOOLBARVISIBILITY = 1;
				}else{
					self.MAP_TOOLBARVISIBILITY = 0;
				}
				ui.refresh("ToolbarFloatingClose,ToolbarFloating,ToolbarColoresTrazo,ToolbarColoresFondo,ToolbarTamanoTrazo,ToolbarFloatingClose,ToolbarFloatingClose1");
			
}

function EspecialBasicosPlus_cambiarcolortrazo() {

				self.MAP_COLOR_TRAZO = color;
			
}

function EspecialBasicosPlus_cambiarcolorfondo() {

				self.MAP_COLOR_FONDO = color;
			
}

function EspecialBasicosPlus_cambiartamanotrazo() {

}

function EspecialBasicosPlus_guardar() {

				//Opcional: Acepta un segundo parámetro, nombre de fichero
				ui.saveDrawing("DIBUJO");
				//Comprobación extra, ver si se ha guardado correctamente
				var FileManager = createObject("FileManager");
				var path = appData.filesPath + self.DIBUJO.toString();
				var result = FileManager.fileExists(path);
				if ( result == 0){
					ui.showToast("Fichero " + path + " guardado correctamente");
				}else{
					ui.showToast("Error al guardar fichero " + path);
				}
				FileManager = null;
			
}

function EspecialBasicosPlus_borrar() {

				ui.clearDrawing("DIBUJO");
			
}

function EspecialBasicosPlus_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

