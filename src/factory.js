var Factory = {};

(function() {
  // Private properties
  var constructors = {},

  // Private methods

  /**
    * Augments a constructor provided by the client
    * adds properties and functions used to handle sequences
    */
  augmentConstructor = function(constrFn) {

    /**
      * Helper function to give a unique number
      * per instace of the constructor and assign that number
      * to a property of the instace
      */
    constrFn.propertiesToSequence = [];
    constrFn.sequence = function(property, fn) {
      this.propertiesToSequence.push({
        "property": property,
        "fn": fn
      });
      return this;
    };

    /**
      * Sets a defaultProperties attributes that help
      * to initialize new objects with the specified properties
      * set to a default value
      */
    constrFn.defaults = function(properties) {
      this.defaultProperties = properties;
      return this;
    };

    // AutoIncrement increments a counter per instance
    constrFn.prototype.autoIncrement = (function() {
      var count = 0;
      return function(property, fn) {
        if(typeof this.autoIncremented === "undefined" || this.autoIncremented !== true) {
          count += 1;
          this.autoIncremented = true;
        }
        if(typeof fn === "function") {
          this[property] = fn(count);
        } else {
          this[property] = count;
        }
      };
    }());
    return constrFn;
  },

  /**
    * Defines a constructor type
    * params:
    * @constrFn (optional)
    */
  define = function(type, constrFn) {

    if (typeof constrFn !== "undefined" && typeof constrFn !== "function") {
      throw {
        name: "NotAFunctionError",
        message: "constrFn is not a function; it is a: " + typeof constrFn
      };
    }

    if (constructors.hasOwnProperty(type)) {
      throw {
        name: "AlreadyDefinedType",
        message: "that object type was already defined"
      };
    }
    if( typeof constrFn === "undefined" ) {
      constrFn = function() {};
    }
    augmentConstructor(constrFn);
    constructors[type] = constrFn;

    return constructors[type];
  },

  // Builds a object using a constructor type
  build = function(type, overridenProps) {
    var constructor = constructors[type],
        objectBuilt = {},
        autoIncrementObj = {},
        property = {},
        i = 0;

    // error if the constructor does not exist
    if (typeof constructor !== "function") {
      return undefined;
    }

    // Build the object
    objectBuilt = new constructor();

    // Set the default properties to the new object
    for(property in constructor.defaultProperties) {
      objectBuilt[property] = constructor.defaultProperties[property];
    }

    /**
      * Set the overriden properties' values to the new object
      * if the property is not existent it will be added
      */
    if (typeof overridenProps !== "undefined") {
      for(property in overridenProps) {
        objectBuilt[property] = overridenProps[property];
      }
    }

    // Call its autoincrement method per property needed
    for(i = 0; i < constructor.propertiesToSequence.length; i += 1) {
      autoIncrementObj = constructor.propertiesToSequence[i];
      objectBuilt.autoIncrement(autoIncrementObj.property, autoIncrementObj.fn);
    }
    return objectBuilt;
  },

  // Build a list of objects using a constructor type
  buildList = function(type, quantity){
    var objectList = [],
        i = 0;

    for(;i < quantity; i += 1) {
      objectList.push(build(type));
    }

    return objectList;
  },

  // Clean the constructors object
  clean = function() {
    constructors = {};
  };

  // end var

  // Revealing public API;
  Factory = {
    define: define,
    build: build,
    buildList: buildList,
    clean: clean
  };

}());
