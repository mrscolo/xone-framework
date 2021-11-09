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

function EspecialChat_onrecordfinished() {

				// AQUI TENGO QU3E GUARDAR EL MENSAJE EN EL CHAT
				// 0 UNA VEZ, 1 DOS VECES.-1 INDEFINIDAMENTE
				// ui.playSoundAndVibrate(self.MAP_VOZGRABADA.toString(),"",0);
              
}

function EspecialChat_onSetTime() {

                setTimeRecording("MAP_TIMERECORD");
            
}

async function EspecialChat_before_edit() {

                await inicializeChats();
            
}

async function EspecialChat_after_edit() {

                await lockContents(["Chat","nUsuarios","Chatear"]);
            
}

function EspecialChat_onSetBackground() {

                if(self.MAP_GRUPOSEL==2){
                    if(self.MAP_FOTO_FONDO=="fondo_chat.png"){
                        self.MAP_FOTO_FONDO = "fondo_chat2.png";
                    }else{
                        self.MAP_FOTO_FONDO = "fondo_chat.png";
                    }
                    ui.executeActionAfterDelay("onSetBackground", 60);
                    ui.refresh("frmChatear");
                }
            
}

async function EspecialChat_AccionesChatEspecial() {

                await AccionesChatEspecial(parametro,null);
            
}

async function EspecialChat_abrirDrawer() {

                if (grupo!=999) {
                    self.MAP_GRUPOSEL=grupo;
                    ui.refresh("MAP_GRUPOSEL");
                }
                irGrupo(grupo);
                if (grupo==2) {
                    // ui.executeActionAfterDelay("onSetBackground", 60);
                    await fillMessagesContent(await self.getContents("Chatear"),1,25);
                    ui.refresh("Chatear");
                }
            
}

function EspecialChat_onback() {

                salir();
            
}

async function EspecialChat_field() {

			    	await AccionesChatEspecial('enviar');
				
}

async function EspecialChat_field() {

			    	await AccionesChatEspecial('adjuntoguardar',e);
				
}

