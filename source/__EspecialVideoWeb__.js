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

function EspecialVideoWeb_onfocusgrupo() {

      		    self.MAP_GROUP = index;
		
}

function EspecialVideoWeb_before_edit() {

			self.MAP_GROUP=1;
			self.MAP_MI_TIPO_WEB = DevolverIframeVideoYoutube("https://www.youtube.com/watch?v=OeY87de7OBE",self);
			self.MAP_TOTAL_PAGES=1;
		
}

function EspecialVideoWeb_onback() {

				appData.failWithMessage (-11888, "##EXIT##");
			
}

