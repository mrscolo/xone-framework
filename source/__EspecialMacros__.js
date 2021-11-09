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

function EspecialMacros_before_edit() {

				self.MAP_VERSION = appData.getGlobalMacro("##VERSION##");
				self.MAP_FRAMEWORK = appData.getGlobalMacro("##FRAME_VERSION##");
				self.MAP_XONELIVE = appData.getGlobalMacro("##LIVEUPDATE_VERSION##");
				self.MAP_MID = appData.getGlobalMacro("##MID##");
				self.MAP_IMEI = appData.getGlobalMacro("##DEVICEID##");
				self.MAP_MODELO = appData.getGlobalMacro("##DEVICE_MODEL##");
				
				self.MAP_DEVICE_MANUFACTURER = appData.getGlobalMacro("##DEVICE_MANUFACTURER##");
				self.MAP_DEVICE_OSVERSION = appData.getGlobalMacro("##DEVICE_OSVERSION##");
				self.MAP_DEVICE_OSSDK = appData.getGlobalMacro("##DEVICE_OSSDK##");
				self.MAP_DEVICE_OSSDKCODE = appData.getGlobalMacro("##DEVICE_OSSDKCODE##");
				self.MAP_CURRENT_ORIENTATION = appData.getGlobalMacro("##CURRENT_ORIENTATION##");
				self.MAP_SCREEN_RESOLUTION_WIDTH = appData.getGlobalMacro("##SCREEN_RESOLUTION_WIDTH##");
				self.MAP_SCREEN_RESOLUTION_HEIGHT = appData.getGlobalMacro("##SCREEN_RESOLUTION_HEIGHT##");
				self.MAP_CURRENT_DENSITY = appData.getGlobalMacro("##CURRENT_DENSITY##");
				self.MAP_CURRENT_DENSITY_VALUE = appData.getGlobalMacro("##CURRENT_DENSITY_VALUE##");
				self.MAP_CURRENT_COUNTRY_CODE = appData.getGlobalMacro("##CURRENT_COUNTRY_CODE##");
				self.MAP_CURRENT_LANGUAGE = appData.getGlobalMacro("##CURRENT_LANGUAGE##");
				self.MAP_GROUP = 1;
				self.MAP_TOTAL_PAGES = 3;
			
}

function EspecialMacros_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

async function EspecialMacros_field() {

					var coll = await self.getContents("content1");
					if ( self.TIPO == "TODOS"){
						coll.setMacro("##TIPO##","1=1");
					}else{
						coll.setMacro("##TIPO##","FILTRO='" + self.TIPO.toString() + "'");
					}
					ui.refresh();
				
}

async function EspecialMacros_field() {

					var coll = await self.getContents("content2");
					if ( self.TIPO1  == "TODOS"){
						coll.setMacro("##TIPO##","SELECT ID,TITULO,FILTRO FROM GEN_CONTROLES");
					}else{
						coll.setMacro("##TIPO##","SELECT ID,TITULO,FILTRO FROM GEN_CONTROLES WHERE  FILTRO='" + self.TIPO1.toString() + "'");
					}
					ui.refresh();
				
}

function EspecialMacros_onback() {

				appData.failWithMessage(-11888, "##EXIT##");
			
}

