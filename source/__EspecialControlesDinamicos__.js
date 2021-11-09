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

function EspecialControlesDinamicos_ir() {

      		ui.showGroup(index,"##ALPHA_IN##",500,"##ALPHA_OUT##",500);
      		self.MAP_GROUP = index;
			self.MAP_COLOR1 ="#FFFFFF";
			self.MAP_COLOR2 ="#000000";
		
}

async function EspecialControlesDinamicos_anterior() {

      		if( self.MAP_GROUP  > 1){
      			let index = self.MAP_GROUP - 1;
      			await self.executeNode("ir", index);
      		}
		
}

async function EspecialControlesDinamicos_siguiente() {

      		if ( self.MAP_GROUP < self.MAP_TOTAL_PAGES ){
      			let index = self.MAP_GROUP + 1;
      			await self.executeNode("ir", index);
      		}
		
}

function EspecialControlesDinamicos_before_edit() {
			
			self.MAP_GROUP = 1;
			self.MAP_TOTAL_PAGES = 12;
			self.MAP_COLOR1 = "#FFFFFF";
			self.MAP_COLOR2 = "#000000";
		
}

function EspecialControlesDinamicos_onback() {

	      	appData.failWithMessage(-11888,"##EXIT##");
	      
}

function EspecialControlesDinamicos_cambiarFondo() {

      		if( self.MAP_COLOR1 != "#39902B" ){
      			self.MAP_COLOR1 = "#39902B";
      		}else{
      			self.MAP_COLOR1 = "#FFFFFF";
      		}
		
}

function EspecialControlesDinamicos_cambiarFuente() {

      		if( self.MAP_COLOR2 != "#F0283C"){
      			self.MAP_COLOR2 = "#F0283C";
      		}else{
      			self.MAP_COLOR2 = "#000000";
      		}
		
}

