Function inicializarCal()
	'Primero eliminamos los registros que haya. Lo hacemos de forma logica.	
	'Habra algun mantenimiento programado que elimine estos registros, de forma que los borrados no entren en replica.		
	Set cCal=appdata.GetCollection("ContentdatosCalendario")
	for k=1 to 5
		Set objCalendario=cCal.CreateObject
		cCal.AddItem Empty,objCalendario
		'Vamos a agregar algunos eventos en distintos d�as para probar.
		stDia="00"+cstr(cint(k*5))
		stDia=right(stDia,2)
		objCalendario("FECHA")=cstr(year(now))+"-"+cstr(month(now))+"-"+stDia
		objCalendario("HORAINI")="19:00"
		objCalendario("HORAFIN")="23:00"
		if k=1 or k=3 then 
			objCalendario("TIPO")="Info: Azul"
			objCalendario("DESCRIPCION")="Tarea de informaci�n"
		else
			if k=2 or k=5 then 
				objCalendario("TIPO")="Visita: Naranja"
				objCalendario("DESCRIPCION")="Visita al cliente"
			else
				objCalendario("TIPO")="Pedido: Verde"
				objCalendario("DESCRIPCION")="Visita con pedido creado"			
			end if
		end if
		objCalendario.save
	next
	Set objCalendario=nothing
	Set cCal=nothing
	
End Function
 
Function ShowMessageDebug(mode,stmsg) 
	'Para poder utilizar esta funcion tenemos que tener una variable global "Debug"
	if appdata.CurrentEnterprise.variables("Debug") = true then
		if mode = "msgbox" then
			ui.MsgBox stmsg,"�App_log_xone!",0
		end if
		if mode = "showtoast" then
			ui.showtoast "App_log_xone->"+stmsg
		end if
		if mode = "consola" then
			appdata.writeconsolestring "App_log_xone->"+stmsg
		end if
	end if
End Function
