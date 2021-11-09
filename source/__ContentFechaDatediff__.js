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

async function ContentFechaDatediff_salvar() {

                await self.save();
            
}

function ContentFechaDatediff_CALCULAR() {

                if (isDate(self.FECHA) && isDate(self.FECHA2)) {
                    self.MAP_DIAS=vbSupport.dateDiff("d", self.FECHA, self.FECHA2);
                } else
                    ui.msgBox("rellene las fechas antes de calcular","ATENCION!!!", 0);
                }
            
}

