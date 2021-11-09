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

function ContentWifis_selecteditem() {

			try
			{
				var parent = self.getOwnerCollection().getOwnerObject();
				var view = ui.getView(self.getOwnerCollection().getOwnerObject());
				var wifiManager = createObject("WifiManager");
				
				if(self.MAP_IDESTADO == 1){
				    // significa que es la wifi en la que estamos conectados ...
				    parent.MAP_WIFICONECTEDINFO = 1;
				    var wifiActiveInfo = wifiManager.getActiveWifiInfo();
				    if(wifiActiveInfo != null){
				        parent.MAP_SSID_INFO = self.MAP_SSID;
				        parent.MAP_ESTADO_INFO = self.MAP_ESTADO;
				        parent.MAP_INTENSIDAD_INFO = wifiActiveInfo.getRssi();
				        // La velocidad se devuelve en Mbps
				        parent.MAP_VELOCIDAD_INFO = wifiActiveInfo.getLinkSpeed() + "Mbps";
				        // La frecuencuia se devuelve en MHz
				        parent.MAP_FRECUENCIA_INFO = (wifiActiveInfo.getFrequency()/1000) + "GHz";
				        parent.MAP_SEGURIDAD_INFO = self.MAP_SECURITY;
				    }
				    view.refreshAll("frmWifiConectedInfo,frmWifiConectedInfoG");
				}else if (self.MAP_IDESTADO == 0){
				    // significa que es una wifi que tenemos guardada pero no estamos conectados ...
				    parent.MAP_WIFISAVE = 1;
				    parent.MAP_SSID_SAVE = self.MAP_SSID;
				    view.refreshAll("frmWifiSave,frmWifiSaveG");
				}else if (self.MAP_IDESTADO == -1){
				    // significa que es una wifi que ni estamos conectados ni la tenemos guardada ...
				    parent.MAP_WIFINEW = 1;
				    parent.MAP_SSID_NEW = self.MAP_SSID;
				    view.refreshAll("frmWifiNew,frmWifiNewG");
				}
				
				parent.MAP_SECURITY = self.MAP_SECURITY;
				
				/*
				self.getOwnerCollection().getOwnerObject().MAP_SELECCION=1;
				self.getOwnerCollection().getOwnerObject().MAP_SSID=self.MAP_SSID;
				self.getOwnerCollection().getOwnerObject().MAP_SECURITY=self.MAP_SECURITY;
				self.getOwnerCollection().getOwnerObject().MAP_ESTADO=self.MAP_ESTADO;
				self.getOwnerCollection().getOwnerObject().MAP_PWD="";
				
				
				if (self.MAP_ESTADO=="Conectada" || self.MAP_ESTADO=="Guardada, Protegida" || self.MAP_ESTADO=="Guardada, Abierta" || self.MAP_ESTADO=="Abierta")
				{
					self.getOwnerCollection().getOwnerObject().MAP_SELECCION1=1;
				}
				else
				{
					self.getOwnerCollection().getOwnerObject().MAP_SELECCION1=0;
				}
					
				if (self.MAP_ESTADO=="Conectada")
					self.MAP_COLOR="#5B9BD5";
				else
					self.MAP_COLOR="#D2DEEF";*/
				
				//ui.refresh(MAP_TXT_TITLE3,MAP_OLVIDAR);
  				
		    }
      		catch(ex){
					
			}
		  
}

