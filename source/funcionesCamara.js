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

function getSupportedAspectRatios() {
    let control = getControl("MAP_CAMERA");
    if (!control) {
        return;
    }
    let allAspectRatios = control.getSupportedAspectRatios();
    let sMessage = "Relaciones de aspecto soportadas: ";
    for (let i = 0;i < allAspectRatios.length;i++) {
        sMessage = sMessage + "\n" + allAspectRatios[i];
    }
    ui.msgBox(sMessage, "Mensaje", 0);
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