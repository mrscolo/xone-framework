/***
*
* Code from funciones_varias.js
*
***/

//Funcion para guardar las coordenadas GPS en un objeto dado. 
async function GetPosGPS(tipo,auxcollobj) {
	var latitud=0;
	var longitud=0;
	var distinta=0;
	//Activamos el GPS
	ui.startGps();	
	// Capturamos las coordenadas GPS	
	var collGPS =await appData.getCollection("ContentConectarGPS");
	await collGPS.startBrowse();
	var x =await collGPS.getCurrentItem();
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
			var colltracking=await appData.getCollection(auxcollobj);
			var objtracking=await colltracking.createObject();
			colltracking.addItem(objtracking);
			objtracking.LATITUD=latitud;
			objtracking.LONGITUD=longitud;
			await objtracking.save();
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
 


async function PosicionamientoGPS() {
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
	 	
	 	
	 	
	 	var collGPS = await appData.getCollection("GPSColl");
          	await collGPS.loadAll();
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
async function ComprobarConexion() {
    var conexion=0;
    try{
        //appdata.Error.Clear
        //on error resume next  
    	var coll=await appData.getCollection("ContentComprobarConexion");
        await coll.startBrowse();
        //appdata.Error.Clear
        if (await coll.getCurrentItem()!==null)
        	if ((await coll.getCurrentItem()).RESULTADO==="##OK##")
        		conexion=1;
        coll.endBrowse();
        coll.clear();
        coll=null; 
        return conexion;
    }catch(err){
        return conexion;
    }
}

/***
*
* Code from funciones_openStreetMap.js
*
***/

var bBreakUpdateGpsLoop = false;
let allMarkers = [];

function startUpdateGpsLoop() {
    let myPromise = new Promise(function(bien, mal) {
        bBreakUpdateGpsLoop = false;
		let ventana = ui.getView(self);
        while(!bBreakUpdateGpsLoop) {
            if (!ventana) {
                break;
            }
            try {
                actualizarGps();
            } catch(error) {
                ui.showToast("Hubo un error");
            }
            ventana.refreshValue("MAP_LONGITUD", "MAP_LATITUD", "MAP_FGPS");
        }
	});
	myPromise.then(function() {
		ui.showToast("Todo OK en promesa");
	}, function() {
		ui.showToast("Error en promesa");
	});
}

function stopUpdateGpsLoop() {
    bBreakUpdateGpsLoop = true;
}

function startGpsCallback() {
    let jsParams = {
        nodeName                  : "callbackgps",
        timeBetweenUpdates        : 10000,
        minimumMetersDistanceRange: 0,
        foreground                : true,
        title                     : "Titulo",
        text                      : "Texto"
    };
    ui.startGps(jsParams);
    ui.showSnackbar("Invocado con callback 50 segs");
}

function startGpsInterval() {
    let jsParams = {
        timeBetweenUpdates        : 0,
        minimumMetersDistanceRange: 0
    };
    ui.startGps(jsParams);
}

function comprobarEstadoGps() {
	let sDeviceOs = appData.getGlobalMacro("##DEVICE_OS##");
	if (sDeviceOs == "android") {
		let nStatus = ui.checkGpsStatus();
		if (nStatus === 0) {
			ui.showToast("No hay GPS, no se puede activar.");
		}
		if (nStatus == 1) {
			ui.showToast("Está activada la localización por GPS.");
		}
		if (nStatus == 2) {
			ui.showToast("Está activada la localización por redes wifi y de telefonía.");
		}
		if (nStatus == 3) {
			ui.showToast("No está activado el GPS ni la ubicación por redes wifi y telefonía, a ver si nos lo activan.");
			ui.askUserForGpsPermission();
		}
		if (nStatus == 4) {
			ui.showToast("Está activada la localización por GPS y redes wifi y de telefonía.");
		}
		if (nStatus == -1) {
			ui.showToast("Error inesperado, compruebe la consola de mensajes.");
		}
	}
}

async function actualizarGps() {
	let collGps, objCollGps;
	collGps = await appData.getCollection("GPSColl");
	await collGps.startBrowse();
	try {
		objCollGps = await collGps.getCurrentItem();
		if (!objCollGps) {
			throw "GPS no disponible. objCollGps es: " + objCollGps;
		}
		if (objCollGps.STATUS != 1) {
			throw "GPS no disponible. STATUS vale: " + objCollGps.STATUS;
		}
		if (!objCollGps.LONGITUD) {
			throw "Sin cobertura GPS";
		}
		self.MAP_LONGITUD = objCollGps.LONGITUD;
		self.MAP_LATITUD = objCollGps.LATITUD;
		self.MAP_ALTITUD = objCollGps.ALTITUD;
		self.MAP_VELOCIDAD = objCollGps.VELOCIDAD;
		self.MAP_RUMBO = objCollGps.RUMBO;
		self.MAP_FGPS = objCollGps.FGPS;
		self.MAP_HGPS = objCollGps.HGPS;
		self.MAP_STATUS = objCollGps.STATUS;
		self.MAP_SATELITES = objCollGps.SATELITES;
		self.MAP_FUENTE = objCollGps.FUENTE;
		self.MAP_PRECISION = objCollGps.PRECISION;
		ui.getView(self).refresh("MAP_LONGITUD,MAP_LATITUD,MAP_ALTITUD,MAP_VELOCIDAD,MAP_RUMBO,MAP_FGPS,MAP_HGPS,MAP_STATUS,MAP_SATELITES,MAP_FUENTE,MAP_PRECISION");
	} finally {
		collGps.endBrowse();
	}
}

function onMapClicked(evento) {
    ui.showToast("onMapClicked(): latitude: " + evento.latitude + " longitude: " + evento.longitude);
    let mapControl = getControl(evento.target);
    let params = {
    	latitude: evento.latitude,
    	longitude: evento.longitude,
    	//rotation: 100,
    	//alpha: 0.5,
    	draggable: true,
    	icon: "icon.png",
    	tag: "Soy un marker"
    };
    let marker = mapControl.addMarker(params);
    allMarkers.push(marker);
}

function onMapLongClicked(evento) {
    ui.showToast("onMapLongClicked(): latitude: " + evento.latitude + " longitude: " + evento.longitude);
}

async function onMarkerDraggedEnd(evento) {
    let nResult = await ui.msgBox("¿Aquí está bien?", "Mensaje", 4);
    if (nResult != 6) {
        // Moverlo a un sitio particular
        // evento.marker.setPosition(38.8685452, -6.8170906);
        // Quitarlo
        evento.marker.remove();
    }
    ui.showToast("Tag: " + evento.tag + " latitude: " + evento.latitude + " longitude: " + evento.longitude);
}

function onMapReady(evento) {
    ui.showToast("El mapa ha sido creado");
}

function onLocationReady(evento) {
    ui.showToast("Localización encontrada por primera vez.\nLatitud: " + evento.latitude + "\nLongitud:" + evento.longitude);
}

function onLocationChanged(evento) {
    ui.showToast("Localización cambiada.\nLatitud: " + evento.latitude + "\nLongitud:" + evento.longitude);
}

function onDistanceMeter(evento) {
    ui.showToast("Distancia en metros: " + evento.distance);
}

function showMarkers() {
    let nLength = allMarkers.length;
    for(let i = 0;i < nLength;i++) {
        let marker = allMarkers[i];
        marker.setVisible(true);
    }
}

function hideMarkers() {
    let nLength = allMarkers.length;
    for(let i = 0;i < nLength;i++) {
        let marker = allMarkers[i];
        marker.setVisible(false);
    }
}

function setMarkersDraggable(bDraggable) {
    let nLength = allMarkers.length;
    for(let i = 0;i < nLength;i++) {
        let marker = allMarkers[i];
        marker.setDraggable(bDraggable);
    }
}

function removeMarkers() {
    let nLength = allMarkers.length;
    for(let i = 0;i < nLength;i++) {
        let marker = allMarkers[i];
        marker.remove();
    }
    allMarkers.splice(0, allMarkers.length);
}

async function doChangeMapPois(sMapControl) {
    let mapContent = await self.getContents("ClientesCoord");
    if (mapContent.getFilter() == "t1.NOMBRE = 'Madrid'") {
        mapContent.setFilter("");
    } else {
        mapContent.setFilter("t1.NOMBRE = 'Madrid'");
    }
    mapContent.unlock();
    mapContent.clear();
    await mapContent.loadAll();
    mapContent.lock();
    ui.refresh(sMapControl);
}

function doRefresh(sControl) {
    if (!sControl) {
        throw "El nombre del control no puede estar vacío";
    }
    ui.refresh(sControl);
}

function getUserLocation(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let userLocation = mapControl.getUserLocation();
    if (userLocation === null) {
        ui.showToast("No se ha podido obtener la localización del usuario");
    } else {
        ui.showToast("Latitud: " + userLocation.latitude + "\nLongitud: " + userLocation.longitude);
    }
}

function isUserLocationEnabled(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    ui.showToast("Enabled: " + mapControl.isUserLocationEnabled());
}

function enableUserLocation(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.enableUserLocation();
}

function disableUserLocation(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.disableUserLocation();
}

function drawLine(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.drawLine("ruta 1", "#FF0000", "normal", 37.348394305664385, -9.723497182130814,  37.348394305664385, -0.002672821283340454);
    mapControl.drawLine("ruta 1", "#00FF00", "dashed", 38.47718888472095,  -9.644861854612827,  38.63807799294125,  -0.1756015419960022);
    mapControl.drawLine("ruta 2", "#0000FF", "dotted", 41.053614029734,    -9.531369879841805,  40.98011827779008,  0.7152241095900536);
    mapControl.drawLine("ruta 2", "#FFFF00", "mixed",  43.67910133655382,  -10.153294019401073, 43.03194923828824,  3.0807440355420117);
}

function drawLine2(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let params = {
        line       : "ruta 1",
        strokeColor: "#FF0000",
        mode       : "normal",
        locations  : [{
            latitude : 37.348394305664385,
            longitude: -9.723497182130814
        }, {
            latitude : 37.348394305664385,
            longitude: -0.002672821283340454
        }]
    };
    mapControl.drawLine(params);
    params = {
        line       : "ruta 1",
        strokeColor: "#00FF00",
        mode       : "dashed",
        locations  : [{
            latitude : 38.47718888472095,
            longitude: -9.644861854612827
        }, {
            latitude : 38.63807799294125,
            longitude: -0.1756015419960022
        }]
    };
    mapControl.drawLine(params);
    params = {
        line       : "ruta 2",
        strokeColor: "#0000FF",
        mode       : "dotted",
        locations  : [{
            latitude : 41.053614029734,
            longitude: -9.531369879841805
        }, {
            latitude : 40.98011827779008,
            longitude: 0.7152241095900536
        }]
    };
    mapControl.drawLine(params);
    params = {
        line       : "ruta 2",
        strokeColor: "#FFFF00",
        mode       : "mixed",
        locations  : [{
            latitude : 43.67910133655382,
            longitude: -10.153294019401073
        }, {
            latitude : 43.03194923828824,
            longitude: 3.0807440355420117
        }]
    };
    mapControl.drawLine(params);
}

function drawRoute(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let params = {
        route               : "ruta 1",
        // Estos dos parámetros solo están soportados con OpenStreetMap
        // urlType             : "osm2po",
        // url                 : "http://127.0.0.1:8888/Osm2poService",
        // urlType             : "osrm",
        // url                 : "http://127.0.0.1:5000/route/v1/",
        // Usar accurate para tener una ruta precisa con Google Maps. Consume bastante más recursos y puede hacer el mapa de Google lento
        // accurate            : true,
        // Badajoz
        sourceLatitude      : 38.8685452,
        sourceLongitude     : -6.8170906,
        // Madrid
        destinationLatitude : 40.4167747,
        destinationLongitude: -3.70379019,
        /*
         * Usar waypoints para indicar una ruta con más de dos posiciones (no
         * soportado con osm2po)
         */ 
        // waypoints: [{
        //     // Madrid
        //     latitude : 40.4893538,
        //     longitude: -3.6827461
        // }, {
        //     // Badajoz
        //     latitude : 38.8685452,
        //     longitude: -6.8170906
        // }, {
        //     // Barcelona
        //     latitude : 41.3850632,
        //     longitude: 2.1734035
        // }],
        mode                : "driving",
        strokeColor         : "#FFFF00",
        strokeWidth         : 5.0
    };
    mapControl.drawRoute(params);
    //mapControl.zoomTo(40.4167747, -3.70379019);
}

function drawArea(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let params = {
        id       : "Area #2",
        fillcolor: "#7F00FF00",
        color    : "#FF0000FF",
        width    : 5,
        pattern  : "normal",
        // El polígono a dibujar (La Coruña -> Bilbao -> Lisboa)
        data     : ["43.3712591, -8.4188010", "43.2603479, -2.9334110", "38.7166700, -9.1333300"]
    };
    mapControl.drawArea(params);
}

function drawEncodeArea(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let params = {
        id       : "Area #1",
        fillcolor: "#7F0000FF",
        color    : "#FFFF0000",
        width    : 5,
        pattern  : "normal",
        // El polígono a dibujar (Badajoz -> Madrid -> Barcelona -> Valencia)
        data     : toEncoded(["38.8685452, -6.8170906", "40.4167747, -3.70379019", "41.3850632, 2.1734035", "39.4561165, -0.3545661"])
    };
    mapControl.drawEncodeArea(params);
}

function removeArea(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.removeArea("Area #1");
}

function clearAllAreas(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.clearAllAreas();
}

function routeTo(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let params = {
        route: "ruta 1",
        sourceLatitude: 40.4167747,
        sourceLongitude: -3.70379019,
        destinationLatitude: 41.3850632,
        destinationLongitude: 2.1734035,
        mode: "driving",
        strokeColor: "#FFFF00",
        strokeWidth: 5.0,
        //Valores posibles: internal, external, google_maps, osmand, osmand_plus
        source: "external"
    };
    mapControl.routeTo(params);
    //mapControl.zoomTo(40.4167747, -3.70379019);
}

function clearRoute(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.clearRoute("ruta 1");
}

function clearAllRoutes(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.clearAllRoutes();
}

function clearLine(sMapControl) { 
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.clearLine("ruta 1");
}

function clearAllLines(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.clearAllLines();
}

function showPoisMenu(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.showPoisMenu();
}

function hidePoisMenu(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.hidePoisMenu();
}

function togglePoisMenu(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.togglePoisMenu();
}

function zoomTo(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.zoomTo(38.886546, -7.0043193);
}

function zoomToEncodeData(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.zoomToEncodeData(toEncoded(["38.8685452, -6.8170906", "40.4167747, -3.70379019"]));
}

function zoomToBounds(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.zoomToBounds(["35.946850084, -9.39288367353", "43.7483377142, 3.03948408368"]);
}

function zoomToMyLocation(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.zoomToMyLocation(20);
}

function restrictMapToBounds(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.restrictMapToBounds(["35.946850084, -9.39288367353", "43.7483377142, 3.03948408368"]);
}

function startDistanceMeter(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    let jsParams = {
        latitude       : 38.886546,
        longitude      : -7.0043193,
        startMarkerIcon: "start_distance_marker_icon.png",
        endMarkerIcon  : "end_distance_marker_icon.png",
    };
    mapControl.startDistanceMeter(jsParams);
    // mapControl.startDistanceMeter("38.886546,-7.0043193");
    mapControl.zoomTo(38.886546, -7.0043193);
}

function stopDistanceMeter(sMapControl) {
    let mapControl = getControl(sMapControl);
    if (!mapControl) {
        return;
    }
    mapControl.stopDistanceMeter();
}

async function testInexistente(sMapControl) {
    let contents = await self.getContents("ClientesCoord");
    let newObject = await contents.createObject();
    newObject.NOMBRE = "Test POI";
    newObject.DIRECCION = "Calle Falsa";
    contents.unlock();
    contents.clear();
    contents.addItem(newObject);
    contents.lock();
    let window = ui.getView(self);
    if (!window) {
        return;
    }
    window.refresh(sMapControl);
}

function distanceTo() {
    //let jsParams = ["38.8685452, -6.8170906", "40.4167747, -3.70379019"];
    let jsParams = [
        {
            latitude : 38.8685452,
            longitude: -6.8170906
        }, {
            latitude : 40.4167747,
            longitude: -3.70379019
        }
    ];
    let nMeters = new GpsTools().distanceTo(jsParams);
    ui.showToast("Distancia entre Badajoz y Madrid: " + nMeters + " metros.");
}

async function getAddressFromPosition() {
    let result = new GpsTools().getAddressFromPosition("38.8862106, -7.0040345");
    let str = "Localidad: " + result.locality
        + "\nSublocalidad: " + result.subLocality
        + "\nÁrea administración: " + result.adminArea
        + "\nSubárea de administración: " + result.subAdminArea
        + "\nCaracterísticas: " + result.features
        + "\nPaís: " + result.country 
        + "\nCódigo país: " + result.countryCode
        + "\nCalle: " + result.street
        + "\nNúmero: " + result.number
        + "\nDirección: " + result.address
        + "\nCódigo postal: " + result.postal;
    await ui.msgBox(str, "Resultado", 0);
}

async function containsLocation() {
    let bResult;
    await ui.msgBox("¿Es Teruel una ciudad contenida en un polígono formado por La Coruña -> Bilbao -> Lisboa?", "Mensaje", 0);
    bResult = new GpsTools().containsLocation("40.3633442, -1.0893794", ["43.3712591, -8.4188010", "43.2603479, -2.9334110", "38.7166700, -9.1333300"]);
    if (bResult) {
        await ui.msgBox("Por ahí anda Teruel", "Mensaje", 0);
    } else {
        await ui.msgBox("No, Teruel no está ahí", "Mensaje", 0);
    }
    await ui.msgBox("¿Es Teruel una ciudad contenida en un polígono formado por Badajoz -> Madrid -> Barcelona -> Valencia?", "Mensaje", 0);
    bResult = new GpsTools().containsLocation("40.3633442, -1.0893794", ["38.8685452, -6.8170906", "40.4167747, -3.70379019", "41.3850632, 2.1734035", "39.4561165, -0.3545661"]);
    if (bResult) {
        await ui.msgBox("Por ahí anda Teruel", "Mensaje", 0);
    } else {
        await ui.msgBox("No, Teruel no está ahí", "Mensaje", 0);
    }
}

async function getLastKnownLocation() {
    let location = new GpsTools().getLastKnownLocation();
    if (!location) {
        ui.showToast("No hay última localización conocida");
        return;
    }
    await ui.msgBox("Latitud: " + location.latitude + "\nLongitud: " + location.longitude + "\nPrecisión (metros): " + location.accuracy + "\nAltitud (metros elipsis WSG 84): " + location.altitude + "\nRumbo (grados): " + location.bearing + "\nVelocidad (metros/segundo): " + location.speed + "\nFecha: " + location.time.toString(), "Mensaje", 0);
}

function encoded() {
    let sEncoded = toEncoded(["38.8685452, -6.8170906", "40.4167747, -3.70379019"]);
    ui.showToast(sEncoded);
}

function toEncoded(lstCoords) {
    if (!lstCoords) {
        return null;
    }
    return new GpsTools().encode(lstCoords);
}

function doFollowUserLocation(sControl, bFollow) {
    let control = getControl(sControl);
    if (!control) {
        return;
    }
    control.setFollowUserLocation(bFollow);
}

function doSetMapType(sControl, sMapType) {
    let control = getControl(sControl);
    if (!control) {
        return;
    }
    control.setMapType(sMapType);
}

function getControl(sControl) {
    if (!sControl) {
        throw "El nombre del control no puede estar vacío";
    }
    let window = ui.getView(self);
    if (!window) {
        return null;
    }
    let control = window[sControl];
    if (!control) {
        return null;
    }
    if (control === undefined) {
        return null;
    }
    return control;
}

/***
*
* Code from pdf.js
*
***/

function AddTableCellText(pdf, cellText, leftBorder, topBorder, rightBorder, bottomBorder) {
	pdf.setCellBorder ("none");
	if (leftBorder===true)
		pdf.setCellBorder ("left");
	if (rightBorder===true)
		pdf.setCellBorder ("right");
	if (topBorder===true)
		pdf.setCellBorder ("top");
		
	if (bottomBorder)
		pdf.setCellBorder ("bottom");
	pdf.addCellText (cellText);
}
 
async function GeneratePDFDocument() {
	var pdf01=createObject("XOnePDF");
	pdf01.create ("PDFbyXOne.pdf");
	pdf01.open();
	
	pdf01.setFont ("helvetica");
	pdf01.setFontSize (12);
	pdf01.setFontStyle ("normal");
	pdf01.setFontColor ("#000000");
	
	pdf01.createTable (1);
	pdf01.setTableCellWidths (400);
	AddTableCellText (pdf01,"",0,0,0,0);
	pdf01.setAlignment ("center");
	AddTableCellText (pdf01, "Prueba Crear PDF", 0, 0, 0, 0);
	pdf01.addTable();
	
	pdf01.setFontSize (9);
	
	
	pdf01.createTable (1);
	pdf01.setTableCellWidths (400);
	AddTableCellText (pdf01, " ", 0, 0, 0, 0);
	pdf01.addTable();
	
	pdf01.createTable (3);
	pdf01.setTableCellWidths (280, 70, 50);
	AddTableCellText (pdf01,"",0,0,0,0);
	pdf01.setAlignment ("left");
	AddTableCellText (pdf01, "Serie: ", 1, 1, 0, 0);
	pdf01.setAlignment ("center");
	AddTableCellText (pdf01, self.MAP_PDFSERIE,0,1,1,0);
	pdf01.addTable();
	
	pdf01.createTable (6);
	pdf01.setTableCellWidths (60, 70, 60, 90, 30, 90);
	pdf01.setAlignment ("left");
	AddTableCellText (pdf01, "FECHA ", 1, 1, 0, 1);
	pdf01.setAlignment ("center");
	AddTableCellText (pdf01, getDate(self.MAP_PDFFECHA),0,1,1,1);	
	pdf01.setAlignment ("left");
	AddTableCellText (pdf01, " ", 0, 1, 0, 1);
	pdf01.setAlignment ("center");
	AddTableCellText (pdf01, "",0,1,1,1);
	pdf01.setAlignment ("left");
	AddTableCellText (pdf01, "Nº ", 0, 1, 0, 1);
	pdf01.setAlignment ("center");
	AddTableCellText (pdf01, self.MAP_PDFNUMERO,0,1,1,1);
	pdf01.addTable();
	
	pdf01.createTable (1);
	pdf01.setTableCellWidths (400);
	AddTableCellText (pdf01,"",0,0,0,0);
	pdf01.setAlignment ("left");
	AddTableCellText (pdf01, cstr(self.MAP_PDFTEXT), 0, 0, 0, 0);
	pdf01.addTable();
	
	pdf01.addImageSetXY ("faro.jpg", 200,100, 150, 75);
	
	pdf01.close();
	
	pdf01.flattenPdf ("");
	
	//var a=ui.mgBox ("Quiere Abrir el PDF?","PDF GENERADO",4);
	if (await ui.msgBox("Quiere Abrir el PDF?","PDF GENERADO",4)===6)
		pdf01.launchPDF ("PDFbyXOne.pdf");
	
	
	pdf01=null;
}

function getDate(stdate) {
    return stdate.toString().substr(0,11);
    
// 	getDate = ""
// 	getDate = mid(cstr(stdate),1,11)
// 	exit function
}

/***
*
* Code from vbscriptsupport.js
*
***/

function VBScriptSupport() {
	this.cstr = function(value) {
		return safeToString(value);
	};
 
	this.now = function() {
		return new Date();
	};
 
	this.len = function(str) {
		return safeToString(str).length;
	};
 
	this.cint = function(value) {
		return parseInt(value);
	};
 
	this.left = function(str, n) {
		if (n <= 0) {
			return new String();
		} else if (n > String(str).length) {
			return safeToString(str);
		} else {
			return safeToString(str).substring(0, n);
		}
	};
 
	this.replace = function(source, search, replacement) {
		source = safeToString(source);
		search = safeToString(search);
		replacement = safeToString(replacement);
		search = escapeRegularExpression(search);
		source.replace(search, replacement);
		return source;
	};
 
	this.day = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getDate();
	};
 
	this.month = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getMonth();
	};
 
	this.year = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getFullYear();
	};
 
	this.right = function(str, n) {
		str = new String(str);
		if (n <= 0 || n > str.length) {
			return str;
		} else {
			var iLen = str.length;
			return str.substring(iLen, iLen - n);
		}
	};
 
	this.mid = function(str, start, len) {
		if (start < 0 || len < 0) {
			return str;
		}
		var iEnd, iLen = new String(str).length;
		if (start + len > iLen) {
			iEnd = iLen;
		} else {
			iEnd = start + len;
		}
		return new String(str).substring(start, iEnd);
	};
 
	this.inStr = function(strSearch, charSearchFor) {
		for (i = 0; i < len(strSearch); i++) {
			if (charSearchFor == mid(strSearch, i, 1)) {
				return i;
			}
		}
		return -1;
	};
 
	this.lcase = function(str) {
		if (isString(str)) {
			return str.toLowerCase();
		}
		return new String(str).toLowerCase();
	};
 
	this.ucase = function(str) {
		if (isString(str)) {
			return str.toUpperCase();
		}
		return new String(str).toUpperCase();
	};
 
	this.abs = function(value) {
		return Math.abs(value);
	};
 
	this.trim = function(str) {
		str = safeToString(str);
		return str.trim();
	};
 
	this.split = function(str, delimiter) {
		return str.split(delimiter);
	};
 
	this.dateDiff = function(sPeriod, mDate1, mDate2) {
		mDate1 = safeToDate(mDate1);
		mDate2 = safeToDate(mDate2);
		nDiff = Math.abs(mDate1.getTime() - mDate2.getTime());
		switch(sPeriod) {
			case "h":
				return nDiff / 3600000;
			case "n":
				return nDiff / 60000;
			default:
				throw new Error("dateDiff(): Unknown date period " + sPeriod);
		}
	};
 
	this.dateAdd = function(sPeriod, nNumber, mDate) {
		mDate = safeToDate(mDate);
		switch(sPeriod) {
			case "yyyy":
				//Year
				mDate.setYear(mDate.getYear() + nNumber);
				return mDate;
			case "q":
				//Quarter
				return mDate;
			case "m":
				//Month
				mDate.setMonth(mDate.getMonth() + nNumber);
				return mDate;
			case "y":
				//Day of year
				return mDate;
			case "d":
				//Day
				mDate.setDate(mDate.getDate() + nNumber);
				return mDate;
			case "w":
				//Weekday
				return mDate;
			case "ww":
				//Week of year
				return mDate;
			case "h":
				//Hour
				mDate.setHours(mDate.getHours() + nNumber);
				return mDate;
			case "n":
				//Minute
				mDate.setMinutes(mDate.getMinutes() + nNumber);
				return mDate;
			case "s":
				//Second
				mDate.setSeconds(mDate.getSeconds() + nNumber);
				return mDate;
			default:
				throw new Error("dateAdd(): Unknown date period " + sPeriod);
		}
	};
}
 
var vbSupport = new VBScriptSupport();
 
function isNothing(obj) {
	if (obj === null) {
		return true;
	}
	if (obj == "undefined") {
		return true;
	}
	return false;
}
 
function isSomething(obj) {
	if (obj === null) {
		return false;
	}
	if (obj == "undefined") {
		return false;
	}
	return true;
}
 
function getClassName(obj) {
	if(isNothing(obj)) {
		return null;
	}
	return obj.constructor.name;
}
 
function isFloatNumber(n) {
	return n === +n && n !== (n | 0);
}
 
function isIntegerNumber(n) {
	return n === +n && n === (n | 0);
}
 
function isNumber(obj) {
	if (isNothing(obj)) {
		return false;
	}
	return !isNaN(parseFloat(obj)) && isFinite(obj);
}
 
function isString(obj) {
	return typeof obj === 'string' || obj instanceof String;
}
 
function isEmptyString(obj) {
	if(!isString(obj)) {
		return false;
	}
	return(!obj || 0 === obj.length);
}
 
function isDate(obj) {
	if (obj instanceof Date) {
		return true;
	}
	return false;
}
 
function safeToString(value) {
	if(isNothing(value)) {
		return new String();
	}
	return new String(value);
}
 
function safeToDate(mDate) {
	if(isDate(mDate)) {
		return mDate;
	}
	return new Date(replaceAll(safeToString(mDate), '-', '/'));
}
 
function escapeRegularExpression(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
 
function replaceAll(sSource, sSearch, sReplacement) {
	sSearch = escapeRegularExpression(sSearch);
	return sSource.split(sSearch).join(sReplacement);
}




/***
*
* Code from nfc.js
*
***/

function ponerCallbackNfc() {
    let nfc = new XOneNFC();
    nfc.setOnTagDiscoveredCallback(tagNfcEncontrado);
}

function tagNfcEncontrado(tag) {
    let sMessage = "ID tag NFC (hex): " + tag.getHexId();
    if (tag.isTechnologyAvailable("ndef")) {
        // Vamos a manipular NDEF, decírselo al frame
        tag.setType("ndef");
        let ndefMessage = tag.getNdefMessage();
        let allRecords = ndefMessage.getAllRecords();
        if (!allRecords || allRecords.length <= 0) {
            sMessage = sMessage + "\nNo hay records NDEF en este tag";
        } else {
            for (let i = 0;i < allRecords.length;i++) {
                let record = allRecords[i];
                let sMimeType = record.getMimeType();
                let sText = record.getText();
                sMessage = sMessage + "\nRecord #1\nMime type: " + sMimeType + "\nText: " + sText;
            }
        }
        self.MAP_DATA = sMessage;
        ui.refreshValue("MAP_DATA");
    } else if (tag.isTechnologyAvailable("nfc_v")) {
        tag.setType("nfc_v");
        tag.connect();
        ui.showToast("Es NFC-V: " + tag.readNfcV());
    } else {
        ui.showToast("Tag NFC inválido");
    }
}

/***
*
* Code from dnie.js
*
***/


// Lectura de DNI datos personales
function enableDnieReader() {
    if (self.MAP_CAN_NUMBER === "") {
        ui.showSnackbar("Introduzca el CAN del DNI electrónico");
        return;
    }
	var options = {
		readProfileData : true,
		// Recuperar la foto del usuario, la de la firma y los certificados de autenticación y firma es lento. Hacerlo sólo cuando sea necesario.
		readUserImage : true,
		readSignatureImage : true,
		canNumber : self.MAP_CAN_NUMBER,
		onDnieRead : function(dnieReadResult) {
			self.MAP_TEXT = "DNI number: " + dnieReadResult.getDniNumber() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Document type: " + dnieReadResult.getDocumentType() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Name: " + dnieReadResult.getName() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Surname: " + dnieReadResult.getSurname() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Date of birth: " + dnieReadResult.getDateOfBirth() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Date of expiry: " + dnieReadResult.getDateOfExpiry() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Nationality: " + dnieReadResult.getNationality() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Issuer: " + dnieReadResult.getIssuer() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Optional data: " + dnieReadResult.getOptionalData() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Sex: " + dnieReadResult.getSex() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Birth place: " + dnieReadResult.getBirthPlace() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Address: " + dnieReadResult.getAddress() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Custody info: " + dnieReadResult.getCustodyInfo() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Icao name: " + dnieReadResult.getIcaoName() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Other info: " + dnieReadResult.getOtherInfo() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Profession: " + dnieReadResult.getProfession() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Phone: " + dnieReadResult.getPhone() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Title: " + dnieReadResult.getTitle() + "\n";
			self.MAP_TEXT = self.MAP_TEXT + "Summary: " + dnieReadResult.getSummary();
			self.MAP_USER_IMAGE = dnieReadResult.getUserImage(appData.getFilesPath() + "user_" + dnieReadResult.getDniNumber() + ".png");
			self.MAP_SIGNATURE_IMAGE = dnieReadResult.getSignatureImage(appData.getFilesPath() + "signature_" + dnieReadResult.getDniNumber() + ".png");
			ui.refreshValue("MAP_TEXT");
			ui.refresh("MAP_TEXT", "MAP_USER_IMAGE", "MAP_SIGNATURE_IMAGE");
		},
		onDnieReadError : function(sReadError) {
			self.MAP_TEXT = "Error: " + sReadError;
			ui.refreshValue("MAP_TEXT");
		},
		onProgressUpdated : function(sMessage, nProgress) {
			self.MAP_TEXT = "Reading DNIe.\nProgress: " + nProgress + "\n" + sMessage;
			ui.refreshValue("MAP_TEXT");
		}
	};
	var nfc = createObject("XOneNFC");
	nfc.enableDnieReader(options);
	ui.showSnackbar("Pase su DNI electrónico por el lector NFC");
}

function disableDnieReader() {
	var nfc = createObject("XOneNFC");
	nfc.disableDnieReader();
}

// Ejemplo de PDFs
function generatePdfDemo() {
	var source = "<P> <TABLE border='1'> <CAPTION align='top'> A more complex table-within-a table. </CAPTION> <TR> <TH> Outer Table </TH> <TD> <TABLE border='1'> <CAPTION align='top'> An inner table showing a variety of headings and data items. </CAPTION> <TR> <TH colspan='5'> Inner Table </TH> </TR> <TR> <TH rowspan='2' colspan='2'> CORNER </TH> <TH colspan='3'> Head1 </TH> </TR> <TR> <TH rowspan='2'> Head2 </TH> <TH colspan='2'> Head3 </TH> </TR> <TR> <TH> Head4 </TH> <TH> Head5 </TH> <TH> Head6 </TH> </TR> <TR> <TD> A </TD> <TD rowspan='2' valign='middle' bgcolor= 'yellow'> Two Tall </TD> <TD bgcolor='green'> <UL> <LI> Lists can be table data </LI> <LI> Images can be table data </LI> </UL> </TD> <TD colspan='2' align='center'> Two Wide </TD> </TR> <TR valign='middle'> <TD> aaaaa </TD> <TD align='center'> A <A href='form.html'>Form</A> in a table: <FORM Method='POST' Action= 'http://www.december.com/cgi-bin/formmail.secure.cgi'> <INPUT type='hidden' name='recipient' value='nobody@december.com'><INPUT type= 'hidden' name='subject' value= 'Table Example'> Your age: <INPUT type= 'text' name='user-age' size='2'><BR> What is your favorite ice cream?<BR> <SELECT name='favorite-icecream'> <OPTION> Vanilla </OPTION> <OPTION> Chocolate </OPTION> <OPTION> Cherry Garcia </OPTION> <OPTION> Pizza Pancake </OPTION> <OPTION> None of the above! </OPTION> </SELECT><BR> <INPUT type='submit' value='OK'> <INPUT type='reset' value='Cancel'> </FORM> </TD> <TD> <TABLE> <CAPTION> No border </CAPTION> <TR> <TH> Little </TH> </TR> <TR> <TD> Table </TD> </TR> </TABLE> </TD> <TD> Multiple<BR> line<BR> item </TD> </TR> </TABLE> </TD> </TR> </TABLE> <P> For more practical examples, see the Periodic Table of the Elements, <A href= 'http://www.webelements.com/'>WebElements</A>. </P> <P> You can see a <A href='tablem.html'>variety of table cellspacing and cellpadding attributes demonstrated</A>. </P>";
	var pdf = createObject("XOnePDF");
	pdf.permissions("assembly");
	pdf.create(appData.getFilesPath() + "PDFbyXOne.pdf");
	pdf.open();
	pdf.fromHtml(source);
	pdf.close();
	pdf.launchPDF();
}

// Lectura de DNIs (firma digital)
function signPdfDemo() {
    var fm = createObject("FileManager");
    var nResult = fm.fileExists(appData.getFilesPath() + "PDFbyXOne.pdf");
    if (nResult != 0) {
        ui.showSnackbar("El fichero PDF a firmar no existe. Genérelo primero.");
        return;
    }
    if (self.MAP_CAN_NUMBER == "") {
        ui.showSnackbar("Introduzca el CAN del DNI electrónico");
        return;
    }
    if (self.MAP_PIN == "") {
        ui.showSnackbar("Introduzca el PIN del DNI electrónico");
        return;
    }
	var options = {
		readSignatureCertificate : true,
		canNumber : self.MAP_CAN_NUMBER,
		pin : self.MAP_PIN,
		onDnieRead : function(dnieReadResult) {
			var pdf = createObject("XOnePDF");
			var sSourcePdf = appData.getFilesPath() + "PDFbyXOne.pdf";
			var sSignedPdf = appData.getFilesPath() + "PDFbyXOne_signed.pdf";
			pdf.signPdfWithKey(sSourcePdf, sSignedPdf, dnieReadResult.getSignatureKey(), dnieReadResult.getSignatureCertificateChain());
			pdf.launchPDF(sSignedPdf);
		},
		onDnieReadError : function(sReadError) {
			self.MAP_TEXT = "Error: " + sReadError;
			ui.refreshValue("MAP_TEXT");
		},
		onProgressUpdated : function(sMessage, nProgress) {
			self.MAP_TEXT = "Reading DNIe.\nProgress: " + nProgress + "%\n" + sMessage;
			ui.refreshValue("MAP_TEXT");
		}
	};
	var nfc = createObject("XOneNFC");
	nfc.enableDnieReader(options);
	ui.showSnackbar("Pase su DNI electrónico por el lector NFC");
}

function sendSignedPdf() {
    var fm = createObject("FileManager");
    var sSignedPdf = appData.getFilesPath() + "PDFbyXOne_signed.pdf";
    var nResult = fm.fileExists(sSignedPdf);
    if (nResult != 0) {
        ui.showSnackbar("El fichero PDF firmado no existe. Fírmelo primero.");
        return;
    }
    ui.sendMail("","","PDF firmado", "Adjunto PDF firmado con DNI electrónico", sSignedPdf);
}

/***
*
* Code from funciones_calendario.js
*
***/

async function inicializarCal() {
	//Primero eliminamos los registros que haya. Lo hacemos de forma logica.	
	//Habra algun mantenimiento programado que elimine estos registros, de forma que los borrados no entren en replica.		
	var cCal=await appData.getCollection("ContentdatosCalendario");
	var objCalendario;
	var stDia,fecha;
	for (var k=1;k<=5;k++) {
	    fecha = new Date();
		objCalendario=await cCal.createObject();
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
		await objCalendario.save();
	}
	objCalendario=null;
	cCal=null;
}
 
async function ShowMessageDebug(mode,stmsg) {
	//Para poder utilizar esta funcion tenemos que tener una variable global "Debug"
	if (appData.getCurrentEnterprise().getVariables("Debug") === true) {
		if (mode === "msgbox")
			await ui.msgBox (stmsg,"¡App_log_xone!",0);
		else if (mode === "showtoast")
			ui.showToast ("App_log_xone->"+stmsg);
		else if (mode === "consola")
			appdata.writeConsoleString("App_log_xone->"+stmsg);
	}
}

/***
*
* Code from funciones_chat.js
*
***/

// Funcion para bloquear un listado de contents.
// listContents: Listado de contents
async function lockContents(listContents){
    var content = null;
    for(var i = 0; i < listContents.length; i++){
        content = await self.getContents(listContents[i]);
        if(content != null){
           content.lock(); 
        }
    }
}

// Funcion para inicializar los parametros de la coleccion EspecialChat
async function inicializeChats(){
    self.MAP_GRUPOSEL=1;
    self.MAP_VERFLOTANTE=0;
    self.MAP_RECORDON=0;
    self.MAP_PHONE="";
    self.MAP_USERLOGIN=user.LOGIN;
    (await self.getContents("Chat")).setMacro("##MACRO##",user.LOGIN);
    self.MAP_FOTO_FONDO = "fondo_chat.png";
}

// Function para crear el chat ...
async function createChat(userFrom,userTo){
    var index = 0;
    var coll = await self.getContents("Chat");
    coll.unlock();
    var obj = await coll.findObject("(USUARIO='" + userFrom + "' AND USUARIO2='" + userTo + "') OR (USUARIO='" + userTo + "' AND USUARIO2='" + userFrom + "')");
    if(obj == null){
        obj = await coll.createObject();
        obj.USUARIO=userFrom;
        obj.USUARIO2=userTo;
        obj.FECHA= new Date();
        await obj.save(); 
    }
    index = obj.getObjectIndex();
    coll.lock();
    return index;
}

async function openChat(index,mSelf){
    var coll = await mSelf.getContents("Chat");
    coll.unlock();
    await coll.loadAll();
    var obj = coll.get(index);
    mSelf.MAP_INDICESEL = index;
    mSelf.MAP_IDCHATSEL = obj.ID;
    mSelf.MAP_IMGTIPO = obj.MAP_IMAGEN;
	mSelf.MAP_CHATTITULO = obj.MAP_TITULO;
	mSelf.MAP_CCUSUARIO = obj.USUARIO2;
    coll.lock();
	ui.getView(mSelf).refresh("MAP_BTVERGENTE","MAP_IMGTIPO","MAP_CHATTITULO"); 
	await mSelf.executeNode("abrirDrawer(2)");
}

async function openListUser(){
    // habilitamos la visibilidad de la ventana flotante ...
    self.MAP_VERFLOTANTE=1;
    // desbloqueamos el content que contiene a los usuarios ya que lo hemos bloqueado en el nodo after-edit ...
    (await self.getContents("nUsuarios")).unlock();
    await (await self.getContents("nUsuarios")).loadAll();
    (await self.getContents("nUsuarios")).lock();
    // creamos el indice despues de cargar los usuarios, para poder buscar en memoria ...
    (await self.getContents("nUsuarios")).createSearchIndex(["NOMBRE,"]);
    // usamos refreshAll porque queremos que se refresquen todos sus hijos y no solo la visibilidad del frame ...
    ui.getView(self).refreshAll("frmnuevochat");
}

function closeListUser(){
    self.MAP_VERFLOTANTE=0;
    ui.getView(self).refresh("frmnuevochat"); 
}

function salir(){
    //ui.showToast("MAP_VERFLOTANTE: "+ self.MAP_VERFLOTANTE);
    //ui.showToast("MAP_GRUPOSEL: "+ self.MAP_GRUPOSEL);
    if(self.MAP_VERFLOTANTE != 0){
        self.MAP_VERFLOTANTE = 0;
        ui.refresh("frmnuevochat,frmInfoCentralfloating");
    }else{
        if(self.MAP_GRUPOSEL==1){
            appData.failWithMessage(-11888, "##EXIT##"); 
        }else{
            ui.refresh("Chat");
            self.MAP_GRUPOSEL=1;
            irGrupo(1);
        }
    }
}

function setTimeRecording(sTime){
    var v = self[sTime].split(":");
    var m = Number(v[0]);
    var s = Number(v[1]);
    if(s<60){
        s++;
    }else{
        m++;
        s=0;
    }
    if(s<10){
        s="0"+s.toString();
    }
    self[sTime] = m.toString()+":"+s.toString();
    ui.refreshValue(sTime);
    if(self.MAP_RECORDON==1){
        ui.executeActionAfterDelay("onSetTime", 1);
    }
}

async function AccionesChatEspecial(parametro, evento) 
{
    var coll,obj,fecha;
    switch (parametro) {
        case 'nuevochat':
            // Aqui es donde vamos a crear un nuevo chat ...
            await openListUser();
            break;
        case 'ok':
            // Aqui es donde ese crea el chat y se abre ...
            // creamos el chat, si no existiera ...
            var index = await createChat(user.LOGIN,self.MAP_CCUSUARIO);
            // cerramos el menu de seleccion de usuarios ...
            closeListUser();
            // abrirmos el chat ...
            await openChat(index,self);
            break;
        case 'llamada':
            //ver a quien llamamos
            //si es unico, es decir, personal, se llama al USUARIO
            //si es grupo: mostrar frame flotante, para llamar a uno de ellos
            if(self.MAP_PHONE.toString().length == 0){
                await ui.msgBox("La persona con la que quiere contactar no tiene relleno el número de teléfono","Notificación",0);
            }else{
                ui.makePhoneCall(self.MAP_PHONE);
            }
            break;
        case 'fotoabrir':
            self.MAP_TIPO = 1;
            ui.startCamera("MAP_FOTO","photo");
            break;
        case 'voz':
            if( self.MAP_RECORDON==0){
                self.MAP_TIPO = 2;
                self.MAP_RECORDON=1;
                self.MAP_SHOWADDTEXT=1;
                self.MAP_TIMERECORD="0:00";
                ui.startAudioRecord("onrecordfinished","MAP_VOZGRABADA", 0);
                ui.executeActionAfterDelay("onSetTime", 1);
                ui.refresh("frmNormal,MAP_ADDTEXT");
                ui.getView(self).refreshAll("frmRecording");
            }else{
                self.MAP_TIPO = 0;
                self.MAP_RECORDON=0;
                self.MAP_SHOWADDTEXT=0;
                self.MAP_TIMERECORD="0:00";
                ui.stopAudioRecord();
                ui.refresh("frmRecording,MAP_ADDTEXT");
                ui.getView(self).refreshAll("frmNormal");
            }
            break;
        //Revisar esto en sistema operativo Android-10
        case 'textoChange':
            if(evento != null){
                var w;
                self.MAP_TIPO = 0;
                if(evento.newText.length > 0 && self.MAP_SHOWADDTEXT == 0){
                    self.MAP_SHOWADDTEXT = 1;
                    w = self.getFieldPropertyValue("MAP_TITLE","width");
                    w = w.replace("p","");
                    w = parseInt(w) + 100;
                    self.setFieldPropertyValue("MAP_TITLE","width",w.toString()+"p");
                    self.MAP_TITLE = evento.newText;
                    ui.refresh("MAP_TITLE,MAP_ADDFOTO,MAP_ADDRECORD,MAP_ADDTEXT");
                }else{
                    if(evento.newText.length == 0){
                        self.MAP_SHOWADDTEXT = 0;
                        w = self.getFieldPropertyValue("MAP_TITLE","width");
                        w = w.replace("p","");
                        w = parseInt(w) - 100;
                        self.setFieldPropertyValue("MAP_TITLE","width",w.toString()+"p");
                        self.MAP_TITLE = evento.newText;
                        ui.refresh("MAP_TITLE,MAP_ADDFOTO,MAP_ADDRECORD,MAP_ADDTEXT");
                    }
                }
            }
            break;
        case 'enviar':
            switch (self.MAP_TIPO) {
                case 0:
                    await sendMessage(await self.getContents("Chatear"),self,"MAP_TITLE",true);
        	        self.MAP_TIPO = 0;
                    break;
                case 1:
                    await sendMessage(await self.getContents("Chatear"),self,"MAP_FOTO",true);
        	        self.MAP_TIPO = 0;
        	        break;
        	    case 2:
                    ui.stopAudioRecord();
                    await sendMessage(await self.getContents("Chatear"),self,"MAP_VOZGRABADA",true);
        	        self.MAP_TIPO = 0;
                    self.MAP_RECORDON=0;
                    self.MAP_SHOWADDTEXT=0;
                    self.MAP_TIMERECORD="0:00";
                    ui.refresh("frmRecording,MAP_ADDTEXT");
                    ui.getView(self).refreshAll("frmNormal");
        	        break;
            }
            break;
        case 'textoU':
            if(evento != null){
                (await self.getContents("nUsuarios")).doSearch(evento.newText);
                ui.refresh("@nUsuarios");
            }
            break;
        
    }
}

async function AccionesChat(parametro) 
{
    switch (parametro) {
        case 'ver':
            // abrirmos el chat ...
            await openChat(self.getObjectIndex(),self.getOwnerCollection().getOwnerObject());
            break;
        // case 'veradjunto': 
        //     ui.openFile(self.ADJUNTO);
        //     break;
        case 'verfoto': 
            ui.openFile(self.MAP_FOTO);
            break;
        case 'vervoz': 
            ui.openFile(self.MAP_VOZ);
            break;
        // case 'compartir': 
        //     break;
    }
}

async function sendMessage(colMUser,obj,title,isFromUser){
	if(obj[title].length != 0 ){
	  	var CollCV=await appData.getCollection("MensajesReader");
		var ObjCV=await CollCV.createObject();
		if(isFromUser){
			ObjCV.USUARIOTO = self.MAP_CCUSUARIO;
			ObjCV.USUARIOFROM = user.LOGIN;
		}else{
			ObjCV.USUARIOTO = user.LOGIN;
			ObjCV.USUARIOFROM = self.MAP_CCUSUARIO;
		}
		ObjCV.FECHA = new Date();
		ObjCV.MENSAJE = self[title];
		ObjCV.TIPO = self.MAP_TIPO;
		ObjCV.IDCHAT = self.MAP_IDCHATSEL;
		await ObjCV.save();
		
		ui.startReplica();
		
		colMUser.unlock();
		await addUserMessage(colMUser,ObjCV,-1,ObjCV.ROWID);
		colMUser.lock();
		
		//limpiamos
		self[title] = "";
		ObjCV = null;
		CollCV.clear();
		CollCV = null;
		
		ui.refresh("MensajesUsuarios",title);
	}
}

async function fillMessagesContent(colMUser,page,cant) {
    var colMsg,obj,n,i,nInit,nEnd,ObjB;
	colMsg=await appData.getCollection("MensajesReader");
 	colMsg.setFilter("IDCHAT="+self.MAP_IDCHATSEL+"");
	colMUser.unlock();
	colMUser.clear();
	await colMUser.loadAll();
	colMsg.setSort("FECHA ASC");
	await colMsg.startBrowse();
	while (await colMsg.getCurrentItem() !== undefined && await colMsg.getCurrentItem() != null) {
	    obj=await colMsg.getCurrentItem();
		await addUserMessage(colMUser,obj,0,obj.ROWID);
		await colMsg.moveNext();
	}
	colMsg.endBrowse();
	colMsg.clear();
	colMsg = null;
	colMUser.lock();
	ui.refresh("Chatear");
}

async function addUserMessage(colMUser,obj, index,sRowid) {
    
    var omuser,queue,fecha,dia,mes,anio;
    omuser=await colMUser.createObject();
	colMUser.addItem(omuser);
	omuser.FECHA=obj.FECHA;
	omuser.USUARIOFROM=obj.USUARIOFROM;
	omuser.USUARIOTO=obj.USUARIOTO;
	switch (obj.TIPO) {
	    case 0:
	        omuser.MENSAJE= obj.MENSAJE;
	        break;
	    case 1:
	        omuser.MAP_FOTO= obj.MENSAJE;
	        break;
	    case 2:
	        if(obj.MENSAJE != null){
	            var msgVoz = obj.MENSAJE.substring(obj.MENSAJE.lastIndexOf("/")+1);
	            omuser.MAP_VOZ= msgVoz;
	        }
	        break;
	    case 3:
	        omuser.MAP_ADJUNTO= obj.MENSAJE;
	        break;
	}
	omuser.TIPO = obj.TIPO; 
	omuser.IDCHAT = obj.IDCHAT;
	omuser.MAP_FECHAHORA=obj.FECHA;
	
	if (obj.USUARIOFROM==user.LOGIN) {
	    omuser.MAP_COLORVIEW="#A5DF00";
		omuser.MAP_FORECOLOR="#666666";
		omuser.MAP_FORECOLORFECHA="#B3FFFFFF";
		omuser.MAP_ESPACIO=1;
        //Comprobar que se ha replicado el mensaje, para mostrar mensaje enviado o no
// 		queue=appData.getCollection("MasterReplicaQueue").findObject("ROWID='" + obj.ROWID.toString() + "'");
// 		if (queue !== undefined && queue != null) {
// 		    omuser.MAP_IMAGE="trasparente.png"; 
// 		} else {
// 		    omuser.MAP_IMAGE="Icon_Enviar.png"; 
// 		}
// 		queue=null;    
	} else {
        omuser.MAP_COLORVIEW="#e5e5ea";
    	omuser.MAP_FORECOLOR="#000000";
    	omuser.MAP_FORECOLORFECHA="#80000000";
    	omuser.MAP_ESPACIO=0;
    	omuser.MAP_IMAGE="trasparente.png";
	}
 	// colMUser.setVariables("refreshindex",0);
	ui.refresh("Chatear");
}


function irGrupo(grupo){
    ui.showGroup(grupo,'##RIGHTN##',150,'##RIGHTN_OUT##',150);
}

/***
*
* Code from strings.js
*
***/

var literales = null;
iniciarLiterales();

/* Se pone en una funcion porque para que lo coja el traductor*/
function iniciarLiterales(){
    
    literales = {
        /*##XONE_TRANSLATE_NEXT_LINE##*/
        stVersionLog: "- Version Log.",
        /*##XONE_TRANSLATE_NEXT_LINE##*/
        stScreensRework: "- Screens rework.",
        /*##XONE_TRANSLATE_NEXT_LINE##*/
        stNewSup: "- New supervisor option.",
        /*##XONE_TRANSLATE_NEXT_LINE##*/
        stMustIndicateWarehouse:"You must indicate the warehouse."
    };

}

/***
*
* Code from funciones.js
*
***/

String.prototype.repeat = function (n) {
    var aux = "";
    for(var i = 0; i < n; i++){
        aux += this;
    }
    return aux;
};

var MAP_OBJETO_HIJO = null;

/* ***********************************
         FUNCIONES DE FECHA              
   *********************************** */
// Hacer pad zero
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function doAuthLogout() { 
    
            new OAuth2().withOptions( { authority:"https://gaccess-int.gamesacorp.com/identity/",
                             clientID:'APP_0275_GOTMOBILITY',
                             clientSecret:'C7331D93-9109-4F87-B2BA-17C77711B54E',
                             scope:'openid profile',
                             persistenceKey:'key_1234', 
                             responseType:'code id_token',
                             redirectUri:'com.xone.oauth2:/gamesaredirect'}).logout();
                             
}
    
function doAuthLogin() {
    
        new OAuth2().withOptions( { authority:"https://gaccess-int.gamesacorp.com/identity/",
                             clientID:'APP_0275_GOTMOBILITY',
                             clientSecret:'C7331D93-9109-4F87-B2BA-17C77711B54E',
                             scope:'openid profile',
                             responseType:'code id_token',
                             persistenceKey:'key_1234', 
                             redirectUri:'com.xone.oauth2:/gamesaredirect'})
                            .authenticate ({ 
                                    onSuccess:function ( result ) {
                                        
                                        console.log(result);
                                    }, 
                                    onError:function(err) { 
                                        
                                         console.log(err);
                                    }  
                                    
                                });
    
}

async function doLoginNew() {
    var params = {
        userName: self.MAP_USER,
        password: self.MAP_PASSWORD,
        entryPoint: "Menu",
        // entryPoint: "EspecialChat",

        // Opcional
        onLoginSuccessful: function() {
            ui.showToast("Login OK!");
        },

        // Opcional
        onLoginFailed: function() {
            ui.showToast("Login failed!");
        }
    };
    await appData.login(params);
}

function doLogout() {
    appData.logout();
}

function exit() {
    appData.exit();
}

function funcionesFecha() {
	//Funciones Fecha Local
    var d = new Date();
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    var anio = d.getFullYear();
    var mes = addZero(d.getMonth()+1);
    var diames = addZero(d.getDate());
    var diasemana = d.getDay()+", "+diasSemana[d.getDay()];
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var ms = d.getMilliseconds();
    var t = d.getTime();
    var GMTminutes = d.getTimezoneOffset();

    var mensaje = "Fecha local: "+diames+"/"+mes+"/"+anio;
    mensaje += "\nDia semana: "+d.getDay()+", "+diasSemana[d.getDay()];
    mensaje += "\nHora: "+h+":"+m+":"+s+"."+ms;
    mensaje += "\nMilisegundos desde 1970: "+t;
    mensaje += "\nDiferencia GMT minutos: "+GMTminutes;

	//Funciones Fecha UTC
    var dUTC = new Date();
    var anioUTC = dUTC.getUTCFullYear();
    var mesUTC = addZero(dUTC.getUTCMonth()+1);
    var diamesUTC = addZero(dUTC.getUTCDate());
    var diasemanaUTC = dUTC.getUTCDay()+", "+diasSemana[dUTC.getUTCDay()];
    var hUTC = addZero(dUTC.getUTCHours());
    var mUTC = addZero(dUTC.getUTCMinutes());
    var sUTC = addZero(dUTC.getUTCSeconds());
    var msUTC = dUTC.getUTCMilliseconds();
    var tUTC = Date.UTC(anioUTC,mesUTC,diamesUTC,hUTC,mUTC,sUTC,msUTC);

    var mensajeUTC = "\nFecha UTC: "+diamesUTC+"/"+mesUTC+"/"+anioUTC;
    mensajeUTC += "\nDia semana UTC: "+diasemanaUTC;
    mensajeUTC += "\nHora UTC: "+hUTC+":"+mUTC+":"+sUTC+"."+msUTC;
    mensajeUTC += "\nMilisegundos desde 1970 en UTC: "+tUTC;

	//Convertir a String y otros
    var str = d.toString();
    var strUTC = dUTC.toUTCString();
    var strDate = d.toDateString();
    var strLocaleDate = d.toLocaleString();
    var strLocaleDateOnly = d.toLocaleDateString();
    var strTime = d.toTimeString();
    var strLocaleTime = d.toLocaleTimeString();
    var strIso = d.toISOString(); 
    var sJson = d.toJSON(); 

    var mensajeString = "\ntoString(): \n"+str;
    mensajeString += "\ntoUTCString(): \n    "+strUTC;
    mensajeString += "\ntoDateString(): "+strDate;
    mensajeString += "\ntoLocaleString(): \n"+strLocaleDate;
    mensajeString += "\ntoLocaleDateString(): \n    "+strLocaleDateOnly;
    mensajeString += "\ntoTimeString(): \n    "+strTime;
    mensajeString += "\ntoLocaleTimeString(): "+strLocaleTime;
    mensajeString += "\ntoISOString(): \n    "+strIso;
    mensajeString += "\ntoJSON(): \n    "+sJson;

    mensaje += "\n"+mensajeUTC;
    mensaje += "\n"+mensajeString;
    return mensaje;
}

/* ***********************************
         FUNCIONES VARIAS             
   *********************************** */

async function userMsgBox(title, msg, type) {
	var collMsgBox, objMsgBox, nResult;
	collMsgBox = (await appData.getCollection("EspecialMsgbox")).createClone();
	objMsgBox = await collMsgBox.createObject();
	collMsgBox.addItem(objMsgBox);
	objMsgBox.MAP_TITULO = title;
	objMsgBox.MAP_MENSAJE = msg;
	objMsgBox.MAP_TIPO = type;
	
	nResult = await ui.msgBox(objMsgBox);
	return nResult;
}


function frameScroll(e) {
	if (e.dy<=10 && self.MAP_SHOWOVERSCROLL===1) {
		self.MAP_SHOWOVERSCROLL=0;
		ui.getView(self).refresh("froverscroll");
	} else {
		if (e.dy>10 && self.MAP_SHOWOVERSCROLL===0) {
			self.MAP_SHOWOVERSCROLL=1;
			ui.getView(self).refresh ("froverscroll");
		}
	}
}
   
function EscanearMatricula(RutaImagen) {
	var ocr = createObject("XOneOCR");
	return ocr.scanLicensePlate(RutaImagen);
}

function EscanearTexto(RutaImagen) {
	var ocr = createObject("XOneOCR");
	return ocr.scanText(RutaImagen, "áéíóúÁÉÍÓÚqwertyuiopasdfghjklzxcvbnñmQWERTYUIOPASDFGHJKLZXCVBNÑM");
}


/*
* Next an previous helper
*/
function prev(obj,execNode,refresh) { 
    if (obj.MAP_GROUP > 1)
        goPage(obj,obj.MAP_GROUP - 1,refresh);
}

function next(obj,execNode,refresh) { 
    if (obj.MAP_GROUP < obj.MAP_TOTAL_PAGES)
  		goPage(obj,obj.MAP_GROUP + 1,refresh);
}

function goPage(obj,index,refresh) {
    ui.showGroup (index,"##ALPHA_IN##",500,"##ALPHA_OUT##",500);
    obj.MAP_GROUP = index;
    /*if (refresh!==undefined) {
        ui.refresh(refresh);
    }else{
        ui.refresh();
    }*/
}

function cstr(val) {
    if (val===undefined || val===null)
        return "";
    return val.toString();
}

function formatDateTime(date,type) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
  
    switch (type) {
        case 0:
            return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
        case 1:
            return date.getDate()+1 + "/" + date.getMonth() + "/" + date.getFullYear();
        case 2:
            return date.getDate()+1 + "/" + date.getMonth() + "/" + date.getFullYear().toString().substring(2,4);
        case 3:
            return strTime;
        case 4:
            return hours + ':' + minutes;
    }
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

function len(val) {
    return cstr(val).length;
}

function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

async function testClick(e){
	await ui.msgBox(e.target,"Test",0);
}


async function scanAvailableNetworks() {
	try {
	    self.MAP_LOADING = 1;
	    ui.refresh("frmLoading");
		(await self.getContents("ContentWifis")).clear();
	    
	    var wifiManager = new WifiManager();
	    if(wifiManager.isWifiAdapterEnabled()){
	        onWifiNetworksFound.OBJETO = self;
    	    var lstAvailable = wifiManager.scanAvailableNetworks(onWifiNetworksFound);
    	    ui.showToast("Escaneando redes WiFi...");
	    }else{
	        ui.executeActionAfterDelay("scanAvailableNetworks",5);
	    }
	}
	catch(ex){
		//ui.msgBox("ex: "+ex,"aa",0);
	}
}

async function onWifiNetworksFound(wifiNetworks) {
    self = onWifiNetworksFound.OBJETO;
    var sMessage = "";
    var wifiManager = new WifiManager();
    var orden = 1;
    for (var i = 0;i < wifiNetworks.length;i++) {
        //sMessage = sMessage + "SSID: " + wifiNetworks[i].getSsid() + "\n";
        var wifi = wifiNetworks[i];
        var isOpen = false;
        var coll = await self.getContents("ContentWifis");
        if (coll != null)
        {
	    	var obj2=coll.getItem("MAP_SSID",wifi.getSsid());
	    	if (!obj2)
	    	{
				coll.lock();
				var obj = await coll.createObject();
				coll.addItem(obj);
				
				if (obj) {
				    
				    if (wifi.getNetworkSecurity()=="OPEN")
					{
					    obj.MAP_IMAGE = "wifi-open.png";
					    isOpen = true;
					}
					else
					{
					    obj.MAP_IMAGE = "wifi-lock.png";
					    isOpen = false;
					}
					
					if (saberSiWifiGuardada(wifi.getSsid()))
					{
						obj.MAP_ESTADO = "Guardado";
						obj.MAP_ORDEN = orden;
						orden ++;
						obj.MAP_IDESTADO = 0;
					}
					else
					{ 
					    obj.MAP_ESTADO="";
					    obj.MAP_ORDEN = 99999;
						obj.MAP_IDESTADO = -1;
					}
					
					
					var wifiInfo = wifiManager.getActiveWifiInfo();
					
					if (wifiInfo != null) {
						if (wifiInfo.getSsid() == wifi.getSsid())
						{
							obj.MAP_ESTADO="Conexión establecida";
							if(isOpen){
							    obj.MAP_IMAGE = "wifi-open-conected.png";
							}else{
							    obj.MAP_IMAGE = "wifi-lock-conected.png";
							}
							obj.MAP_ORDEN = 0;
							obj.MAP_IDESTADO = 1;
						}
					}
					
					if(wifi.getSsid().length > 0){
					    obj.MAP_SSID = wifi.getSsid();
					}else {
					    obj.MAP_SSID = "Red desconocida";
					}
					obj.MAP_SECURITY=wifi.getNetworkSecurity();
				}
				
				coll.unlock();
			}
		}
    }
    self.MAP_LOADING = 0;
    ui.refresh("ContentWifis,frmLoading");
    
    (await self.getContents("ContentWifis")).doSort("MAP_ORDEN ASC");
    //ui.msgBox(sMessage, "Redes", 0);
}

function saberSiWifiGuardada(wifi) {
    var wifiManager = createObject("WifiManager");
    var lstSaved = wifiManager.listSavedNetworks();
    var sMessage = "";
    for (var i = 0; i < lstSaved.length;i++) {
        if (wifi==lstSaved[i].getSsid())
        	return true;
    }
    return false;
}

//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto más facilmente.
//El documento es una grilla cuyo punto 0,0 es la ESQUINA INFERIOR IZQUIERDA.
//Para mejor desarrollo, activar showGridDebug(pdf)
//addNewLine(pdf) Añade una tabla de una línea vacía y sin bordes
async function GenerarPDFBasico(nameFile,pdf,createGrid){

	//Creamos el PDF, borramos si existe ya el fichero, le indicamos el nombre y la encriptación a utilizar
	     		
	pdf.create(nameFile);
	pdf.permissions("assembly");
	pdf.permissions("print");
	pdf.setEncryption("","1234","128bits");

	pdf.open();
	
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");			
	pdf.setAlignment("center");	
	pdf.setFontSize(9);
	pdf.setFontColor("#000000");
	
	//**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf);
	}

				
	//********************************************
	//    Comenzamos a pintar en el documento
	//********************************************
	pdf.setFont("helvetica");
	pdf.setFontSize(9);
	pdf.setFontStyle("normal");
	pdf.setFontColor("#000000");
	pdf.addText("Esto es un ejemplo de texto, en la posicion: " + pdf.getVerticalPosition().toString());
	pdf.newLine();
	pdf.addText("Segunda Línea, en la posicion: " + pdf.getVerticalPosition().toString());
	pdf.newLine();
	
	//Se especifica que vamos a crear una tabla con 3 columnas sin bordes
	pdf.createTable(3);
	pdf.setCellBorder("none");
	pdf.setTableWidth(100);
	pdf.setTableCellWidths(33,33,33);
	pdf.setAlignment("left");
	pdf.addCellText("Texto a la izquierda");
	pdf.setAlignment("center");
	pdf.addCellText("Texto centrado");
	pdf.setAlignment("right");
	pdf.addCellText("Texto a la derecha");
	pdf.addTable();
	
	//Se especifica que vamos a crear una tabla con 3 columnas sin bordes
	pdf.createTable(1);
	//Las posibilidades para los bordes son: all, top, left, right, bottom
	pdf.setCellBorder("all");
	//Da igual el ancho que se le indique a la tabla
	pdf.setTableWidth(100);
	pdf.setAlignment("center");
	pdf.setFontStyle("bold");
	pdf.setFontSize(12);
	pdf.setFontColor("#FFFFFF");
	//Al tener la letra de color blanco, ponemos el fondo de la celda en negro
	pdf.addCellText("Con las tablas es más sencillo alinear el texto","#000000");
	pdf.setAlignment("left");
	pdf.setFontStyle("normal");
	pdf.setFontSize(10);
	pdf.setFontColor("#000000");
	pdf.addCellText("El ancho de una tabla NO FLOTANTE es 418, desde la posición 88 hasta la 506, da igual el ancho que se especifique para la tabla ó para las columnas");
	pdf.setAlignment("center");
	pdf.setFontStyle("bold");
	pdf.setFontSize(12);
	pdf.setFontColor("#FFFFFF");
	//Al tener la letra de color blanco, ponemos el fondo de la celda en negro
	pdf.addCellText("El ancho de las celdas será un porcentaje con respecto a la suma de los anchos de las columnas","#000000");
	pdf.setFontColor("#000000");
	pdf.setAlignment("left");
	pdf.setFontStyle("normal");
	pdf.setFontSize(10);
	pdf.addCellText("Da igual el ancho que se ponga para una tabla NO FLOTANTE, el ancho de la celda será determinado mediante una regla de 3 para averiguar el porcentaje correspondiente a la cantidad asignada.");
	pdf.addCellText("Por ejemplo: 3 columnas 60 de ancho para cada una:" + String.fromCharCode(10) + "SetTableCellWidths 60,60,60  ->  60+60+60 = 180 que sería el 100% de la tabla" + String.fromCharCode(10) + "Para averiguar el porcentaje, calculamos 60x100 / 180 = 33.3%.");
	pdf.addTable(); 

    //Creamos una tabla con 3 columnas
	pdf.createTable(3);
	pdf.setTableCellWidths(60,60,60);
	pdf.setAlignment("center");
	pdf.addCellText("SetTableCellWidths 60,60,60");
	pdf.addCellText("60+60+60=180 -> 100%");
	pdf.addCellText("60x100 / 180 = 33.3%");
	pdf.addTable();


	pdf.createTable(1);
	pdf.setCellBorder("all");
	pdf.setAlignment("center");
	pdf.setFontStyle("bold");
	pdf.setFontColor("#FFFFFF");
	//Al tener la letra de color blanco, ponemos el fondo de la celda en negro
	pdf.addCellText("Lo más sencillo será hacer coincidir los anchos de las columnas con 100 y así tendremos el porcentaje que tomará cada celda de ancho.","#000000");
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontStyle("normal");
	pdf.addCellText("Por ejemplo: SetTableCellWidths 20,50,15,15.");
	pdf.addTable();
	
    //Creamos una tabla con 4 columnas
	pdf.setAlignment("center");
	
	pdf.createTable(4);
	pdf.setTableCellWidths(20,50,15,15);
	pdf.addCellText("20%");
	pdf.addCellText("50%");
	pdf.addCellText("15%");
	pdf.addCellText("15%");
	pdf.addTable();
	
	//****************************************************
	// Para hacer una tabla posicionada de forma absoluta
	//****************************************************
	//Esta tabla al pintarse no actualiza pdf.getVerticalPosition() porque se pinta "flotando" encima del documento
	pdf.createTable(1);
	// Muy importante, a la hora de hacer una tabla posicionada de forma absoluta
	// es necesario definir previamente el ancho de la tabla.
	pdf.setTableWidth(418);
	pdf.setAlignment("center");
	pdf.setFontStyle("bold");
	pdf.setFontSize(12);
	pdf.setFontColor("#000000");
	pdf.addCellText("Tabla 'FLOTANTE' de 418 de ancho");
	pdf.addTableSetXY(88,542);
	
	//Se especifica que vamos a crear una tabla con 2 columnas
	pdf.setFontColor("#000000");
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");
	
	pdf.createTable(2);
	// Muy importante, a la hora de hacer una tabla posicionada de forma absoluta
	// es necesario definir previamente el ancho de la tabla.
	pdf.setTableWidth(340);
	pdf.setTableCellWidths(180,160);
	pdf.addCellText("Texto en tabla 'flotante', el alto de la tabla lo marcará el contenido.");
	pdf.setAlignment("center");
	pdf.addCellText("Situada en:" + String.fromCharCode(10) + String.fromCharCode(13) + "Eje X=120, Eje Y=500");
	pdf.addTableSetXY(120,500);

	
	pdf.createTable(3);
	// Muy importante, a la hora de hacer una tabla posicionada de forma absoluta
	// es necesario definir previamente el ancho de la tabla.
	pdf.setAlignment("center");	
	pdf.setTableWidth(460);
	pdf.setTableCellWidths(30,40,30);
	pdf.addCellText("Una flotante puede ocupar lo que se quiera.","#99FFFF");
	pdf.addCellText("Y posicionarla en cualquier lugar.","#99FFFF");
	pdf.addCellText("Los anchos definidos 30,40,30","#99FFFF");
	pdf.addTableSetXY(60,430);
	
	//Ponemos la imagen de la flecha apuntando a la coordenada 0,0 en una posición absoluta, también "flotando" sobre el documento
	pdf.addImageSetXY("./icons/coordenada00.png", 0, 0);

	pdf.close();
	
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
		pdf.launchPDF();
	}
}

function showGridDebug(pdf){
    var i,j;
	//Tabla para saber las posiciones X e Y de un PDF

	//Para el EJE X
	pdf.setAlignment("center");
	pdf.setFontSize(9);
	pdf.setFontStyle("bold");
	pdf.setFontColor("#0000CC");
	for ( j = 2; j < 26; j++){
		i = parseInt(j * 20);
		//Esta es la primera fila del Eje X, Arriba, Y=840
		pdf.createTable(1);
		pdf.setTableWidth(20);
		pdf.addCellText(i.toString());
		pdf.addTableSetXY(i,840);
		//pdf.addRectangle(PosX, posY, Ancho, Alto, Grosor, ColorFondo, ColorLinea
		pdf.addRectangle(i, 20, 0, 820, 0, "#FF0000", "#FF0000");
		
		//Esta es la segunda fila del Eje X, Abajo, Y=20
		pdf.createTable(1);
		pdf.setTableWidth(20);
		pdf.addCellText(i.toString());
		pdf.addTableSetXY(i,20);
	}
	
	//Para el EJE Y
	pdf.setFontColor("#009900");
	for ( j = 0; j < 42; j++){
		i = parseInt( j * 20 );
		
		//Esta es la primera columna del Eje Y, en la izquierda X=10
		pdf.createTable(1);
		//pdf.addCellText("10,"+i
		pdf.setTableWidth(30);
		pdf.addCellText(i.toString());
		pdf.addTableSetXY(10,i);
		//pdf.addRectangle(PosX, posY, Ancho, Alto, Grosor, ColorFondo, ColorLinea
		pdf.addRectangle(10, i, 540, 0, 0, "#FF0000", "#FF0000");
		
		//Esta es la segunda columna del Eje Y, en la derecha X=540
		pdf.createTable(1);
		pdf.setTableWidth(30);
		//pdf.addCellText("540,"+i
		pdf.addCellText(i.toString());
		pdf.addTableSetXY(540,i);
	}
	
	pdf.setFontStyle("normal");
	pdf.setFontColor("#000000");
}

//PARAMETROS:
//Pdf01 -- el objeto pdf
//Total de lineas
//Numero actual de linea
//Si es final de linea.
//Texto a poner.
function AddCellTexttable(Pdf01,nColumT,nColum,isFinLine,textLine){

	//le quitamos todos los bordes	
	Pdf01.setCellBorder("none");
	//dibujamos la liena de arriba o de abajo dependiendo de donde estemos.
	if ( isFinLine == 0){
		//dibujamos top
		Pdf01.setCellBorder("top");
	}else{
		if ( isFinLine == 1 ){
			//dibujamos bottom
			Pdf01.setCellBorder("bottom");
		}
	}

	//if nColum = 1 then
		//dibujamos el borde left|top si no es finline
	//	Pdf01.setCellBorder("left" 
	//end if
	
	//if nColum = nColumT then
		//dibujamos el borde left|top si no es finline		
	//	Pdf01.setCellBorder("right"
	//end if
    Pdf01.addCellText(textLine);
}

function addNewLine(Pdf01){
	Pdf01.createTable(1);
	Pdf01.setCellBorder("none");
	Pdf01.addCellText(" ");
	Pdf01.addTable();
}

//crearPDF
function CreatePDF(nameFile,pdf){
	//creamos el pdf
	
	//namefile="/mnt/sdcard/xone/"+namefile
	try{
    	appData.error.clear();
    	pdf.delete(nameFile);
    	appData.error.clear();
	}catch(e){
	    
	}
    	pdf.permissions("assembly");
    	pdf.create(nameFile);
    	pdf.setEncryption("", "1234", "128bits");
}

//devolvemos la hora sin fecha
function getTime(stdate){
    stdate = getEmptyFromNull(stdate);
	return stdate.toString().substring(11);
}

//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto muy facilmente.
//AddCellTexttable(Pdf01,nColumTotales,nColumActual,isFinLine,texto)
//addNewLine(Pdf01) Añade una tabla de una línea vacía y sin bordes
async function GenerarPDF1(nameFile,pdf,createGrid){

	//Creamos el PDF, borramos si existe ya el fichero, le indicamos el nombre y la encriptación a utilizar
	CreatePDF(nameFile,pdf);
	
	//pdf.BeginHeader
				
	//pdf.endHeader()
	
	pdf.open();
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");
	
	//**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf);
	}
	
	//addNewLine pdf
	//1er recuadro
	pdf.createTable(1);
	AddCellTexttable(pdf,1,1,1,"");
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	pdf.addTable();
	
	addNewLine(pdf);
	pdf.createTable(1);
	pdf.setTableWidth(150);
	//pdf01.setTableCellWidths(450,550
	pdf.setCellBorder("none");
	pdf.setAlignment("left");
	pdf.addCellImage("./icons/LogoPrint.png",150,73);
	pdf.addTable();
	
	pdf.createTable(2);
	pdf.setTableWidth(0);
	pdf.setTableCellWidths(10,10);
	pdf.setAlignment("right");
	AddCellTexttable(pdf,1,1,1," 0");
	AddCellTexttable(pdf,1,1,1," CIFSSSSSS: B01234567");
	pdf.addTable(); 
	
	//Fecha
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setFontStyle("bold");					
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1,getDate(new Date()));
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,getTime(new Date()));
	pdf.addTable(); 
	
	pdf.createTable(2);
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");
	pdf.setTableWidth(150);		
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Ticket: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,nameFile);
	pdf.addTable();
	
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Montador: ");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,self.MAP_ENCARGADO")
	AddCellTexttable(pdf,2,1,-1,"Manuel Chaves");
	pdf.addTable();
	
	pdf.createTable(1);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,1,"");
	pdf.addTable(); 
	
	//primer apartado
	
	pdf.createTable(1);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,0,"");
	pdf.addTable();
	
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Cliente: ");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,self.MAP_CLIENTE")	
	AddCellTexttable(pdf,2,1,-1,"Cliente del curso");
	pdf.addTable();
	
	pdf.createTable(2);	
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Cod.Cliente: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"378-522");
	pdf.addTable();
	
	pdf.createTable(2);	
	pdf.setTableWidth(150);			
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Finca: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"La finca 3");
	pdf.addTable();
	
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Cod.Proyecto: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"123-456");
	pdf.addTable();
	
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," N.ORDEN: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"123456");
	pdf.addTable();
			
	pdf.createTable(1);
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,1,"");
	pdf.addTable();
	
	//segundo apartado
	
	pdf.createTable(3);
	pdf.setFontStyle("bold");
	pdf.setTableCellWidths(100,25,25);
	pdf.setAlignment("left|bottom");
	AddCellTexttable(pdf,2,1,0," Tarea ");
	AddCellTexttable(pdf,2,1,0," Inicio ");
	AddCellTexttable(pdf,2,1,0," Fin ");
	pdf.addTable();
	
	pdf.createTable(1);
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");
	pdf.setTableWidth(150);		
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,1,"");
	pdf.addTable();
		
	addNewLine(pdf);
	
	//Recorreremos con un FOR para ir poniendo las tareas, para el ejemplo las ponemos fijas
	//set coll = this.Contents("@MaestroTareas")
	//coll.Macro("##MACRO1##") = "IDORDEN="+numOrden
	//coll.LoadAll
	//tot=coll.count
	//if not coll is nothing then
	//	for i=0 to tot			
	//		set obj = coll(cint(i))		
	//		pdf.createTable(3	
	//		pdf.setTableCellWidths(100,25,25			
	//		pdf.setAlignment("left"
	//		AddCellTexttable pdf,2,1,-1,cstr(obj("MAP_TAREADESC"))	
	//		AddCellTexttable pdf,2,1,-1,cstr(obj("HORAINICIO"))	
	//		AddCellTexttable pdf,2,1,-1,cstr(obj("HORAFIN"))	
	//		pdf.addTable();			
	//	next		
	//end if	
	
	
	//Aqui ponemos fijo lo anterior para no necesitar Base de datos
	pdf.createTable(3);
	pdf.setTableCellWidths(100,25,25);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1,"Tarea Numero Uno");
	AddCellTexttable(pdf,2,1,-1,"11:45");
	AddCellTexttable(pdf,2,1,-1,"12:00");
	pdf.addTable();

	pdf.createTable(3);
	pdf.setTableCellWidths(100,25,25);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1,"Tarea Numero Dos");	
	AddCellTexttable(pdf,2,1,-1,"12:00");	
	AddCellTexttable(pdf,2,1,-1,"12:30");
	pdf.addTable();	
	
	pdf.createTable(3);
	pdf.setTableCellWidths(100,25,25);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1,"Tarea Numero Tres");
	AddCellTexttable(pdf,2,1,-1,"12:30");	
	AddCellTexttable(pdf,2,1,-1,"13:00");
	pdf.addTable();
	
	//datos del total horas.
	pdf.createTable(2);
	pdf.setTableCellWidths(110,40);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1,"Total Horas");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,cstr(round(self.TOTALHORAS")))+"h"	
	AddCellTexttable(pdf,2,1,-1,"1.15"+" h");
	pdf.addTable();
	
	addNewLine(pdf);
	addNewLine(pdf);
	
	//datos del total.
	//calculos del subtotal
	pdf.createTable(2);	
	pdf.setTableCellWidths(110,40);
	pdf.setAlignment("left");
	//AddCellTexttable pdf,2,1,-1," Subtotal = " + cstr(round(self.TOTALHORAS"),2)) + "h * " + cstr(user("PRECIOHORA")) + cstr(user("MONEDA"))+ "/h ="	
	AddCellTexttable(pdf,2,1,-1," Subtotal = " + "1.15" + "h x " + "40 " + "?" + "/h ="	);
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"46 Eur");
	pdf.addTable();
	//calculos gastos
	pdf.createTable(2);
	pdf.setTableCellWidths(110,40);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Gastos");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"12 Eur");
	pdf.addTable();
	//calculos desplazamiento
	pdf.createTable(2);
	pdf.setTableCellWidths(110,40);
	pdf.setAlignment("left");
	//AddCellTexttable pdf,2,1,-1," Desplazamiento = " + cstr(round(self.UNIDADESDESPLAZ"),2)) + "Ud * " + cstr(user("PRECIOHORA")) + cstr(user("MONEDA"))+"/Ud ="	
	AddCellTexttable(pdf,2,1,-1," Desplazamiento = 1 Ud * 20 Eur/Ud =");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,cstr(round(self.UNIDADESDESPLAZ") * user("PRECIOHORA"),2))	+ cstr(user("MONEDA"))		
	AddCellTexttable(pdf,2,1,-1,"20 ?");
	pdf.addTable();
	
	pdf.createTable(1);
	pdf.setTableWidth(150);			
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,1,"");
	pdf.addTable(); 
	
	//total
	pdf.createTable(2);	
	pdf.setTableCellWidths(110,40);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," TOTAL ");
	pdf.setFontStyle("bold");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,cstr(round(self.MAP_TOTAL"),2)) + cstr(user("MONEDA"))	
	AddCellTexttable(pdf,2,1,-1,"78 ?");
	pdf.addTable();
	
	addNewLine(pdf);
	
	//CLIENTE QUE FIRMA
	pdf.createTable(2);
	pdf.setTableWidth(150);
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Cliente: ");
	pdf.setAlignment("right");
	//AddCellTexttable pdf,2,1,-1,self.NOMBRERECEPTOR")	
	AddCellTexttable(pdf,2,1,-1,"Antonio Rodriguez López");
	pdf.addTable(); 
	
	pdf.createTable(2);	
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," DNI: ");
	pdf.setAlignment("right");
	AddCellTexttable(pdf,2,1,-1,"08.123.456");
	pdf.addTable();
	
	pdf.createTable(1);	
	pdf.setTableWidth(150);
	pdf.setAlignment("left");
	AddCellTexttable(pdf,2,1,-1," Firma del cliente: ");
	pdf.addTable();
	
	pdf.createTable(1);
	pdf.setTableWidth(150);
	pdf.setCellBorder("none");
	pdf.setAlignment("left");
	//pdf.addCellImage(self.FIRMACLIENTE"),120,120
	//Si no especificamos una ruta para el fichero de imagen, lo busca en files.
	pdf.addCellImage("4b0a07e4-2213-47eb-83a1-e28d15662f0a.jpg",120,120);
	pdf.addTable();
	
	pdf.close();
	
	//Si queremos abrir el PDF una vez generado.
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}

async function CrearPdf_Factura (nameFile,pdf01,createGrid){
	ui.updateWaitDialog("Generando PDF...", 0);
	
	try{
	    pdf01.delete(nameFile);
	}catch(e){
	}
	
	
	pdf01.create(nameFile);
	pdf01.setEncryption("","1234","128bits");
	
	// INICIO CABECERA
	pdf01.beginHeader();
	
	pdf01.createTable(1);
	pdf01.setCellBorder("none");
	pdf01.setAlignment("left");
	pdf01.setTableCellWidths(100);
	//pdf01.addCellImage("logo_cabecera_pdf.png", 110, 40 //, 40,40
	pdf01.addImageSetXY("logo_cabecera_pdf.png", 86,750,80,40);
	
	//pdf01.setFont("courier");
	pdf01.setFontSize(15);
	pdf01.setFontColor("#0000AA");
	pdf01.setFontStyle("bold");
	
	pdf01.addCellText(" ");
	pdf01.addCellText("FACTURA:  123.123");
	pdf01.addCellText("23569   Cárnicas del Suroeste S.L.");
	pdf01.setFontSize(12);
	pdf01.setFontStyle("normal");
	pdf01.addCellText("CIF: 08.123.123    TLF: +34 123 123 456");
	pdf01.addCellText("La dirección del cliente, 34 A  06001");
	pdf01.addCellText("MERIDA  -  BADAJOZ");
	pdf01.addCellText("ESPAÑA");
	pdf01.addCellText("FECHA: 03/02/2015");
	pdf01.setFontSize(7);
	pdf01.addCellText("Bens constantes desta factura, colocados à disposição do adquirente nesta data");
	pdf01.addCellText(" ");
	pdf01.addTable();
      
  	pdf01.createTable(3);
  	pdf01.setTableWidth(250);
	pdf01.setTableCellWidths(25,20,55);
	
	pdf01.setCellBorder("all");
	pdf01.setAlignment("center");
	pdf01.addCellText("FACTURA","#EEEEEE");
	pdf01.addCellText("FECHA","#EEEEEE");
	pdf01.setAlignment("left");
	pdf01.addCellText("FORMA PAGO","#EEEEEE");

	pdf01.setAlignment("center");
	pdf01.addCellText("123.123");
	pdf01.addCellText("03/02/2015");
	pdf01.setAlignment("left");
	pdf01.addCellText("90 días");
    pdf01.addTableSetXY(90,700);

    //pdf01.addTableSetXY(90,820
      
    pdf01.setFont("helvetica");
	pdf01.setFontSize(8);
	pdf01.setFontColor("#0000AA");
	pdf01.createTable(7);
	pdf01.setTableCellWidths(10,40,10,10,10,10,10);
	
	pdf01.setCellBorder("none");
	pdf01.setCellBorder("left");
	pdf01.setCellBorder("top");
	pdf01.setCellBorder("bottom");
	pdf01.setAlignment("left");
	pdf01.addCellText("CODIGO","#EEEEEE");
	
	pdf01.setCellBorder("left");
	pdf01.setCellBorder("bottom");
	pdf01.setCellBorder("top");
	pdf01.addCellText("DESCRIPCION","#EEEEEE");
	pdf01.setAlignment("right");
	pdf01.addCellText("BULTOS","#EEEEEE");
	pdf01.addCellText("K/U","#EEEEEE");
	pdf01.addCellText("T.CANT","#EEEEEE");
	pdf01.addCellText("IMPORTE","#EEEEEE");
	
	pdf01.setCellBorder("left");
	pdf01.setCellBorder("right");
	pdf01.setCellBorder("bottom");
	pdf01.setCellBorder("top");
	pdf01.addCellText("TOTAL","#EEEEEE");
	pdf01.addTable();
	
    pdf01.endHeader();

	// FIN CABECERA
	
	// INICIO PIE
	pdf01.beginFooter();
	pdf01.createTable(1);
	pdf01.setTableWidth(418);
	pdf01.setCellBorder("none");
	pdf01.addCellImage("logo_pie_pdf.png", 600, 70);
	//pdf01.setFont("courier");
	pdf01.setAlignment("center");
	pdf01.setFontSize(10);
	pdf01.setFontStyle("normal");
	pdf01.setFontColor("#FFFFFF");
	var pagina = pdf01.getCurrentPage();
	pdf01.addCellText("PAG: " + pagina);
	//Esto sólo funcionará en el pie de página.
	//pdf01.ShowPageNumber, 300, 10
	//pdf01.addTable();
	pdf01.addTableSetXY(88,104);
	pdf01.endFooter();
	// FIN PIE
	
	pdf01.open();
 	ui.updateWaitDialog("Generando PDF...", 20);
	pdf01.newLine();

    //**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf01);
	}
	
	//pdf01.NewLine
	
	pdf01.setAlignment("left");
	pdf01.setFontSize(9);
	pdf01.setFontColor("#000000");
	pdf01.setCellBorder("none");
	//set coll=this.contents("DetallesFactura")
	//se hace fijo para no tener que adjuntar una base de datos con el ejemplo.
	var i = 0;
	//coll.loadall
	ui.updateWaitDialog("Generando PDF...", 40);
	//BULTOSTOTAL=0
	//for i=0 to coll.count-1
	for( i = 0; i < 59; i++){
		//set obj=coll(i)
			pdf01.createTable(7);
			pdf01.setTableCellWidths(10, 40, 10, 10, 10, 10 , 10);
			pdf01.setCellBorder("none");
			//if i=coll.count-1 then
			if( i == 59 || pdf01.getVerticalPosition() <= 130 ){  //Si es el ultimo registro ponemos la linea inferior
				pdf01.setCellBorder("left");
				pdf01.setAlignment("left");
				pdf01.setCellBorder("bottom");
				pdf01.addCellText("000" + i.toString());
				pdf01.setCellBorder("none");
				pdf01.setCellBorder("left");
				pdf01.setCellBorder("bottom");
				pdf01.addCellText("Pollo asado");
				pdf01.setAlignment("right");
				pdf01.addCellText("2.00");
				pdf01.addCellText("1.00");
				pdf01.addCellText("2.33");
				pdf01.addCellText("4.66");
				pdf01.setCellBorder("none");
				pdf01.setCellBorder("left");
				pdf01.setCellBorder("bottom");
				pdf01.setCellBorder("right");
				pdf01.addCellText("4.66");
				if ( pdf01.getVerticalPosition() < 130){
					pdf01.newPage();
				}
			}else{
			
				pdf01.setCellBorder("left");
				pdf01.setAlignment("left");
				pdf01.addCellText("000" + i.toString());
				//pdf01.setCellBorder("none"
				//pdf01.setCellBorder("left"
				pdf01.addCellText("Pollo asado al vacío"+ pdf01.getVerticalPosition().toString());
				pdf01.setAlignment("right");
				pdf01.addCellText("2.00");
				pdf01.addCellText("1.00");
				pdf01.addCellText("2.33");
				pdf01.addCellText("4.66");
				
				pdf01.setCellBorder("none");
				pdf01.setCellBorder("left");
				pdf01.setCellBorder("right");
				
				pdf01.addCellText("4.66");
			}
			//BULTOSTOTAL=BULTOSTOTAL + coll(i)("MAP_CANTIDAD")
		pdf01.addTable();
	}
	ui.updateWaitDialog("Generando PDF...", 90);
	//obj = null;
	//coll = null;
	
	pdf01.setFontSize(7);
	pdf01.setFontStyle("normal");
	pdf01.setFontColor("#000000");
	pdf01.addTextLine(" ");
	pdf01.addTextLine(" ");
	pdf01.addTextLine(" ");
	pdf01.addTextLine("Declaro pelo presente documento que os artigos adquiridos a XXXXXX. para su expediçiao que se descreve neste documento serão agravados mo destino pelo I.V.A. dada a minha condiçao de sujeto pasivo do I.V.A. em Portugal");
	pdf01.setFontSize(12);
	pdf01.setFontStyle("bold");
	pdf01.addTextLine(" ");
	pdf01.addText("EXENTO DE IVA ");
	pdf01.setFontSize(8);
	pdf01.setFontStyle("bold");
	pdf01.addText("Art. 25 de la Ley del IVA");
	pdf01.setFontSize(8);
	pdf01.setFontStyle("normal");
	pdf01.addText("           FORMA DE PAGO: ");
	pdf01.setFontSize(12);
	pdf01.setFontStyle("bold");
	pdf01.addTextLine("Efectivo");
	
	//pdf01.setFont("courier");
	pdf01.setFontSize(9);
	pdf01.setFontStyle("normal");
	pdf01.setFontColor("#0000AA");
	pdf01.addText("BULTOS: 60");
	
	pdf01.setFontSize(12);
	pdf01.setFontColor("#0000AA");
	pdf01.addTextSetX("TOTAL FACTURA: XXX.XX ?",350);
	
	
	pdf01.close();
 	ui.updateWaitDialog("Generando PDF...", 100);
 	
 	//Si queremos abrir el PDF una vez generado.
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf01.launchPDF();
	}
 	
	//pdf01.DecryptPDF "/mnt/sdcard/xone/testpdf01.pdf", "/mnt/sdcard/xone/testpdf01decrypt.pdf", "1234"
}

function getStrFill(stProp,stRelleno,nChar){
	var stCad = "";
	//Aquí obtenemos el valor del title del TL
	if( stProp.length < nChar){
		nChar = ( nChar - stProp.length ) * 2;
		stCad = stRelleno.repeat(nChar-1);
	}
	
	stCad = stProp + stCad;
	return stCad;
}

//Devolvemos "true" ó "false" como cadena según esté marcado ó no el check.
function getBoolStr(stProp){
	if( self[stProp] == 1){
		return "true";
	}else{
		return "false";
	}
}

function getEmptyFromNull (dataObject){
    return (dataObject == null) ? "" : dataObject;
}


//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto más facilmente.
//El documento es una grilla cuyo punto 0,0 es la ESQUINA INFERIOR IZQUIERDA.
//Para mejor desarrollo, activar showGridDebug(pdf)
//addNewLine(Pdf01) Añade una tabla de una línea vacía y sin bordes

var pdfGlobal;

async function GenerarPDFChecks(nameFile,pdf,createGrid){
    var i = 0;
	//Creamos el PDF, borramos si existe ya el fichero, le indicamos el nombre y la encriptación a utilizar
	//CreatePDF nameFile,pdf
	try{
	    pdf.delete(nameFile);
	}catch(e){
	}
	
	pdf.create(nameFile);
	pdf.permissions("assembly");
	pdf.permissions("print");
	pdf.setEncryption("", "1234", "128bits");

	pdf.open();
	
	pdf.setFont("gillsans.ttf");
	pdf.setFontStyle("normal");		
	pdf.setAlignment("center");	
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	
	//**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf);
	}
	
	//**********************************
	//       PRIMER RECUADRO
	// TEXTO INSPECCION
	// FSI-1.4 y V.1
	// LOGO
	// *********************************
	
	pdf.createTable(3);
	pdf.setTableWidth(415);
	pdf.setTableCellWidths(90,235,90);
	pdf.addCellText( (String.fromCharCode(10)+String.fromCharCode(13)).repeat(3) );
	
	pdf.setFontStyle("bold");		
	pdf.setFontColor("#FFFFFF");
	pdf.setFontSize(12);
	
	pdf.addCellText( String.fromCharCode(10) + "INSPECCION","#000000");
	pdf.setFontSize(10);
	pdf.setFontColor("#000000");
	pdf.addCellText("FSI-1.4" + String.fromCharCode(10) + String.fromCharCode(13) + "V.1");
	pdf.addTable();
	
	//Para dejar una separación, usamos una tabla sin bordes con la letra más o menos grande para haya más o menos separación
	pdf.setFontSize(2);
	addNewLine(pdf);
	pdf.setFontSize(10);

	//pdf.addRectangle(PosX, posY, Ancho, Alto, Grosor, ColorFondo, ColorLinea
	//Para la línea entre el FSI-1.4 y el V.1
	pdf.addRectangle(408, 786, 99, 0, 1, "#000000", "#000000");

	pdf.addImageSetXY("./icons/logo_xone.png", 118, 770, 30, 30);	
	
	
	//**********************************
	//      SEGUNDO RECUADRO
	// Servicio, Inspector, Fecha, Hora
	// Vigilantes asignados
	// *********************************
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);	
	pdf.setFontStyle("bold");
	
	//Tabla con el Servicio
	pdf.setAlignment("left");
	pdf.createTable(2);
	pdf.setTableWidth(415);
	pdf.setTableCellWidths(60,355);
	pdf.addCellText("SERVICIO");
	pdf.addCellText(getEmptyFromNull(self.CODSERVICIO));
	pdf.addTable();

	//Tabla con el Inspector, fecha y hora
	pdf.createTable(6);
	pdf.setTableWidth(415);
	pdf.setTableCellWidths(60,178,42,60,40,35);
	pdf.addCellText("INSPECTOR");
	pdf.setFontSize(7);
	pdf.addCellText(getEmptyFromNull(self.MAP_USUARIO));
	pdf.setFontSize(8);
	pdf.addCellText("FECHA");
	pdf.addCellText(getDate(self.FECHA));
	pdf.addCellText("HORA");
	pdf.addCellText(getEmptyFromNull(self.HORA));
	pdf.addTable();
		
	//Tabla con los vigilantes
	pdf.createTable(2);
	pdf.setTableWidth(415);
	pdf.setTableCellWidths(60,355);
	pdf.addCellText("V/S"+String.fromCharCode(10)+String.fromCharCode(13)+"ASIGNADOS");
	pdf.addCellText(" ");
	pdf.addTable();

	//Tabla "flotante" con los vigilantes asignados
	pdf.setCellBorder("all");
	pdf.setFontStyle("normal");			
	pdf.setAlignment("left");
	pdf.setFontSize(10);	
	pdf.createTable(2);
	pdf.setTableWidth(358);
	pdf.setTableCellWidths(179,179);
	pdf.addCellText("abcdefghijklmnñopqrstuvwxyz"); //,"#FF0000"
	pdf.addCellText("abcdefghijklmnñopqrstuvwxyz"); //,"#00FF00"
	pdf.addCellText("abcdefghijklmnñopqrstuvwxyz"); //,"#0000FF"
	pdf.addCellText("abcdefghijklmnñopqrstuvwxyz"); //,"#FF0000"
	
	//pdf.addTableSetXY(149,727);
	pdf.addTableSetXY(149,736);
	
	pdf.setFontSize(2);	
	addNewLine(pdf);

    // *************************************
    // *************************************
	// *****************************
	//  CONTROL DE DOCUMENTACION 1
	// *****************************

	//Nos quedamos con la posición donde se pinta la tabla contenedora para luego pintar todos los checks
	//relativos a ésta posición
	var posY = pdf.getVerticalPosition() - 10;
	var interlineado = 11;
	pdf.setCellBorder("all");
	pdf.setFontSize(8);		
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");
	
	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText(this.fieldPropertyValue("MAP_ETQ01","title"),"#EEEEEE" //"CONTROL DE DOCUMENTACIÓN"
	pdf.addCellText("CONTROL DE DOCUMENTACIÓN","#EEEEEE"); //"CONTROL DE DOCUMENTACIÓN"
	pdf.addCellText( (String.fromCharCode(10) + String.fromCharCode(13)).repeat(4) );
	pdf.addCellText( (String.fromCharCode(10) + String.fromCharCode(13)).repeat(5) );
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontSize(9);	
	pdf.setFontStyle("bold");
	pdf.createTable(8);
	
	//***** IMPORTANTE ******
	//Para poder poner una tabla	en una posición absoluta, hay que definir SetTableWidth 
	//y se le dice el ancho de la primera celda
	//***********************
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(220,25,25,25,79,20,20,20);
	pdf.setAlignment("center");
	pdf.addCellText(" "); //,"#FF0000"
	pdf.addCellText("SI"); //,"#00FF00"
	pdf.addCellText("NO"); //,"#0000FF"
	pdf.addCellText("N/A*"); //,"#FF0000"
	pdf.addCellText(" "); //,"#00FF00"
	pdf.addCellText("B"); //,"#0000FF"
	pdf.addCellText("M"); //,"#FF0000"
	pdf.addCellText("R"); //,"#00FF00"

	pdf.addTableSetXY(90,posY);

	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(8);
		
	for (i = 1; i <= 3; i++){
		i = parseInt(i);
		
		pdf.createTable(2);
		
		//***** IMPORTANTE ******
		//Para poder poner una tabla	en una posición absoluta, hay que definir SetTableWidth 
		//y se le dice el ancho de la primera celda
		//***********************
		
		pdf.setTableWidth(380);
		pdf.setTableCellWidths(380,100);

		//pdf.addCellText(getStrFill(this.fieldPropertyValue("MAP_ETQ01_"+i,"title"),".",40)
		pdf.addCellText(getStrFill("Lo que sea",".",40));
		pdf.addCellText("ESTADO");
		
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		
		
		pdf.addCheckboxSetXY(" ", 307, posY - interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 331, posY - interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_NO"), "true");
		pdf.addCheckboxSetXY(" ", 354, posY - interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_NA"), "true");
			
		switch (self["ESTADO"+i]) {
		    case "BIEN":
		        pdf.addCheckboxSetXY(" ", 452, posY - interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 471, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY - interlineado , 9, "check", "false", "true");
		        break;
		    case "MAL":
				pdf.addCheckboxSetXY(" ", 452, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY - interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 490, posY - interlineado , 9, "check", "false", "true");
		        break;
		    case "REGULAR":
				pdf.addCheckboxSetXY(" ", 452, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY - interlineado , 9, "check", "true", "true");
		        break;
		    default:
				pdf.addCheckboxSetXY(" ", 452, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY - interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY - interlineado , 9, "check", "false", "true");
		        break;
		}
	}
	
	// *****************************
	//  CONTROL DE DOCUMENTACION 2
	// *****************************
	
	posY = posY - 6;
	
	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(8);
	
	for ( i = 1; i <= 4; i++){ //Hay 4 registros
		i = parseInt(i);
		pdf.createTable(3);
		
		//***** IMPORTANTE ******
		//Para poder poner una tabla	en una posición absoluta, hay que definir SetTableWidth 
		//y se le dice el ancho de la primera celda
		//***********************
		
		pdf.setTableWidth(414);
		pdf.setTableCellWidths(402,110,78);

		//pdf.addCellText(getStrFill(this.fieldPropertyValue("MAP_ETQ01_"+cstr(i+3),"title"),".",40)
		pdf.addCellText(getStrFill("Lo que sea 2",".",40));
		
		switch (i.toString()) {
		    case "1":
				pdf.addCellText("Fecha última revisión");
				if ( getEmptyFromNull(self.FECHAUR4) == ""){
					pdf.addCellText("__ / __ / ____"); //,"#0000FF"
				}else{
					pdf.addCellText(getDate(self.FECHAUR4));
				}
		        break;
		    case "2":
				pdf.addCellText("Fecha última revisión");
				if ( getEmptyFromNull(self.FECHAUR5) == ""){
					pdf.addCellText("__ / __ / ____"); //,"#0000FF"
				}else{					
					pdf.addCellText(getDate(self.FECHAUR5));
				}
		        break;
		    default:
				pdf.addCellText("");
				pdf.addCellText("");
		        break;
		}
		
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
			
		pdf.addCheckboxSetXY(" ", 307, posY-interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 331, posY-interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_NO"), "true");
		pdf.addCheckboxSetXY(" ", 354, posY-interlineado , 9, "check", getBoolStr("MAP_01_"+i+"_NA"), "true");
			
	}


	// *****************************
	// REVISION DE MEDIOS AUXILIARES
	// *****************************

	posY = pdf.getVerticalPosition() - 10;
	interlineado = 12;
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);		
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");

	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText( this.fieldPropertyValue("MAP_ETQ02","title"),"#EEEEEE" //"REVISIÓN DE MEDIOS AUXILIARES"
	pdf.addCellText( "REVISIÓN DE MEDIOS AUXILIARES","#EEEEEE"); //"REVISIÓN DE MEDIOS AUXILIARES"
	pdf.addCellText( (String.fromCharCode(10) + String.fromCharCode(13)).repeat(9));
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontSize(9);	
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.createTable(4);
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(324,30,30,30);

	pdf.addCellText(""); //,"#FF0000"
	pdf.addCellText("SI"); //,"#FF0000"
	pdf.addCellText("NO"); //,"#00FF00"
	pdf.addCellText("N/A*"); //,"#0000FF"

	pdf.addTableSetXY(90,posY);
	
	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	
	for( i = 1; i <= 6; i++){
		i = parseInt(i);
		pdf.createTable(1);
		pdf.setTableWidth(414 );
		//pdf.addCellText(getStrFill(this.fieldPropertyValue("MAP_ETQ02_"+i,"title"),".",80)
		pdf.addCellText(getStrFill("Lo que sea 3",".",80));
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		//pdf.addTable();
		
		pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", getBoolStr("MAP_02_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", getBoolStr("MAP_02_"+i+"_NO"), "true");
		pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", getBoolStr("MAP_02_"+i+"_NA"), "true");
	}

		
	// ********************************
	// CUMPLIMIENTO CODIGO DEONTOLOGICO
	// ********************************

	posY = pdf.getVerticalPosition() - 10;
	interlineado = 12;

	pdf.setCellBorder("all");
	pdf.setFontSize(8);	
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");

	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText( this.fieldPropertyValue("MAP_ETQ03","title"),"#EEEEEE" //"CUMPLIMIENTO DEONTOLÓGICO"
	pdf.addCellText( "CUMPLIMIENTO DEONTOLÓGICO","#EEEEEE"); //"CUMPLIMIENTO DEONTOLÓGICO"
	pdf.addCellText((String.fromCharCode(10)+String.fromCharCode(13)).repeat(3));
	pdf.addTable();
	
	
	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");	
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.setFontSize(9);
	pdf.createTable(8);	
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(157,20,20,20,157,20,20,20);
	pdf.addCellText(" "); //,"#FF0000"
	pdf.addCellText("B"); //,"#00FF00"
	pdf.addCellText("M"); //,"#0000FF"
	pdf.addCellText("R"); //,"#FF0000"
	pdf.addCellText(" "); //,"#00FF00"
	pdf.addCellText("B"); //,"#0000FF"
	pdf.addCellText("M"); //,"#FF0000"
	pdf.addCellText("R"); //,"#00FF00"

	pdf.addTableSetXY(90,posY); 
	
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	
	var j;
	for ( i = 1; i <= 2; i++){ //Son 4, pero al estar en 2 columnas los vamos a hacer de 2 en 2
		i = parseInt(i);
		j = parseInt( i * 2 + 2);
		pdf.createTable(2);
		//***** IMPORTANTE ******
		//Para poder poner una tabla	en una posición absoluta, hay que definir SetTableWidth 
		//y se le dice el ancho de la primera celda
		//***********************
		pdf.setTableWidth(400 );
		pdf.setTableCellWidths(210,190);

		//ESTADO4, ESTADO5, ESTADO6 y ESTADO7
		//pdf.addCellText(getStrFill(this.fieldPropertyValue("ESTADO"+cstr(i*2+2),"title"),".",34)
		pdf.addCellText(getStrFill("Aa",".",34));
		//pdf.addCellText(getStrFill(this.fieldPropertyValue("ESTADO"+cstr(i*2+3),"title"),".",34)
		pdf.addCellText(getStrFill("Bb",".",34));
		
		posY = posY - interlineado;
		pdf.addTableSetXY(96,posY);
		
		switch (self["ESTADO" + j.toString()]) {
		    case "BIEN":
				pdf.addCheckboxSetXY(" ", 245, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 264, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 283, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "MAL":
				pdf.addCheckboxSetXY(" ", 245, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 264, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 283, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "REGULAR":
				pdf.addCheckboxSetXY(" ", 245, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 264, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 283, posY-interlineado , 9, "check", "true", "true");
		        break;
		    default:
				pdf.addCheckboxSetXY(" ", 245, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 264, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 283, posY-interlineado , 9, "check", "false", "true");
		        break;
		}
		
		j++;
		
		switch (self["ESTADO" + j.toString()]) {
		    case "BIEN":
				pdf.addCheckboxSetXY(" ", 452, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 471, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "MAL":
				pdf.addCheckboxSetXY(" ", 452, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 490, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "REGULAR":
				pdf.addCheckboxSetXY(" ", 452, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY-interlineado , 9, "check", "true", "true");
		        break;
		    default:
				pdf.addCheckboxSetXY(" ", 452, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 471, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 490, posY-interlineado , 9, "check", "false", "true");
		        break;
		}
		
	}
	
	
	// ****************************
	//     CONTROL OPERACIONAL
	// ****************************

	posY = pdf.getVerticalPosition() - 10;
	interlineado = 12;
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);		
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");

	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText(this.fieldPropertyValue("MAP_ETQ04","title"),"#EEEEEE" //"CONTROL OPERACIONAL"
	pdf.addCellText("CONTROL OPERACIONAL","#EEEEEE"); //"CONTROL OPERACIONAL"
	pdf.addCellText((String.fromCharCode(10)+String.fromCharCode(13)).repeat(12));
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.setFontSize(9);
	pdf.createTable(4);	
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(324,30,30,30);
	pdf.addCellText(""); //,"#FF0000"
	pdf.addCellText("SI"); //,"#FF0000"
	pdf.addCellText("NO"); //,"#00FF00"
	pdf.addCellText("N/A*"); //,"#0000FF"

	pdf.addTableSetXY(90,posY);
	
	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
		
	for ( i = 1; i <= 8; i++){
		i = parseInt(i);
		pdf.createTable(1);
		pdf.setTableWidth(414);

		//pdf.addCellText(getStrFill(this.fieldPropertyValue("MAP_ETQ04_"+i,"title"),".",80)
		pdf.addCellText(getStrFill("Lo que sea 4",".",80));
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		
		pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", getBoolStr("MAP_04_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", getBoolStr("MAP_04_"+i+"_NO"), "true");
		pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", getBoolStr("MAP_04_"+i+"_NA"), "true");
	}

	
    // *******************************
    // EVALUACION EFICACIA Y FORMACION  
    // *******************************

	posY = pdf.getVerticalPosition() - 9;
	interlineado = 12;
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);	
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");
	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText( this.fieldPropertyValue("MAP_ETQ05","title"),"#EEEEEE" //"EVALUACIÓN EFICACIA Y FORMACIÓN"
	pdf.addCellText("EVALUACIÓN EFICACIA Y FORMACIÓN","#EEEEEE"); //"EVALUACIÓN EFICACIA Y FORMACIÓN"
	pdf.addCellText((String.fromCharCode(10)+String.fromCharCode(13)).repeat(3));
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.setFontSize(9);
	pdf.createTable(4);	
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(324,30,30,30);
	pdf.addCellText(""); //,"#FF0000"
	pdf.addCellText("MB"); //,"#FF0000"
	pdf.addCellText("B"); //,"#00FF00"
	pdf.addCellText("R"); //,"#0000FF"

	pdf.addTableSetXY(90,posY);

	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	
	for( i = 8; i <= 9; i++){ //ESTADO8 y ESTADO9
		i = parseInt(i);
		pdf.createTable(1);
		pdf.setTableWidth(414 );
		//pdf.addCellText(getStrFill(this.fieldPropertyValue("ESTADO"+i,"title"),".",80)
		pdf.addCellText(getStrFill("Lo que sea 5",".",80));
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		
		switch (self["ESTADO"+i]) {
		    case "MUY BIEN":
				pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "BIEN":
				pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", "true", "true");
				pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", "false", "true");
		        break;
		    case "REGULAR":
				pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", "true", "true");
		        break;
		    default:
				pdf.addCheckboxSetXY(" ", 425, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 456, posY-interlineado , 9, "check", "false", "true");
				pdf.addCheckboxSetXY(" ", 485, posY-interlineado , 9, "check", "false", "true");
		        break;
		}
	}
	
    // *****************************
    //  INSTRUCCIONES DE EMERGENCIA
    // *****************************

	posY = pdf.getVerticalPosition() - 10;
	interlineado = 12;
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);	
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");
	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText( this.fieldPropertyValue("MAP_ETQ06","title"),"#EEEEEE" //"INSTRUCCIONES DE EMERGENCIA"
	pdf.addCellText( "INSTRUCCIONES DE EMERGENCIA","#EEEEEE"); //"INSTRUCCIONES DE EMERGENCIA"
	pdf.addCellText( (String.fromCharCode(10)+String.fromCharCode(13)).repeat(6) );
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontSize(9);
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.createTable(3);
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(334,40,40);
	pdf.addCellText(""); //,"#FF0000"
	pdf.addCellText("SI"); //,"#00FF00"
	pdf.addCellText("NO"); //,"#0000FF"

	pdf.addTableSetXY(90,posY);

	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	
	for ( i = 1; i <= 4; i++){
		i = parseInt(i);
		pdf.createTable(1);
		pdf.setTableWidth(414 );
		//pdf.addCellText(getStrFill(this.fieldPropertyValue("MAP_ETQ06_"+i,"title"),".",80)
		pdf.addCellText(getStrFill("Lo que sea 6",".",80));
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		
		pdf.addCheckboxSetXY(" ", 440, posY-interlineado , 9, "check", getBoolStr("MAP_06_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 480, posY-interlineado , 9, "check", getBoolStr("MAP_06_"+i+"_NO"), "true");
	}
	
    // *****************************
    //    PREVENCION DE RIESGOS
    // *****************************

	posY = pdf.getVerticalPosition() - 11;
	interlineado = 12;
	
	pdf.setCellBorder("all");
	pdf.setFontSize(8);	
	pdf.setFontStyle("normal");
	pdf.setAlignment("left");

	pdf.createTable(1);
	pdf.setTableWidth(750);
	pdf.setFont("frutiger.ttf");
	//pdf.addCellText( this.fieldPropertyValue("MAP_ETQ07","title"),"#EEEEEE" //"PREVENCIÓN DE RIESGOS"
	pdf.addCellText( "PREVENCIÓN DE RIESGOS","#EEEEEE"); //"PREVENCIÓN DE RIESGOS"
	pdf.addCellText((String.fromCharCode(10)+String.fromCharCode(13)).repeat(11));
	pdf.addTable();

	pdf.setFont("gillsans.ttf");
	pdf.setCellBorder("none");
	pdf.setFontStyle("bold");
	pdf.setAlignment("center");
	pdf.setFontSize(9);
	pdf.createTable(4);	
	pdf.setTableWidth(414);
	pdf.setTableCellWidths(351,18,20,25);
	pdf.addCellText(""); //,"#FF0000"
	pdf.addCellText("SI"); //,"#00FF00"
	pdf.addCellText("NO"); //,"#0000FF"
	pdf.addCellText("N/A*"); //,"#FF0000"

	pdf.addTableSetXY(90,posY);

	pdf.setFontStyle("normal");		
	pdf.setAlignment("left");
	pdf.setFontColor("#000000");
	pdf.setFontSize(9);
	for( i = 1; i <= 6; i++){
		i = parseInt(i);

		pdf.createTable(1);
		pdf.setTableWidth(414);
		
		var texto = "";
		
		switch (i.toString()) {
		    case "1":
				pdf.addCellText("¿Existe en el Servicio la evaluación de riesgos y la planificación de actividad preventiva?");
				posY = posY - interlineado;
				pdf.addTableSetXY(90,posY);
				pdf.createTable(1);
				pdf.setTableWidth(414);
				texto = "¿Se evidencian las Firmas de Entrega de dichos documentos por los Trabajadores?";
		        break;
		    case "2":
				texto = self.fieldPropertyValue("MAP_ETQ07_2","title") + " " + self.fieldPropertyValue("MAP_ETQ07_21","title");
		        break;
		    case "6":
				texto = self.fieldPropertyValue("MAP_ETQ07_6","title") + " " + self.fieldPropertyValue("MAP_ETQ07_61","title");
		        break;
		    default:
				texto = "¿Se evidencian las Firmas de Entrega de dichos documentos por los Trabajadores?";
		        break;
		}
		
		pdf.addCellText(getStrFill(texto,".",85));
		
		posY = posY - interlineado;
		pdf.addTableSetXY(90,posY);
		
		pdf.addCheckboxSetXY(" ", 445, posY-interlineado , 9, "check", getBoolStr("MAP_07_"+i+"_SI"), "true");
		pdf.addCheckboxSetXY(" ", 466, posY-interlineado , 9, "check", getBoolStr("MAP_07_"+i+"_NO"), "true");
		pdf.addCheckboxSetXY(" ", 487, posY-interlineado , 9, "check", getBoolStr("MAP_07_"+i+"_NA"), "true");
	}

	pdf.setFontSize(8);
	pdf.setCellBorder("none");
	pdf.createTable(2);
	pdf.setTableWidth(410);
	pdf.setTableCellWidths(40,380);
	pdf.addCellText(" ");
	pdf.addCellText("*N/A no aplicable"); //,"#00FF00"
	
	pdf.addTable();

	
    // *****************************
    //            FIRMAS
    // *****************************

	pdf.setCellBorder("all");
	pdf.setFontSize(9);	
	pdf.setFontStyle("bold");
	pdf.setAlignment("left");
	pdf.createTable(3);
	pdf.setTableCellWidths(220,220,220);
	pdf.addCellText("Firma Inspector" + String.fromCharCode(10) + String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13));
	pdf.addCellText("Firma Jefe de Equipo/R. Turno"+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13));
	pdf.addCellText("Firma Jefe de Servicio/Delegado"+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13)+String.fromCharCode(10)+String.fromCharCode(13));

	pdf.addTable();

	//Si no especificamos una ruta para el fichero de imagen, lo busca en files.
	if ( getEmptyFromNull(self.FIRMA1).length > 0){
		pdf.addImageSetXY(getEmptyFromNull(self.FIRMA1),125,32, 50, 50);
	}

	if ( getEmptyFromNull(self.FIRMA2).length > 0){
		pdf.addImageSetXY(getEmptyFromNull(self.FIRMA2),265,32, 50, 50);
	}
	
	if ( getEmptyFromNull(self.FIRMA3).length > 0 ){
		pdf.addImageSetXY(getEmptyFromNull(self.FIRMA3),410,32, 50, 50);
	}
	
	pdf.close();
	//Si queremos abrir el PDF una vez generado.
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}

function setTextStyle(Pdf01,stfont,ststyle,stalign,stsize,stcolor){
	//Pdf01.setFont(stfont	
	Pdf01.setFont("Roboto-Regular.ttf");
	Pdf01.setFontStyle(ststyle);		
	Pdf01.setAlignment(stalign);
	Pdf01.setFontColor(stcolor);
	
	//if stsize=10 then stsize=11
	Pdf01.setFontSize(stsize);
}


//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto más facilmente.
//El documento es una grilla cuyo punto 0,0 es la ESQUINA INFERIOR IZQUIERDA.
//Para mejor desarrollo, activar showGridDebug(pdf)
//addNewLine(Pdf01) Añade una tabla de una línea vacía y sin bordes

async function GenerarPDF3(nameFile,pdf,createGrid){
	
	//Creamos el PDF, borramos si existe ya el fichero, le indicamos el nombre y la encriptación a utilizar
	//CreatePDF nameFile,pdf
	try{
	    pdf.delete(nameFile);
	}catch(e){
	}
	
	pdf.create(nameFile);
	pdf.permissions("assembly");
	pdf.permissions("print");
	pdf.setEncryption("", "1234", "128bits");

	pdf.open();
	
	
	setTextStyle(pdf,"gillsans.ttf","normal","center",14,"#000000");

	//pdf.setFont("gillsans.ttf"	
	//pdf.setFontStyle("normal"			
	//pdf.setAlignment("center"	
	//pdf.setFontColor("#000000"
	//pdf.setFontSize(normal
	
	//**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf);
	}
	
	//**********************************
	//	INICIALIZAMOS VALORES
	//**********************************
	
	var margenIzq = 46;
	var margenDcho = 546;
	var margenSup = 810;

	//**********************************
	//       CABECERA
	// LOGO		TITULO		
	// *********************************
	
	//**********************************
	//       	SOLICITUD
	// *********************************	
	margenSup = margenSup - 70; //Bajamos 70
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","bold","center",14,"#000000");
	pdf.addCellText("SOLICITUD","#FFFFFF");
	setTextStyle(pdf,"gillsans.ttf","normal","center",10,"#000000");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	
	//Para dejar una separación, usamos una tabla sin bordes con la letra más o menos grande para haya más o menos separación
    //	pdf.setFontSize(2			
    //	addNewLine(pdf)
    //	pdf.setFontSize(10			


	//**********************************
	//       	ACTIVO FISICO
	// *********************************	
	//Primero hacemos una tabla con 2 columnas y luego hacemos otra con 2 filas más adelante para ponerla sobre la segunda columna
	
	margenSup = margenSup - 20; //Bajamos 20 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("ACTIVO FISICO","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","center",10,"#000000");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	
	//Ahora la tabla con las 2 filas de la segunda columna
	margenSup = margenSup - 16; //Bajamos

	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all"); 
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" Denominación: " + " ");
	pdf.addCellText(" Codigo Identificación (KKS): " + " ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	lo ponemos 100 más adelante para que salga en la segunda columna.


	//**********************************
	//SOLICITANTE Y EJECUTOR
	//**********************************
	
	margenSup = margenSup - 28; //Bajamos 
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(50,50);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" Solicitante (Nombre y Area):" + String.fromCharCode(13) + " " + " " + (String.fromCharCode(13)).repeat(1));
	pdf.addCellText(" Ejecutor (Nombre):"+ String.fromCharCode(13)+ " " + " ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY

	//**********************************
	//ALCANCE ORDEN y ALCANCE OPERACION
	//**********************************
	
	margenSup = margenSup - 34; //Bajamos 
	
	//tabla vacía para poder dejar el espacio fijo
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("ALCANCE ORDEN","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText((String.fromCharCode(13)).repeat(5));
	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("ALCANCE OPERACION","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText((String.fromCharCode(13)).repeat(5));
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	margenSup = margenSup - 15; //Bajamos solo un poco para dejar el titulo
	//otra tabla en la misma posición para poner el texto 
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none"); 
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9);
	pdf.addCellText(" ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	margenSup = margenSup - 75; 
	//otra tabla en la misma posición para poner el texto 
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9);
	pdf.addCellText(" ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	//**********************************
	//FECHAS
	//**********************************
	
	margenSup = margenSup - 58; //Bajamos 
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all"); 
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(50,50);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" Fecha Requerida: " + " ");
	pdf.addCellText(" Duración prevista: " + " ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	
	//**********************************
	// PROCEDIMIENTO ASOCIADO
	//**********************************

	margenSup = margenSup - 14; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText(" PROCEDIMIENTO ASOCIADO: " + " " +String.fromCharCode(13) + " " + " ");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	//**********************************
	// TRABAJO CON RIESGO ESPECIAL
	//**********************************
	margenSup = margenSup - 22; //Bajamos 
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(80,20);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("TRABAJO CON RIESGO ESPECIAL","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" ".repeat(9)+"SI" + " ".repeat(11) + "NO");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+412, margenSup-13 , 10, "check", "true", "true");
	pdf.addCheckboxSetXY(" ", margenIzq+451, margenSup-13 , 10, "check", "false", "true");

	margenSup = margenSup - 16; //Bajamos 
	
	pdf.createTable(3);  //Num columnas	
	pdf.setCellBorder("all"); 
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(34,33,33);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" ".repeat(7) + "Eléctrico");
	pdf.addCellText(" ".repeat(7) + "Trabajos en altura");
	pdf.addCellText(" ".repeat(7) + "Trabajos en zanjas");
	
	pdf.addCellText(" ".repeat(7) + "Espacios confinados");
	pdf.addCellText(" ".repeat(7) + "Presencia de gas");
	pdf.addCellText(" ".repeat(7) + "");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+6, margenSup-12 , 10, "check", "true", "true"); //CHECK Electrico
	
	pdf.addCheckboxSetXY(" ", margenIzq+176, margenSup-12 , 10, "check", "true", "true"); //CHECK Trabajos en altura
	
	pdf.addCheckboxSetXY(" ", margenIzq+342, margenSup-12 , 10, "check", "true", "true"); //CHECK Trabajos en zanjas
	
	pdf.addCheckboxSetXY(" ", margenIzq+6, margenSup-26 , 10, "check", "true", "true"); //CHECK Espacios confinados
	
	pdf.addCheckboxSetXY(" ", margenIzq+176, margenSup-26 , 10, "check", "true", "true"); //CHECK Presencia de gas
	
	//pdf.addCheckboxSetXY(" ", margenIzq+342, margenSup-26 , 10, "check", "false", "true" //CHECK pa luego

	//**********************************
	//Observaciones, precauciones...
	//**********************************
	margenSup = margenSup - 28; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all"); 
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" Observaciones, precauciones y protección adicionales: "+ String.fromCharCode(13) +  " " + " "+ String.fromCharCode(13));
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	//**********************************
	//NOTA
	//**********************************
	margenSup = margenSup - 45; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","center",9,"#FF0000");
	pdf.addCellText("NOTA: SI SE MODIFICAN O AMPLIAN LAS ACTIVIDADES DESCRITAS EN EL ALCANCE DEL TRABAJO SERÁ NECESARIO REVISAR ESTE PERMISO ANTES DE CONTINUAR CON LOS TRABAJOS");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	


	//**********************************
	// REQUERIMIENTOS
	//**********************************
	margenSup = margenSup - 34; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("REQUERIMIENTOS","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	//**********************************
	//Descargo y Pruebas
	//**********************************
	margenSup = margenSup - 16; //Bajamos 
	
	pdf.createTable(4);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(20,30,20,30);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" DESCARGO");
	pdf.addCellText( " ".repeat(7) + "SI" + " ".repeat(11) + "NO");
	pdf.addCellText(" PRUEBAS");
	pdf.addCellText( " ".repeat(7) + "SI" + " ".repeat(11) + "NO");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+110, margenSup-12 , 10, "check", "true", "true"); //CHECK SI DESCARGO
	pdf.addCheckboxSetXY(" ", margenIzq+150, margenSup-12 , 10, "check", "false", "true"); //CHECK NO DESCARGO
	
	pdf.addCheckboxSetXY(" ", margenIzq+360, margenSup-12 , 10, "check", "true", "true"); //CHECK SI PRUEBAS
	pdf.addCheckboxSetXY(" ", margenIzq+400, margenSup-12 , 10, "check", "false", "true"); //CHECK NO PRUEBAS
	
	
	//**********************************
	//Observaciones
	//**********************************
	margenSup = margenSup - 14; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	pdf.addCellText(" Observaciones:"+(String.fromCharCode(13)).repeat(5));
			
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	margenSup = margenSup - 13; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText(" " + " ");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	

	//********************************************************************
	// CONDICIONES DEL SISTEMA REQUERIDAS POR MANTENIMIENTO
	//********************************************************************
	margenSup = margenSup - 51; //Bajamos 
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(80,20);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("CONDICIONES DEL SISTEMA REQUERIDAS POR MANTENIMIENTO","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" ".repeat(8)+"SI"+" ".repeat(11)+"NO");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+412, margenSup-13 , 10, "check", "true", "true"); //CHECK SI
	pdf.addCheckboxSetXY(" ", margenIzq+451, margenSup-13 , 10, "check", "false", "true"); //CHECK NO

	margenSup = margenSup - 16; //Bajamos 
	
	pdf.createTable(3);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(34,33,33);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" ".repeat(7)+ "Drenado");
	pdf.addCellText(" ".repeat(7)+ "Despresurizado");
	pdf.addCellText(" ".repeat(7)+ "Bloqueado Mecánicamente");
	
	pdf.addCellText(" ".repeat(7)+ "Barrido");
	pdf.addCellText(" ".repeat(7)+ "Inertizado");
	pdf.addCellText(" ".repeat(7)+ "Bloqueado Eléctricamente");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+6, margenSup-12 , 10, "check", "true", "true"); //CHECK Drenado
	
	pdf.addCheckboxSetXY(" ", margenIzq+176, margenSup-12 , 10, "check", "true", "true"); //CHECK Despresurizado
	
	pdf.addCheckboxSetXY(" ", margenIzq+342, margenSup-12 , 10, "check", "true", "true"); //CHECK Bloqueado Mecánicamente
	
	pdf.addCheckboxSetXY(" ", margenIzq+6, margenSup-26 , 10, "check", "true", "true"); //CHECK Barrido
	
	pdf.addCheckboxSetXY(" ", margenIzq+176, margenSup-26 , 10, "check", "true", "true"); //CHECK Inertizado
	
	pdf.addCheckboxSetXY(" ", margenIzq+342, margenSup-26 , 10, "check", "true", "true"); //CHECK Bloqueado Eléctricamente
	
	
	//**********************************
	//Observaciones
	//**********************************
	margenSup = margenSup - 28; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10);
	pdf.addCellText(" Observaciones, precauciones y protección adicionales: " + (String.fromCharCode(13)).repeat(5));

	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	margenSup = margenSup - 13; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText(" " + " ");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	//********************************************************************
	// ENTREGA DEL SISTEMA EN LAS CONDICIONES REQUERIDAS
	//********************************************************************
	margenSup = margenSup - 51; //Bajamos 
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(80,20);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("ENTREGA DEL SISTEMA EN LAS CONDICIONES REQUERIDAS","#CCCCCC");
	setTextStyle(pdf,"gillsans.ttf","normal","left",10,"#000000");
	pdf.addCellText(" ".repeat(9)+"SI"+" ".repeat(11)+"NO");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	

	pdf.addCheckboxSetXY(" ", margenIzq+412, margenSup-13 , 10, "check",  "true", "true"); //CHECK SI
	pdf.addCheckboxSetXY(" ", margenIzq+451, margenSup-13 , 10, "check",  "false", "true"); //CHECK NO

	//**********************************
	//Observaciones
	//**********************************
	margenSup = margenSup - 16; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",10);
	pdf.addCellText(" Observaciones: "+(String.fromCharCode(13)).repeat(5));
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	
	margenSup = margenSup - 13; //Bajamos 
	
	pdf.createTable(1);  //Num columnas	
	pdf.setCellBorder("none");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(100);

	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText(" " + " "); 
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY	
	
	//************************************************************		******************************************
	//************************************************************		******************************************

	//    						Ponemos celdas vacías para pasar a la hoja siguiente
	
	//************************************************************		******************************************
	// ***********************************************************		******************************************	

	pdf.createTable(1);
	pdf.setCellBorder("none");
	pdf.addCellText(" "+(String.fromCharCode(13)).repeat(85));
	pdf.addTable();
	

	//**********************************
	//       CABECERA 2
	// LOGO		TITULO		
	// *********************************
	setTextStyle(pdf,"gillsans.ttf","normal","center",14,"#000000");
	
	margenIzq 	= 46;
	margenDcho 	= 546;
	margenSup	= 810;
	
	
	//Esta tabla al pintarse no actualiza pdf.GetVerticalPosition porque se pinta "flotando" encima del documento
	//El alto de las celdas viene determinado por su contenido, si queremos más alto poner más String.fromCharCode(10)+String.fromCharCode(13)
	pdf.createTable(3);  //Num columnas
	
	// Muy importante, a la hora de hacer una tabla posicionada de forma absoluta
	// es necesario definir previamente el ancho de la tabla.
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(20,55,25);  //La suma debe ser 100, pues son porcentajes
	pdf.addCellText((String.fromCharCode(10)).repeat(3));
	
	setTextStyle(pdf,"gillsans.ttf","bold","center",16,"#000000");
	pdf.addCellText(String.fromCharCode(13)+"Central Termosolar " + " ","#FFFFFF");
	
	setTextStyle(pdf,"gillsans.ttf","normal","center",10,"#000000");
	pdf.addCellText(String.fromCharCode(13)+"MECANICO"+(String.fromCharCode(13)).repeat(2)+"Nº OT: 4065833  -  0010","#99FF99");
	
	pdf.addTableSetXY(margenIzq,margenSup);	//EjeX, EjeY
	
	//Para la línea entre el puesto de trabajo y el numero de OT
	//pdf.addRectangle(EjeX, EjeY, Long, 0, 1, "ColorIni", "ColorFin"
	pdf.addRectangle(421, 780, 125, 0, 1, "#000000", "#000000");
	

	//**********************************
	//       	FIRMAS
	// *********************************		
	margenSup = margenSup - 90; //Bajamos
	
	pdf.createTable(2);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(500);
	pdf.setTableCellWidths(50,50);

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("FIRMAS DE APERTURA","#CCCCCC");
	pdf.addCellText("CONFORME","#CCCCCC");
	

	setTextStyle(pdf,"gillsans.ttf","normal","left",8,"#000000");
	
	pdf.addCellText((String.fromCharCode(13)).repeat(10) + " Ejecutor / Nombre / Fecha / Hora");
	
	pdf.addCellText((String.fromCharCode(13)).repeat(10) + " Supervisor de turno / Nombre / Fecha / Hora");
	

	setTextStyle(pdf,"gillsans.ttf","normal","left",12,"#000000");
	pdf.addCellText("TRABAJO FINALIZADO","#CCCCCC");
	pdf.addCellText("CONFORME","#CCCCCC");
	
	setTextStyle(pdf,"gillsans.ttf","normal","left",8,"#000000");
	
	pdf.addCellText((String.fromCharCode(13)).repeat(10) + " Ejecutor / Nombre / Fecha / Hora");
	
	pdf.addCellText((String.fromCharCode(13)).repeat(10) + " Supervisor de turno / Nombre / Fecha / Hora");
	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	
	
	//**********************************
	//       TEXTO PIE FINAL
	// *********************************		
	//margenSup = margenSup - 190 //Bajamos
	
	//pdf.createTable(1  //Num columnas	
	//pdf.setCellBorder("none" 
	//pdf.setTableWidth(500
	//pdf.setTableCellWidths(100 

	//setTextStyle(pdf,"gillsans.ttf","normal","center",12,"#000000"
	//pdf.addCellText("TELEFONO SALA CONTROL MAN1"+String.fromCharCode(13)+String.fromCharCode(13)+"682 127 278"

	//pdf.addTableSetXY(margenIzq, margenSup	//EjeX, EjeY
	
	pdf.close();
	
	//Si queremos abrir el PDF una vez generado.
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}

//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto más facilmente.
//El documento es una grilla cuyo punto 0,0 es la ESQUINA INFERIOR IZQUIERDA.
//Para mejor desarrollo, activar showGridDebug(pdf)
//addNewLine(Pdf01) Añade una tabla de una línea vacía y sin bordes

async function GenerarPDF3Apaisado(nameFile,pdf,createGrid){
	var cDesca, objDesca;

	//Creamos el PDF, borramos si existe ya el fichero, le indicamos el nombre y la encriptación a utilizar
	//CreatePDF nameFile,pdf
	try{
	    pdf.delete(nameFile);
	}catch(e){
	}
	
	pdf.create(nameFile,865,600);
	pdf.permissions("assembly");
	pdf.permissions("print");
	pdf.setEncryption("", "1234", "128bits");

	pdf.open();
	
	//**************************************************************
	// Muestra una rejilla de ayuda para posicionar cosas en el PDF
	//**************************************************************
	if(createGrid == 1){
	    showGridDebug(pdf);
	}
	
	
	setTextStyle(pdf,"gillsans.ttf","normal","center",14,"#000000");

	//pdf.setFont("gillsans.ttf"	
	//pdf.setFontStyle("normal"			
	//pdf.setAlignment("center"	
	//pdf.setFontColor("#000000"
	//pdf.setFontSize(normal
	
	//**********************************
	//	INICIALIZAMOS VALORES
	//**********************************
	
	var margenIzq 	= 20;
	var margenDcho 	= 845;
	var margenSup	= 600; //es apaisado

	//**********************************
	//       CABECERA
	// LOGO		TITULO		
	// *********************************
	
	//Esta tabla al pintarse no actualiza pdf.GetVerticalPosition porque se pinta "flotando" encima del documento
	//El alto de las celdas viene determinado por su contenido, si queremos más alto poner más String.fromCharCode(10)+String.fromCharCode(13)
	margenSup = margenSup - 25; //Bajamos
	pdf.createTable(3);  //Num columnas
	pdf.setCellBorder("none"); 
	
	// Muy importante, a la hora de hacer una tabla posicionada de forma absoluta
	// es necesario definir previamente el ancho de la tabla.
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(10,80,10); //La suma debe ser 100, pues son porcentajes
	pdf.addCellText((String.fromCharCode(10)).repeat(3));
	
	setTextStyle(pdf,"gillsans.ttf","bold","center",16,"#000000");
	pdf.addCellText(String.fromCharCode(13)+"Central Termosolar " + " ","#FFFFFF");
	
	pdf.addCellText(" ");
	
	pdf.addTableSetXY(margenIzq,margenSup);	//EjeX, EjeY
	
	//Para la línea entre el puesto de trabajo y el numero de OT
	//pdf.addRectangle(EjeX, EjeY, Long, 0, 1, "ColorIni", "ColorFin"
	//pdf.addRectangle(421, 780, 125, 0, 1, "#000000", "#000000"

	//**********************************
	//       Cajas bajo cabecera
	// *********************************	
	//Nº Permiso
	margenSup = margenSup - 70; //Bajamos
	pdf.createTable(12);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(8,1,12,17,1,35,6,1,6,6,1,6);
	
	pdf.setCellBorder("none" );
	setTextStyle(pdf,"gillsans.ttf","normal","right",9,"#000000");
	pdf.addCellText("Nº Permiso");
	pdf.addCellText(" ");

	pdf.setCellBorder("all");
	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText(" " + " - " + " ");

	pdf.setCellBorder("none");
	setTextStyle(pdf,"gillsans.ttf","normal","right",9,"#000000");
	pdf.addCellText("Supervisor de Turno / Fecha");
	pdf.addCellText(" ");

	pdf.setCellBorder("all");
	setTextStyle(pdf,"gillsans.ttf","normal","left",9,"#000000");
	pdf.addCellText("Nombre del tio con los apellidos y la fecha");

	pdf.setCellBorder("none");
	setTextStyle(pdf,"gillsans.ttf","normal","right",9,"#000000");
	pdf.addCellText("Caja");
	pdf.addCellText(" ");

	pdf.setCellBorder("all");
	setTextStyle(pdf,"gillsans.ttf","normal","center",9,"#000000");
	pdf.addCellText(" ");

	pdf.setCellBorder("none");
	setTextStyle(pdf,"gillsans.ttf","normal","right",9,"#000000");
	pdf.addCellText("Unidad");
	pdf.addCellText(" ");

	pdf.setCellBorder("all");
	setTextStyle(pdf,"gillsans.ttf","normal","center",9,"#000000");
	pdf.addCellText(" ");
	
	pdf.addTableSetXY(20, margenSup);	//EjeX, EjeY
		
	//**********************************
	//       Cabeceras content
	// *********************************	
	margenSup = margenSup - 23; //Bajamos
	pdf.createTable(3);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(39,42,19);
	setTextStyle(pdf,"gillsans.ttf","bold","center",10,"#000000");
	pdf.setCellBorder("none");
	pdf.addCellText(" ");
	pdf.setCellBorder("all");
	pdf.addCellText("Secuencia Ejecución y pruebas");
	pdf.addCellText("Secuencia de reposición");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY

	margenSup = margenSup - 14; //Bajamos
	pdf.createTable(7);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(39,15,9,9,9,9,10);
	setTextStyle(pdf,"gillsans.ttf","normal","center",8,"#000000");
	pdf.setCellBorder("none");
	pdf.addCellText(" ");
	pdf.setCellBorder("all");
	pdf.addCellText("COLOCACIÓN");
	pdf.addCellText("PREPARACIÓN"+String.fromCharCode(13)+"PARA PRUEBA");
	pdf.addCellText("VUELTA A"+String.fromCharCode(13)+"DESCARGO");
	pdf.addCellText("PREPARACIÓN"+String.fromCharCode(13)+"PARA PRUEBA");
	pdf.addCellText("LEVANTAMIENTO");
	pdf.addCellText("SI NO ES POSIBLE"+String.fromCharCode(13)+"REPONER");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY

	margenSup = margenSup - 20; //Bajamos
	pdf.createTable(9);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(12,4,23,15,9,9,9,9,10);
	setTextStyle(pdf,"gillsans.ttf","normal","center",8,"#000000");
	pdf.setCellBorder("all");
	pdf.addCellText("Nº Total Tarjetas");
	pdf.addCellText(" ");
	setTextStyle(pdf,"gillsans.ttf","normal","center",7,"#000000");
	pdf.addCellText(" ");
	pdf.addCellText("Posición en descargo");
	pdf.addCellText("Posición en 1ª prueba");
	pdf.addCellText("Posición en descargo");
	pdf.addCellText("Posición en 2ª prueba");
	pdf.addCellText("Posición reposición");
	pdf.addCellText("Reposición pendiente");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	
	//**********************************
	//       	Content Datos
	// *********************************	
	margenSup = margenSup - 12; //Bajamos
	pdf.createTable(16);  //Num columnas	
	pdf.setCellBorder("all");
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(4,12,23,4,6,5,4,5,4,5,4,5,4,5,5,5);
 
	setTextStyle(pdf,"gillsans.ttf","normal","center",9,"#000000");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Tarjeta");
	pdf.addCellText(String.fromCharCode(13)+"KKS");
	pdf.addCellText(String.fromCharCode(13)+"DESCRIPCIÓN");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Orden");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Candado");
	pdf.addCellText(String.fromCharCode(13)+"Estado");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Orden");
	pdf.addCellText(String.fromCharCode(13)+"Estado");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Orden");
	pdf.addCellText(String.fromCharCode(13)+"Estado");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Orden");
	pdf.addCellText(String.fromCharCode(13)+"Estado");
	pdf.addCellText("Nº"+String.fromCharCode(13)+"Orden");
	pdf.addCellText(String.fromCharCode(13)+"Estado");
	setTextStyle(pdf,"gillsans.ttf","normal","center",7,"#000000");
	pdf.addCellText("Otros"+String.fromCharCode(13)+"Descargos");
	setTextStyle(pdf,"gillsans.ttf","normal","center",9,"#000000");
	pdf.addCellText(String.fromCharCode(13)+"Estado");

	
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY
	

	//**********************************
	//       	FIRMAS
	// *********************************	
	margenSup = 140; //Bajamos
	pdf.createTable(7);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(39,15,9,9,9,9,10);
	setTextStyle(pdf,"gillsans.ttf","normal","right",9,"#000000");
	pdf.setCellBorder("all");
	
	pdf.addCellText("NOMBRE Y FIRMA DEL OPERADOR"+(String.fromCharCode(13)).repeat(2)+"FECHA Y HORA");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	
	pdf.addCellText("NOMBRE Y FIRMA DEL SUPERVISOR DE TURNO"+(String.fromCharCode(13)).repeat(2)+"FECHA Y HORA");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addCellText(" ");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY

	margenSup = margenSup - 80; //Bajamos
	pdf.createTable(7);  //Num columnas	
	pdf.setTableWidth(825);
	pdf.setTableCellWidths(39,15,9,9,9,9,10);
	setTextStyle(pdf,"gillsans.ttf","normal","center",8,"#000000");
	pdf.setCellBorder("none");
	pdf.addCellText(" ");
	pdf.setCellBorder("all");
	pdf.addCellText("COLOCACIÓN");
	pdf.addCellText("PREPARACIÓN"+String.fromCharCode(13)+"PARA PRUEBA");
	pdf.addCellText("VUELTA A"+String.fromCharCode(13)+"DESCARGO");
	pdf.addCellText("PREPARACIÓN"+String.fromCharCode(13)+"PARA PRUEBA");
	pdf.addCellText("LEVANTAMIENTO");
	pdf.addCellText("SI NO ES POSIBLE"+String.fromCharCode(13)+"REPONER");
	pdf.addTableSetXY(margenIzq, margenSup);	//EjeX, EjeY

	
	pdf.close();
	//Si queremos abrir el PDF una vez generado.
	var a = await ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}


function setLanguage(lang){
    switch (lang) {
        case "es-ES":
            self.setFieldPropertyValue("MAP_IDIOMA","title","Seleccione un idioma: ");
            self.setFieldPropertyValue("MAP_LABEL","title","Etiqueta: ");
            self.setFieldPropertyValue("MAP_TEXT","title","Texto: ");
            self.setFieldPropertyValue("MAP_PASSWORD","title","Contraseña: ");
            self.setFieldPropertyValue("MAP_TEXTAREA","title","Multilínea: ");
            self.setFieldPropertyValue("MAP_NUMBER","title","Número: ");
            self.setFieldPropertyValue("MAP_DECIMAL","title","N. Decimal: ");
            self.setFieldPropertyValue("MAP_NUMTEXT","title","Número-Texto: ");
            self.setFieldPropertyValue("MAP_DECTEXT","title","Decimal-Texto: ");
            self.setFieldPropertyValue("MAP_DATE","title","Fecha: ");
            self.setFieldPropertyValue("MAP_HOUR","title","Hora: ");
            self.setFieldPropertyValue("MAP_TELEFONO","title","Teléfono: ");
            self.setFieldPropertyValue("MAP_CHECKBOX","title","Casilla de Verificacion (0/1): ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR","title","Combo: ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR2","title","Lupa: ");
            self.setFieldPropertyValue("MAP_TEXTAT","title","Adjunto: ");
            self.setFieldPropertyValue("MAP_BT_EJEMPLO","title","Ejemplo de titulo");
            break;
        case "en-US":
            self.setFieldPropertyValue("MAP_IDIOMA","title","Select a language: ");
            self.setFieldPropertyValue("MAP_LABEL","title","Tag: ");
            self.setFieldPropertyValue("MAP_TEXT","title","Text: ");
            self.setFieldPropertyValue("MAP_PASSWORD","title","Password: ");
            self.setFieldPropertyValue("MAP_TEXTAREA","title","Multiline: ");
            self.setFieldPropertyValue("MAP_NUMBER","title","Number: ");
            self.setFieldPropertyValue("MAP_DECIMAL","title","N. Decimal: ");
            self.setFieldPropertyValue("MAP_NUMTEXT","title","Number-Text: ");
            self.setFieldPropertyValue("MAP_DECTEXT","title","Decimal-Text: ");
            self.setFieldPropertyValue("MAP_DATE","title","Date: ");
            self.setFieldPropertyValue("MAP_HOUR","title","Time: ");
            self.setFieldPropertyValue("MAP_TELEFONO","title","Phone: ");
            self.setFieldPropertyValue("MAP_CHECKBOX","title","Checkbox (0/1): ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR","title","Combo: ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR2","title","Magnifier: ");
            self.setFieldPropertyValue("MAP_TEXTAT","title","Attachment: ");
            self.setFieldPropertyValue("MAP_BT_EJEMPLO","title","Attachment: ");
            break;
        case "pt-PT":
            self.setFieldPropertyValue("MAP_IDIOMA","title","Selecionar um idioma: ");
            self.setFieldPropertyValue("MAP_LABEL","title","Etiqueta: ");
            self.setFieldPropertyValue("MAP_TEXT","title","Texto: ");
            self.setFieldPropertyValue("MAP_PASSWORD","title","Senha: ");
            self.setFieldPropertyValue("MAP_TEXTAREA","title","Multilina: ");
            self.setFieldPropertyValue("MAP_NUMBER","title","Número: ");
            self.setFieldPropertyValue("MAP_DECIMAL","title","N. Decimal: ");
            self.setFieldPropertyValue("MAP_NUMTEXT","title","Número-Texto: ");
            self.setFieldPropertyValue("MAP_DECTEXT","title","Decimal-Texto: ");
            self.setFieldPropertyValue("MAP_DATE","title","Data: ");
            self.setFieldPropertyValue("MAP_HOUR","title","Hora: ");
            self.setFieldPropertyValue("MAP_TELEFONO","title","Teléfono: ");
            self.setFieldPropertyValue("MAP_CHECKBOX","title","Caixa de verificação (0/1): ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR","title","Combo: ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR2","title","Lupa: ");
            self.setFieldPropertyValue("MAP_TEXTAT","title","Anexo: ");
            self.setFieldPropertyValue("MAP_BT_EJEMPLO","title","Attachment: ");
            break;
        case "ru":
            self.setFieldPropertyValue("MAP_IDIOMA","title","Выбрать язык : ");
            self.setFieldPropertyValue("MAP_LABEL","title","тег: ");
            self.setFieldPropertyValue("MAP_TEXT","title","текст: ");
            self.setFieldPropertyValue("MAP_PASSWORD","title","пароль: ");
            self.setFieldPropertyValue("MAP_TEXTAREA","title","многострочный: ");
            self.setFieldPropertyValue("MAP_NUMBER","title","номер: ");
            self.setFieldPropertyValue("MAP_DECIMAL","title","N. Десятичная: ");
            self.setFieldPropertyValue("MAP_NUMTEXT","title","номер-текст: ");
            self.setFieldPropertyValue("MAP_DECTEXT","title","Десятичная-текст: ");
            self.setFieldPropertyValue("MAP_DATE","title","дата: ");
            self.setFieldPropertyValue("MAP_HOUR","title","время: ");
            self.setFieldPropertyValue("MAP_TELEFONO","title","телефон: ");
            self.setFieldPropertyValue("MAP_CHECKBOX","title","флажок (0/1): ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR","title","Combo: ");
            self.setFieldPropertyValue("TIPOIDENTIFICADOR2","title","Увеличительное стекло: ");
            self.setFieldPropertyValue("MAP_TEXTAT","title","приложенный: ");
            self.setFieldPropertyValue("MAP_BT_EJEMPLO","title","Пример названия");
            break;
    }
}

function DevolverIframeVideoYoutube(sUrlYoutube,objeto){
      if(sUrlYoutube == ""){
            ui.showToast("Error, URL de youtube inválida");
            return "";
      }
      var longitud = sUrlYoutube.length;
      var urlIndice = sUrlYoutube.indexOf("watch?v=",1);
      if(urlIndice != -1){
            //Es una URL completa. Parseamos y sacamos el código.
            if(urlIndice >= longitud){
                //ui.ShowToast "Error, URL de youtube inválida", "Error", 0
                return "";
            }
            sUrlYoutube = sUrlYoutube.substring(urlIndice + 8, longitud);
            //Vemos si hay más parámetros después del código del vídeo,
            //para ignorarlos.
            var urlIndiceSiguenteParametro = sUrlYoutube.indexOf("&",1);
            if(urlIndiceSiguenteParametro > -1){
                  //No hay parámetros, cogemos desde aquí hasta el final nos vale.
            //}else{
                  //Hay parámetros. La posición del primer parámetro la hemos calculado
                  //a partir del InStr, así que se la sumamos para coger la posición
                  //en la cadena completa.
                  sUrlYoutube = sUrlYoutube.substring(1, urlIndiceSiguenteParametro - 1);
            }
      		//objeto("MAP_IMG_FIJACAPITULO")="https://www.youtube.com/embed/" + sUrlYoutube + "?rel=0&autoplay=1"
      		//objeto.MAP_IMG_FIJACAPITULO = sUrlYoutube;
		    //Concatenamos el iframe.
      		return "<iframe id='video' type='text/html' width='100%' height='100%' src='https://www.youtube.com/embed/" + sUrlYoutube + "?rel=0&autoplay=0' frameborder='0'/>";
	  }else{
	  		//objeto.MAP_IMG_FIJACAPITULO = sUrlYoutube;
	  		return "<iframe id='video' type='text/html' width='100%' height='100%' src='" + sUrlYoutube + "?rel=0&autoplay=0' frameborder='0'/>";
      }
}

function doRegisterNewFingerprint() {
	var params = {
		onSuccess: function(result) {
			var sPublicKey = result.getPublicKey();
			if (user.PUBLICKEY != sPublicKey) {
				user.PUBLICKEY = sPublicKey;
				user.save();
				ui.showToast("Autenticación por huella dactilar habilitada para usuario " + user.LOGIN);
				appData.failWithMessage(-11888, '##EXIT##');
			} else {
				ui.showToast("Ya está registrado!");
				appData.failWithMessage(-11888, '##EXIT##');
			}
		},
		onFailure: function(nError, sErrorMessage) {
			if (nError == undefined) {
				if(ui.msgBox("Huella no registrada. Añada una nueva en los ajustes de seguridad del dispositivo , ¿Quiere hacerlo ahora?","¡Información!",4) == 6 ){
				    fingerprintManager.launchFingerprintSettings();
				}
			} else {
				ui.showToast("Error huella dactilar.\nCódigo: " + nError + "\nMensaje: " + sErrorMessage);
			}
		}
	};
	fingerprintManager.setCallback(params);
	fingerprintManager.listen();
	ui.showToast("Pase su dedo por el lector de huellas dactilares");
}

function doRegisterNewFingerprintIOS() {
	var params = {
		onSuccess: function(result) {
			var sPublicKey = result.getPublicKey();
			if (user.PUBLICKEY != sPublicKey) {
				user.PUBLICKEY = sPublicKey;
				user.save();
				ui.showToast("Autenticación por huella dactilar habilitada para usuario " + user.LOGIN);
			} else {
				ui.showToast("Ya está registrado!");
			}
		},
		onFailure: function(nError, sErrorMessage) {
			//if (nError == undefined) {
			//	if(ui.msgBox("Huella no registrada. Añada una nueva en los ajustes de seguridad del dispositivo , ¿Quiere hacerlo ahora?","¡Información!",4) == 6 ){
			//	    fingerprintManager.launchFingerprintSettings();
			//	}
			//} else {
				ui.showToast("Error huella dactilar.\nCódigo: " + nError + "\nMensaje: " + sErrorMessage);
			//}
		}
	};
	fingerprintManager.setCallback(params);
	fingerprintManager.launch();
}

function doFingerprintAuth() {
	var params = {
		onSuccess: function(result) {
			var sPublicKey = result.getPublicKey();
			var obj = getUserByPublicKey(sPublicKey);
			if (obj == null) {
				ui.showToast("Huella no asignada a ningun usuario.");
	            fingerprintManager.listen();
			} else {
			    fingerprintManager.stopListening();
				hacerLogin(obj.LOGIN, obj.PWD);
			}
		},
		onFailure: function(nError, sErrorMessage) {
			if (nError == undefined) {
				ui.showToast("Huella no registrada. Entre en la aplicacion y asigne la huella al usuario.");
			} else {
				ui.showToast("Error huella dactilar.\nCódigo: " + nError + "\nMensaje: " + sErrorMessage);
			}
	        if (nError===10) { // Cancelado por el usuario
			    fingerprintManager.stopListening();
			} else {
	            fingerprintManager.listen();
			}
		}
	};
	fingerprintManager.setCallback(params);
	fingerprintManager.listen();
}

function doFingerprintAuthIOS(){
    var params = {
		onSuccess: function(result) {
			var sPublicKey = result.getPublicKey();
			var obj = getUserByPublicKey(sPublicKey);
			if (obj == null) {
				ui.showToast("Huella no asignada a ningun usuario.");
			} else {
				hacerLogin(obj.LOGIN, obj.PWD);
			}
		},
		onFailure: function(nError, sErrorMessage) {
			if (nError == undefined) {
				ui.showToast("Huella no registrada. Entre en la aplicacion y asigne la huella al usuario.");
			} else {
				ui.showToast("Error huella dactilar.\nCódigo: " + nError + "\nMensaje: " + sErrorMessage);
			}
		}
	};
	fingerprintManager.setCallback(params);
	fingerprintManager.launch();
}

async function hacerLogin(usuario,contrasenna){
    var collUser = await appData.getCollection("Usuarios");
    var objUser = await collUser.findObject("LOGIN='" + usuario.toString() + "'");
    if(objUser !== undefined
        && objUser != null){
        if(objUser.PWD == contrasenna){
            self["MAP_T_ERROR"] = "";
            ui.refresh("MAP_T_ERROR");
            await doLogin(usuario,contrasenna);  
        }else{
            self["MAP_T_ERROR"] = "Usuario o contraseña incorrectos.";
            ui.refresh("MAP_T_ERROR,frmError");    
        }
        
    }else{
        self["MAP_T_ERROR"] = "Usuario o contraseña incorrectos.";
        ui.refresh("MAP_T_ERROR,frmError");
    }
} 

function getOS(){
    return appData.getGlobalMacro("##DEVICE_OS##");
}

async function doLogin(user,pass) {
    var params = {
        userName: user,
        password: pass,
        entryPoint: "Menu"

        // Opcional
        //onLoginSuccessful: function() {
        //    ui.showToast("Login OK!");
        //},

        // Opcional
        //onLoginFailed: function() {
        //    ui.showToast("Login failed!");
        //}
    };
    await appData.login(params);
}

async function getUserByPublicKey(sPublicKey) {
	var collUsuarios = await appData.getCollection("Usuarios");
	return await collUsuarios.findObject("PUBLICKEY = '" + sPublicKey + "'");
}

function testReplica() {
    var sResult = replica.testConnection();
	ui.showToast("Connection: " + sResult);
	
    sResult = replica.testAuthentication();
    ui.showToast("Authentication: " + sResult);
}

function doDRCamera () {
    
    var obj = self;
    
    ui.startCamera({
        width:640,
        onSuccess: function ( imgFile ) {
            obj.setFieldPropertyValue("DIBUJO","img", imgFile);
            ui.refresh();
        },
        onCancelled: function () {
            
        }
        
    });
}

/***
*
* Code from eventos.js
*
***/

// Por script
async function jstestClick(e) {
	var c;
	if (e.data.msg) {
		await ui.msgBox (e.target+": "+e.data.msg,e.data.title+" "+e.data.collName,0);
		if(e.data.collName != null){
    		if(e.data.collName.length > 0){
		        c=await appData.getCollection(e.data.collName);
		    }
		}
	} else {
		await ui.msgBox ("Abre el objeto "+e.data,"Titulo",0);
		if(e.data != null){
    		if(e.data.length > 0){
    		    c=await appData.getCollection(e.data);
    		}
		}
	}
	var obj=await c.createObject();
	c.addItem(obj);
	appData.pushValue(obj);
}

//manejar errores del tipo WEB
function handleError(e) {
    //if (e.messageLevel == "ERROR") {
    //    ui.msgBox("Nivel: " + e.messageLevel + "\nMensaje: " + e.message + "\nLínea: " + e.lineNumber + "\nID fuente: " + e.sourceId, "Error WebView", 0);
    //}
}
  
function eventoOnTextChanged(evento) {
	//ui.showToast("onTextChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTecla pulsada: " + evento.keyPressed + "\noldText: " + evento.oldText + "\nnewText: " + evento.newText);
	self["MAP_DESCRIPCIONEVENTO"]="onTextChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTecla pulsada: " + evento.keyPressed + "\noldText: " + evento.oldText + "\nnewText: " + evento.newText;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO");
}

async function FiltraMarcados(e){
    self.MAP_BUSCAR_TEXT = e.newText;
    await self.executeNode("applyfilter");
}

function eventoOnFocusChanged(evento) {
	//ui.showToast("onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused);
	self.MAP_DESCRIPCIONEVENTO="onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO");
}

function eventoOnFocusChanged3(evento) {
	self.MAP_DESCRIPCIONEVENTO3="onFocusChanged! target: " + evento.target + "\nObjItem: " + evento.objItem + "\nTiene foco: " + evento.isFocused;
	ui.getView(self).refresh("MAP_DESCRIPCIONEVENTO3");
}

// Por attributo en el nodo
async function jstestClickNode(e,data) {
	var c;
	if (data.msg) {
		await ui.msgBox (e.target+": "+data.msg,data.title+" "+data.collName,0);
		c=await appData.getCollection(data.collName);
	} else {
		await ui.msgBox ("Abre el objeto "+data,"Titulo",0);
		c=await appData.getCollection(data);
	}
	var obj=await c.createObject();
	c.addItem(obj);
	appData.pushValue(obj);
}
function scrollArrow(e,miparam) {
	if (miparam==1){
		if (e.dy<=10 && self.MAP_VALORVER==1) {
			self.MAP_VALORVER=0;
			ui.getView(self).refresh("frmblotante");
		} else if (e.dy>10 && self.MAP_VALORVER==0) {
			self.MAP_VALORVER=1;
			ui.getView(self).refresh("frmblotante");
		} 
	} else {
		if (e.dy<=10 && self.MAP_ATTSHOWOVERSCROLL==1) {
			self.MAP_ATTSHOWOVERSCROLL=0;
			ui.getView(self).refresh("attfroverscroll");
		} else if (e.dy>10 && self.MAP_ATTSHOWOVERSCROLL==0) {
			self.MAP_ATTSHOWOVERSCROLL=1;
			ui.getView(self).refresh("attfroverscroll");
		} 
	}
}

// Esta funcion es llamada por el evento sys-message de la colección empresas
async function sysMessage(codigo,message) {
	var cadena="";
	switch(codigo) {
 
		case 1000:
			cadena=" Actualización descargándose (un mensaje por cada actualización).";
			break;
 
		case 1001:
			cadena=" Actualización aplicada (un mensaje por cada actualización).";
			break;
 
		case 1002:
			cadena=" Se han aplicado todas las actualizaciones (al comprobar las actualizaciones puede haber más de una, éste se invoca al aplicar todas).";
			break;
 
		case 1003:
 
			/* Provisionamiento seguro. */
			/* Declarar el nodo sys-message requiere que este caso lo controle el programador,
			/* es responsabilidad del programador limpiar la cola de réplica y cerrar la aplicación.
			/* ************************ */
 
			await ui.msgBox("Advertencia, se ha programado una actualización de base de datos. Se van a replicar todos los datos y se cerrará la aplicación.", "Mensaje", 0);
			var bResult = replica.processReplicatorQueue(liveResponse);
			if (bResult) {
				//ui.msgBox("Cola de salida del replicador procesada correctamente. Cerrando aplicación.", "Mensaje", 0);
				appData.failWithMessage(-11888, "##EXITAPP##");
			} else {
				ui.showToast("Error al procesar la cola de salida");
				//Ojo, hay que volver a intentarlo ó hacer una repetitiva, tenemos que replicar lo que haya en el disposivo antes de salir.
			}
			break;
    }
}

/***
*
* Code from funciones_perifericos.js
*
***/

async function EnviarMail(adjunto) {
	var men="";	
	if (self.MAP_CORREO.length===0)
		men="Es obligatorio indicar el correo de destino";
		
	if (self.MAP_ASUNTO.length===0 && men.length===0)
		men="Es obligatorio indicar el asunto del correo";
		
	if (self.MAP_CUERPO.length===0 && men.length===0)
		men="Es obligatorio indicar el cuerpo del correo";
	
	if (men.length===0) {
		if (adjunto==="NO") {
			var ok=await ui.msgBox ("¿Desea adjuntar un fichero?","Aviso",4);
	        if (ok===6){
	        	self.MAP_VISIBLE=1;
	        	ui.refresh("MAP_TEXTAT,boton0,boton1");
	        }else{
				ui.sendMail(self.MAP_CORREO, "direccion_con_copia@xone.es", self.MAP_ASUNTO, self.MAP_CUERPO, "");
	        }
			
		} else {
			if (self.MAP_TEXTAT.length===0)
				await ui.msgBox("Error: Es Obligatorio indicar el fichero adjunto","AVISO",0);				
			else
				ui.sendMail (self.MAP_CORREO, "direccion_con_copia@xone.es", self.MAP_ASUNTO, self.MAP_CUERPO, self.MAP_TEXTAT);
		}
	} else {
		await ui.msgBox ("Error: " + men ,"AVISO",0);				
	}
}

async function CodigoBarras() {
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
		await ui.msgBox ("Error: " + men ,"AVISO",0);
	}
}

/***
*
* Code from funcionesCamara.js
*
***/

function takePicture() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    var params = {
        filename     : "test.jpg",
        saveToGallery: true,
        width        : 360,
        height       : 360,
        onFinished   : function(sFileName) {
            if (!sFileName) {
                ui.showToast("Error de cámara");
            } else {
                ui.showToast("Abriendo nueva foto..."); 
                ui.openFile(sFileName);
            }
        }
    };
    control.takePicture(params);
}

function record() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    
    var currentObj = self;
    let params = {
        quality     : self.MAP_CAMERA_QUALITY,
        maxDuration : 10000,    // Milisegundos
        //maxFileSize : 10485760, // Bytes
        withMicAudio: true,
        onFinished  : function(sFileName) {
            self.MAP_RECORDING=0;
            ui.refresh("MAP_START_RECORDING,MAP_STOP_RECORDING,MAP_START_PREVIEW,MAP_STOP_PREVIEW");
            if (!sFileName) {
                ui.showToast("Error de cámara");
            } else {
                ui.showToast("Nuevo vídeo..."); 
                ui.openFile(sFileName);
            }
        }
    };
    control.record(params);
    self.MAP_RECORDING=1;
    ui.refresh("MAP_START_RECORDING,MAP_STOP_RECORDING,MAP_START_PREVIEW,MAP_STOP_PREVIEW");
}

function stopRecording() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.stopRecording();
}

function startPreview() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.startPreview();
}

function stopPreview() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.stopPreview();
}

function isOpened() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let bOpened = control.isCameraOpened();
    ui.showToast("Abierta: " + bOpened);
}

function isAutoFocus() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let bAutoFocus = control.isAutoFocus();
    ui.showToast("Autofoco: " + bAutoFocus);
}

async function getSupportedAspectRatios() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let allAspectRatios = control.getSupportedAspectRatios();
    let sMessage = "Relaciones de aspecto soportadas: ";
    for (let i = 0;i < allAspectRatios.length;i++) {
        sMessage = sMessage + "\n" + allAspectRatios[i];
    }
    await ui.msgBox(sMessage, "Mensaje", 0);
}

function doSetOnCodeScanned() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.setOnCodeScanned(function(evento) {
        let nResult = ui.msgBox("Valor: " + evento.data + "\nTipo: " + evento.type, "¿Código OK?", 4);
        if (nResult == 6) {
            return true;
        } else {
            return false;
        }
    });
}

/**
 * Modifica el comportamiento de flash de la cámara.
 * 
 * Valores posibles:
 * 1) on: Siempre encendido al tomar una foto
 * 2) off: Siempre apagado al tomar una foto
 * 3) torch: Siempre encendido
 * 4) auto: Encendido o apagado al tomar una foto dependiendo de lo que diga el
 * sensor de luz
 * 5) red_eye: Encendido o apagado al tomar una foto dependiendo de lo que diga
 * el sensor de luz, en un modo especial que reduce los ojos rojos
 */
function doSetFlashMode(sFlashMode) {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.setFlashMode(sFlashMode);
}

function doToggleFlashMode() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let sFlashMode = control.getFlashMode();
    if (sFlashMode == "on") {
        control.setFlashMode("off");
        self.setFieldPropertyValue("MAP_TOGGLE_FLASH_MODE", "img", "flash-off.png");
    } else if (sFlashMode == "off") {
        control.setFlashMode("auto");
        self.setFieldPropertyValue("MAP_TOGGLE_FLASH_MODE", "img", "flash-auto.png");
    } else if (sFlashMode == "auto") {
        control.setFlashMode("torch");
        self.setFieldPropertyValue("MAP_TOGGLE_FLASH_MODE", "img", "flash-torch.png");
    } else if (sFlashMode == "torch") {
        control.setFlashMode("on");
        self.setFieldPropertyValue("MAP_TOGGLE_FLASH_MODE", "img", "flash-on.png");
    }
    ui.refresh("MAP_TOGGLE_FLASH_MODE");
}

function doToggleCamera() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let sCamera = control.getCamera();
    if (sCamera == "front") {
        control.setCamera("back");
    } else if (sCamera == "back") {
        control.setCamera("front");
    }
}

function doToggleAutoFocus() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    control.setAutoFocus(!control.isAutoFocus());
}

let appData ,ui ,self ,selfDataColl ,user; const _logString = Array(1000).join(" "), _mF = new Map();

export const __SCRIPT_WRAPPERASYNC = async (AppData,Ui,Self,SelfDataColl,User,Func,Arguments) => {
  appData=AppData; ui=Ui; self=Self; selfDataColl=SelfDataColl; user=User;
	if (typeof Func === "function") return await Func.call(this,Arguments);
	let f = _mF.get(Func);
	if(!f) _mF.set(Func, (f = ((async () => {}).constructor)('appData, ui, self, selfDataColl, user,doToggleAutoFocus,doToggleCamera,doToggleFlashMode,doSetFlashMode,doSetOnCodeScanned,getSupportedAspectRatios,isAutoFocus,isOpened,stopPreview,startPreview,stopRecording,record,takePicture,CodigoBarras,EnviarMail,sysMessage,scrollArrow,jstestClickNode,eventoOnFocusChanged3,eventoOnFocusChanged,FiltraMarcados,eventoOnTextChanged,handleError,jstestClick,doDRCamera,testReplica,getUserByPublicKey,doLogin,getOS,hacerLogin,doFingerprintAuthIOS,doFingerprintAuth,doRegisterNewFingerprintIOS,doRegisterNewFingerprint,DevolverIframeVideoYoutube,setLanguage,GenerarPDF3Apaisado,GenerarPDF3,setTextStyle,GenerarPDFChecks,getEmptyFromNull,getBoolStr,getStrFill,CrearPdf_Factura,GenerarPDF1,getTime,CreatePDF,addNewLine,AddCellTexttable,showGridDebug,GenerarPDFBasico,saberSiWifiGuardada,onWifiNetworksFound,scanAvailableNetworks,testClick,Right,Left,len,formatDateTime,cstr,goPage,next,prev,EscanearTexto,EscanearMatricula,frameScroll,userMsgBox,funcionesFecha,exit,doLogout,doLoginNew,doAuthLogin,doAuthLogout,addZero,iniciarLiterales,irGrupo,addUserMessage,fillMessagesContent,sendMessage,AccionesChat,AccionesChatEspecial,setTimeRecording,salir,closeListUser,openListUser,openChat,createChat,inicializeChats,lockContents,ShowMessageDebug,inicializarCal,sendSignedPdf,signPdfDemo,generatePdfDemo,disableDnieReader,enableDnieReader,tagNfcEncontrado,ponerCallbackNfc,replaceAll,escapeRegularExpression,safeToDate,safeToString,isDate,isEmptyString,isString,isNumber,isIntegerNumber,isFloatNumber,getClassName,isSomething,isNothing,VBScriptSupport,getDate,GeneratePDFDocument,AddTableCellText,getControl,doSetMapType,doFollowUserLocation,toEncoded,encoded,getLastKnownLocation,containsLocation,getAddressFromPosition,distanceTo,testInexistente,stopDistanceMeter,startDistanceMeter,restrictMapToBounds,zoomToMyLocation,zoomToBounds,zoomToEncodeData,zoomTo,togglePoisMenu,hidePoisMenu,showPoisMenu,clearAllLines,clearLine,clearAllRoutes,clearRoute,routeTo,clearAllAreas,removeArea,drawEncodeArea,drawArea,drawRoute,drawLine2,drawLine,disableUserLocation,enableUserLocation,isUserLocationEnabled,getUserLocation,doRefresh,doChangeMapPois,removeMarkers,setMarkersDraggable,hideMarkers,showMarkers,onDistanceMeter,onLocationChanged,onLocationReady,onMapReady,onMarkerDraggedEnd,onMapLongClicked,onMapClicked,actualizarGps,comprobarEstadoGps,startGpsInterval,startGpsCallback,stopUpdateGpsLoop,startUpdateGpsLoop,ComprobarConexion,PosicionamientoGPS,GetPosGPS,XArguments', Func)));
	if (_mF.size>1000) _mF.delete(_mF.entries().next().value[0]);
	console.log(f); console.log(`%c${_logString}`,"background:blue;display:block;font-size:1px");
	await f(appData, ui, self, selfDataColl, user,doToggleAutoFocus,doToggleCamera,doToggleFlashMode,doSetFlashMode,doSetOnCodeScanned,getSupportedAspectRatios,isAutoFocus,isOpened,stopPreview,startPreview,stopRecording,record,takePicture,CodigoBarras,EnviarMail,sysMessage,scrollArrow,jstestClickNode,eventoOnFocusChanged3,eventoOnFocusChanged,FiltraMarcados,eventoOnTextChanged,handleError,jstestClick,doDRCamera,testReplica,getUserByPublicKey,doLogin,getOS,hacerLogin,doFingerprintAuthIOS,doFingerprintAuth,doRegisterNewFingerprintIOS,doRegisterNewFingerprint,DevolverIframeVideoYoutube,setLanguage,GenerarPDF3Apaisado,GenerarPDF3,setTextStyle,GenerarPDFChecks,getEmptyFromNull,getBoolStr,getStrFill,CrearPdf_Factura,GenerarPDF1,getTime,CreatePDF,addNewLine,AddCellTexttable,showGridDebug,GenerarPDFBasico,saberSiWifiGuardada,onWifiNetworksFound,scanAvailableNetworks,testClick,Right,Left,len,formatDateTime,cstr,goPage,next,prev,EscanearTexto,EscanearMatricula,frameScroll,userMsgBox,funcionesFecha,exit,doLogout,doLoginNew,doAuthLogin,doAuthLogout,addZero,iniciarLiterales,irGrupo,addUserMessage,fillMessagesContent,sendMessage,AccionesChat,AccionesChatEspecial,setTimeRecording,salir,closeListUser,openListUser,openChat,createChat,inicializeChats,lockContents,ShowMessageDebug,inicializarCal,sendSignedPdf,signPdfDemo,generatePdfDemo,disableDnieReader,enableDnieReader,tagNfcEncontrado,ponerCallbackNfc,replaceAll,escapeRegularExpression,safeToDate,safeToString,isDate,isEmptyString,isString,isNumber,isIntegerNumber,isFloatNumber,getClassName,isSomething,isNothing,VBScriptSupport,getDate,GeneratePDFDocument,AddTableCellText,getControl,doSetMapType,doFollowUserLocation,toEncoded,encoded,getLastKnownLocation,containsLocation,getAddressFromPosition,distanceTo,testInexistente,stopDistanceMeter,startDistanceMeter,restrictMapToBounds,zoomToMyLocation,zoomToBounds,zoomToEncodeData,zoomTo,togglePoisMenu,hidePoisMenu,showPoisMenu,clearAllLines,clearLine,clearAllRoutes,clearRoute,routeTo,clearAllAreas,removeArea,drawEncodeArea,drawArea,drawRoute,drawLine2,drawLine,disableUserLocation,enableUserLocation,isUserLocationEnabled,getUserLocation,doRefresh,doChangeMapPois,removeMarkers,setMarkersDraggable,hideMarkers,showMarkers,onDistanceMeter,onLocationChanged,onLocationReady,onMapReady,onMarkerDraggedEnd,onMapLongClicked,onMapClicked,actualizarGps,comprobarEstadoGps,startGpsInterval,startGpsCallback,stopUpdateGpsLoop,startUpdateGpsLoop,ComprobarConexion,PosicionamientoGPS,GetPosGPS,Arguments);
};