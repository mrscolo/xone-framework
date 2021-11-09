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
 
function GeneratePDFDocument() {
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
	if (ui.msgBox("Quiere Abrir el PDF?","PDF GENERADO",4)===6)
		pdf01.launchPDF ("PDFbyXOne.pdf");
	
	
	pdf01=null;
}

function getDate(stdate) {
    return stdate.toString().substr(0,11);
    
// 	getDate = ""
// 	getDate = mid(cstr(stdate),1,11)
// 	exit function
}