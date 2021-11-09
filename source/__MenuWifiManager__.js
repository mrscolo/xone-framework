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

function MenuWifiManager_before_edit() {

                
                self.MAP_WIFICONECTEDINFO = 0;
                // self.MAP_SSID_INFO = "XONEWireles5G";
                // self.MAP_ESTADO_INFO = "Conexión establecida";
                // self.MAP_INTENSIDAD_INFO = "Buena";
                // self.MAP_VELOCIDAD_INFO = "26Mbps";
                // self.MAP_FRECUENCIA_INFO = "50GHz";
                // self.MAP_SEGURIDAD_INFO = "WP2 PSK";
          
                self.MAP_LOADING = 0;
    			var wifiManager = createObject("WifiManager");
    			
    			self.MAP_IMG_LOADING = "loading.gif";
    			
                if(wifiManager.isWifiAdapterEnabled()){
                    self.MAP_REDESWIFI = "Sí";
                    self.MAP_WIFIACTIVE = 1;
                }else{
                    self.MAP_REDESWIFI = "No";
                    self.MAP_WIFIACTIVE = 0;
                }
          		
          		appData.getCurrentEnterprise().setVariables("MAP_MENUFASECERO",1);
          		self.MAP_MENUFASECERO=appData.getCurrentEnterprise().getVariables("MAP_MENUFASECERO");
          		
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
    			self.MAP_TXT_TITLE="Ajustes";
    			
    			self.MAP_BRILLO = systemSettings.getBrightness();
    			self.MAP_BANDERA=0;
    			
    			ui.refresh("MAP_AUTO");
    			//systemSettings.setBrightnessMode("automatic");
    			
    			//self.executeNode("scanAvailableNetworks");
		    
}

function MenuWifiManager_ocultarPanel() {

                self[prop] = 0;
                ui.refresh(frm);
	        
}

function MenuWifiManager_field() {

					if (self.MAP_BANDERA==0){
						//ui.showToast("entra");
						self.MAP_BANDERA=1;
						systemSettings.setBrightnessMode("manual");
		     			systemSettings.setBrightness(self.MAP_BRILLO);
		     			self.MAP_BRILLO = systemSettings.getBrightness();
		     			self.MAP_AUTO=0;
		     			ui.refresh("MAP_AUTO,MAP_BRILLO");
		     			self.MAP_BANDERA=0;
		     		}
	     			
	     			//ui.showToast("pepito");
    		    
}

function MenuWifiManager_field() {

					if (self.MAP_BANDERA==0){
						self.MAP_BANDERA=1;
		     			if (self.MAP_AUTO==1)
		     			{
		     				//ui.showToast("lo pongo auto");
		     				systemSettings.setBrightnessMode("automatic");
		     				//ui.sleep(2);
		     				self.MAP_BRILLO = systemSettings.getBrightness();
		     				
		     			}
		     			else
		     			{
		     				//ui.showToast("lo pongo manual");
		     				systemSettings.setBrightnessMode("manual");
		     			}
		     			ui.refresh("MAP_AUTO,MAP_BRILLO");
		     			self.MAP_BANDERA=0;
	     			}
	    		
}

async function MenuWifiManager_field() {

					var wifiManager = createObject("WifiManager");
					if(self.MAP_WIFIACTIVE == 1){
                        self.MAP_REDESWIFI = "Sí";
					    wifiManager.enableWifiAdapter();
                        await self.executeNode("scanAvailableNetworks");
					    ui.refresh("MAP_REDESWIFI");
					}else{
                        self.MAP_REDESWIFI = "No";
					    wifiManager.disableWifiAdapter();
					    (await self.getContents("ContentWifis")).clear();
					    ui.refresh("MAP_REDESWIFI,ContentWifis");
					}
	    		
}

function MenuWifiManager_field() {

                    if(self.MAP_CHECK_NEW == 1){
                        self.MAP_VISIBLE_PASS_NEW = self.MAP_PASS_NEW;
                    }else{
                        self.MAP_PASS_NEW = self.MAP_VISIBLE_PASS_NEW;
                    }
                        ui.refresh("MAP_VISIBLE_PASS_NEW,MAP_PASS_NEW");
			    
}

async function MenuWifiManager_olvidarwifi() {

              	try
              	{
              	    var sRefresh = "";
    				var wifiManager = createObject("WifiManager");
    				wifiManager.removeNetwork(self[ssidProp]);
    				(await self.getContents("ContentWifis")).clear();
    				if(self.MAP_WIFISAVE == 1){
                        self.MAP_WIFISAVE = 0;
                        sRefresh = "frmWifiSave";
    				}else if (self.MAP_WIFICONECTEDINFO == 1){
                        self.MAP_WIFICONECTEDINFO = 0;
                        sRefresh = "frmWifiConectedInfo";
    				}
    				if(sRefresh.length > 0){
    				    sRefresh += ",ContentWifis";
    				}else{
    				    sRefresh += "ContentWifis";
    				}
                    ui.refresh(sRefresh);
    				await self.executeNode("scanAvailableNetworks");
    			}
    			catch(ex){
    			}
			
}

async function MenuWifiManager_conectarwifi() {

                try {
              		var wifiManager=createObject("WifiManager");
              		var wifiConfiguration=createObject("WifiConfiguration");
              		
              		if (estado == 1)
              		{
              			wifiManager.connect(self[propSSID]);
			            await self.executeNode("ocultarPanel('MAP_WIFISAVE','frmWifiSave')");
              			self.MAP_LOADING = 1;
                		(await self.getContents("ContentWifis")).clear();
                	    ui.refresh("frmLoading,ContentWifis");
              		}
              		else
    				{
    					if (self.MAP_SECURITY=="OPEN")
    					{
    						wifiConfiguration.setSsid(self[propSSID]);
    						wifiConfiguration.setNetworkSecurity("OPEN");
    						wifiManager.addNetwork(wifiConfiguration);
    					}
    					else
    					{
    						if (self.MAP_PASS_NEW.length>=8)
    						{
    							wifiConfiguration.setSsid(self[propSSID]);
    							wifiConfiguration.setNetworkSecurity(self.MAP_SECURITY);
    							wifiConfiguration.setPassword(self.MAP_PASS_NEW);
    							wifiManager.addNetwork(wifiConfiguration);
    						}
    					}
    					wifiManager.connect(self[propSSID]);
    					await self.executeNode("ocultarPanel('MAP_WIFINEW','frmWifiNew')");
              			self.MAP_LOADING = 1;
                		(await self.getContents("ContentWifis")).clear();
                	    ui.refresh("frmLoading,ContentWifis");
    				}
    			}
    			catch(ex){
    			    
    			}
    			
			    ui.executeActionAfterDelay("scanAvailableNetworks",6);
			
}

function MenuWifiManager_getAdapterMacAddress() {

				getAdapterMacAddress();
			
}

function MenuWifiManager_getActiveWifiInfo() {

				getActiveWifiInfo();
			
}

function MenuWifiManager_connect() {

				connect();
			
}

function MenuWifiManager_disconnect() {

				disconnect();
			
}

function MenuWifiManager_enableNetwork() {

				enableNetwork();
			
}

function MenuWifiManager_disableNetwork() {

				disableNetwork();
			
}

function MenuWifiManager_removeNetwork() {

				removeNetwork();
			
}

function MenuWifiManager_addOpenNetwork() {

				addOpenNetwork();
			
}

function MenuWifiManager_addWpaNetwork() {

				addWpaNetwork();
			
}

function MenuWifiManager_listSavedNetworks() {

				listSavedNetworks();
			
}

async function MenuWifiManager_scanAvailableNetworks() {

				await scanAvailableNetworks();
			
}

async function MenuWifiManager_irMenu() {


			if (COLL=="Salir")
			{
				//##XONE_TRANSLATE_NEXT_LINE##
			    var string1="¿Desea salir de la aplicación?";
			    //##XONE_TRANSLATE_NEXT_LINE##
			    var string2="Salir app";
				var cadena=ui.msgBoxWithSound(string1, string2, 4, "", "", 0);
				if (cadena==6) 
				{   
				    ui.stopGps();
					appData.failWithMessage(-11888,"##EXITAPP##");
				}
			}
			else
	  		{
				switch(COLL) {
				    case "Mensajes":
				        COLL="MenuPrincipalFase0";
				        break;
				    case "ConsolaReplica":
				    	COLL="ConsolaReplica";
				        break;
				    case "Tareas":
				    	
				        break;
				    default:
				        
				}
				
				if (COLL!=" ")
				{
					appData.getCurrentEnterprise().setVariables("BANDERAORDENES",0);
					appData.getCurrentEnterprise().setVariables("BANDERATAREAS",0);
					appData.getCurrentEnterprise().setVariables("BANDERADOCUMENTACION",0);
					
					if (COLL=="Tareas")
					{
						COLL=appData.getCurrentEnterprise().getVariables("MENUDONDEESTOY");
						var filtro="";
						if (appData.getCurrentEnterprise().getVariables("IDTA")!=0)
							filtro="t1.IDTA="+appData.getCurrentEnterprise().getVariables("IDTA") + " AND t1.IDOT="+appData.getCurrentEnterprise().getVariables("IDOT");
						else
						{
							if (appData.getCurrentEnterprise().getVariables("IDOT")!=0)
								filtro="t1.IDOT="+appData.getCurrentEnterprise().getVariables("IDOT");
						}
						
						if (filtro!="")
						{
							ui.toggleGroup("99");
							ui.returnToMainMenu();
			          		var coll=await appData.getCollection(COLL);
							coll.clear();
							var objabrir=await coll.findObject(filtro);
							if (objabrir)
								appData.pushValue(objabrir);
						}
						else
						{
							//##XONE_TRANSLATE_NEXT_LINE##
						    //var string3="Aún no ha accedido a ninguna Tarea";
						    //##XONE_TRANSLATE_NEXT_LINE##
						    //var string4="Acceso tareas";
							//ui.msgBoxWithSound(string3, string4, 0, "", "", 0);
							appData.failWithMessage(-11888,"##EXIT##");
						}
					
					}
					else					
					{
						ui.toggleGroup("99");
						ui.returnToMainMenu();
						var colComunica=await appData.getCollection(COLL);
						var obj=await colComunica.createObject();
						colComunica.addItem(obj);
						appData.pushValue(obj);  
						
					}
				}
				else
					await ui.msgBox("Menu sin implementar","Aviso",0);
			}
		
		
}

function MenuWifiManager_showDrawer() {

			    ui.toggleGroup("99");
			    ui.refresh("barraSuperior");
			
}

function MenuWifiManager_onback() {

          		if (self.MAP_SELECCION==1)
          		{
          			self.MAP_SELECCION=0;
          			ui.getView(self).refreshAll("frmActualizacion,frmbtnActualizacion");
          		}
          		else
          			appData.failWithMessage(-11888,"##EXIT##");
			
}

function MenuWifiManager_cancelarwifi() {

			  self.MAP_SELECCION=0;
			  ui.getView(self).refreshAll("frmActualizacion,frmbtnActualizacion");
			
}

