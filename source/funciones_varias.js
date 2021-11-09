//Funcion para guardar las coordenadas GPS en un objeto dado. 
function GetPosGPS(tipo,auxcollobj) {
	var latitud=0;
	var longitud=0;
	var distinta=0;
	//Activamos el GPS
	ui.startGps();	
	// Capturamos las coordenadas GPS	
	var collGPS =appData.getCollection("ContentConectarGPS");
	collGPS.startBrowse();
	var x =collGPS.getCurrentItem();
	if(typeof x !== "undefined"){
    	if (x!==null) {
    		   if (x.STATUS == 1) {
    			    // si status vale 1 significa que no hay error de conexion con el servicio
    			    if (x.HGPS.length>0) {
    				      if (x.LATITUD!=="") 
    				      		latitud=parseFloat(x.LATITUD);
    				      if (x.LONGITUD.length>0) 
    				      		longitud=parseFloat(x.LONGITUD);
    			    }
    		   } else {
    		   		latitud=appData.getCurrentEnterprise().getVariables("LATITUD");
    				longitud=appData.getCurrentEnterprise().getVariables("LONGITUD");
    		   }
    	} else {
    		latitud=appData.getCurrentEnterprise().getVariables("LATITUD");
    		longitud=appData.getCurrentEnterprise().getVariables("LONGITUD");
    	}
	}
	collGPS = null;
	x = null;
	
    // La guardamos en variable global si es distinta
	if (appData.getCurrentEnterprise().getVariables("LATITUD")!==latitud || 
	    appData.getCurrentEnterprise().getVariables("LONGITUD")!==longitud) {
		appData.getCurrentEnterprise().setVariables("LATITUD",latitud);
	    appData.getCurrentEnterprise().setVariables("LONGITUD",longitud);
		distinta=1;
	}
	
	if (tipo==="tracking") {
		if (distinta===1) {
			var colltracking=appData.getCollection(auxcollobj);
			var objtracking=colltracking.createObject();
			colltracking.addItem(objtracking);
			objtracking.LATITUD=latitud;
			objtracking.LONGITUD=longitud;
			objtracking.save();
			replica.start();
			colltracking.clear();
			colltracking=null;			
			objtracking=null;
		}
	} else {
		// Aqui se guarda solo la coordenada para saber donde se hizo la visita		
		auxcollobj.LATITUD=latitud;
		auxcollobj.LONGITUD=longitud;
	}
	
}
 


function PosicionamientoGPS() {
    var latitud,longitud,veces,x;
	if (appData.getCurrentEnterprise().getVariables("MIUBICACION")===0) {	
		latitud=38.886442;
		longitud=-7.004351;
	} else {
	 	//var collGPS =appData.getCollection("ContentConectarGPS");
	 	var coordenadas=0;
	 	ui.setMaxWaitDialog (2);
	 	ui.updateWaitDialog("Detectando localizacion del dispositivo", 1);
	 	veces=0;
	 	//collGPS.startBrowse();
	 	
	 	
	 	
	 	var collGPS = appData.getCollection("GPSColl");
          	collGPS.loadAll();
          	var objGPS = collGPS.getObject(0);
          	//collGPS.clear();

	 	
	 	while (coordenadas==0) { 	
			collGPS.clear();
			if(objGPS != undefined) {
			    
			   if(objGPS.STATUS != 1) {
                    //ui.showToast("El campo STATUS vale " + objGPS.STATUS);
				} else {
				    // si status vale 1 significa que no hay error de conexion con el servicio
				    if (objGPS.HGPS.length>0) {
				      if (objGPS.LATITUD!=="") 
				      		latitud=parseFloat(objGPS.LATITUD);
				      if (objGPS.LONGITUD.length>0) 
				      		longitud=parseFloat(objGPS.LONGITUD);
			        }
			    }
			}
			veces++; 
			if (veces===200) {
				coordenadas=1;
				latitud=38.886442;
				longitud=-7.004351;
			}
	 	}
		if (veces===200)	
			appData.getCurrentEnterprise().setVariables("MIUBICACION",10);
		
		collGPS = null;
	}		
	ui.updateWaitDialog ("Localizacion Terminada", 2);				
}


//FUNCION PARA COMPROBAR SI TIENE CONEXION CON EL SERVIDOR PARA LAS COLL ONLINE
function ComprobarConexion() {
    var conexion=0;
    try{
        //appdata.Error.Clear
        //on error resume next  
    	var coll=appData.getCollection("ContentComprobarConexion");
        coll.startBrowse();
        //appdata.Error.Clear
        if (coll.getCurrentItem()!==null)
        	if (coll.getCurrentItem().RESULTADO==="##OK##")
        		conexion=1;
        coll.endBrowse();
        coll.clear();
        coll=null; 
        return conexion;
    }catch(err){
        return conexion;
    }
}