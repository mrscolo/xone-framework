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

async function ContentReplicaFilesenviados_selecteditem() {

          		var a = await ui.msgBox("?Esta seguro que desea borrar esta fotosgraf?a?","???ATENCION!!!",1);
          		var fso = createObject("filemanager");
		        if ( a == 1){
		        	fso.delete(self.FILENAME.toString());
					self.deleteObject();
		        }
		        fso = null;
		  
}

