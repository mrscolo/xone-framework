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

async function UsuariosChat_selecteditem() {

                self.getOwnerCollection().getOwnerObject().MAP_CCUSUARIO = self.LOGIN;
                self.getOwnerCollection().getOwnerObject().MAP_IMAGE_CHAT = self.IMAGEN;
                await self.getOwnerCollection().getOwnerObject().executeNode("AccionesChatEspecial('ok')");
            
}

