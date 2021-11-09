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

function EspecialJavascript_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

function EspecialJavascript_before_edit_0() {

          	self.MAP_GROUP=1;
          
}

function EspecialJavascript_before_edit_1() {

            self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=2;
			
			var v=ui.getView(self);
			
            self.MAP_X=3;
            self.MAP_Y=2;
            self.MAP_X2=3.5;
            self.MAP_Y2=2.3;
            
            self.MAP_XMASY=self.MAP_X+self.MAP_Y;
            self.MAP_XMASY2=self.MAP_X+self.MAP_Y2;
            self.MAP_X2MENOSY2=self.MAP_X2-self.MAP_Y2;
            self.MAP_XENTREY=self.MAP_X/self.MAP_Y;
			self.MAP_FECHADMY=new Date();
			self.MAP_FECHAYMD=self.MAP_FECHADMY;
			self.MAP_FECHAHORA=self.MAP_FECHADMY;
			
			
}

function EspecialJavascript_create() {

          	self.MAP_FECHAS=funcionesFecha();
          
}

function EspecialJavascript_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

