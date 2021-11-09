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

function EspecialBrillo_before_edit() {
	
          		self.MAP_BANDERA=1;
                if (systemSettings.getBrightnessMode()=="automatic")
          		{
          			//automatic
          			self.MAP_AUTO=1;
          		}
          		else
          		{
          			//manual
          			self.MAP_AUTO=0;
          		}
          		self.MAP_BRILLO = systemSettings.getBrightness();
                self.MAP_AUTO_TL = "Brillo automatico";
			    self.MAP_GROUP = 1;
			    self.MAP_TOTAL_PAGES = 1;
			    self.MAP_COLOR1 = "#FFFFFF";
			    self.MAP_COLOR2 = "#000000";
          		self.MAP_BANDERA=0;
		    
}

function EspecialBrillo_field() {

					if (self.MAP_BANDERA==0){
						self.MAP_BANDERA=1;
						systemSettings.setBrightnessMode("manual");
		     			systemSettings.setBrightness(self.MAP_BRILLO);
		     			self.MAP_BRILLO = systemSettings.getBrightness();
		     			self.MAP_AUTO=0;
		     			ui.refresh("MAP_AUTO,MAP_BRILLO");
		     			self.MAP_BANDERA=0;
		     		}
	    		
}

function EspecialBrillo_field() {

					if (self.MAP_BANDERA==0){
						self.MAP_BANDERA=1;
		     			if (self.MAP_AUTO==1)
		     			{
		     				systemSettings.setBrightnessMode("automatic");
		     				self.MAP_BRILLO = systemSettings.getBrightness();
		     			}
		     			else
		     			{
		     				systemSettings.setBrightnessMode("manual");
		     			}
		     			ui.refresh("MAP_AUTO,MAP_BRILLO");
		     			self.MAP_BANDERA=0;
	     			}
	    		
}

function EspecialBrillo_onfocusgrupo() {

      		    self.MAP_GROUP = index;
		    
}

