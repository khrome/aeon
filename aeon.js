/* Formal OO */
var arrays = require('async-arrays');
var objects = require('async-objects');
var processClassDefinition = function(definition, callback){

    //separate the groups
    var pubKeys = Object.keys(definition);
    pubKeys = arrays.erase(pubKeys, 'Final');
    pubKeys = arrays.erase(pubKeys, 'Static');
    var pubStatKeys = Object.keys(definition.Static);
    pubStatKeys = arrays.erase(pubStatKeys, 'Final');
    var pubStatFinKeys = Object.keys(definition.Static.Final);
    var pubFinKeys = Object.keys(definition.Final);
    
    // group data/fns
    var pub = {};
    pubKeys.forEach(function(name){ pub[name] = definition[name]; });
    var pubStat = {};
    pubStatKeys.forEach(function(name){ pubStat[name] = definition.Static[name]; });
    var pubStatFin = {};
    pubStatFinKeys.forEach(function(name){ pubStatFin[name] = definition.Static.Final[name]; });
    var pubFin = {};
    pubFinKeys.forEach(function(name){ pubFin[name] = definition.Final[name]; });
    
    callback({}, pub, pubStat, pubFin, pubStatFin);
    
};
var basis = function(options){
    var basisOptions = options || {};
    this.Public = {
        Final : {},
        Static : {Final:{}}
    };
    this.Private = {
        Final : {},
        Static : {Final:{}}
    };
    //protected is only protected from execution in the current context
    // you can always break off a fn and use it in your own context
    this.Protected = {
        Final : {},
        Static : {Final:{}}
    };
    this.ÆON = function(options){ //create class from definition
        
        var lines = [];
        var construct = basisOptions.construct;
        var superClass = this.Extends;
        var ob;
        
        var pubFinal;
        var pubStatic;
        var priFinal;
        var priStatic;
        
        //PUBLIC
        processClassDefinition(this.Public, function(options, fields, fieldsStatic, fieldsFinal, fieldsStaticFinal){
            //members
            objects.forEach(fieldsFinal, function(value, name){
                lines.push('Object.defineProperty(this, "'+name+'", { writable: false, value: value });');
            });
            
            pubFinal = function(ob){
                objects.forEach(fields, function(value, name){
                    ob.prototype[name] = value;
                });
            }
            //statics
            pubStatic = function(ob){
                objects.forEach(fieldsStatic, function(value, name){
                    Object.defineProperty(ob, name, { value: value });
                });
                objects.forEach(fieldsStaticFinal, function(value, name){
                    Object.defineProperty(ob, name, { writable: false, value: value });
                });
            }
        });
        
        var allMembers = [];
        var isInternal = function(){
            var context = arguments.callee.caller;
            var parentContext = context.arguments.callee.caller;
            var result = ( allMembers.indexOf(context) == -1 ) && 
                         ( allMembers.indexOf(parentContext) == -1 );
            console.log(
                'testing private',
                allMembers.indexOf(context) == -1,
                allMembers.indexOf(parentContext) == -1
            );
            return result;
        };
        
        //PRIVATE
        //*
        processClassDefinition(this.Private, function(options, fields, fieldsStatic, fieldsFinal, fieldsStaticFinal){
            //members
            objects.forEach(fields, function(value, name){
                lines.push(
                    'Object.defineProperty(this, "'+name+'", { '+
                    'writable: false, value: value , get:function(){ '+
                        'var isIn = isInternal(); '+
                        'console.log("is?", isIn); '+
                        'return isIn?this.["private_'+name+'"]:undefined; '+
                    '}});'
                );
            });
            
            /*priFinal = function(ob){
                objects.forEach(fields, function(value, name){
                    ob.prototype[name] = value;
                });
            };*/
            
            //statics
            /*priStatic = function(ob){
                objects.forEach(fieldsStatic, function(value, name){
                    Object.defineProperty(ob, name, { value: value });
                });
                objects.forEach(fieldsStaticFinal, function(value, name){
                    Object.defineProperty(ob, name, { writable: false, value: value });
                });
            }*/
        }); //*/
        
        if(lines.length){
            if(basisOptions.implicitSuper && this.Extends) lines.unshift('superClass.apply(this, arguments)');
            if(constructor) lines.push('constructor.apply(this, arguments)');
            console.log(lines.join("\n"));
            ob = new Function('options', lines.join("\n"));
        }else{
            ob = construct || function(){};
        }
        if(pubFinal) pubFinal(ob);
        if(pubStatic) pubStatic(ob);
        if(priFinal) priFinal(ob);
        if(priStatic) priStatic(ob);
        allMembers = objects.map(ob, function(value, field){
            
        })
        return ob;
    };
}

module.exports = function(){
    return new basis();
}