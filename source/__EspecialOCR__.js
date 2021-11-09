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

function EspecialOCR_field() {

					ui.sleep(5);
					self.MAP_IMAGEN = self.MAP_SELECTORIMAGENES;
					ui.refresh("MAP_IMAGEN");
				
}

function EspecialOCR_escanearMatricula() {

				var result = EscanearMatricula(self.MAP_IMAGEN);
				self.MAP_MATRICULA = result;
				ui.refresh("MAP_MATRICULA");
			
}

function EspecialOCR_escanearOcr() {

				var result = EscanearTexto(self.MAP_IMAGEN);
				self.MAP_TEXTO = result;
				ui.refresh("MAP_TEXTO");
			
}

function EspecialOCR_escanearMatriculaVbscript() {

				result = EscanearMatricula(self.MAP_IMAGEN);
				self.MAP_MATRICULA = result;
				ui.refresh("MAP_MATRICULA");
			
}

function EspecialOCR_escanearOcrVbscript() {

				result = EscanearTexto(self.MAP_IMAGEN);
				self.MAP_TEXTO = result;
				ui.refresh("MAP_TEXTO");
			
}

function EspecialOCR_onback() {

				appData.failWithMessage(-11888, "##EXIT##");
			
}

