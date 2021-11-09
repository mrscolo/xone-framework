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

function EspecialSonidos_setvolumen() {

				if (self.MAP_VOLUMEN==1) {
					self.MAP_VOLUMEN=0;
					self.MAP_IMGVOLUMEN="sonido_off.png";
					ui.showToast("Sonido Desactivado");
				}
				else {
					self.MAP_VOLUMEN=1;
					self.MAP_IMGVOLUMEN="sonido_on.png";				
					ui.showToast("Sonido Activo, Compruebe el volumen de su dispositivo.");
				}
				ui.refresh("MAP_BTVOLUMEN");
	    	
}

function EspecialSonidos_setvibracion() {

				if (self.MAP_VIBRACION==1) {
					self.MAP_VIBRACION=0;
					self.MAP_IMGVIBRACION="vibracion_off.png";
					ui.showToast("Vibración Desactivada");
				}
				else {
					self.MAP_VIBRACION=1;
					self.MAP_IMGVIBRACION="vibracion_on.png";				
					ui.showToast("Vibración Activa");
				}
				ui.refresh("MAP_BTVIBRACION");	
	    	
}

function EspecialSonidos_playsound() {

				var bVibrate;
				if (self.MAP_VIBRACION == 1) {
					bVibrate = true;
				} else {
				    bVibrate = false;
				}
				/**
				 * Parámetros:
				 * 1) Ruta del archivo de sonido (si es relativa, por defecto
				 * busca en la carpeta files)
				 * 2) Número de repeticiones de la reproducción
				 */
				ui.playSound(self.MAP_SONIDO, self.MAP_REPETICIONES);
				if (bVibrate) {
				    ui.vibrate("3000,3000,3000,3000");
				}
			
}

async function EspecialSonidos_borrar() {

				var collCont = await self.getContents("SonidosNotificaciones");
	            if ( collCont != null || collCont != "undefined"){
		            var obj = createObject("FileManager");
		            //sonido = "/storage/sdcard0/xone/app_AllbyXOne/files/"+self.MAP_SONIDO")
		            var sonido = self.MAP_SONIDO;
		           	//ui.ShowToast sonido
		            //sonido = replace(sonido,right(sonido, 4),"")
		            //ui.ShowToast sonido
		            var res = obj.fileExists(sonido);
					if ( res == 0 ){
						  obj.delete(sonido);
						  //si se pasa una cadena borra el id 
						  //si se pasa un entero borra el indice del array del contents (Empieza por 0)
						  collCont.deleteItem(self.MAP_ID.toString());
						  self.MAP_BTSONIDOSEL = "";
						  self.MAP_SONIDO = "";
					}else{
						await ui.msgBox("El audio no existe","Aviso",0);
					}
		          	ui.getView(self).refresh("SonidosNotificaciones");
	            }
			
}

async function EspecialSonidos_grabacion() {

			if ( accion == "REC" ){
				//Si pulsamos el boton de grabacion 
				// 1.- Preguntamos si ya estabamos grabando para parar la grabacion.
				// 2.- Ponemos como imagen la de grabar por si quiere hacer otra grabacion
				if ( self.MAP_RECORD_ON == 99){
					ui.stopAudioRecord();  
					self.MAP_RECORD_ON = 0;
					self.MAP_IMGBOTONAUDIO = "record.png";
					ui.refresh("MAP_BOTONGRABAR");
				}else{
					//Si no estábamos grabando, ponemos la bandera de que estamos grabando a 99 y ponemos el icono de parar grabación		
					self.MAP_RECORD_ON = 99;
					self.MAP_IMGBOTONAUDIO = "stop.png";
					ui.refresh("MAP_BOTONGRABAR");
					//Las opciones del "ui.StartAudioRecord" son: 
					// 1.- Nodo a ejecutar tras la grabacion
					// 2.- Campo destino con el nombre del fichero
					// 3.- Duracion maxima de la grabacion expresada en segundos (0 - Sin limite, hasta que la paremos nosotros.)
					ui.startAudioRecord("onrecordfinished","MAP_RECORD_FILE", 0);
				}
			}else{
				if ( self.AUDIO.length == 0){
					await ui.msgBox("No existe audio para reproducir.","Aviso",0);
				}else{
					// Si en el ultimo parametro ponemos -1 se reproduce indefinidamente.					
					ui.playSoundAndVibrate(self.AUDIO.toString(),"",1);
				}
			}				
		
}

function EspecialSonidos_onrecordfinished() {

          		//Ponemos la bandera de grabacion a 0
          		//Ponemos en "AUDIO" el fichero generado
          		//Ponemos la imagen del boton de grabacion en "REC" de nuevo para que puede iniciar otra grabacion.
          		self.MAP_RECORD_ON = 0;
                self.AUDIO = self.MAP_RECORD_FILE;
				self.MAP_IMGBOTONAUDIO = "record.png";
				ui.refresh("MAP_ET24,MAP_BOTONGRABAR,AUDIO,MAP_BOTONAUDIOPLAY,MAP_TITULOGRABACION,MAP_BOTONSAVE");
              
}

async function EspecialSonidos_save() {

					if (self.MAP_TITULOGRABACION!="") {
						var coll = await appData.getCollection("ContentSonidosNotificaciones");
						var obj = await coll.createObject();
	
						coll.addItem(obj);
	
						obj.TITULO=self.MAP_TITULOGRABACION;
						obj.SONIDO=self.AUDIO;
					 
				        await obj.save();
				        
				        //Refrescamos el contents (el name del prop type Z)
				        ui.refresh("SonidosNotificaciones");
				        ui.showToast("El sonido "+self.MAP_TITULOGRABACION+", se ha grabado correctamente, puede reproducirlo tambien en la primera pestaña");
					}
					else {
						await ui.msgBox("Escriba un nombre para el sonido","Error",0);
					}
			
}

function EspecialSonidos_onfocusgrupo() {

      		self.MAP_GROUP = index;
      		ui.refresh("MAP_LAST,MAP_LAST_EMPTY,MAP_NEXT");
		
}

function EspecialSonidos_ir() {

      		ui.showGroup(index,"##ALPHA_IN##",500,"##ALPHA_OUT##",500);
      		self.MAP_GROUP = index;
		
}

async function EspecialSonidos_anterior() {

      		if( self.MAP_GROUP > 1 ){
      			var index = self.MAP_GROUP - 1;
      			await self.executeNode("ir", index);
      		}
		
}

async function EspecialSonidos_siguiente() {

      		if (self.MAP_GROUP < self.MAP_TOTAL_PAGES) {
      			//var index = self.MAP_GROUP + 1;
      			if (self.MAP_GROUP+1==2) {
      				//Vaciamos los campos de la grabadora de sonidos si hubieran estado rellenos previamente
      				self.AUDIO="";
      				self.MAP_TITULOGRABACION="";
      				//ui.refresh("AUDIO,MAP_TITULOGRABACION");
      			}
      			await self.executeNode("ir",self.MAP_GROUP + 1);
      		}
		
}

function EspecialSonidos_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

