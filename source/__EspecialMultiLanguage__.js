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

function EspecialMultiLanguage_onfocusgrupo() {

      		    self.MAP_GROUP = index;
		
}

function EspecialMultiLanguage_field() {

                    setLanguage(self.MAP_IDIOMA);
		        
}

function EspecialMultiLanguage_before_edit() {
	
            self.MAP_IDIOMA = "es-ES";
			self.MAP_VALORVER=1;
			self.MAP_GROUP=1;
			self.MAP_IMAGE2="hrio.jpg";	
			self.MAP_FOTOVER="bovedas.jpg";
			self.MAP_VIDEOVER="video.mp4";
			self.MAP_VIDEOVER2="https://www.youtube.com/watch?v=YE7VzlLtp-4";
			self.MAP_WEB="http://xoneisp.com/home/";	
			self.MAP_TOTAL_PAGES=1;
		
}

function EspecialMultiLanguage_onback() {

				appData.failWithMessage (-11888, "##EXIT##");
			
}

