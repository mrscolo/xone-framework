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

async function EspecialPictureMap_accion() {

                var cobj=await self.getContents("PictureMapData");
                cobj.setFilter("ID=" + self.MAP_ID);
                await cobj.loadAll();
                var obj = cobj.getItem(0);
	          	if (obj!=null) {
	          		obj.ESTADO=cstr(param);
	          		if (param==="INCIDENCIA")
		  				self.MAP_ESTADO="Módulo con Incidencia";
		  			else
		  				self.MAP_ESTADO="Módulo Arreglado";
	          		await obj.save();	          		
	          		self.MAP_VISIBLE=0;
	          		await (await self.getContents("PictureMapData")).loadAll();
					(await self.getContents("PictureMapData")).lock();
	          		ui.showToast("entre");
	          	}
	          	obj=null;
		
}

function EspecialPictureMap_onback() {

	      	appData.failWithMessage (-11888,"##EXIT##");
	      
}

async function EspecialPictureMap_before_edit() {
			
			self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=1;
			self.MAP_VISIBLE=0;
			await (await self.getContents("PictureMapData")).loadAll();
			if((await self.getContents("PictureMapData")).count() > 0){
			    var obj = (await self.getContents("PictureMapData")).getItem(0);
			    self.MAP_ID = obj.ID;
			    self.MAP_NOMBRE = obj.TITULO;
			    self.MAP_DESCRIPCION = obj.DESCRIPCION;
			}
			(await self.getContents("PictureMapData")).lock();
		
}

