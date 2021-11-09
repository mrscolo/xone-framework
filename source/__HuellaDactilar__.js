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

function HuellaDactilar_before_edit() {
 
            	
                self.MAP_IDIOMA = "es-ES";
    			self.MAP_VALORVER=1;
    			self.MAP_GROUP=1;
    			self.MAP_IMAGE2="hrio.jpg";	
    			self.MAP_TOTAL_PAGES=1;
			
                if(typeof fingerprintManager !== "undefined"){
                    if (fingerprintManager == null) {
                  		self.MAP_T_HUELLADACTILAR_IFO = "Su dispositivo no soporta la lectura de huella dactilar.";
                  	} 
                }else{
                    self.MAP_T_HUELLADACTILAR_IFO = "Funcionalidad de huella dactilar no implementada.";
                }
            
}

function HuellaDactilar_assignarHuella() {

                if(getOS() == "IOS"){
                    doRegisterNewFingerprintIOS();
                }else{
        		    doRegisterNewFingerprint();
                }
            
}

function HuellaDactilar_onback() {

				appData.failWithMessage (-11888, "##EXIT##");
			
}

