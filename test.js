var should = require("chai").should();
var ß = require('./aeon');

describe('objects', function(){

    describe('wrapper', function(){
        it('creates a stub object', function(){
            var MyClass = ß();
            should.exist(MyClass);
        });
        
        it('creates a class from definition', function(){
            var definition = ß();
            var MyClass = definition.ÆON();
            should.exist(MyClass);
        });
    });
    
    describe('public interface', function(){
        
        it('members are present on instances, but not the object', function(){
            var definition = ß();
            definition.Public.test = function(){
                return 'blah';
            };
            var MyClass = definition.ÆON();
            var myInstance = new MyClass();
            should.exist(myInstance);
            should.exist(myInstance.test);
            should.not.exist(MyClass.test);
            myInstance.test().should.equal('blah')
        });
        
        //*
        it('retains statics on the class but not on the object', function(){
            var definition = ß();
            definition.Public.Static.test = function(){
                return 'blah';
            };
            var MyClass = definition.ÆON();
            var myInstance = new MyClass();
            should.exist(myInstance);
            should.not.exist(myInstance.test);
            should.exist(MyClass.test);
            MyClass.test().should.equal('blah')
        });
        
        it('errors on set of static final field', function(){
            var definition = ß();
            definition.Public.Static.Final.test = function(){
                return 'blah';
            };
            var MyClass = definition.ÆON();
            var myInstance = new MyClass();
            should.exist(myInstance);
            should.not.exist(myInstance.test);
            should.exist(MyClass.test);
            MyClass.test().should.equal('blah');
            try{
                MyClass.test = function(){};
                should.not.exist(true);
            }catch(ex){
                MyClass.test().should.equal('blah');
            }
        });
        
    });
    
    describe('private interface', function(){
        it('members are present on instances, but not the object', function(){
            var definition = ß();
            definition.Public.proxy = function(){
                return this.test();
            };
            definition.Private.test = function(){
                return 'blah';
            };
            var MyClass = definition.ÆON();
            var myInstance = new MyClass();
            should.not.exist(myInstance.test);
            myInstance.proxy().should.equal('blah');
        });
    });
    
    describe('protected interface', function(){
        
    });
    describe('performance', function(){
        //todo: performance comparison simple objects
        //todo: performance 2-level inheritance
        //todo: performance 2-level inheritance + super
    });
});