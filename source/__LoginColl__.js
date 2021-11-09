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

function LoginColl_onback() {

        		appData.failWithMessage(-11888, "##EXIT##");
        
}

function LoginColl_create_0() {

			self.MAP_USUARIO=self.ownerCollection.getVariables("##LOGIN_LASTUSER##");
	  
}

function LoginColl_create_1() {
 
                var aceptar=0;
                self.MAP_HUELLADACTILAR = 0;
				
				// if (fingerprintManager.isHardwareAvailable()){
    // 				if (fingerprintManager.hasEnrolledFingerprints()){
    // 				    // para activar huella dactilar hay que poner esto a 1
    // 				    self.MAP_HUELLADACTILAR = 1;
    				    
    // 				    self.MAP_HUELLADACTILAR = 0;
				// 		doFingerprintAuth();  
    // 				}  
    // 				else{
    // 				    aceptar=ui.msgBox("Desea configurar la huella dactilar?","Mensaje",1);
    // 				    if (aceptar==1){
    // 				        fingerprintManager.launchFingerprintSettings();
    // 				    }else{
    // 				        self.MAP_HUELLADACTILAR = 0;
    // 				    }
    // 				}
				// }
				
    			self.MAP_HUELLADACTILAR = 0;
            
}

function LoginColl_aceptarHuella() {

                if(getOS() == "IOS"){
    		        doFingerprintAuthIOS();    
    			}
    		
}

async function LoginColl_click_entrar() {

            var err = false;
            if(autoLogin == 1){
                self.MAP_USER = "admin";
                self.MAP_PASSWORD = "";
            }else{
                if(self.MAP_USER.length == 0){
                    err = true;
                    await ui.msgBox("Debe rellenar el usuario","Información",0);
                }
                //else if(self.MAP_PASSWORD.length == 0){
                //    err = true;
                //    ui.msgBox("Debe rellenar la Contraseña","Información",0);
                //} 
            }
            if(!err){
		        await doLoginNew();
            }
		
}

async function LoginColl_click_cancelar() {

        	await self.executeNode("onback");
		
}

function LoginColl_login_fail() {

			var v_err=self.getVariables("##LOGIN_ERRORDESCRIPTION##");
			appData.failWithMessage(-8100,"Error: "+v_err);
		
}

function LoginColl_salir() {

            exit();
		
}

