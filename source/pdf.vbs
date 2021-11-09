function AddTableCellText(pdf, cellText, leftBorder, topBorder, rightBorder, bottomBorder)
	pdf.SetCellBorder "none"
	if leftBorder then
		pdf.SetCellBorder "left"
	end if
	if rightBorder then
		pdf.SetCellBorder "right"
	end if
	if topBorder then
		pdf.SetCellBorder "top"
	end if
	if bottomBorder then
		pdf.SetCellBorder "bottom"
	end if
	pdf.AddCellText cellText
end function
 
function GeneratePDFDocument()
	Dim pdf01
	Set pdf01=CreateObject("XOnePDF")
	pdf01.Create "PDFbyXOne.pdf"
	pdf01.Open
	
	pdf01.SetFont "helvetica"
	pdf01.SetFontSize 12
	pdf01.SetFontStyle "normal"
	pdf01.SetFontColor "#000000"
	
	pdf01.CreateTable 1
	pdf01.SetTableCellWidths 400
	AddTableCellText pdf01,"",0,0,0,0
	pdf01.SetAlignment "center"
	AddTableCellText pdf01, "Prueba Crear PDF", 0, 0, 0, 0
	pdf01.AddTable
	
	pdf01.SetFontSize 9
	
	
	pdf01.CreateTable 1
	pdf01.SetTableCellWidths 400
	AddTableCellText pdf01, " ", 0, 0, 0, 0
	pdf01.AddTable
	
	pdf01.CreateTable 3
	pdf01.SetTableCellWidths 280, 70, 50
	AddTableCellText pdf01,"",0,0,0,0
	pdf01.SetAlignment "left"
	AddTableCellText pdf01, "Serie: ", 1, 1, 0, 0
	pdf01.SetAlignment "center"
	AddTableCellText pdf01, cstr(this("MAP_PDFSERIE")),0,1,1,0
	pdf01.AddTable
	
	pdf01.CreateTable 6
	pdf01.SetTableCellWidths 60, 70, 60, 90, 30, 90
	pdf01.SetAlignment "left"
	AddTableCellText pdf01, "FECHA ", 1, 1, 0, 1
	pdf01.SetAlignment "center"
	AddTableCellText pdf01, getDate(this("MAP_PDFFECHA")),0,1,1,1	
	pdf01.SetAlignment "left"
	AddTableCellText pdf01, " ", 0, 1, 0, 1
	pdf01.SetAlignment "center"
	AddTableCellText pdf01, "",0,1,1,1
	pdf01.SetAlignment "left"
	AddTableCellText pdf01, "N�: ", 0, 1, 0, 1
	pdf01.SetAlignment "center"
	AddTableCellText pdf01, cstr(this("MAP_PDFNUMERO")),0,1,1,1
	pdf01.AddTable
	
	pdf01.CreateTable 1
	pdf01.SetTableCellWidths 400
	AddTableCellText pdf01,"",0,0,0,0
	pdf01.SetAlignment "left"
	AddTableCellText pdf01, cstr(this("MAP_PDFTEXT")), 0, 0, 0, 0
	pdf01.AddTable
	
	pdf01.AddImageSetXY "faro.jpg", 200,100, 150, 75
	
	pdf01.Close
	
	pdf01.flattenpdf ""
	
	a=ui.MsgBox ("Quiere Abrir el PDF?","PDF GENERADO",4)
	if a=6 then
		pdf01.LaunchPDF "PDFbyXOne.pdf"
	end if
	
	set pdf01=nothing
end function

function getDate(stdate)
	getDate = ""
	getDate = mid(cstr(stdate),1,11)
	exit function
end function