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

function EspecialColores_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function EspecialColores_before_edit() {
			
			self.MAP_GROUP=1;
			self.MAP_TEXT1="Texto";	
			self.MAP_TEXT2="Texto";	
			self.MAP_TEXT3="Texto";	
			self.MAP_TEXT4="Texto";	
			self.MAP_TEXT5="Texto";	
			self.MAP_TEXT6="Texto";	
			self.MAP_TEXT7="Texto";	
			self.MAP_TEXT8="Texto";	
			self.MAP_TEXT9="Texto";	
			self.MAP_DATE1= new Date();	
			self.MAP_DATE2= new Date();
			self.MAP_DATE3= new Date();	
			self.MAP_DATE4= new Date();
			self.MAP_DATE5= new Date();
			self.MAP_DATE6= new Date();
			self.MAP_DATE7= new Date();
			self.MAP_DATE8= new Date();	
			self.MAP_DATE9= new Date();
			self.MAP_TOTAL_PAGES=4;
		
}

