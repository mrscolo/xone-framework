'Funcion para guardar las coordenadas GPS en un objeto dado. 
Function GetPosGPS(tipo,auxcollobj)
	Dim collGPS,x,latitud,longitud,distinta
	latitud=0
	longitud=0
	distinta=0
	'Activamos el GPS
	appdata.userinterface.startgps	
	'Capturamos las coordenadas GPS	
	Set collGPS =appdata.GetCollection("ContentConectarGPS")
	Set x =collGPS("LONGITUD")
	if not x is nothing then
		   if x("STATUS")="1" then
			    ' si status vale 1 significa que no hay error de conexion con el servicio
			    if x("HGPS")<>"" then
				      if x("LATITUD")<>"" then 
				      		latitud=CStr(CDbl(x("LATITUD")))
				      end if
				      if x("LONGITUD")<>"" then 
				      		longitud=CStr(CDbl(x("LONGITUD")))
				      end if
			    end if
		   else
		   		latitud=appdata.CurrentEnterprise.variables("LATITUD")
				longitud=appdata.CurrentEnterprise.variables("LONGITUD")
		   end if
	else
		latitud=appdata.CurrentEnterprise.variables("LATITUD")
		longitud=appdata.CurrentEnterprise.variables("LONGITUD")
	end if
	Set collGPS =Nothing
	Set x =Nothing
	
	'La guardamos en variable global si es distinta
	if appdata.CurrentEnterprise.variables("LATITUD")<>latitud or appdata.CurrentEnterprise.variables("LONGITUD")<>longitud then
		appdata.CurrentEnterprise.variables("LATITUD")=latitud
		appdata.CurrentEnterprise.variables("LONGITUD")=longitud
		distinta=1
	end if
	

	
	if tipo="tracking" then
		if distinta=1 then
			set colltracking=appdata.GetCollection(cstr(auxcollobj))
			set objtracking=colltracking.CreateObject
			colltracking.AddItem(objtracking)
			objtracking("LATITUD")=latitud
			objtracking("LONGITUD")=longitud
			objtracking.save
			replica.start
			colltracking.clear
			set colltracking=nothing			
			set objtracking=nothing
		end if
	else
		'Aqui se guarda solo la coordenada para saber donde se hizo la visita		
		auxcollobj("LATITUD")=latitud
		auxcollobj("LONGITUD")=longitud
	end if
	
End Function
 


Function PosicionamientoGPS()

	if appdata.CurrentEnterprise.variables("MIUBICACION")=0 then	
		latitud=38.886442
		longitud=-7.004351
	else
	 	Set collGPS =appdata.GetCollection("ContentConectarGPS")
	 	coordenadas=0
	 	ui.SetMaxWaitDialog 2
	 	ui.UpdateWaitDialog "Detectando localizacion del dispositivo", 1
	 	veces=0
	 	while coordenadas=0 	
			Set x =collGPS("LONGITUD")
			if not x is nothing then
			   if x("STATUS")="1" then
				    ' si status vale 1 significa que no hay error de conexion con el servicio
				    if x("HGPS")<>"" then
					      if x("LATITUD")<>"" then 
					      		latitud=CStr(CDbl(x("LATITUD")))
					      end if
					      if x("LONGITUD")<>"" then 
					      		longitud=CStr(CDbl(x("LONGITUD")))
					      end if
					      coordenadas=1		 							      
				    end if
			    end if
			end if
			veces=veces+1 
			if veces=200 then
				coordenadas=1
				latitud=38.886442
				longitud=-7.004351
			end if
		wend
		if veces=200 then	
			appdata.CurrentEnterprise.variables("MIUBICACION")=10
		end if
		Set collGPS =Nothing
		Set x =Nothing
	end if		
	ui.UpdateWaitDialog "Localizacion Terminada", 2				

End Function


'FUNCION PARA COMPROBAR SI TIENE CONEXION CON EL SERVIDOR PARA LAS COLL ONLINE
Function ComprobarConexion()

	appdata.Error.Clear
    on error resume next  
	conexion=0
	set coll=appdata.GetCollection("ContentComprobarConexion")
    coll.StartBrowse
    appdata.Error.Clear
    if not coll.CurrentItem is nothing then
    	if coll.CurrentItem("RESULTADO")="##OK##" then
    		conexion=1
        end if
    end if
    coll.endbrowse
    coll.clear
    set coll=nothing 
    ComprobarConexion=conexion
    
End Function

'imagendrawing inserta firma
Function LanzarFirma()
    ui.showToast appData.FilesPath + "splash.png"
    'Set elPaintAlEstiloXOne = CreateObject("ImageDrawing") 
    'elPaintAlEstiloXOne.Create 640, 480
    'elPaintAlEstiloXOne.SetBackgroundColor "#FF0000"
    'elPaintAlEstiloXOne.SetBackground appData.FilesPath + "SplashbyXOne.jpg"
    'elPaintAlEstiloXOne.SetFont "alexbrush.ttf"
    'elPaintAlEstiloXOne.SetFontSize "32"
    'elPaintAlEstiloXOne.SetFontStyle "bold"
    'elPaintAlEstiloXOne.AddTextSetXY "texto de prueba", 50, 50
    'elPaintAlEstiloXOne.AddImageSetXY "testbackground.png", 100, 200
    'elPaintAlEstiloXOne.Save "temporal_SplashbyXOne.jpg"
    'Set elPaintAlEstiloXOne = Nothing
    'ui.StartSignature "MAP_IMG", 640, 480, "temporalSplashbyXOne.jpg", "landscape"
    ui.StartSignature "MAP_IMG", 640, 480
    'self.MAP_IMG2='temporal_SplashbyXOne.jpg'
    'ui.refresh "MAP_IMG,MAP_IMG2"
End Function