/**
 * gb53.net utils module - 
 * @module gb53_utils
 */
'use strict';
import $ from 'jquery';
import sprintf from 'sprintf';
import * as Log from 'gb53_log';
	
var sVersion = 'gb53_utils.js 16-Apr-16';
//18-Mar add Ut.sprintfo to format from fields of an object

/** get Version string
 * @returns {string} version as 'filename.js date'
 */
export function Version(){ 
		return sVersion; 
	};
	
export function init() {
		Log.i("version: %s -- gb53.net utility functions", Version);
		var methods = "asBool,asNum,asInt,clamp,pctClamp,angleWrap,asLiteral,qindexOf,extract,verify".split(',');
		for (var i in methods )
			Log.d('-%s: DISABLE Util.%s', methods[i], methods[i] );
	}
    
/**
 * shorthand for Math.PI * factor
 * @param {var} [ factor ] - value to be multiplied, defaults to 1
 *   e.g. PI(2) = 2 * Math.PI
 */
export function PI(x){ return (x? x:1)*Math.PI; }

/**
 * conversion factor for angles in degrees - multiply to convert to radians
 * @param {var} [ factor ] - value to be converted, defaults to 1
 *   e.g.  DEG(180)  =  PI radians
 */
export function DEG(x){ return	(x? x:1)*Math.PI/180.0 };

/** 
 * return numeric value from string or value
 * @param {var} value - value to be interpreted as number
 * @param {Number} [default_value] - optional default value, if value isn't recognized
 * @param {Number} [min_value] - optional minimum legal value, clamped to this
 * @param {Number} [max_value] - optional maximum legal value, clamped to this
 * @param {Boolean} [asInt] - optional, if true, result is truncated to integer
 * @returns {Number}
 */
export function asNum(val, def_value, min, max, asInt){
    Log.Call('asNum,val,def_value,min,max,asInt', Array.prototype.slice.call(arguments));
    if(def_value==undefined) def_value = 0;
	if(min==undefined)  min = -Number.MAX_VALUE; 
    	if(max==undefined)  max = Number.MAX_VALUE; 
	if(asInt==undefined) asInt = false;
		
	if (typeof val==='string')
		val = val==''? def_value : parseFloat(val);
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
export function asInt(val, def_value, min, max){
		Log.Call('asInt,val,def_value,min,max', Array.prototype.slice.call(arguments));
		return asNum( val, def_value, min, max, true );
}

/** 
 * return true/false from value or string
 *   recognizes true, false, 't', 'f', 1, 0, 'on', 'off',
 *   'set', 'unset', 'active', 'inactive',
 *   and if 'current_value' is passed: 'toggle', 'switch', '-'
 * @param {var} val - value to be interpreted as boolean
 * @param {bool} [current_value] - optional current boolean, which can be 'toggled'
 * @returns {Boolean}
 */
export function asBool(val, current_value){
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
export function selNum(sel, default_value){
		Log.Call('selNum,sel,default_value', Array.prototype.slice.call(arguments));
		return asNum( $(sel).val(), default_value );
}

/** 
 * return integer value from jQuery selector
 * @param {string} sel - jQuery selector of field, e.g. '#inputID'
 * @param {Number} [default_value] - optional default value, if selector val() isn't recognized
 * @returns {Number}
 */
export function selInt(sel, default_value, min, max){
		Log.Call('selInt,sel,default_value,min,max', Array.prototype.slice.call(arguments));
		return asNum( $(sel).val(), default_value, min, max, true );
}

/** 
 * return boolean value from jQuery selector
 * @param {string} sel - jQuery selector of field, e.g. '#inputID'
 * @returns {Boolean}
 */
export function selBool(sel){
		Log.Call('selBool,sel', Array.prototype.slice.call(arguments));
		return asBool( $(sel).val() );
}

/** 
 * collapse angle in degrees to [0..360)
 * @param {Number} degrees - angle value in degrees
 * @returns {Number} - in range 0 upto 360
 */
export function angleWrap(deg){ 
		Log.Call('angleWrap,deg', Array.prototype.slice.call(arguments));
		if (typeof deg === 'string') deg = parseFloat(deg);
		deg = deg % 360;
		if (deg<0) deg += 360;
		return deg;
}

/** 
 * limit value to range
 * @param {Number} value - numeric value
 * @param {Number} min - minimum allowed value
 * @param {Number} max - maximum allowed value
 * @returns {Number} - in range min..max
 */
export function clamp(v, min,max){ 
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
export function pctClamp(pct, min,max){ 
		Log.Call('pctClamp,pct,min,max', Array.prototype.slice.call(arguments));
		return clamp(min + clamp(pct,0,100)*(max-min)/100, min,max); 
}

/**
 * format string from object fields
 * @param {string} sprintf-like format string with object references in %()
 * @param {Object} object that supplies values 
 * @returns {string} sprintf formatted values
 *   e.g.  sprintfo(" o.str= %(str)s  o.v1= %(v1)d  o.a.foo= %(a.foo)4.2f ", { str: 'test', v1: 7, a:{ foo:3.14159, baz:73.123 }})
 *    returns: " o.str= test  o.v1= 7  o.a.foo= 3.14 "
 */
export function sprintfo(fmt, obj){ 
	var args = [ '' ];
	var iPrv = 0;
	while (true){
		var iNxt = fmt.indexOf('%(', iPrv );
		var iEnd = fmt.indexOf( ')', iNxt+1 );  // ok if iNxt==-1
		if (iNxt < 0){
			args[0] += fmt.substring(iPrv);
			break;
		} 
		args[0] += fmt.substring(iPrv,iNxt+1);
		args.push(objRef(obj, fmt.substring(iNxt+2,iEnd)));
		iPrv = iEnd+1;
	}
    return sprintf.apply(null, args ); 
}
function objRef(obj, ref){
	var parts = ref.split('.');
	var res = obj;
	for (var i=0; i<parts.length; i++)
		if (typeof obj==='object')
			res = res[parts[i]];
	return res;
}

/**
 * display string for Babylon camera
 * @param {Object} Babylon camera
 * @returns {string} shows camera position & target
 */
export function showCam(cam){ 
	if (cam==null) return '';
		
    	return sprintf('(%5.2f, %5.2f, %5.2f) -> (%5.2f, %5.2f, %5.2f)', 
    		cam.position.x, cam.position.y, cam.position.z, 
    		cam.target.x, cam.target.y, cam.target.z); 
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

