Function EnviarMail(adjunto)
	men=""	
	if len(this("MAP_CORREO"))=0 then
		men="Es obligatorio indicar el correo de destino"
	end if
	if len(this("MAP_ASUNTO"))=0 and men="" then
		men="Es obligatorio indicar el asunto del correo"
	end if
	if len(this("MAP_CUERPO"))=0 and men="" then
		men="Es obligatorio indicar el cuerpo del correo"
	end if
	if men="" then
		if adjunto="NO" then
			ok=ui.MsgBox ("¿Desea adjuntar un fichero?","Aviso",4)
	        if ok=6 then
	        	this("MAP_VISIBLE")=1
	        else
				ui.SendMail cstr(this("MAP_CORREO")), "direccion_con_copia@xone.es", cstr(this("MAP_ASUNTO")), cstr(this("MAP_CUERPO")), ""
			end if
		else
			if len(this("MAP_TEXTAT"))=0 then
				ui.MsgBox "Error: Es Obligatorio indicar el fichero adjunto","AVISO",0				
			else
				ui.SendMail cstr(this("MAP_CORREO")), "direccion_con_copia@xone.es", cstr(this("MAP_ASUNTO")), cstr(this("MAP_CUERPO")), cstr(this("MAP_TEXTAT"))
			end if
		end if 
	else
		ui.MsgBox "Error: " + men ,"AVISO",0				
	end if
End Function

 

Function CodigoBarras()
	men=""	
	if len(this("MAP_TIPOCB"))=0 then
		men="Es obligatorio indicar el tipo de codigo de barras a leer"
	end if
	if this("MAP_CHECKBOX1")=0 and this("MAP_CHECKBOX2")=0 then
		men="Es obligatorio indicar la aplicacion a utilizar"
	end if
	if men="" then
		if this("MAP_CHECKBOX1")=1 then
			ui.StartScanner "",cstr(this("MAP_TIPOCB")),""
		else
			ui.StartScanner "quickmark",cstr(this("MAP_TIPOCB")),""
		end if
	else
		ui.MsgBox "Error: " + men ,"AVISO",0				
	end if
End Function