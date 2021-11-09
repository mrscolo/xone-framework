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

function ImageDrawing_before_edit() {
 
                self.MAP_IDIOMA = "es-ES";
    			self.MAP_VALORVER=1;
    			self.MAP_GROUP=1;
    			self.MAP_IMAGE2="hrio.jpg";	
    			self.MAP_TOTAL_PAGES=1;
    			self.MAP_IMG= "SplashbyXOne.jpg";
            
}

function ImageDrawing_LanzarFirma() {

                ui.showToast(appData.filesPath + "splash.png");
                ui.startSignature("MAP_IMG", 640, 480);
            
}

function ImageDrawing_onback() {

				appData.failWithMessage (-11888, "##EXIT##");
			
}

