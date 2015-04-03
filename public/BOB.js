(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/BOB", function(exports, require, module) {
var BOB;

BOB = (function() {
  BOB._data = null;

  BOB.find = function(selector) {};

  BOB.data = function() {
    return BOB._data;
  };

  BOB.get_or_create_bob = function(data, options, parent) {
    var child_bob;
    child_bob = null;
    if (data instanceof BOB) {
      child_bob = data;
    } else {
      child_bob = new BOB(data, options, parent);
    }
    return child_bob;
  };

  BOB.toVariable = function(data) {
    if (typeof data === 'function') {
      return data();
    } else {
      return data;
    }
  };

  function BOB(selector, options, parent, preBob, contentBob, postBob) {
    var key, value, _ref, _ref1;
    if (parent == null) {
      parent = null;
    }
    if (preBob == null) {
      preBob = null;
    }
    if (contentBob == null) {
      contentBob = null;
    }
    if (postBob == null) {
      postBob = null;
    }
    if (selector.indexOf(" ") > -1) {
      console.error("Invalid BOB selector. \"" + selector + "\" contains \" \"(space). Only allowed is \"tag\", \"tag.class\", or \"tag#id\".");
      return "Invalid selector. See console log for more details.";
    }
    this.parent = parent;
    this.options = {};
    if (options) {
      for (key in options) {
        value = options[key];
        this.options[key] = BOB.toVariable(value);
      }
    }
    this.preBob = preBob;
    this.contentBob = contentBob;
    this.postBob = postBob;
    this.type = selector;
    this.object_class = null;
    this.object_id = null;
    this.content = "";
    this.style = null;
    if (selector.indexOf(".") > -1) {
      _ref = selector.split("."), this.type = _ref[0], this.object_class = _ref[1];
    } else if (selector.indexOf("#") > -1) {
      _ref1 = selector.split("#"), this.type = _ref1[0], this.object_id = _ref1[1];
    }
  }

  BOB.prototype.content = function(content) {
    this.content = BOB.toVariable(content);
    return this;
  };

  BOB.prototype.style = function(style) {
    this.style = BOB.toVariable(style);
    return this;
  };

  BOB.prototype["class"] = function(object_class) {
    this.object_class = BOB.toVariable(object_class);
    return this;
  };

  BOB.prototype.id = function(object_id) {
    this.object_id = BOB.toVariable(object_id);
    return this;
  };

  BOB.prototype.insert = function(data, options) {
    var child_bob;
    child_bob = BOB.get_or_create_bob(data, options, this);
    if (this.contentBob) {
      this.contentBob.append(child_bob);
    } else {
      this.contentBob = child_bob;
    }
    return child_bob;
  };

  BOB.prototype.toString = function() {
    var append, content_b, key, prepend, printself, value, _ref;
    if (this.parent) {
      return this.parent.toString();
    }
    if (this.contentBob) {
      this.contentBob.parent = null;
    }
    if (this.preBob) {
      this.preBob.parent = null;
    }
    if (this.postBob) {
      this.postBob.parent = null;
    }
    prepend = "";
    append = "";
    printself = "";
    content_b = "";
    if (this.contentBob) {
      content_b = this.contentBob.toString();
    }
    if (this.preBob) {
      prepend = this.preBob.toString();
    }
    if (this.postBob) {
      append = this.postBob.toString();
    }
    printself += "<" + this.type + " ";
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      if (!(key === "style" && this.style || key === "id" && this.object_id || key === "class" && this.object_class)) {
        printself += key + '="' + value + '" ';
      }
    }
    if (this.object_class) {
      printself += 'class="' + this.object_class + '" ';
    }
    if (this.object_id) {
      printself += 'id="' + this.object_id + '" ';
    }
    if (this.style) {
      printself += 'style="' + this.style + '" ';
    }
    printself = printself.slice(0, -1);
    printself += ">" + this.content + content_b + "</" + this.type + ">";
    return prepend + printself + append;
  };

  BOB.prototype.append = function(data, options) {
    var new_bob;
    new_bob = BOB.get_or_create_bob(data, options, this);
    if (this.postBob) {
      return this.postBob.prepend(new_bob);
    } else {
      return this.postBob = new_bob;
    }
  };

  BOB.prototype.prepend = function(data, options) {
    var new_bob;
    new_bob = BOB.get_or_create_bob(data, options, this);
    if (this.preBob) {
      return this.preBob.append(new_bob);
    } else {
      return this.preBob = new_bob;
    }
  };

  BOB.prototype["do"] = function(dataset) {
    var child_array;
    child_array = new BOBChildArray(dataset, this);
    return child_array;
  };

  BOB.prototype.up = function() {
    return this.parent;
  };

  BOB.prototype.parent = function() {
    return this.parent;
  };

  return BOB;

})();
});

require.register("scripts/BOBChildArray", function(exports, require, module) {
var BOBChildArray;

BOBChildArray = (function() {
  function BOBChildArray(dataset, parent) {
    this.dataset = dataset;
    this.parent = parent;
    this.bobs = [];
  }

  BOBChildArray.prototype.content = function(content) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].content(content);
      }
    }
    return this;
  };

  BOBChildArray.prototype.style = function(style) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].style(style);
      }
    }
    return this;
  };

  BOBChildArray.prototype["class"] = function(object_class) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i]["class"](object_class);
      }
    }
    return this;
  };

  BOBChildArray.prototype.id = function(object_id) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].id(object_id);
      }
    }
    return this;
  };

  BOBChildArray.prototype.insert = function(data, options) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].insert(data, options);
      } else {
        this.bobs.push(this.parent.insert(data, options));
      }
    }
    return this;
  };

  BOBChildArray.prototype.append = function(data, options) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].append(data, options);
      } else {
        this.bobs.push(this.parent.append(data, options));
      }
    }
    return this;
  };

  BOBChildArray.prototype.prepend = function(data, options) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].prepend(data, options);
      } else {
        this.bobs.push(this.parent.prepend(data, options));
      }
    }
    return this;
  };

  BOBChildArray.prototype.toString = function() {
    var bob, html_string, _i, _len, _ref;
    if (this.parent) {
      return this.parent.toString();
    } else {
      html_string = "";
      _ref = this.bobs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bob = _ref[_i];
        bob.parent = false;
        html_string += bob.toString();
      }
      return html_string;
    }
  };

  BOBChildArray.prototype["do"] = function(data) {
    var bob, _i, _len, _ref;
    _ref = this.bobs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bob = _ref[_i];
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i]["do"](data);
      } else {
        this.bobs.push(this.parent["do"](data));
      }
    }
    return this;
  };

  BOBChildArray.prototype.up = function() {
    var i, _i, _ref;
    if (!this.bobs[0]) {
      return this.parent;
    }
    for (i = _i = 0, _ref = this.bobs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.bobs[i] = this.bobs[i].up();
    }
    if (this.bobs[0] === this.parent) {
      return this.parent;
    } else {
      return this;
    }
  };

  return BOBChildArray;

})();
});

;
//# sourceMappingURL=BOB.js.map