function EnviarMail(adjunto) {
	var men="";	
	if (self.MAP_CORREO.length===0)
		men="Es obligatorio indicar el correo de destino";
		
	if (self.MAP_ASUNTO.length===0 && men.length===0)
		men="Es obligatorio indicar el asunto del correo";
		
	if (self.MAP_CUERPO.length===0 && men.length===0)
		men="Es obligatorio indicar el cuerpo del correo";
	
	if (men.length===0) {
		if (adjunto==="NO") {
			var ok=ui.msgBox ("¿Desea adjuntar un fichero?","Aviso",4);
	        if (ok===6){
	        	self.MAP_VISIBLE=1;
	        	ui.refresh("MAP_TEXTAT,boton0,boton1");
	        }else{
				ui.sendMail(self.MAP_CORREO, "direccion_con_copia@xone.es", self.MAP_ASUNTO, self.MAP_CUERPO, "");
	        }
			
		} else {
			if (self.MAP_TEXTAT.length===0)
				ui.msgBox("Error: Es Obligatorio indicar el fichero adjunto","AVISO",0);				
			else
				ui.sendMail (self.MAP_CORREO, "direccion_con_copia@xone.es", self.MAP_ASUNTO, self.MAP_CUERPO, self.MAP_TEXTAT);
		}
	} else {
		ui.msgBox ("Error: " + men ,"AVISO",0);				
	}
}

function CodigoBarras() {
	var men="";
	if (self.MAP_TIPOCB.length===0)
		men="Es obligatorio indicar el tipo de codigo de barras a leer";
	
	if (self.MAP_CHECKBOX1===0 && self.MAP_CHECKBOX2===0)
		men="Es obligatorio indicar la aplicacion a utilizar";
		
	if (men.length===0) {
		if (self.MAP_CHECKBOX1===1)
			ui.startScanner ("",self.MAP_TIPOCB,"");
		else
			ui.startScanner ("quickmark",self.MAP_TIPOCB,"");
	} else {
		ui.msgBox ("Error: " + men ,"AVISO",0);
	}
}