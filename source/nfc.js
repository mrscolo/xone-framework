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