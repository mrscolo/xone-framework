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

function EspecialButtons_onback() {

	      	appData.failWithMessage(-11888,"##EXIT##");
	      
}

function EspecialButtons_onfocusgrupo() {

      		self.MAP_GROUP = index;
		
}

async function EspecialButtons_create() {

      		var testObjectColl = await appData.getCollection("ContentTestObject");
      		await testObjectColl.loadAll();
      		if (testObjectColl.getCount() ===0) {
	      		var testObject = await testObjectColl.createObject();
	      		
	      		testObject.CAMPO1= "Campo 1";
	      		testObject.CAMPO2 = "Campo 2";
	      		
	      		testObjectColl.addItem (testObject);
	      		await testObject.save();
      		}
		
}

function EspecialButtons_llenarPropiedadesjava() {

          		//ui.msgBox("SIN WAIT DIALOG","BOTON JAVASCRIPT",0);
          		//doAuthLogin();
          		/*
          		var coll = appData.getCollection("ContentTestObject");
				coll.startBrowse();
				var obj = coll.getCurrentItem();
				self[prop1] = obj["CAMPO1"];
				self[prop2] = obj["CAMPO2"];
				coll.endBrowse();
				*/
				self[prop1] = "Esto es una prueba";
				self[prop2] = "Esto también";
				
				ui.refresh(prop1,prop2);
			
}

function EspecialButtons_vaciarPropiedadesjava() {

          	    //	ui.msgBox("CON WAIT DIALOG","BOTON JAVASCRIPT",0);
          	    //doAuthLogout();
				self[prop1] = "";
				self[prop2] = "";
				ui.refresh(prop1,prop2);
			
}

function EspecialButtons_leerTexto() {

				//ui.speak("es", "hola");
				ui.speak("en", self[prop2]);
				ui.refresh(prop2);
			
}

function EspecialButtons_escucharTexto() {

            
            
            ui.speak("ES","Diga número de servicio");
            
            let jsParams = {
                
                    timeout:2,       
                    language:'es',
                    showRecording:true,
                    partialResults:false,
                    onRecognize: function(sText) {
                        self[prop1]= sText;
                        ui.refresh(prop1);
                        console.log("onRecognize -> " + sText);
                    },
                    
                    onError: function(sError) {
                        
                        ui.msgBox("onError(): El error es: " + sError, "Desde callback", 0);
                        
                        console.log("onError -> " + sError);
                    }
            };

            ui.recognizeSpeech(jsParams);
    
			
}

function EspecialButtons_field() {

                        if (self.PROP2it.length>0) {
        				    self.PROP2it= self.PROP2it + "\n" + self.MAP_TXTSPEECH;
                        }
        				else {
        				    self.PROP2it= self.MAP_TXTSPEECH;
        				}
        				ui.refresh("PROP2it");
        			
}

function EspecialButtons_actualizaSpeech() {

                ui.showToast("Entro en actualizaSpeech"+self[prop1]+self[prop2]);
		         self[prop1]= self[prop1] + self[prop2];
                ui.showToast(self[prop1]);
		         ui.refresh(prop1);
			
}

function EspecialButtons_before_edit() {
		
			self.MAP_GROUP=1;
			self.MAP_TOTAL_PAGES=1;
		
}

