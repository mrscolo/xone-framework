// Funcion para bloquear un listado de contents.
// listContents: Listado de contents
function lockContents(listContents){
    var content = null;
    for(var i = 0; i < listContents.length; i++){
        content = self.getContents(listContents[i]);
        if(content != null){
           content.lock(); 
        }
    }
}

// Funcion para inicializar los parametros de la coleccion EspecialChat
function inicializeChats(){
    self.MAP_GRUPOSEL=1;
    self.MAP_VERFLOTANTE=0;
    self.MAP_RECORDON=0;
    self.MAP_PHONE="";
    self.MAP_USERLOGIN=user.LOGIN;
    self.getContents("Chat").setMacro("##MACRO##",user.LOGIN);
    self.MAP_FOTO_FONDO = "fondo_chat.png";
}

// Function para crear el chat ...
function createChat(userFrom,userTo){
    var index = 0;
    var coll = self.getContents("Chat");
    coll.unlock();
    var obj = coll.findObject("(USUARIO='" + userFrom + "' AND USUARIO2='" + userTo + "') OR (USUARIO='" + userTo + "' AND USUARIO2='" + userFrom + "')");
    if(obj == null){
        obj = coll.createObject();
        obj.USUARIO=userFrom;
        obj.USUARIO2=userTo;
        obj.FECHA= new Date();
        obj.save(); 
    }
    index = obj.getObjectIndex();
    coll.lock();
    return index;
}

function openChat(index,mSelf){
    var coll = mSelf.getContents("Chat");
    coll.unlock();
    coll.loadAll();
    var obj = coll.get(index);
    mSelf.MAP_INDICESEL = index;
    mSelf.MAP_IDCHATSEL = obj.ID;
    mSelf.MAP_IMGTIPO = obj.MAP_IMAGEN;
	mSelf.MAP_CHATTITULO = obj.MAP_TITULO;
	mSelf.MAP_CCUSUARIO = obj.USUARIO2;
    coll.lock();
	ui.getView(mSelf).refresh("MAP_BTVERGENTE","MAP_IMGTIPO","MAP_CHATTITULO"); 
	mSelf.executeNode("abrirDrawer(2)");
}

function openListUser(){
    // habilitamos la visibilidad de la ventana flotante ...
    self.MAP_VERFLOTANTE=1;
    // desbloqueamos el content que contiene a los usuarios ya que lo hemos bloqueado en el nodo after-edit ...
    self.getContents("nUsuarios").unlock();
    self.getContents("nUsuarios").loadAll();
    self.getContents("nUsuarios").lock();
    // creamos el indice despues de cargar los usuarios, para poder buscar en memoria ...
    self.getContents("nUsuarios").createSearchIndex(["NOMBRE,"]);
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

function AccionesChatEspecial(parametro, evento) 
{
    var coll,obj,fecha;
    switch (parametro) {
        case 'nuevochat':
            // Aqui es donde vamos a crear un nuevo chat ...
            openListUser();
            break;
        case 'ok':
            // Aqui es donde ese crea el chat y se abre ...
            // creamos el chat, si no existiera ...
            var index = createChat(user.LOGIN,self.MAP_CCUSUARIO);
            // cerramos el menu de seleccion de usuarios ...
            closeListUser();
            // abrirmos el chat ...
            openChat(index,self);
            break;
        case 'llamada':
            //ver a quien llamamos
            //si es unico, es decir, personal, se llama al USUARIO
            //si es grupo: mostrar frame flotante, para llamar a uno de ellos
            if(self.MAP_PHONE.toString().length == 0){
                ui.msgBox("La persona con la que quiere contactar no tiene relleno el número de teléfono","Notificación",0);
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
                    sendMessage(self.getContents("Chatear"),self,"MAP_TITLE",true);
        	        self.MAP_TIPO = 0;
                    break;
                case 1:
                    sendMessage(self.getContents("Chatear"),self,"MAP_FOTO",true);
        	        self.MAP_TIPO = 0;
        	        break;
        	    case 2:
                    ui.stopAudioRecord();
                    sendMessage(self.getContents("Chatear"),self,"MAP_VOZGRABADA",true);
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
                self.getContents("nUsuarios").doSearch(evento.newText);
                ui.refresh("@nUsuarios");
            }
            break;
        
    }
}

function AccionesChat(parametro) 
{
    switch (parametro) {
        case 'ver':
            // abrirmos el chat ...
            openChat(self.getObjectIndex(),self.getOwnerCollection().getOwnerObject());
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

function sendMessage(colMUser,obj,title,isFromUser){
	if(obj[title].length != 0 ){
	  	var CollCV=appData.getCollection("MensajesReader");
		var ObjCV=CollCV.createObject();
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
		ObjCV.save();
		
		ui.startReplica();
		
		colMUser.unlock();
		addUserMessage(colMUser,ObjCV,-1,ObjCV.ROWID);
		colMUser.lock();
		
		//limpiamos
		self[title] = "";
		ObjCV = null;
		CollCV.clear();
		CollCV = null;
		
		ui.refresh("MensajesUsuarios",title);
	}
}

function fillMessagesContent(colMUser,page,cant) {
    var colMsg,obj,n,i,nInit,nEnd,ObjB;
	colMsg=appData.getCollection("MensajesReader");
 	colMsg.setFilter("IDCHAT="+self.MAP_IDCHATSEL+"");
	colMUser.unlock();
	colMUser.clear();
	colMUser.loadAll();
	colMsg.setSort("FECHA ASC");
	colMsg.startBrowse();
	while (colMsg.getCurrentItem() !== undefined && colMsg.getCurrentItem() != null) {
	    obj=colMsg.getCurrentItem();
		addUserMessage(colMUser,obj,0,obj.ROWID);
		colMsg.moveNext();
	}
	colMsg.endBrowse();
	colMsg.clear();
	colMsg = null;
	colMUser.lock();
	ui.refresh("Chatear");
}

function addUserMessage(colMUser,obj, index,sRowid) {
    
    var omuser,queue,fecha,dia,mes,anio;
    omuser=colMUser.createObject();
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