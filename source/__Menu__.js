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

function Menu_cambiarMenu() {

		          	self.FILTROCONTROL=Titulo;
		          	self.MAP_IMAGEN=Imagen;
		          	self.MAP_MENU=Titulo;
		          	self.MAP_COLORACTIVO=ColorFondo;
		          	// Quitamos el drawer por si estuviera visible
		          	// ui.hidegroup("99")
					ui.refresh ("@MenuControles","MAP_IMAGEN","frmtitulo");
			
}

async function Menu_before_edit() {

				//self.executeNode ("cambiarMenu('BASICO','1SELECT.png',##FLD_MAP_COLOR1##)");
				await self.executeNode("cambiarMenu","BASICO","1SELECT.png",self.MAP_COLOR1);
			
}

function Menu_showDrawer() {

				ui.toggleGroup("99");
			
}

async function Menu_toggleSUBMENU() {

                if ( subopcion == 6){
		   			await self.executeNode("logout");
		   		}else{
    		  		// Pasamos como parámetro la opcion principal en que ha pinchado.
    		  		// Preguntamos y si le ha vuelto a dar a la que estaba desplegada, la colapsamos.
    		   		
    		  		if (self.MAP_SUBOPCION==subopcion){
    		   			self.MAP_SUBOPCION=0;
    		   		}else{
    		   			self.MAP_SUBOPCION=subopcion;
    		   		}
		   		}
			
}

async function Menu_pulsar() {

              if (tipo) {
              		if (tipo===0)
              			await self.executeNode("cambiarMenu('BASICO','1SELECT.png',##FLD_MAP_COLOR1##)");
              		
    				if (tipo===1)
              			await self.executeNode ("cambiarMenu('CONTENTS','2SELECT.png',##FLD_MAP_COLOR2##)");
              		
              		if (tipo===2)
              			await self.executeNode ("cambiarMenu('PERIFERICOS','3SELECT.png',##FLD_MAP_COLOR3##)");
              		
    				if (tipo===3)
              			await self.executeNode ("cambiarMenu('REGLAS DE NEGOCIO','4SELECT.png',##FLD_MAP_COLOR4##)");
              			
              }
              
              var param = {TIPO:"",MAP_COLORACTIVO:""};
              if ( coll === "EspecialPerifericos" || coll === "EspecialDatosOnline"){
                  param.TIPO = subtipo||"";
              }
              if (coll==="ContentConsolaReplica" || tipo == 5){
	          		param.MAP_COLORACTIVO = self.MAP_COLOR5;
			  }else{
	          		param.MAP_COLORACTIVO = self.MAP_COLORACTIVO;
			  }
			  
              var obj = await (await appData.getCollection(coll)).createObject(param,true);
              appData.pushValue(obj);
              
    //           var obj=appData.getCollection(coll).createObject();
				// appData.getCollection(coll).addItem (obj);
				// if (coll==="EspecialPerifericos" || coll==="EspecialDatosOnline")
	   //       		obj["TIPO"]=subtipo||"";
	          	
	   //       	if (coll==="ContentConsolaReplica" || tipo == 5){
	   //       		obj["MAP_COLORACTIVO"]=self.MAP_COLOR5;
				// }else{
	   //       		obj["MAP_COLORACTIVO"]=self.MAP_COLORACTIVO;
				// }
				// appData.pushValue(obj);
		
}

function Menu_field() {
	
				if (self.MAP_TIMEAUTO==="CADA 3 SG")
					self.MAP_TIMEVALOR=3;
				if (self.MAP_TIMEAUTO==="CADA 60 SG")
					self.MAP_TIMEVALOR=60;
			
}

function Menu_onback() {

				// appData.failWithMessage (-11888, "##EXITAPP##");
				exit();
			
}

function Menu_logout() {

				    doLogout();
			    
}

