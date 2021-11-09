function inicializarCal() {
	//Primero eliminamos los registros que haya. Lo hacemos de forma logica.	
	//Habra algun mantenimiento programado que elimine estos registros, de forma que los borrados no entren en replica.		
	var cCal=appData.getCollection("ContentdatosCalendario");
	var objCalendario;
	var stDia,fecha;
	for (var k=1;k<=5;k++) {
	    fecha = new Date();
		objCalendario=cCal.createObject();
		cCal.addItem (objCalendario);
		//  Vamos a agregar algunos eventos en distintos días para probar.
		stDia="00"+(k*5);
		stDia=Right(stDia,2);
		objCalendario.FECHA="" + fecha.getFullYear() + "-" + fecha.getMonth() +"-"+stDia;
		objCalendario.HORAINI="19:00";
		objCalendario.HORAFIN="23:00";
		if (k===1 || k===3) { 
			objCalendario.TIPO="Info: Azul";
			objCalendario.DESCRIPCION="Tarea de información";
		} else {
			if (k===2 || k===5) { 
				objCalendario.TIPO="Visita: Naranja";
				objCalendario.DESCRIPCION="Visita al cliente";
			} else {
				objCalendario.TIPO="Pedido: Verde";
				objCalendario.DESCRIPCION="Visita con pedido creado";			
			}
		}
		objCalendario.save();
	}
	objCalendario=null;
	cCal=null;
}
 
function ShowMessageDebug(mode,stmsg) {
	//Para poder utilizar esta funcion tenemos que tener una variable global "Debug"
	if (appData.getCurrentEnterprise().getVariables("Debug") === true) {
		if (mode === "msgbox")
			ui.msgBox (stmsg,"¡App_log_xone!",0);
		else if (mode === "showtoast")
			ui.showToast ("App_log_xone->"+stmsg);
		else if (mode === "consola")
			appdata.writeConsoleString("App_log_xone->"+stmsg);
	}
}