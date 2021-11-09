let appData,self,ui;
module.exports.__SCRIPT_WRAPPER = function(appData, ui, self, functionString, Arguments) {
    appData=appDataVal;
    ui = uiVal;
    self = selfVal;
    if (typeof functionString == 'string') eval(functionString);
     else functionString.call(this,Arguments);
}

module.exports.__SCRIPT_WRAPPERASYNC = async function(appDataVal,uiVal, selfVal, functionString,Arguments) {
    appData=appDataVal;
    ui = uiVal;
    self = selfVal;
    if (typeof functionString == 'string') await eval(functionString);
    else await functionString.call(this,Arguments);
}

function EspecialPerifericos_onfocusgrupo() {

      		    self.MAP_GROUP = index;
      		    ui.refresh("MAP_LAST,MAP_NEXT,MAP_LAST_EMPTY");
		
}

async function EspecialPerifericos_basico() {

				var pdf01 = createObject("XOnePDF");
				await GenerarPDFBasico("basico.pdf",pdf01,self.MAP_SHOWGRID);
				pdf01 = null;
			
}

async function EspecialPerifericos_pdf1() {

				//Hemos incluido los dos ficheros necesarios para que funcione este ejemplo.
				//Lo ideal es ponerlos en la colección "Empresas", que se carga al inicio de la aplicación.
				var pdf01 = createObject("XOnePDF");
				await GenerarPDF1("basico.pdf",pdf01,self.MAP_SHOWGRID);
				ui.refresh("MAP_NAME_PDF");
				pdf01 = null;
			
}

async function EspecialPerifericos_pdf2() {

			
			    var pdf01 = createObject("XOnePDF");
				await CrearPdf_Factura("factura.pdf",pdf01,self.MAP_SHOWGRID);
				
			
}

async function EspecialPerifericos_pdf_checks() {

				ui.updateWaitDialog("Generando PDF...", 0);
				var pdf01 = createObject("XOnePDF");
				await GenerarPDFChecks("checks.pdf",pdf01,self.MAP_SHOWGRID);
				pdf01 = null;
			
}

function EspecialPerifericos_pdf5() {

				generatePdfDemo();
			
}

async function EspecialPerifericos_pdf3() {

				ui.updateWaitDialog("Generando PDF...", 0);
				var pdf01 = createObject("XOnePDF");
				await GenerarPDF3("pdf3.pdf",pdf01,self.MAP_SHOWGRID);
				pdf01 = null;
			
}

async function EspecialPerifericos_pdf3apaisado() {

				ui.updateWaitDialog("Generando PDF...", 20);
				var pdf01 = createObject("XOnePDF");
				await GenerarPDF3Apaisado("pdf3apaisado.pdf",pdf01,self.MAP_SHOWGRID);
				pdf01 = null;
			
}

async function EspecialPerifericos_accion() {

      		switch (param) {
      			case "mail":
      				await EnviarMail("NO");
      				break;
      			case "mailsi":
      				await EnviarMail("SI");
      				break;
      			case "mailsicancel":
      				self.MAP_VISIBLE=0;
      				break;
      			case "pdf":
      				if (len(self.MAP_PDFSERIE)===0 || self.MAP_PDFNUMERO===0 || len(self.MAP_PDFFECHA)===0 || len(self.MAP_PDFTEXT)===0)
      					appData.failWithMessage (-8100,"Todos los campos son obligatorios");
      				else
      					await GeneratePDFDocument();
      				break;
      			case "cbarras":
      				await CodigoBarras();
      				break;
      			case "compartir":
					ui.captureImage ("captureimg","group4Frame");
					ui.shareData ("Compartir byXOne:" + cstr(self.MAP_COMPARTIR),"",self.captureimg);
					break;
				default:
					await ui.msgBox ("No pulso ninguna opción valida","AVISO",0);
					break;
      		}
		
}

function EspecialPerifericos_signPdfDemo() {

          signPdfDemo();
		
}

function EspecialPerifericos_enableDnieReader() {

          enableDnieReader();
		
}

function EspecialPerifericos_sendSignedPdf() {

          sendSignedPdf();
		
}

function EspecialPerifericos_field() {
			
				if (self.MAP_CHECKBOX1 ==1){
					self.MAP_CHECKBOX2 = 0;
				}
			
}

function EspecialPerifericos_field() {
			
				if (self.MAP_CHECKBOX2 == 1){
					self.MAP_CHECKBOX1 = 0;
				}
			
}

function EspecialPerifericos_before_edit() {
			
			appData.getCurrentEnterprise().setVariables("OBJETO",self);
			self.MAP_VISIBLE=0;
			self.MAP_BANDERA=0;
			self.MAP_CHECKBOX1=1;
			self.MAP_GROUP2=1;
			self.MAP_TOTAL_PAGES=4;
			switch (self.TIPO) {
      			case "MAIL":
      				self.MAP_GROUP2=1;
      		        self.MAP_GROUP=1;
			        self.MAP_TOTAL_PAGES=1;
      				break;
      			case "PDF":
      			    self.MAP_GROUP2 = 2;
      				self.MAP_GROUP=1;
			        self.MAP_TOTAL_PAGES=2;
      				break;
      			case "STARTSCANNER":
      				self.MAP_GROUP2=4;
      				self.MAP_GROUP=1;
			        self.MAP_TOTAL_PAGES=1;
      				break;
      			case "COMPARTIR":
      				self.MAP_GROUP2=5;
      				self.MAP_GROUP=1;
			        self.MAP_TOTAL_PAGES=1;
      				break;
				default:
					self.MAP_GROUP2=1;
					self.MAP_GROUP=1;
			        self.MAP_TOTAL_PAGES=1;
					break;
			}
      		self.MAP_CAN_NUMBER = "";
            self.MAP_PIN = "";
		
}

function EspecialPerifericos_onback() {

				appData.failWithMessage(-11888,"##EXIT##");
			
}

