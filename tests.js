/**
 * gb53.net utils.js test file 
 */
"use strict";
import * as QUnit from 'qunit';
import * as Log from '../log/gb53_log';
//import {PI,DEG,asBool,asNum,asInt,selBool,selNum,selInt,angleWrap,clamp,pctClamp } from '../utils/gb53_utils';
import { verify } from '../testutils/gb53_testutils';
import * as Ut from '../utils/gb53_utils';

QUnit.module("gb53_utils");

//QUnit.test('SHOULD FAIL', function(assert){
//	assert.equal(2,3, 'Failed Assertion reports failure');
//});

QUnit.test('init and constants',  function(assert) { 
	Ut.init();

	assert.equal(Ut.PI(), Math.PI, 'Utils.PI() returns Math.PI' );
	assert.equal(Ut.PI(2), 2*Math.PI, 'Utils.PI(2) returns 2*Math.PI' );
	assert.equal(Ut.DEG(), Math.PI/180.0 , 'Utils.DEG() returns degrees to radians factor' );
	assert.equal(Ut.DEG(180), Math.PI , 'Utils.DEG(v) returns v degrees in radians' );
});

QUnit.test('asBool',  function(assert) { 
    	verify(" asBool( true ) => true ", 	 Ut.asBool );
    	verify(" asBool( 1 ) => true ", 	 Ut.asBool );
    	verify(" asBool( 'true' ) => true ", Ut.asBool );
    	verify(" asBool( 'True' ) => true ", Ut.asBool );
    	verify(" asBool( 'tRUe' ) => true ", Ut.asBool );
    	verify(" asBool( 'T' ) => true ", 	 Ut.asBool );
    	verify(" asBool( 'on' ) => true ", 	   Ut.asBool );
    	verify(" asBool( 'set' ) => true ",    Ut.asBool );
    	verify(" asBool( '1' ) => true ", 	   Ut.asBool );
    	verify(" asBool( 'active' ) => true ", Ut.asBool );
			
    	verify(" asBool( false ) => false ", 		Ut.asBool );
    	verify(" asBool( 0 ) => false ", 			Ut.asBool );
    	verify(" asBool( 'false' ) => false ", 		Ut.asBool );
    	verify(" asBool( 'F' ) => false ", 			Ut.asBool );
    	verify(" asBool( 'off' ) => false ", 		Ut.asBool );
    	verify(" asBool( 'unset' ) => false ", 		Ut.asBool );
    	verify(" asBool( 'reset' ) => false ", 		Ut.asBool );
    	verify(" asBool( '0' ) => false ", 			Ut.asBool );
    	verify(" asBool( 'inactive' ) => false ", 	Ut.asBool );

		verify(" asBool( 'toggle', true ) => false ", 	Ut.asBool );
		verify(" asBool( 'toggle', false ) => true ", 	Ut.asBool );
		verify(" asBool( 'switch', true ) => false ", 	Ut.asBool );
		verify(" asBool( 'switch', false ) => true ", 	Ut.asBool );
		verify(" asBool( '-', true ) => false ", 		Ut.asBool );
		verify(" asBool( '-', false ) => true ", 		Ut.asBool );

		verify(" asBool( 2 ) => 'ERR' ", 	Ut.asBool );
		verify(" asBool( -1 ) => 'ERR' ", 	Ut.asBool );
		verify(" asBool( 'x' ) => 'ERR' ", 	Ut.asBool );
		verify(" asBool( '' ) => 'ERR' ", 	Ut.asBool );
    });
QUnit.test("clamp", function(){
    	verify(" clamp(5, 0, 100) => 5", Ut.clamp );
    	verify(" clamp(-5, 0, 100) => 0", Ut.clamp );
    	verify(" clamp(105, 0, 100) => 100", Ut.clamp );
		verify(" clamp(45, 40, 50) => 45", Ut.clamp );
		verify(" clamp(10, 40, 50) => 40", Ut.clamp );
		verify(" clamp(72, 40, 50) => 50", Ut.clamp );
		verify(" clamp(-37, -40, -20) => -37", Ut.clamp );
		verify(" clamp(-57, -40, -20) => -40", Ut.clamp );
		verify(" clamp( 17, -40, -20) => -20", Ut.clamp );
    });
QUnit.test("pctClamp", function(){
    	verify(" pctClamp(30, 0,100) => 30 ", Ut.pctClamp );
		verify(" pctClamp(30, 0,100) => 30 ", Ut.pctClamp );
		verify(" pctClamp(10, 40,60) => 42 ", Ut.pctClamp );
		verify(" pctClamp(50, 40,60) => 50 ", Ut.pctClamp );
		verify(" pctClamp(-10, 40,60) => 40 ", Ut.pctClamp );
		verify(" pctClamp(1010, 40,60) => 60 ", Ut.pctClamp );
		verify(" pctClamp(50, -40,40) => 0 ", Ut.pctClamp );
		verify(" pctClamp(25, -40,40) => -20 ", Ut.pctClamp );
		verify(" pctClamp(75, -40,40) => 20 ", Ut.pctClamp );
		verify(" pctClamp(50, -100,-40) => -70 ", Ut.pctClamp );
		verify(" pctClamp(25, -100,-40) => -85 ", Ut.pctClamp );
		verify(" pctClamp(75, -100,-40) => -55 ", Ut.pctClamp );
    });
QUnit.test("angleWrap", function(){
    	// function angleWrap(deg): collapse angle in degrees to [0..360)
    	verify(" angleWrap(60) => 60 ", 	Ut.angleWrap );
    	verify(" angleWrap(420) => 60 ", 	Ut.angleWrap );
    	verify(" angleWrap(780) => 60 ",	Ut.angleWrap );
    	verify(" angleWrap(-60) => 300 ", 	Ut.angleWrap );
    	verify(" angleWrap(-420) => 300 ", 	Ut.angleWrap );
    	verify(" angleWrap(-780) => 300 ", 	Ut.angleWrap );
    	verify(" angleWrap(360) => 0 ", 	Ut.angleWrap );
    });
QUnit.test("asNum",  function() {    
		// function asNum(val, def_value, min, max, asInt){
		verify(" asNum( 1.7 ) => 1.7 ", Ut.asNum );
		verify(" asNum( '1.75' ) => 1.75 ", Ut.asNum );
		verify(" asNum( 30.5, 50, 0, 100 ) => 30.5 ", Ut.asNum );
		verify(" asNum( '3x.5', 50, 0, 100 ) => 50 ", Ut.asNum );
		verify(" asNum( '', 50, 0, 100 ) => 50 ", Ut.asNum );
		verify(" asNum( -5, 50, 0, 100 ) => 0 ", Ut.asNum );
		verify(" asNum( 105, 50, 0, 100 ) => 100 ", Ut.asNum );
    });
QUnit.test("asInt",  function() {    
		// function asInt(val, def_value, min, max, asInt){
		verify(" asInt( 1.7 ) => 1 ", Ut.asInt );
		verify(" asInt( '1.75' ) => 1 ", Ut.asInt );
		verify(" asInt( 30.5, 50, 0, 100 ) => 30 ", Ut.asInt );
		verify(" asInt( '3x.5', 50, 0, 100 ) => 50 ", Ut.asInt );
		verify(" asInt( '', 50, 0, 100 ) => 50 ", Ut.asInt );
		verify(" asInt( -5, 50, 0, 100 ) => 0 ", Ut.asInt );
		verify(" asInt( 105, 50, 0, 100 ) => 100 ", Ut.asInt );
    });
QUnit.start();		// needed for jspm loaded QUnit

