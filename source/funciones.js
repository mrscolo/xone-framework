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

function doLoginNew() {
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
    appData.login(params);
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

function userMsgBox(title, msg, type) {
	var collMsgBox, objMsgBox, nResult;
	collMsgBox = appData.getCollection("EspecialMsgbox").createClone();
	objMsgBox = collMsgBox.createObject();
	collMsgBox.addItem(objMsgBox);
	objMsgBox.MAP_TITULO = title;
	objMsgBox.MAP_MENSAJE = msg;
	objMsgBox.MAP_TIPO = type;
	
	nResult = ui.msgBox(objMsgBox);
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

function testClick(e){
	ui.msgBox(e.target,"Test",0);
}


function scanAvailableNetworks() {
	try {
	    self.MAP_LOADING = 1;
	    ui.refresh("frmLoading");
		self.getContents("ContentWifis").clear();
	    
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

function onWifiNetworksFound(wifiNetworks) {
    self = onWifiNetworksFound.OBJETO;
    var sMessage = "";
    var wifiManager = new WifiManager();
    var orden = 1;
    for (var i = 0;i < wifiNetworks.length;i++) {
        //sMessage = sMessage + "SSID: " + wifiNetworks[i].getSsid() + "\n";
        var wifi = wifiNetworks[i];
        var isOpen = false;
        var coll = self.getContents("ContentWifis");
        if (coll != null)
        {
	    	var obj2=coll.getItem("MAP_SSID",wifi.getSsid());
	    	if (!obj2)
	    	{
				coll.lock();
				var obj = coll.createObject();
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
    
    self.getContents("ContentWifis").doSort("MAP_ORDEN ASC");
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
function GenerarPDFBasico(nameFile,pdf,createGrid){

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
	
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
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
function GenerarPDF1(nameFile,pdf,createGrid){

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
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}

function CrearPdf_Factura (nameFile,pdf01,createGrid){
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
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
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

function GenerarPDFChecks(nameFile,pdf,createGrid){
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
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
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

function GenerarPDF3(nameFile,pdf,createGrid){
	
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
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
	if( a == 6){
		//Si queremos abrir el PDF una vez generado.
	    pdf.launchPDF();
	}
}

//Para mayor simplicidad, todas las diferentes líneas son tablas, que nos permiten alinear el texto más facilmente.
//El documento es una grilla cuyo punto 0,0 es la ESQUINA INFERIOR IZQUIERDA.
//Para mejor desarrollo, activar showGridDebug(pdf)
//addNewLine(Pdf01) Añade una tabla de una línea vacía y sin bordes

function GenerarPDF3Apaisado(nameFile,pdf,createGrid){
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
	var a = ui.msgBox("ABRIR PDF?","PDF GENERADO",4);
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

function hacerLogin(usuario,contrasenna){
    var collUser = appData.getCollection("Usuarios");
    var objUser = collUser.findObject("LOGIN='" + usuario.toString() + "'");
    if(objUser !== undefined
        && objUser != null){
        if(objUser.PWD == contrasenna){
            self["MAP_T_ERROR"] = "";
            ui.refresh("MAP_T_ERROR");
            doLogin(usuario,contrasenna);  
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

function doLogin(user,pass) {
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
    appData.login(params);
}

function getUserByPublicKey(sPublicKey) {
	var collUsuarios = appData.getCollection("Usuarios");
	return collUsuarios.findObject("PUBLICKEY = '" + sPublicKey + "'");
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