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

function EspecialBluetooth_before_edit() {
			
			    self.MAP_GROUP = 1;
			    self.MAP_TOTAL_PAGES = 1;
			    self.MAP_COLOR1 = "#FFFFFF";
			    self.MAP_COLOR2 = "#000000";
		    
}

function EspecialBluetooth_onfocusgrupo() {

      		    self.MAP_GROUP = index;
		    
}

