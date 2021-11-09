function testClick(e)
	ui.MsgBox e.target,"Test",0
end function

function frameScroll(e) 
	if e.dy<=10 and this("MAP_SHOWOVERSCROLL")=1 then
		this("MAP_SHOWOVERSCROLL")=0
		ui.getView(this).refresh "froverscroll"
	else 
		if e.dy>10 and this("MAP_SHOWOVERSCROLL")=0 then
			this("MAP_SHOWOVERSCROLL")=1
			ui.getView(this).refresh "froverscroll"
		end if
	end if
end function
   
Function EscanearMatricula(RutaImagen)
	ocr = CreateObject("XOneOCR")
	EscanearMatricula = ocr.ScanLicensePlate(RutaImagen)
End Function

Function EscanearTexto(RutaImagen)
	ocr = CreateObject("XOneOCR")
	EscanearTexto = ocr.ScanText(RutaImagen, "áéíóúÁÉÍÓÚqwertyuiopasdfghjklzxcvbnñmQWERTYUIOPASDFGHJKLZXCVBNÑM")
End Function