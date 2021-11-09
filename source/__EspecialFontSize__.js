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

function EspecialFontSize_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

function EspecialFontSize_before_edit() {
		
			self.MAP_TEXT1="Font Size 6";
			self.MAP_TEXT2="Font Size 7";
			self.MAP_TEXT3="Font Size 8";
			self.MAP_TEXT4="Font Size 9";
			self.MAP_TEXT5="Font Size 10";
			self.MAP_TEXT6="Font Size 12";
			self.MAP_TEXT7="Font Size 14";
			self.MAP_TEXT8="Font Size 16";
			self.MAP_TEXT9="Font Size 18";
			self.MAP_TEXT10="Font Size 20";
			self.MAP_TEXT11="Font Size 30";         
			self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=4;
		
}

