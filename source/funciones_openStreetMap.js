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

function actualizarGps() {
	let collGps, objCollGps;
	collGps = appData.getCollection("GPSColl");
	collGps.startBrowse();
	try {
		objCollGps = collGps.getCurrentItem();
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

function onMarkerDraggedEnd(evento) {
    let nResult = ui.msgBox("¿Aquí está bien?", "Mensaje", 4);
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

function doChangeMapPois(sMapControl) {
    let mapContent = self.getContents("ClientesCoord");
    if (mapContent.getFilter() == "t1.NOMBRE = 'Madrid'") {
        mapContent.setFilter("");
    } else {
        mapContent.setFilter("t1.NOMBRE = 'Madrid'");
    }
    mapContent.unlock();
    mapContent.clear();
    mapContent.loadAll();
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

function testInexistente(sMapControl) {
    let contents = self.getContents("ClientesCoord");
    let newObject = contents.createObject();
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

function getAddressFromPosition() {
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
    ui.msgBox(str, "Resultado", 0);
}

function containsLocation() {
    let bResult;
    ui.msgBox("¿Es Teruel una ciudad contenida en un polígono formado por La Coruña -> Bilbao -> Lisboa?", "Mensaje", 0);
    bResult = new GpsTools().containsLocation("40.3633442, -1.0893794", ["43.3712591, -8.4188010", "43.2603479, -2.9334110", "38.7166700, -9.1333300"]);
    if (bResult) {
        ui.msgBox("Por ahí anda Teruel", "Mensaje", 0);
    } else {
        ui.msgBox("No, Teruel no está ahí", "Mensaje", 0);
    }
    ui.msgBox("¿Es Teruel una ciudad contenida en un polígono formado por Badajoz -> Madrid -> Barcelona -> Valencia?", "Mensaje", 0);
    bResult = new GpsTools().containsLocation("40.3633442, -1.0893794", ["38.8685452, -6.8170906", "40.4167747, -3.70379019", "41.3850632, 2.1734035", "39.4561165, -0.3545661"]);
    if (bResult) {
        ui.msgBox("Por ahí anda Teruel", "Mensaje", 0);
    } else {
        ui.msgBox("No, Teruel no está ahí", "Mensaje", 0);
    }
}

function getLastKnownLocation() {
    let location = new GpsTools().getLastKnownLocation();
    if (!location) {
        ui.showToast("No hay última localización conocida");
        return;
    }
    ui.msgBox("Latitud: " + location.latitude + "\nLongitud: " + location.longitude + "\nPrecisión (metros): " + location.accuracy + "\nAltitud (metros elipsis WSG 84): " + location.altitude + "\nRumbo (grados): " + location.bearing + "\nVelocidad (metros/segundo): " + location.speed + "\nFecha: " + location.time.toString(), "Mensaje", 0);
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