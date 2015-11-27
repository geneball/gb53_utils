/**
 * gb53.net utils module - 
 * @module gb53_utils
 */
'use strict';

// modules packaged into vendor_bundle.js
var $ = require('jquery');
var moment = require('moment');
var sprintf = require('sprintf');
var expect = require('expect');		// for verify()

//var Utils = require('gb53_utils'), PI = Utils.PI, DEG = Utils.DEG, asBool = Utils.asBool, asNum = Utils.asNum, asInt = Utils.asInt, selBool = Utils.selBool, selNum = Utils.selNum, selInt = Utils.selInt, angleWrap = Utils.angleWrap, clamp = Utils.clamp, pctClamp = Utils.pctClamp;
var Log 	= require('gb53_log'); // Log. e() w() d() i() v() V() W() WF() C() show()

var Version = 'gb53_utils.js 15-Nov-15';

/** get Version string
 * @returns {string} version as 'filename.js date'
 */
exports.Version = 
	function Version(){ 
		return Version; 
	};
exports.init = 
	function init() {
		Log.i("version: %s -- gb53.net utility functions", Version);
		var methods = "asBool,asNum,asInt,clamp,pctClamp,angleWrap,asLiteral,qindexOf,extract,verify".split(',');
		for (var i in methods )
			Log.d('-%s: DISABLE Util.%s', methods[i], methods[i] );
	}
    
/**
 * shorthand for Math.PI
 */
exports.PI =	Math.PI;

/**
 * conversion factor for angles in degrees - multiply to convert to radians
 *   e.g.  180*DEG  =  PI radians
 */
exports.DEG = 	Math.PI/180.0;

var asNum = 
/** 
 * return numeric value from string or value
 * @param {var} value - value to be interpreted as number
 * @param {Number} [default_value] - optional default value, if value isn't recognized
 * @param {Number} [min_value] - optional minimum legal value, clamped to this
 * @param {Number} [max_value] - optional maximum legal value, clamped to this
 * @param {Boolean} [asInt] - optional, if true, result is truncated to integer
 * @returns {Number}
 */
exports.asNum = 
    function asNum(val, def_value, min, max, asInt){
    	Log.Call('asNum,val,def_value,min,max,asInt', Array.prototype.slice.call(arguments));
    	if(def_value==undefined) def_value = 0;
	if(min==undefined)  min = -Number.MAX_VALUE; 
    	if(max==undefined)  max = Number.MAX_VALUE; 
	if(asInt==undefined) asInt = false;
		
	if (val=='') 
	    val = def_value;
	val = +val;
	if (isNaN(val)) 
	    val = def_value;
		
	if (asInt) 
	    val = Math.trunc(val);
	return clamp(val, min, max);
}

/** 
 * return integer value from string or value
 * @param {var} value - value to be interpreted as number
 * @param {Number} [default_value] - optional default value, if value isn't recognized
 * @param {Number} [min_value] - optional minimum legal value, clamped to this
 * @param {Number} [max_value] - optional maximum legal value, clamped to this
 * @returns {Number}
 */
exports.asInt =
	function asInt(val, def_value, min, max){
		Log.Call('asInt,val,def_value,min,max', Array.prototype.slice.call(arguments));
		return asNum( val, def_value, min, max, true );
}

var asBool =
/** 
 * return true/false from value or string
 *   recognizes true, false, 't', 'f', 1, 0, 'on', 'off',
 *   'set', 'unset', 'active', 'inactive',
 *   and if 'current_value' is passed: 'toggle', 'switch', '-'
 * @param {var} val - value to be interpreted as boolean
 * @param {bool} [current_value] - optional current boolean, which can be 'toggled'
 * @returns {Boolean}
 */
exports.asBool = 
	function asBool(val, current_value){
		Log.Call('asBool,val,current_value', Array.prototype.slice.call(arguments));
		if (typeof val != 'string'){
		    if (val===true  || val===1) return true;
		    if (val===false || val===0) return false;
		    Log.e('asBool: unrecognized literal "%s"', val.toString());
		    return 'ERR';
		    Log.e('asBool: unrecognized value %s: %s', typeof val, val);
		    return 'ERR';
		}
		var bval = sprintf('.%s.', val.toLowerCase());
		
		var on = '.on.true.t.1.set.active.';	// recognized names for 'true'
		if (on.indexOf(bval) >= 0) return true;
		
		var off = '.off.false.f.0.unset.reset.inactive.';   // recognized names for 'false'
		if (off.indexOf(bval) >= 0) return false;
		
		var tog = '.toggle.switch.-.';   // recognized values for 'toggle' -- current_value must be defined
		if (tog.indexOf(bval) >= 0){
		    if (current_value!==true && current_value!==false){
		    	Log.e('asBool: toggle-- current value not boolean--  %s: %s', typeof val, val);
		    	return 'ERR';
		    }
		    return !current_value;
		}
		Log.e('asBool: unrecognized string "%s"', val);
		return 'ERR';
    }

/** 
 * return numeric value from jQuery selector
 * @param {string} sel - jQuery selector of field, e.g. '#inputID'
 * @param {Number} [default_value] - optional default value, if selector val() isn't recognized
 * @returns {Number}
 */
exports.selNum =
	function selNum(sel, default_value){
		Log.Call('selNum,sel,default_value', Array.prototype.slice.call(arguments));
		return asNum( $(sel).val(), default_value );
}

/** 
 * return integer value from jQuery selector
 * @param {string} sel - jQuery selector of field, e.g. '#inputID'
 * @param {Number} [default_value] - optional default value, if selector val() isn't recognized
 * @returns {Number}
 */
exports.selInt =
	function selInt(sel, default_value, min, max){
		Log.Call('selInt,sel,default_value,min,max', Array.prototype.slice.call(arguments));
		return asNum( $(sel).val(), default_value, min, max, true );
}

/** 
 * return boolean value from jQuery selector
 * @param {string} sel - jQuery selector of field, e.g. '#inputID'
 * @returns {Boolean}
 */
exports.selBool =
	function selBool(sel){
		Log.Call('selBool,sel', Array.prototype.slice.call(arguments));
		return asBool( $(sel).val() );
}

/** 
 * collapse angle in degrees to [0..360)
 * @param {Number} degrees - angle value in degrees
 * @returns {Number} - in range 0 upto 360
 */
exports.angleWrap = 
    function angleWrap(deg){ 
		Log.Call('angleWrap,deg', Array.prototype.slice.call(arguments));
		while (deg<0) deg += 360;
		while (deg>=360) deg -= 360;
		return deg;
}

var clamp =
/** 
 * limit value to range
 * @param {Number} value - numeric value
 * @param {Number} min - minimum allowed value
 * @param {Number} max - maximum allowed value
 * @returns {Number} - in range min..max
 */
exports.clamp = 
    function clamp(v, min,max){ 
		Log.Call('clamp,v,min,max', Array.prototype.slice.call(arguments));
    	if(typeof v != 'number' || typeof min != 'number' || typeof max != 'number')
    	    return sprintf("ERR[clamp: bad args %s,%s,%s]",typeof v, typeof min, typeof max);
    	if ( v < min ) return min;
    	if ( v > max ) return max;
    	return v;
}

/** 
 * map percentage value to range
 * pctClamp(30, 0,100) => 30
 * pctClamp(-10, 40,60) => 40
 * @param {Number} pct - percentage in [0..100]
 * @param {Number} min - minimum value
 * @param {Number} max - maximum value
 * @returns {Number} - in range [min..max] based on 'pct'
 */
exports.pctClamp = 
    function pctClamp(pct, min,max){ 
		Log.Call('pctClamp,pct,min,max', Array.prototype.slice.call(arguments));
		return clamp(min + clamp(pct,0,100)*(max-min)/100, min,max); 
}

/**
 * display string for Babylon camera
 * @param {Object} Babylon camera
 * @returns {string} shows camera position & target
 */
exports.showCam =
    function showCam(cam){ 
	if (cam==null) return '';
		
    	return sprintf('(%5.2f, %5.2f, %5.2f) -> (%5.2f, %5.2f, %5.2f)', 
    		cam.position.x, cam.position.y, cam.position.z, 
    		cam.target.x, cam.target.y, cam.target.z); 
}

var extract =
/**
 * extracts specified substring
 * extract( 'abc( def ) g',   0, '(' ) => 'abc'
 * extract( 'abc( def ) g', '(', '(' ) => 'def'
 * extract( 'abc( def ) g', 'd'      ) => 'ef ) g'
 * extract( 'abc( def ) g',   0, 'd' ) => 'abc('
 * extract( ' fn() => 0 ', '(', ')' ) 	=> '' 
 * extract( ' fn(a) => 0 ', '(', ')' ) 	=> 'a'
 * extract( ' fn( a, b, c) => 0 ', '(', ')' ) => 'a, b, c' 
 * extract( ' fn( a, b, c) => 0 ',   0, '(' ) => 'fn'
 * extract( ' fn ( a, b, c) => 0 ',  0, '(' ) => 'fn'
 * extract( ' fn ( a, b, c) => 0 ',  0, '(' ) => 'fn'
 * extract( ' fn( a, b, c) => 0 ',  '=>'    ) => '0'
 * @param {String} source - source string
 * @param {Number|String} start - starting position or marker
 * @param {Number|String} end - ending position or marker
 * @returns {string} returns trimmed string from start..end  
 */
exports.extract = 
    function extract(s, min,max){
	Log.Call('extract,s,min,max', Array.prototype.slice.call(arguments));
	if (typeof min==='string'){
	    var p = qindexOf(s, min);
	    if (p<0) return null;
	    min = p + min.length;
	}
	if (max==undefined)
	    max = s.length; 
	else if (typeof max==='string'){
	    var p = qindexOf(s, max, min);
	    if (p<0) return null;
	    max = p;
	}
	Log.e("extract: return '%s'[%d..%d] = '%s'", s,min,max, s.substring(min,max));
	return s.substring(min, max).trim();
}
var qsplit = 
/**
 * returns array of 'delim' separated substrings, outside of quoted substrings
 * @param {String} source - source string
 * @param {String} delim - separator
 * @returns {Array} of substrings  
 */
exports.qsplit = 
	function qsplit(s, delim){
		Log.Call('qsplit,s,delim', Array.prototype.slice.call(arguments));
		var res = [], strt = 0;
		var p = qindexOf(s,delim, strt);
		while (p>=0){
			res.push( s.substring(strt,p).trim() );
			Log.d('qsplit: + "%s"', res[res.length-1]);
			strt = p + delim.length;
			p = qindexOf(s,delim, strt);
		}
		res.push( s.substr(strt));
		Log.d('qsplit: +."%s"', res[res.length-1]);
		return res;
}

var qindexOf =
/**
 * returns index of specified substring, outside of quoted substrings
 * @param {String} source - source string
 * @param {String} substr - substring to search for
 * @param {number} optional start - index to begin search
 * @returns {Number} returns index of 1st occurrence, or -1 if not found  
 */
exports.qindexOf = 
	function qindexOf(s, s2, strt){
		Log.Call('qindexOf,s,s2,strt', Array.prototype.slice.call(arguments));
		if (strt==undefined) strt = 0;
		var instr = false, qchar = '';
		var sch = s2.charAt(0);
		for (var i=strt; i<s.length; i++){
			var ch = s.charAt(i);
			if (instr){
				if (ch==qchar) instr = false;
			} else if (ch=="'" || ch=='"'){
				instr = true; qchar = ch;
			} else if (ch==sch){
				if (s.substr(i,s2.length)==s2)
					return i;
			}
		}
		Log.d('qindexOf: no "%s" found in "%s":%d', s2,s,strt);
		return -1;
}

var asLiteral =
/** converts quoted strings to strings, unquoted strings to values
 * @param {String}  value definition
 * @returns {string} literal value 
 */
exports.asLiteral = 
    function asLiteral( s ){
		Log.Call('asLiteral,s', Array.prototype.slice.call(arguments));
    	if (typeof s !== 'string') 
    	    return s;  // already non-string
    	s = s.trim();
    	var fr = s.charAt(0), bk = s.charAt(s.length-1);
    	if (fr==bk && (fr=='"' || fr=="'")) 
    	    return s.substr(1,s.length-2).trim();	// unquote, then return string
    	
    	if ( s=='true' ) return true;
    	if ( s=='false' ) return false;
    	if ( s=='null' ) return null;
    	if ( s=='' || s=='undefined' ) return undefined;
    	if ( s=='NaN' ) return 1/0;	// NaN

    	var v = +s;
    	//console.log('aL: %s:%d', typeof v, v);
    	if ( !isNaN(v) ) return v;
    	Log.e('asLiteral: "%s" unrecognized', s);
    	return 'ERR['+s+']';
}

var verify = 
/**
 * verify test expression
 * e.g.:  " nm(0,'b',3.5,false) => 8 " translates to it(descr, function(){ expect( fn(0, 'b', 3.5, false).toEqual(8); });
 *    ==> as toBe,
 *   throws=>  as toThrow()
 * @param {String} descr - test description as in examples
 * @param {Function} fn - javascript function to call
 */
exports.verify = 
    function verify(vstr, actualfn){
		Log.Call('verify,vstr,fn', Array.prototype.slice.call(arguments));
    	var fname = extract(vstr, 0,'(' );
    	var argstr = extract(vstr, '(', ')' );
    	if (argstr==null) { Log.e('verify: no () found in "%s"',vstr); return; }
    	var args = argstr==null? [] : qsplit(argstr, ',');
    	for(var i=0; i<args.length; i++){
    	    args[i] = asLiteral(args[i]);
    	    Log.d('verify: arg[%d]=%s', i,args[i]);
    	}
    	
    	var result = asLiteral( extract(vstr, '=>' ) );	
    	Log.d('verify: got %s', actualfn.apply(this, args));
    	var op = qindexOf(vstr,'==>')>0? '==>' : qindexOf(vstr,'throws=>')>0? 'throws=>' : '=>';
    	switch (op){ 
		case "=>":
			it(vstr, function(){ expect( actualfn.apply( this, args )).toEqual( result ) });
			break;
		case "==>":
			it(vstr, function(){ expect( actualfn.apply( this, args )).toBe( result ) });
			break;
		case "throws=>":
			it(vstr, function(){ expect( actualfn.apply( this, args )).toThrow( result ) });
			break;
    	}
}


// still used?
function asVec(labels, args) { // call as ('xyz', [ args of length: 2[s, {x:,y:,z:}] 4[s, x,y,z] 3[x,y,z] or 1[{x:,y:,z:}] )
    var s = '', v;
    switch (args.length){
        case 1: v = args[0]; break;
        case 2: s = args[0]; v = args[1]; break;
        case 3: v = { x:args[0], y:args[1], z:args[2] }; break;
        case 4: s = args[0]; v = { x:args[1], y:args[2], z:args[3] }; break;
        default: return 'asXYZ: invalid args';
    }
    return sprintf('%s{%s:%5.2f %s:%5.2f  %s:%5.2f}', s, labels.charAt(0), v.x,  labels.charAt(1), v.y, labels.charAt(2), v.z);
}
function asXYZ(){ return asVec('xyz', Array.prototype.slice.call(arguments));
}
function asABG(){ return asVec('abg', Array.prototype.slice.call(arguments));
}

