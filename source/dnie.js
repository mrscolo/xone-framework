
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