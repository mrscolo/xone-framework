function VBScriptSupport() {
	this.cstr = function(value) {
		return safeToString(value);
	};
 
	this.now = function() {
		return new Date();
	};
 
	this.len = function(str) {
		return safeToString(str).length;
	};
 
	this.cint = function(value) {
		return parseInt(value);
	};
 
	this.left = function(str, n) {
		if (n <= 0) {
			return new String();
		} else if (n > String(str).length) {
			return safeToString(str);
		} else {
			return safeToString(str).substring(0, n);
		}
	};
 
	this.replace = function(source, search, replacement) {
		source = safeToString(source);
		search = safeToString(search);
		replacement = safeToString(replacement);
		search = escapeRegularExpression(search);
		source.replace(search, replacement);
		return source;
	};
 
	this.day = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getDate();
	};
 
	this.month = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getMonth();
	};
 
	this.year = function(mDate) {
		mDate = safeToDate(mDate);
		return mDate.getFullYear();
	};
 
	this.right = function(str, n) {
		str = new String(str);
		if (n <= 0 || n > str.length) {
			return str;
		} else {
			var iLen = str.length;
			return str.substring(iLen, iLen - n);
		}
	};
 
	this.mid = function(str, start, len) {
		if (start < 0 || len < 0) {
			return str;
		}
		var iEnd, iLen = new String(str).length;
		if (start + len > iLen) {
			iEnd = iLen;
		} else {
			iEnd = start + len;
		}
		return new String(str).substring(start, iEnd);
	};
 
	this.inStr = function(strSearch, charSearchFor) {
		for (i = 0; i < len(strSearch); i++) {
			if (charSearchFor == mid(strSearch, i, 1)) {
				return i;
			}
		}
		return -1;
	};
 
	this.lcase = function(str) {
		if (isString(str)) {
			return str.toLowerCase();
		}
		return new String(str).toLowerCase();
	};
 
	this.ucase = function(str) {
		if (isString(str)) {
			return str.toUpperCase();
		}
		return new String(str).toUpperCase();
	};
 
	this.abs = function(value) {
		return Math.abs(value);
	};
 
	this.trim = function(str) {
		str = safeToString(str);
		return str.trim();
	};
 
	this.split = function(str, delimiter) {
		return str.split(delimiter);
	};
 
	this.dateDiff = function(sPeriod, mDate1, mDate2) {
		mDate1 = safeToDate(mDate1);
		mDate2 = safeToDate(mDate2);
		nDiff = Math.abs(mDate1.getTime() - mDate2.getTime());
		switch(sPeriod) {
			case "h":
				return nDiff / 3600000;
			case "n":
				return nDiff / 60000;
			default:
				throw new Error("dateDiff(): Unknown date period " + sPeriod);
		}
	};
 
	this.dateAdd = function(sPeriod, nNumber, mDate) {
		mDate = safeToDate(mDate);
		switch(sPeriod) {
			case "yyyy":
				//Year
				mDate.setYear(mDate.getYear() + nNumber);
				return mDate;
			case "q":
				//Quarter
				return mDate;
			case "m":
				//Month
				mDate.setMonth(mDate.getMonth() + nNumber);
				return mDate;
			case "y":
				//Day of year
				return mDate;
			case "d":
				//Day
				mDate.setDate(mDate.getDate() + nNumber);
				return mDate;
			case "w":
				//Weekday
				return mDate;
			case "ww":
				//Week of year
				return mDate;
			case "h":
				//Hour
				mDate.setHours(mDate.getHours() + nNumber);
				return mDate;
			case "n":
				//Minute
				mDate.setMinutes(mDate.getMinutes() + nNumber);
				return mDate;
			case "s":
				//Second
				mDate.setSeconds(mDate.getSeconds() + nNumber);
				return mDate;
			default:
				throw new Error("dateAdd(): Unknown date period " + sPeriod);
		}
	};
}
 
var vbSupport = new VBScriptSupport();
 
function isNothing(obj) {
	if (obj === null) {
		return true;
	}
	if (obj == "undefined") {
		return true;
	}
	return false;
}
 
function isSomething(obj) {
	if (obj === null) {
		return false;
	}
	if (obj == "undefined") {
		return false;
	}
	return true;
}
 
function getClassName(obj) {
	if(isNothing(obj)) {
		return null;
	}
	return obj.constructor.name;
}
 
function isFloatNumber(n) {
	return n === +n && n !== (n | 0);
}
 
function isIntegerNumber(n) {
	return n === +n && n === (n | 0);
}
 
function isNumber(obj) {
	if (isNothing(obj)) {
		return false;
	}
	return !isNaN(parseFloat(obj)) && isFinite(obj);
}
 
function isString(obj) {
	return typeof obj === 'string' || obj instanceof String;
}
 
function isEmptyString(obj) {
	if(!isString(obj)) {
		return false;
	}
	return(!obj || 0 === obj.length);
}
 
function isDate(obj) {
	if (obj instanceof Date) {
		return true;
	}
	return false;
}
 
function safeToString(value) {
	if(isNothing(value)) {
		return new String();
	}
	return new String(value);
}
 
function safeToDate(mDate) {
	if(isDate(mDate)) {
		return mDate;
	}
	return new Date(replaceAll(safeToString(mDate), '-', '/'));
}
 
function escapeRegularExpression(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
 
function replaceAll(sSource, sSearch, sReplacement) {
	sSearch = escapeRegularExpression(sSearch);
	return sSource.split(sSearch).join(sReplacement);
}


