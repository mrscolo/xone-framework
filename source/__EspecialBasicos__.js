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

function EspecialBasicos_before_edit() {
			
			self.MAP_VALORVER=1;
			self.MAP_GROUP=1;
			self.MAP_IMAGE2="hrio.jpg";	
			self.MAP_FOTOVER="bovedas.jpg";
			self.MAP_VIDEOVER="video.mp4";
			self.MAP_VIDEOVER2="https://www.youtube.com/embed/YE7VzlLtp-4";
			self.MAP_WEB="http://xoneisp.com/home/";
				
			self.MAP_EJEMPLO1="1 CSS";	
			self.MAP_EJEMPLO2="2 CSS";	
			self.MAP_EJEMPLO3="3 CSS";
			
			self.MAP_TOTAL_PAGES=6;
		
}

function EspecialBasicos_oldvalue() {

            //Expuesto en javascript a partir de la v4.8.1.33
			//self.MAP_TEXT_OLD=self.MAP_TEXT.getOldValue();
			self.MAP_TEXT_OLD=self.getOldValue("MAP_TEXT");
			//También puede ser:
			//self.MAP_TEXT_OLD=self.MAP_TEXT.getOldItem();
			ui.refresh("MAP_TEXT_OLD");
		
}

function EspecialBasicos_onback() {

				appData.failWithMessage (-11888, "##EXIT##");
			
}

