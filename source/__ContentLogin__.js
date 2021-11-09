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

async function ContentLogin_entrar() {

			var ObjB,st_erraut,CollB,CollC,ObjC;
			st_erraut="";
			var CollB = await appData.getCollection("Usuarios");
			CollB.setFilter("LOGIN='" + self.MAP_USERNAME.toString() + "'");
			await CollB.startBrowse();
			var ObjB = await CollB.getCurrentItem();
			if( ObjB === null || ObjB == "undefined"){
				st_erraut = "Nombre de usuario o password incorrecto";
			}
			ObjB = null;
			CollB.endBrowse();
			CollB.clear();
			CollB = null;
			// Si todo OK, intentamos el logueo
			if( st_erraut == ""){
				self.setVariables("##LOGIN_USERCOLL##","Usuarios");
				self.setVariables("##LOGIN_NEWUSER##","LOGIN," + self.MAP_USERNAME);
				self.setVariables("##LOGIN_NEWPASS##","PWD," + self.MAP_PASSWORD);
				self.setVariables("##LOGIN_NEWNOUSERIN##",0);
				appData.failWithMessage(-11888,"##LOGIN_START##");
			}else{
				appData.failWithMessage(-8100,st_erraut);
			}
		
}

function ContentLogin_salir() {

  			appdata.failWithMessage(-11888,"##EXITAPP##");
		
}

