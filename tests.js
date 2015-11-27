/**
 * gb53.net utils test module - 
 * @module gb53_utils_test
 */
"use strict";

var Log 	= require('gb53_log');
var Utils	= require('gb53_utils'), PI = Utils.PI, DEG = Utils.DEG, asBool = Utils.asBool, asNum = Utils.asNum, 
	asInt	= Utils.asInt, selBool = Utils.selBool, selNum = Utils.selNum, selInt = Utils.selInt, angleWrap = Utils.angleWrap, 
	clamp	= Utils.clamp, pctClamp = Utils.pctClamp, qindexOf = Utils.qindexOf, extract = Utils.extract, asLiteral = Utils.asLiteral, verify = Utils.verify;

global.QUnit = require('qunit');
var bdd = require('qunit-bdd'), describe = bdd.describe, it = bdd.it, expect = bdd.expect;

describe("gb53_utils",  function() {    
	Utils.init();
//    describe("failures",  function() {    
//    	//Log.i('+verify: ENABLE');
//    	//Log.i('+extract: ENABLE');
//    	//Log.i('+qindexOf: ENABLE');
//    	//Log.i('+qsplit: ENABLE');
//		verify(" extract( ' fn( a, b, c) => 0  ', '(', ')' ) => 'a, b, c' ",extract); 
//		verify(" extract( ' fn( a, b, c) => 0  ',   0, '(' ) => 'fn' ",		extract); 
//		verify(" extract( ' fn ( a, b, c) => 0 ',   0, '(' ) => 'fn' ",		extract); 
//    	Log.i('-verify: DISABLE');
//    	Log.i('-extract: DISABLE');
//    	Log.i('-qindexOf: ENABLE');
//    	Log.i('-qsplit: ENABLE');
//	});
    describe("PI",  function() {    
    	it("it: returns Math.PI ", function(){ expect( PI ).toEqual( Math.PI ); } ); 
	});
    describe("DEG",  function() {    
    	it("it: returns degrees to radians ",  function(){ expect( DEG ).toEqual( Math.PI/180.0 ) } );
	});
    describe("asLiteral", function(){
		it("it:  asLiteral( 5 ) => 5 ", 			function(){ expect( asLiteral( 5		)).toEqual( 5		) });
		it("it:  asLiteral( true ) => true ", 		function(){ expect( asLiteral( true 		)).toEqual( true 	) });
		it("it:  asLiteral( null ) => null ", 		function(){ expect( asLiteral( null 		)).toEqual( null 	) });
		it("it:  asLiteral( '5' ) => 5 ", 			function(){ expect( asLiteral( '5'		)).toEqual( 5 		) });
		it("it:  asLiteral( 'true' ) => true ", 		function(){ expect( asLiteral( 'true'		)).toEqual( true	) });
		it("it:  asLiteral( 'false' ) => false ", 		function(){ expect( asLiteral( 'false'		)).toEqual( false	) });
		it("it:  asLiteral( 'null' ) => null ", 		function(){ expect( asLiteral( 'null'		)).toEqual( null 	) });
	    it("it:  asLiteral( 'undefined' ) => undefined ",	function(){ expect( asLiteral( 'undefined'	)).toEqual( undefined	) });
		it("it:  asLiteral( 'NaN' ) => NaN ", 		function(){ expect( asLiteral( 'NaN'		)).toBe(    1/0 	) });
		it("it:  asLiteral( \" '5' \" ) => '5' ", 		function(){ expect( asLiteral( " '5' "		)).toEqual( '5' 	) });
		it("it:  asLiteral( \"'true' \" ) => 'true' ", 	function(){ expect( asLiteral( "'true' "	)).toEqual( 'true'	) });
		it("it:  asLiteral( \"'null'\" ) => 'null' ", 	function(){ expect( asLiteral( "'null'"		)).toEqual( 'null' 	) });
    });
    describe("qindexOf", function(){
    	var arg1 = 'ABC( DEF ) G', arg2 = 'abc "def" ghi \'jkl\' def jkl';
    	it("it: qindexOf( '" + arg1 + "', '(' ) => 3 ", function(){ expect( qindexOf(arg1, '(')).toEqual(3) });
    	it("it: qindexOf( '" + arg1 + "', 'D' ) => 5 ", function(){ expect( qindexOf(arg1, 'D')).toEqual(5) });
    	
    	it("it: qindexOf( '" + arg2 + "', 'g' ) => 10 ", function(){ expect( qindexOf(arg2, 'g')).toEqual(10) });
    	it("it: qindexOf( '" + arg2 + "', 'd' ) => 20 ", function(){ expect( qindexOf(arg2, 'd')).toEqual(20) });
    	it("it: qindexOf( '" + arg2 + "', 'k' ) => 25 ", function(){ expect( qindexOf(arg2, 'k')).toEqual(25) });
    });
    describe("extract",  function() {    
		// function extract(s, front,back){
		it("it: extract( 'abc( def ) g',   0, '(' ) => 'abc'",    function(){ expect( extract('abc( def ) g',   0, '(' ) ).toEqual( 'abc'    ) } );
		it("it: extract( 'abc( def ) g', '(', ')' ) => 'def'", 	  function(){ expect( extract('abc( def ) g', '(', ')' ) ).toEqual( 'def'    ) } );
		it("it: extract( 'abc( def ) g', 'd'      ) => 'ef ) g'", function(){ expect( extract('abc( def ) g', 'd'      ) ).toEqual( 'ef ) g' ) } );
		it("it: extract( 'abc( def ) g',   0, 'd' ) => 'abc('",   function(){ expect( extract('abc( def ) g',   0, 'd' ) ).toEqual( 'abc('   ) } );
		
		it("it: extract( ' fn() => 0 ', '(', ')' ) => '' ",					function(){ expect( extract(' fn() => 0 ', '(', ')' )).toEqual('')});
		it("it: extract( ' fn(a) => 0 ', '(', ')' ) => 'a' ",				function(){ expect( extract(' fn(a) => 0 ', '(', ')' )).toEqual('a')});
		it("it: extract( ' fn( a, b, c) => 0 ', '(', ')' ) => 'a, b, c' ",	function(){ expect( extract(' fn( a, b, c) => 0 ', '(', ')' )).toEqual('a, b, c')});
		it("it: extract( ' fn( a, b, c) => 0 ', 0, '(' ) => 'fn' ",			function(){ expect( extract(' fn( a, b, c) => 0 ', 0, '(' )).toEqual('fn')});
		it("it: extract( ' fn ( a, b, c) => 0 ', 0, '(' ) => 'fn' ",		function(){ expect( extract(' fn ( a, b, c) => 0 ', 0, '(' )).toEqual('fn')});

		verify(" extract( 'abc( def ) g',   0, '(' ) => 'abc' ", 			extract);
		verify(" extract( 'abc( def ) g', '(', ')' ) => 'def' ", 			extract);
		verify(" extract( 'abc( def ) g', 'd'      ) => 'ef ) g' ", 		extract);
		verify(" extract( 'abc( def ) g',   0, 'd' ) => 'abc(' ", 			extract);
			
		verify(" extract( ' fn() => 0          ', '(', ')' ) => '' ",		extract); 
		verify(" extract( ' fn(a) => 0         ', '(', ')' ) => 'a' ",		extract); 
		verify(" extract( ' fn( a, b, c) => 0  ', '(', ')' ) => 'a, b, c' ",extract); 
		verify(" extract( ' fn( a, b, c) => 0  ',   0, '(' ) => 'fn' ",		extract); 
		verify(" extract( ' fn ( a, b, c) => 0 ',   0, '(' ) => 'fn' ",		extract); 

    	var arg2a = " fn( '(' ) ", res2a="'('",  arg3a = " fn( ')' ) ", res3a="')'", arg4a = " fn('\"') ", res4a="'\"'";
    	var arg2b = ' fn( "(" ) ', res2b='"("',  arg3b = ' fn( ")" ) ', res3b='")"', arg4b = ' fn("\'") ', res4b='"\'"';
		it('it: extract( "'+arg2a+'", "(", ")" ) => "'+res2a+'" ',  function(){ expect( extract(arg2a, '(', ')' ) ).toEqual( res2a ) } );
		it("it: extract( '"+arg2b+"', '(', ')' ) => '"+res2b+"' ",  function(){ expect( extract(arg2b, '(', ')' ) ).toEqual( res2b ) } );
		it('it: extract( "'+arg3a+'", "(", ")" ) => "'+res3a+'" ',  function(){ expect( extract(arg3a, '(', ')' ) ).toEqual( res3a ) } );
		it("it: extract( '"+arg3b+"', '(', ')' ) => '"+res3b+"' ",  function(){ expect( extract(arg3b, '(', ')' ) ).toEqual( res3b ) } );
		it('it: extract( "'+arg4a+'", "(", ")" ) => "'+res4a+'" ',  function(){ expect( extract(arg4a, '(', ')' ) ).toEqual( res4a ) } );
		it("it: extract( '"+arg4b+"', '(', ')' ) => '"+res4b+"' ",  function(){ expect( extract(arg4b, '(', ')' ) ).toEqual( res4b ) } );
    });
    describe("asBool",  function() {    
    	verify(" asBool( true ) => true ", 	 asBool );
    	verify(" asBool( 1 ) => true ", 	 asBool );
    	verify(" asBool( 'true' ) => true ", asBool );
    	verify(" asBool( 'True' ) => true ", asBool );
    	verify(" asBool( 'tRUe' ) => true ", asBool );
    	verify(" asBool( 'T' ) => true ", 	 asBool );
    	verify(" asBool( 'on' ) => true ", 	   asBool );
    	verify(" asBool( 'set' ) => true ",    asBool );
    	verify(" asBool( '1' ) => true ", 	   asBool );
    	verify(" asBool( 'active' ) => true ", asBool );
			
    	verify(" asBool( false ) => false ", 		asBool );
    	verify(" asBool( 0 ) => false ", 			asBool );
    	verify(" asBool( 'false' ) => false ", 		asBool );
    	verify(" asBool( 'F' ) => false ", 			asBool );
    	verify(" asBool( 'off' ) => false ", 		asBool );
    	verify(" asBool( 'unset' ) => false ", 		asBool );
    	verify(" asBool( 'reset' ) => false ", 		asBool );
    	verify(" asBool( '0' ) => false ", 			asBool );
    	verify(" asBool( 'inactive' ) => false ", 	asBool );

		verify(" asBool( 'toggle', true ) => false ", 	asBool );
		verify(" asBool( 'toggle', false ) => true ", 	asBool );
		verify(" asBool( 'switch', true ) => false ", 	asBool );
		verify(" asBool( 'switch', false ) => true ", 	asBool );
		verify(" asBool( '-', true ) => false ", 		asBool );
		verify(" asBool( '-', false ) => true ", 		asBool );

		verify(" asBool( 2 ) => 'ERR' ", 	asBool );
		verify(" asBool( -1 ) => 'ERR' ", 	asBool );
		verify(" asBool( 'x' ) => 'ERR' ", 	asBool );
		verify(" asBool( '' ) => 'ERR' ", 	asBool );
    });
    describe("clamp", function(){
    	verify(" clamp(5, 0, 100) => 5", clamp);
    	verify(" clamp(-5, 0, 100) => 0", clamp);
    	verify(" clamp(105, 0, 100) => 100", clamp);
		verify(" clamp(45, 40, 50) => 45", clamp);
		verify(" clamp(10, 40, 50) => 40", clamp);
		verify(" clamp(72, 40, 50) => 50", clamp);
		verify(" clamp(-37, -40, -20) => -37", clamp);
		verify(" clamp(-57, -40, -20) => -40", clamp);
		verify(" clamp( 17, -40, -20) => -20", clamp);
    });
    describe("pctClamp", function(){
    	verify(" pctClamp(30, 0,100) => 30 ", pctClamp);
		verify(" pctClamp(30, 0,100) => 30 ", pctClamp);
		verify(" pctClamp(10, 40,60) => 42 ", pctClamp);
		verify(" pctClamp(50, 40,60) => 50 ", pctClamp);
		verify(" pctClamp(-10, 40,60) => 40 ", pctClamp);
		verify(" pctClamp(1010, 40,60) => 60 ", pctClamp);
		verify(" pctClamp(50, -40,40) => 0 ", pctClamp);
		verify(" pctClamp(25, -40,40) => -20 ", pctClamp);
		verify(" pctClamp(75, -40,40) => 20 ", pctClamp);
		verify(" pctClamp(50, -100,-40) => -70 ", pctClamp);
		verify(" pctClamp(25, -100,-40) => -85 ", pctClamp);
		verify(" pctClamp(75, -100,-40) => -55 ", pctClamp);
    });
    describe("angleWrap", function(){
    	// function angleWrap(deg): collapse angle in degrees to [0..360)
    	verify(" angleWrap(60) => 60 ", 	angleWrap);
    	verify(" angleWrap(420) => 60 ", 	angleWrap);
    	verify(" angleWrap(780) => 60 ",	angleWrap);
    	verify(" angleWrap(-60) => 300 ", 	angleWrap);
    	verify(" angleWrap(-420) => 300 ", 	angleWrap);
    	verify(" angleWrap(-780) => 300 ", 	angleWrap);
    	verify(" angleWrap(360) => 0 ", 	angleWrap);
    });
    describe("asNum",  function() {    
		// function asNum(val, def_value, min, max, asInt){
		verify(" asNum( 1.7 ) => 1.7 ", asNum );
		verify(" asNum( '1.75' ) => 1.75 ", asNum );
		verify(" asNum( 30.5, 50, 0, 100 ) => 30.5 ", asNum );
		verify(" asNum( '3x.5', 50, 0, 100 ) => 50 ", asNum );
		verify(" asNum( '', 50, 0, 100 ) => 50 ", asNum );
		verify(" asNum( -5, 50, 0, 100 ) => 0 ", asNum );
		verify(" asNum( 105, 50, 0, 100 ) => 100 ", asNum );
    });
    describe("asInt",  function() {    
		// function asInt(val, def_value, min, max, asInt){
		verify(" asInt( 1.7 ) => 1 ", asInt );
		verify(" asInt( '1.75' ) => 1 ", asInt );
		verify(" asInt( 30.5, 50, 0, 100 ) => 30 ", asInt );
		verify(" asInt( '3x.5', 50, 0, 100 ) => 50 ", asInt );
		verify(" asInt( '', 50, 0, 100 ) => 50 ", asInt );
		verify(" asInt( -5, 50, 0, 100 ) => 0 ", asInt );
		verify(" asInt( 105, 50, 0, 100 ) => 100 ", asInt );
    });
});

