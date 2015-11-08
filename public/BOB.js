(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
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
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
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
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("scripts/BOB", function(exports, require, module) {
var BOB;

BOB = (function() {
  BOB._data = null;

  BOB.find = function(selector) {};

  BOB.data = function() {
    return BOB._data;
  };

  BOB.d = function() {
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
    this.innerBob = contentBob;
    this.postBob = postBob;
    this.type = selector;
    this.object_class = null;
    this.object_id = null;
    this.object_content = "";
    this.object_style = null;
    if (selector.indexOf(".") > -1) {
      _ref = selector.split("."), this.type = _ref[0], this.object_class = _ref[1];
    } else if (selector.indexOf("#") > -1) {
      _ref1 = selector.split("#"), this.type = _ref1[0], this.object_id = _ref1[1];
    }
  }

  BOB.prototype.content = function(content) {
    return this.co(content);
  };

  BOB.prototype.co = function(content) {
    var child;
    child = this.i("");
    child.object_content = BOB.toVariable(content);
    return this;
  };

  BOB.prototype.style = function(style) {
    return this.st(style);
  };

  BOB.prototype.st = function(style) {
    this.object_style = BOB.toVariable(style);
    return this;
  };

  BOB.prototype["class"] = function(object_class) {
    return this.cl(object_class);
  };

  BOB.prototype.cl = function(object_class) {
    this.object_class = BOB.toVariable(object_class);
    return this;
  };

  BOB.prototype.id = function(object_id) {
    this.object_id = BOB.toVariable(object_id);
    return this;
  };

  BOB.prototype.insert = function(data, options) {
    return this.i(data, options);
  };

  BOB.prototype.i = function(data, options) {
    var child_bob;
    child_bob = BOB.get_or_create_bob(data, options, this);
    if (this.innerBob) {
      this.innerBob.a(child_bob);
    } else {
      this.innerBob = child_bob;
    }
    return child_bob;
  };

  BOB.prototype.append = function(data, options) {
    return this.a(data, options);
  };

  BOB.prototype.a = function(data, options) {
    var new_bob, par;
    par = this;
    if (this.parent) {
      par = this.parent;
    }
    new_bob = BOB.get_or_create_bob(data, options, par);
    if (this.postBob) {
      return this.postBob.a(new_bob);
    } else {
      return this.postBob = new_bob;
    }
  };

  BOB.prototype.prepend = function(data, options) {
    return this.p(data, options);
  };

  BOB.prototype.p = function(data, options) {
    var new_bob, par;
    par = this;
    if (this.parent) {
      par = this.parent;
    }
    new_bob = BOB.get_or_create_bob(data, options, par);
    if (this.preBob) {
      return this.preBob.p(new_bob);
    } else {
      return this.preBob = new_bob;
    }
  };

  BOB.prototype["do"] = function(dataset) {
    return this.d(dataset);
  };

  BOB.prototype.d = function(dataset) {
    var child_array;
    child_array = new BOBChildArray(dataset, this);
    return child_array;
  };

  BOB.prototype.up = function() {
    return this.parent;
  };

  BOB.prototype.u = function() {
    return this.parent;
  };

  BOB.prototype.prettyPrint = function() {
    return this.pp();
  };

  BOB.prototype.pp = function() {
    return this.s(true);
  };

  BOB.prototype.toString = function() {
    return this.s();
  };

  BOB.prototype.s = function(pretty) {
    var append, closable, content_b, key, prepend, printself, value, _ref;
    if (pretty == null) {
      pretty = false;
    }
    if (this.parent) {
      return this.parent.s(pretty);
    }
    if (this.innerBob) {
      this.innerBob.parent = null;
    }
    if (this.preBob) {
      this.preBob.parent = null;
    }
    if (this.postBob) {
      this.postBob.parent = null;
    }
    prepend = '';
    append = '';
    printself = '';
    content_b = '';
    if (this.innerBob) {
      content_b = this.innerBob.s(pretty);
    }
    if (this.preBob) {
      prepend = this.preBob.s(pretty);
    }
    if (this.postBob) {
      append = this.postBob.s(pretty);
    }
    if (this.type !== "") {
      printself += '<' + this.type + ' ';
      _ref = this.options;
      for (key in _ref) {
        value = _ref[key];
        if (!(key === 'style' && this.object_style || key === 'id' && this.object_id || key === 'class' && this.object_class)) {
          printself += key + '="' + value + '" ';
        }
      }
      if (this.object_class) {
        printself += 'class="' + this.object_class + '" ';
      }
      if (this.object_id) {
        printself += 'id="' + this.object_id + '" ';
      }
      if (this.object_style) {
        printself += 'style="' + this.object_style + '" ';
      }
      printself = printself.slice(0, -1);
      closable = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr", "basefont", "bgsound", "frame", "isindex"].indexOf(this.type) !== -1;
      if (closable && content_b === '') {
        printself += ' />';
      } else {
        if (pretty) {
          if (content_b) {
            content_b = "\n\t" + content_b.split("\n").join("\n\t") + "\n";
          } else {
            content_b = "\n";
          }
        }
        printself += '>' + content_b + '</' + this.type + '>';
      }
    } else {
      printself = this.object_content;
    }
    if (pretty) {
      if (prepend) {
        prepend = prepend + "\n\t";
        printself = printself.split("\n").join("\n\t");
      }
      if (append) {
        append = "\n" + append;
      }
    }
    return prepend + printself + append;
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
    return this.co(content);
  };

  BOBChildArray.prototype.co = function(content) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].co(content);
      }
    }
    return this;
  };

  BOBChildArray.prototype.style = function(style) {
    return this.st(style);
  };

  BOBChildArray.prototype.st = function(style) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].st(style);
      }
    }
    return this;
  };

  BOBChildArray.prototype["class"] = function(object_class) {
    return this.cl(object_class);
  };

  BOBChildArray.prototype.cl = function(object_class) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].cl(object_class);
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
    return this.i(data, options);
  };

  BOBChildArray.prototype.i = function(data, options) {
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
    return this.a(data, options);
  };

  BOBChildArray.prototype.a = function(data, options) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].a(data, options);
      } else {
        this.bobs.push(this.parent.a(data, options));
      }
    }
    return this;
  };

  BOBChildArray.prototype.prepend = function(data, options) {
    return this.p(data, options);
  };

  BOBChildArray.prototype.p = function(data, options) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = this.dataset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].p(data, options);
      } else {
        this.bobs.push(this.parent.p(data, options));
      }
    }
    return this;
  };

  BOBChildArray.prototype.prettyPrint = function() {
    return this.pp();
  };

  BOBChildArray.prototype.pp = function() {
    return this.s(true);
  };

  BOBChildArray.prototype.toString = function() {
    return this.s();
  };

  BOBChildArray.prototype.s = function(pretty) {
    var bob, html_string, _i, _len, _ref;
    if (pretty == null) {
      pretty = false;
    }
    if (this.parent) {
      return this.parent.s(pretty);
    } else {
      html_string = "";
      _ref = this.bobs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bob = _ref[_i];
        bob.parent = false;
        html_string += bob.s(pretty);
      }
      return html_string;
    }
  };

  BOBChildArray.prototype["do"] = function(data) {
    return this.d(data);
  };

  BOBChildArray.prototype.d = function(data) {
    var bob, _i, _len, _ref;
    _ref = this.bobs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bob = _ref[_i];
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].d(data);
      } else {
        this.bobs.push(this.parent.d(data));
      }
    }
    return this;
  };

  BOBChildArray.prototype.up = function() {
    return this.u();
  };

  BOBChildArray.prototype.u = function() {
    var i, _i, _ref;
    if (!this.bobs[0]) {
      BOB._data = null;
      return this.parent;
    }
    for (i = _i = 0, _ref = this.bobs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.bobs[i] = this.bobs[i].u();
    }
    if (this.bobs[0] === this.parent) {
      BOB._data = null;
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