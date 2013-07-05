var $s, $evScope, $exec;

$bt = {
	events: {},
	event: {},
	chars: [],
	roster: [],
	officier: false,
	tag: null
};

(function(){

var $ = jQuery;

var removeDiacritics = (function() {
	var diacritics = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u0152":"OE","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u1E9E":"SS","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u0153":"oe","\u0276":"oe","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u017F":"s","\u1E9B":"s","\u00DF":"ss","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\uFF10":"0","\u2080":"0","\u24EA":"0","\u2070":"0", "\u00B9":"1","\u2474":"1","\u2081":"1","\u2776":"1","\u24F5":"1","\u2488":"1","\u2460":"1","\uFF11":"1", "\u00B2":"2","\u2777":"2","\u2475":"2","\uFF12":"2","\u2082":"2","\u24F6":"2","\u2461":"2","\u2489":"2", "\u00B3":"3","\uFF13":"3","\u248A":"3","\u2476":"3","\u2083":"3","\u2778":"3","\u24F7":"3","\u2462":"3", "\u24F8":"4","\u2463":"4","\u248B":"4","\uFF14":"4","\u2074":"4","\u2084":"4","\u2779":"4","\u2477":"4", "\u248C":"5","\u2085":"5","\u24F9":"5","\u2478":"5","\u277A":"5","\u2464":"5","\uFF15":"5","\u2075":"5", "\u2479":"6","\u2076":"6","\uFF16":"6","\u277B":"6","\u2086":"6","\u2465":"6","\u24FA":"6","\u248D":"6", "\uFF17":"7","\u2077":"7","\u277C":"7","\u24FB":"7","\u248E":"7","\u2087":"7","\u247A":"7","\u2466":"7", "\u2467":"8","\u248F":"8","\u24FC":"8","\u247B":"8","\u2078":"8","\uFF18":"8","\u277D":"8","\u2088":"8", "\u24FD":"9","\uFF19":"9","\u2490":"9","\u277E":"9","\u247C":"9","\u2089":"9","\u2468":"9","\u2079":"9"};
	return function (str) {
		var chars = str.split(''),
		    i = chars.length - 1,
		    alter = false,
		    ch;
		for (; i >= 0; i--) {
			ch = chars[i];
			if (diacritics.hasOwnProperty(ch)) {
				chars[i] =  diacritics[ch];
				alter = true;
			}
		}
		if (alter) {
			str = chars.join('');
		}
		return str;
	}
})();

var HTML5Nav = !!(window.history && window.history.pushState);

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+$=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\$\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
}

var BlowTools = angular.module("BlowTools", [], function() {
	// Stub
});

BlowTools.directive("eatClick", function() {
	return function(scope, element, attrs) {
		jQuery(element).click(function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
	}
});

var LocalScope = BlowTools.controller("LocalScope", function($scope) {});

var Calendar = BlowTools.controller("Calendar", function($scope) {
	$s = $scope;
	$exec = $scope.$apply.bind($scope);
	
	var dead = false;
	
	// --- Data store ----------------------------------------------------------
	
	$scope.$bt = $bt;
	
	$scope.standby = false;
	
	var update_timeout, last_tag;
	var tid = 0;
	var update_interval = 5000;
	var standby_counter = 0;
	var lock = false;
	
	var queue = [];
	
	$scope.showLoader = false;
	$scope.update = function(call, call_args, ignore_lock) {
		if(dead || ((lock || $bt.tag === false) && !ignore_lock)) {
			if(call)
				queue.push({ call: call, call_args: call_args });
			return;
		}
		
		clearTimeout(update_timeout);
		var this_tid = ++tid;
		
		if(call && !ignore_lock) {
			lock = true;
			$scope.showLoader = true;
		}
		
		if(!call) {
			if(++standby_counter > 35) {
				$scope.standby = true;
				return $exec();
			}
		} else {
			standby_counter = 0;
		}
		
		$bt.tag = false;
		
		var state = {
			c: call,
			ca: call_args,
			d: $scope.display,
			a: $scope.arg,
			m: $scope.month,
			y: $scope.year
		};
		
		jQuery.ajax({
			type: "POST",
			url: "/api.php",
			data: state, 
			success: function(data) {
				if(this_tid != tid) {
					return;
				}
				
				if(data.error) {
					console.log(data);
					$scope.error = data.error;
					if(data.fatal) {
						$scope.errorFatal = true;
						dead = true;
						return $exec();
					}
					
					delete data.error;
				}
				
				if(data.redirect) {
					$scope.setDisplay(data.redirect.display, data.redirect.arg, data.redirect.opts, false, true);
					delete data.redirect;
				}
				
				for(var key in data) {
					$bt[key] = data[key];
				}
				
				if(call && !ignore_lock) {
					lock = false;
					if(queue.length > 0) {
						var c = queue.shift();
						$scope.update(c.call, c.call_args);
					} else {
						$scope.showLoader = false;
					}
				}
				
				if($bt.chars.length < 1 && $scope.display != "characters" && $scope.display != "associate") {
					$scope.display = "characters";
					last_tag = false;
				}
				
				if(!last_tag || last_tag != $bt.tag) {
					last_tag = $bt.tag;
					update_interval = 6000;
					standby_counter = 0;
					$exec();
				} else {
					if(update_interval < 30000) {
						update_interval += 2000;
					}
					if(call && !ignore_lock) $exec();
				}
				
				if(data.display == "event") {
					$exec(function() { $evScope.initViewer(); });
				}
				
				if(this_tid != tid) {
					return;
				}
				
				clearTimeout(update_timeout);
				
				if(state.d != $scope.display || state.a !== $scope.arg || state.m != $scope.month || state.y != $scope.year) {
					$scope.update();
				} else {
					update_timeout = setTimeout($scope.update, update_interval);
				}
			},
			error: function() {
				$scope.error = "Une erreur réseau fatale s'est produite. Actualisez la page pour continuer.";
				$scope.errorFatal = true;
				$scope.showLoader = false;
				return $exec();
			},
			dataType: "json"
		});
	};
	
	$scope.exitStandby = function() {
		standby_counter = 0;
		update_interval = 10000;
		$scope.standby = false;
		$scope.update();
	};
	
	// --- Navigator -----------------------------------------------------------
	
	var now = new Date();	
	$scope.month = now.getMonth();
	$scope.year = now.getFullYear();
	
	$scope.monthNext = function() { 
		$scope.month += 1;
		if($scope.month > 11) {
			$scope.month = 0;
			$scope.year += 1;
		}
		$scope.update();
	};
	
	$scope.monthPrev = function() {
		$scope.month -= 1;
		if($scope.month < 0) {
			$scope.month = 11;
			$scope.year -= 1;
		}
		$scope.update();
	};
	
	// --- Strings -------------------------------------------------------------
	
	$scope.monthNames = [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Octobre",
		"Novembre",
		"Décembre"
	];
	
	$scope.dayNames = [
		"Lundi", 
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
		"Dimanche"
	];
	
	// --- Data Magic ----------------------------------------------------------
	
	var data = [];
	
	var update_cell_events = function(cell, day) {
		if($bt.tag && $bt.tag == cell.events_tag) return; else cell.events_tag = $bt.tag;
		
		if(!cell.events || cell.events_id != day || !$bt.events[day]) cell.events = [];
		if(!$bt.events[day]) return;
		
		cell.events_id = day;
		var events = $bt.events[day];
		
		// Removes deleted events
		cell.events = cell.events.filter(function(event) {
			return events.some(function(event2) { return event.id == event2.id; });
		});
		
		// Add missing events
		events.forEach(function(event) {
			if(!cell.events.some(function(event2) { 
				if(event.id == event2.id) {
					for(var key in event)
						event2[key] = event[key];
					return true;
				}
				return false;
			})) {
				cell.events.push(event);
			}
		});
		
		// Sort them all!
		cell.events.sort(function(a, b) {
			return a.hour.localeCompare(b.hour);
		});
	};
	
	var add_zero = function(i) {
		return (i < 10) ? "0" + i: "" + i;
	};
	
	$scope.getCalendarData = function() {
		var last_month = new Date($scope.year, $scope.month, 0);
		var days_in_last_month = last_month.getDate();
		var last_month_id = last_month.getMonth();
		var last_month_year = last_month.getFullYear();
		
		var next_month = new Date($scope.year, $scope.month + 1, 1);
		var next_month_id = next_month.getMonth();
		var next_month_year = next_month.getFullYear();
		
		var days_in_month = (new Date($scope.year, $scope.month + 1, 0)).getDate();
		var first_month_day = ((new Date($scope.year, $scope.month, 1).getDay()) + 6) % 7;
		
		var today = new Date();
		
		for(var r = 0; r < 6; r++) {
			if(!data[r]) data[r] = [];
			
			for(var c = 0; c < 7; c++) {
				if(!data[r][c]) data[r][c] = {};
				
				var day = 7 * r + c - first_month_day + 1;
				var month = $scope.month;
				var year = $scope.year;
				
				if(day < 1) {
					day = days_in_last_month + day
					month = last_month_id;
					year = last_month_year;
				} else if(day > days_in_month) {
					day = day - days_in_month
					month = next_month_id;
					year = next_month_year;
				}
				
				var cell = data[r][c];
				cell.day = day;
				cell.month = month + 1;
				cell.year = year;
				cell.inactive = (month != $scope.month);
				cell.today = (year == today.getFullYear() && month == today.getMonth() && day == today.getDate());
				cell.id = year + "-" + add_zero(month + 1) + "-" + add_zero(day);
				
				update_cell_events(cell, cell.id);
			}
		}
		
		return data;
	};
	
	var chars = [];
	var chars_tag;
	
	$scope.getChars = function() {
		if($bt.tag && $bt.tag == chars_tag) return chars; else chars_tag = $bt.tag;
	
		chars = chars.filter(function(c) {
			return $bt.chars.some(function(c2) { return c.name == c2.name && c.server == c2.server; });
		});
		
		$bt.chars.forEach(function(c) {
			if(!chars.some(function(c2) { 
				if(c.name == c2.name && c.server == c2.server) {
					for(var key in c)
						c2[key] = c[key];
					return true;
				}
				return false;
			})) {
				chars.push(c);
			}
		});
		
		chars.sort(function(a, b) {
			if(a.main != b.main) return a.main ? -1 : 1;
			else if(a.active != b.active) return a.active ? -1 : 1;
			else return a.name.localeCompare(b.name);
		});
		
		return chars;
	};
	
	$scope.rolesString = {
		TANK: "Tank",
		DPS: "DPS",
		HEALING: "Heal"
	};
	
	$scope.getRolesForClass = function(c) {
		return $bt.classRoles[c];
	};
	
	$scope.formatDate = function(date) {
		return date ? date.replace(/(\d+)-(\d+)-(\d+) (\d+):(\d+).*/, "$3/$2/$1 $4:$5") : "";
	};
	
	// --- Paging stuff --------------------------------------------------------
	
	$scope.display = "calendar";
	
	//$scope.display = "event";
	//$scope.arg = { id: 3, title: "Mercredi 5", type: 1 };
	
	var allowedDisplays = [
		"calendar",
		"absences",
		"event",
		"editevent",
		"characters",
		"associate"
	];
	
	var doDisplayUpdate = function(display, arg, opts) {
		if(!allowedDisplays.some(function(d) { return d == display; })) {
			display = "calendar";
		}
		
		if($evScope && display != "event") {
			$evScope.resetViewer();
		}
		
		$scope.arg = arg;
		$scope.opts = opts;
		$scope.display = display;
	};
	
	$scope.setDisplay = function(display, arg, opts, back, no_update) {
		if($bt.chars.length < 1 && display != "characters" && display != "associate") {
			$scope.error = "L'association d'au-moins un personnage est nécessaire avant d'avoir accès aux fonctionnalités de registering.";
			return;
		}
		
		doDisplayUpdate(display, arg, opts);
		
		if(HTML5Nav) {
			var url = (display == "calendar") ? "/" : "/" + display;
			if(arg) {
				if(typeof arg == "number")
					url += "/" + arg;
				else
					url += "/$" + Base64.encode(JSON.stringify(arg));
			}
			history.pushState(opts, null, url);
		}
		
		if(!no_update) {
			$scope.update();
		}
	};
	
	$scope.updateDisplay = function(opts) {
		var parts = location.pathname.split("/");
		if(parts[2] && parts[2].charAt(0) == '$') {
			parts[2] = JSON.parse(Base64.decode(parts[2]));
		}
		doDisplayUpdate(parts[1], parts[2], opts || {});
		$scope.update();
	};
	
	$scope.updateDisplay();
	
	// --- Announces -----------------------------------------------------------
	
	var last_announce;
	
	$scope.announce = function(which, preview) {
		if(!preview && last_announce == which)
			return ($scope.error = "Cette annonce vient d'être envoyée");
	
		var announce = false;
		
		switch(which) {
			case "event-new":
			case "event-registering":
			case "event-comp-available":
			case "event-off":
				if($evScope)
					announce = $evScope.announce(which, preview);
				break;
		}
		
		if(announce) {
			if(preview) {
				return "« " + announce.replace(/<[^>]+>/g, "") + " »"
			} else {
				last_announce = which;
				return $scope.update("announce", announce);
			}
		} else {
			if(preview) {
				return "[ Cette annonce ne peux pas être envoyée ]"
			} else {
				$scope.error = "Cette annonce ne peux pas être envoyée.";
			}
		}
	};
	
	// --- Bootstrap -----------------------------------------------------------
	
	var decline_modal = false;
	$scope.showDeclineModal = function() {
		return decline_modal;
	};
	
	$scope.displayDeclineModal = function(event) {
		decline_modal = event;
		setTimeout(function() {
			jQuery("#declineReasonInput").focus();
		}, 50);
	};
	
	$scope.hideDeclineModal = function(reason) {
		if(reason) {
			$scope.update("register", { id: decline_modal, answer: 2, note: reason });
		}
		decline_modal = false;
	};
	
	$scope.update();
});

var RosterBrowser = BlowTools.controller("RosterBrowser", function($scope) {
	$scope.getRoster = function() {
		var roster = $scope.$bt.roster.filter(function(c) { return !$scope.search || removeDiacritics(c.name).toLowerCase().match(removeDiacritics($scope.search).toLowerCase()); });
		roster.sort(function(a, b) { return removeDiacritics(a.name).localeCompare(removeDiacritics(b.name)); });
		return roster;
	}
});

var EventViewer = BlowTools.controller("EventViewer", function($scope) {
	$evScope = $scope;
	
	$scope.tab = 1;
	$scope.initDone = false;
	$scope.dragging_char = {};
	$scope.dragging_slot = false;
	$scope.data_available = false;
	
	$scope.initViewer = function() {
		if($scope.initDone) {
			return;
		}
		
		$scope.id = $bt.event.id;
		$scope.answer = $bt.event.answer;
		$scope.note = $bt.event.note;
		
		$scope.initDone = true;
		$scope.data_available = true;
	};
	
	var ev_cache = {};
	var ev_tag;
	
	$scope.resetViewer = function() {
		$scope.tab = 1;
		$scope.initDone = false;
		$scope.data_available = false;
		
		$scope.id = 0;
		$scope.answer = 0;
		$scope.note = "";
		
		$scope.dragging_char = {};
		
		ev_tag = false;
		ev_cache = {};
	};
	
	$scope.getEvent = function() {
		if($bt.tag && $bt.tag == ev_tag) return ev_cache; else ev_tag = $bt.tag;
		
		if($bt.tag) {
			for(var key in $bt.event) {
				if(key == "answers") {
					ev_cache["answers"] = $bt.event["answers"].map(function(e) {
						var $$hashKey;
						if(ev_cache["answers"]) {
							ev_cache["answers"].some(function(e2) {
								if(e.name == e2.name && e.server == e2.server) {
									$$hashKey = e2.$$hashKey;
									return true;
								}
								return false;
							});
						}
						e.$$hashKey = $$hashKey;
						return e;
					});
				} else {
					ev_cache[key] = $bt.event[key];
				}
			}
		}
		
		if(!ev_cache["answers"]) ev_cache["answers"] = [];
		if(!ev_cache["raidcomp"]) ev_cache["raidcomp"] = {};
		return ev_cache;
	};
	
	$scope.getAvailableCount = function() {
		return $scope.getEvent().answers.filter(function(a) { return a.answer == 1; }).length;
	};
	
	$scope.getUnavailableCount = function() {
		return $scope.getEvent().answers.filter(function(a) { return a.answer == 2; }).length;
	};
	
	$scope.getNonregisterCount = function() {
		return $scope.getEvent().answers.filter(function(a) { return a.group_id != 11 && a.answer == 0; }).length;
	};
	
	$scope.getTabChars = function() {
		return $scope.getEvent().answers.filter(function(a) { return (a.group_id == 11 && $scope.tab == 0) ? false : a.answer == $scope.tab; });
	};
	
	$s.getEventID = function() {
		return $scope.getEvent().id || 0;
	};
	
	$s.getEventType = function() {
		return $scope.getEvent().type || ($s.opts && $s.opts.type);
	};
	
	$s.getEventTitle = function() {
		return $scope.getEvent().title || ($s.opts && $s.opts.title);
	};
	
	// Raid comp
	
	var offset;
	var slots, slotHover;
	var slotWidth, slotHeight;
	
	var max_comp = 0;
	$scope.current_comp = 0;
	
	$scope.addComp = function() {
		max_comp++;
	};
	
	$scope.canAddComp = function() {
		return max_comp < 3;
	};
	
	$scope.getCompCount = function() {
		var max = Math.max(max_comp, $scope.current_comp);
		for(var comp in $scope.getEvent().raidcomp) {
			if(comp > max) max = comp;
		}
		
		var comps = [];
		for(var i = 0; i <= max; i++) {
			comps.push(i);
		}
		
		return comps;
	};
	
	$scope.setComp = function(i) {
		$scope.current_comp = i;
	};
	
	$scope.compHasSelf = function(i) {
		var comp = $scope.getEvent().raidcomp[i];
		if(comp) {
			for(var slot in comp) {
				if(comp[slot].owner == $bt.chars[0].owner) {
					return true;
				}
			}
		}
		
		return false;
	};
	
	$scope.computeSlotId = function(group, slot) {
		return (group - 1) * 5 + slot;
	};
	
	$scope.isCharUsed = function(id) {
		if(id == $scope.dragging_char.id) {
			return true;
		}
		
		var raidcomp = $scope.getEvent().raidcomp;
		for(var comp in raidcomp) {
			for(var slot in raidcomp[comp]) {
				if(raidcomp[comp][slot].id == id) {
					return true;
				}
			}
		}
		
		return false;
	};
	
	$scope.dragStart = function(id, e, group, slot) {
		var event = $scope.getEvent();
		
		if(!event.editable || event.state) return false;
		
		var c = false;
		event.answers.some(function(a) {
			if(a.id == id) {
				c = a;
				return true;
			}
			return false;
		});
		
		if(!c) return false;
	
		if(group && slot)
			$scope.dragging_slot = $scope.computeSlotId(group, slot);
		$scope.dragging_char = c;
		
		offset = $(".event-viewer").offset();
		offset.left -= 15;
		offset.top -= 15;
		
		slots = [];
		$(".raidcomp .slot").each(function(i, s) {
			var $s = $(s);
			
			slotWidth = $s.width();
			slotHeight = $s.height();
			
			var offset = $s.offset();
			offset.$ = $s;
			slots.push(offset)
		});
		
		slotHover = false;
		
		$scope.dragUpdate(e);
		
		$exec();
		return false;
	};
	
	$scope.dragStop = function() {
		var sourceSlot = $scope.dragging_slot;
			
		if(slotHover) {
			var destSlot = slotHover.data("slotid");
			
			if(!sourceSlot|| sourceSlot != destSlot) {
				$scope.update("set-raidcomp", {
					event: $bt.event.id,
					comp: $scope.current_comp,
					slot: destSlot,
					char: $scope.dragging_char.id
				}, true);
			}
		
			slotHover.removeClass("hover");
			slotHover = false;
		} else if(sourceSlot) {
			$scope.update("unset-raidcomp", {
				event: $bt.event.id,
				comp: $scope.current_comp,
				slot: sourceSlot
			}, true);
		}
		
		offset = false;
		$scope.dragging_char = {}
		$scope.dragging_slot = false;
		
		$exec();
		return false;
	};
	
	$scope.dragUpdate = function(e) {
		if(!offset) return;
		
		$("#dragIndicator").css({ left: e.pageX - offset.left, top: e.pageY - offset.top });
		
		var hover = false;
		
		slots.forEach(function(s) {
			if(e.pageX >= s.left && e.pageX <= s.left + slotWidth && e.pageY >= s.top && e.pageY <= s.top + slotHeight) {
				hover = s.$;
				s.$.addClass("hover");
			} else {
				s.$.removeClass("hover");
			}
		});
		
		slotHover = hover;
	};
	
	$scope.getCharForSlot = function(group, slot) {
		var comp = $scope.getEvent().raidcomp[$scope.current_comp];
		var slot = $scope.computeSlotId(group, slot);
		return (comp && comp[slot]) || false;
	};
	
	$scope.slotWarning = function(group, slot) {
		var char = $scope.getCharForSlot(group, slot);
		if(char) {
			if($scope.getEvent().answers.some(function(a) {
				return a.owner == char.owner && a.answer != 1;
			})) {
				return "Ce joueur n'est pas enregistré comme disponible"
			}
			
			if($scope.getEvent().raidcomp.some(function(rc, i) {
				if(i == $scope.current_comp) return false;
				for(var slot in rc) {
					if(rc[slot].id == char.id) {
						return true;
					}
				}
			})) {
				return "Ce personnage est dans plusieurs raid-comp simultanément"
			}
		}
		return false;
	}
	
	$scope.setEventState = function(state) {
		$scope.update('set-event-state', { event: $scope.getEvent().id, state: state });
	};
	
	$scope.$watch('getEvent().event_note', function(newValue) {
		$scope.eventNoteText = newValue;
	});
	
	$scope.setEventEditing = function(force) {
		if(force === null) {
			$scope.update('set-event-editing', { event: $scope.getEvent().id, editing: "", text: $scope.eventNoteText });
		} else {
			$scope.update('set-event-editing', { event: $scope.getEvent().id, editing: $bt.username, force: force });
		}
	};
	
	$scope.announce = function(which, preview) {
		if(!$scope.data_available)
			return false;
			
		var e = $scope.getEvent();
		var title = "<b>" + e.title + "</b> à <b>" + e.date.match(/\d{2}:\d{2}/)[0] + "</b>";
		
		if(e.state && which != "event-new") return false;
			
		switch(which) {
			case "event-new":
				return "De nouveaux événements sont disponibles sur le calendar. Pensez à vous register.";
				
			case "event-registering":
				var nr = e.answers.filter(function(a) { return (a.group_id == 11) ? false : a.answer == 0; });
				var nrString = nr.reduce(function(a, b) { return (a ? a + ", " : "") + "<b class='c" + b.class + "'>" + b.name + "</b>"; }, "")
				
				var strings;
				switch(nr.length) {
					case 0:
						return false;
					
					case 1:
						strings = ["Oubli", "te register"];
						break;
					
					default:
						strings = ["Oublis", "vous register"];
						break;
				}
				
				return strings[0] + " de registering pour " + title + ": " + nrString + ". Merci de " + strings[1] + " au plus vite.";
				
			case "event-comp-available":
				if(!preview) $scope.update("set-event-state", { event: e.id, state: 1 });
				return "La compo pour l'événement " + title + " est maintenant disponible.";
			
			case "event-off":
				if(!preview) $scope.update("set-event-state", { event: e.id, state: 2 });
				return "L'événement " + title + " est annulé. Pensez à vous register pour les prochains événments.";
		}
	};
});

BlowTools.controller("RaidCompSlot", function($scope, $element) {
	console.log("init raid comp slot", $element.data("slotid"));
});

BlowTools.directive("raidUnit", function() {
	return {
		restrict: "E",
		replace: true,
		scope: { charid:"@" },
		templateUrl: 'RaidUnitTpl',
		link: function(scope, element, attrs) {
			scope.char = { role: "DPS" }
		}
	};
});

BlowTools.filter("markdown", function() {
	var markdown = new Showdown.converter();
	return function(input) {
		return markdown.makeHtml(input);
	};
});

if(HTML5Nav) {
	window.addEventListener("popstate", function(e) {
		$s.updateDisplay(e.state);
		$exec();
	});
}

/*
jQuery(function($) {
	$(document).mousemove(function(event) {
		$("#loader").css({left: event.pageX + 10, top: event.pageY + 10});
	});
});
*/

})();
