// Por script
function jstestClick(e) {
	var c;
	if (e.data.msg) {
		ui.msgBox (e.target+": "+e.data.msg,e.data.title+" "+e.data.collName,0);
		if(e.data.collName != null){
    		if(e.data.collName.length > 0){
		        c=appData.getCollection(e.data.collName);
		    }
		}
	} else {
		ui.msgBox ("Abre el objeto "+e.data,"Titulo",0);
		if(e.data != null){
    		if(e.data.length > 0){
    		    c=appData.getCollection(e.data);
    		}
		}
	}
	var obj=c.createObject();
	c.addItem(obj);
	appData.pushValue(obj);
}

//manejar errores del tipo WEB
function handleError(e) {
    //if (e.messageLevel == "ERROR") {
    //    ui.msgBox("Nivel: " + e.messageLevel + "\nMensaje: " + e.message + "\nLínea: " + e.lineNumber + "\nID fuente: " + e.sourceId, "Error WebView", 0);
    //}
}
  
function eventoOnTextChanged(evento) {
	//ui.showToast("onTextChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTecla pulsada: " + evento.keyPressed + "\noldText: " + evento.oldText + "\nnewText: " + evento.newText);
	self["MAP_DESCRIPCIONEVENTO"]="onTextChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTecla pulsada: " + evento.keyPressed + "\noldText: " + evento.oldText + "\nnewText: " + evento.newText;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO");
}

function FiltraMarcados(e){
    self.MAP_BUSCAR_TEXT = e.newText;
    self.executeNode("applyfilter");
}

function eventoOnFocusChanged(evento) {
	//ui.showToast("onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused);
	self.MAP_DESCRIPCIONEVENTO="onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO");
}

function eventoOnFocusChanged3(evento) {
	self.MAP_DESCRIPCIONEVENTO3="onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO3");
}

// Por attributo en el nodo
function jstestClickNode(e,data) {
	var c;
	if (data.msg) {
		ui.msgBox (e.target+": "+data.msg,data.title+" "+data.collName,0);
		c=appData.getCollection(data.collName);
	} else {
		ui.msgBox ("Abre el objeto "+data,"Titulo",0);
		c=appData.getCollection(data);
	}
	var obj=c.createObject();
	c.addItem(obj);
	appData.pushValue(obj);
}
function scrollArrow(e,miparam) {
	if (miparam==1){
		if (e.dy<=10 && self.MAP_VALORVER==1) {
			self.MAP_VALORVER=0;
			ui.getView(self).refresh("frmblotante");
		} else if (e.dy>10 && self.MAP_VALORVER==0) {
			self.MAP_VALORVER=1;
			ui.getView(self).refresh("frmblotante");
		} 
	} else {
		if (e.dy<=10 && self.MAP_ATTSHOWOVERSCROLL==1) {
			self.MAP_ATTSHOWOVERSCROLL=0;
			ui.getView(self).refresh("attfroverscroll");
		} else if (e.dy>10 && self.MAP_ATTSHOWOVERSCROLL==0) {
			self.MAP_ATTSHOWOVERSCROLL=1;
			ui.getView(self).refresh("attfroverscroll");
		} 
	}
}

// Esta funcion es llamada por el evento sys-message de la colección empresas
function sysMessage(codigo,message) {
	var cadena="";
	switch(codigo) {
 
		case 1000:
			cadena=" Actualización descargándose (un mensaje por cada actualización).";
			break;
 
		case 1001:
			cadena=" Actualización aplicada (un mensaje por cada actualización).";
			break;
 
		case 1002:
			cadena=" Se han aplicado todas las actualizaciones (al comprobar las actualizaciones puede haber más de una, éste se invoca al aplicar todas).";
			break;
 
		case 1003:
 
			/* Provisionamiento seguro. */
			/* Declarar el nodo sys-message requiere que este caso lo controle el programador,
			/* es responsabilidad del programador limpiar la cola de réplica y cerrar la aplicación.
			/* ************************ */
 
			ui.msgBox("Advertencia, se ha programado una actualización de base de datos. Se van a replicar todos los datos y se cerrará la aplicación.", "Mensaje", 0);
			var bResult = replica.processReplicatorQueue(liveResponse);
			if (bResult) {
				//ui.msgBox("Cola de salida del replicador procesada correctamente. Cerrando aplicación.", "Mensaje", 0);
				appData.failWithMessage(-11888, "##EXITAPP##");
			} else {
				ui.showToast("Error al procesar la cola de salida");
				//Ojo, hay que volver a intentarlo ó hacer una repetitiva, tenemos que replicar lo que haya en el disposivo antes de salir.
			}
			break;
    }
}