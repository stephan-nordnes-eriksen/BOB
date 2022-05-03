// Generated by CoffeeScript 2.7.0
// BOB

// build or bail
var BOB, BOBChildArray;

BOB = (function() {
  class BOB {
    static find(selector) {}

    static data() {
      return BOB._data;
    }

    static d() {
      return BOB._data;
    }

    static get_or_create_bob(data, options, parent) {
      var child_bob;
      child_bob = null;
      if (data instanceof BOB) {
        child_bob = data;
      } else {
        child_bob = new BOB(data, options, parent);
      }
      return child_bob;
    }

    static toVariable(data) {
      if (typeof data === 'function') {
        return data();
      } else {
        return data;
      }
    }

    constructor(selector, options, parent = null, preBob = null, contentBob = null, postBob = null) {
      var key, value;
      if (selector.indexOf(" ") > -1) {
        console.error("Invalid BOB selector. \"" + selector + "\" contains \" \"(space). Only allowed is \"tag\", \"tag.class\", or \"tag#id\".");
        return "Invalid selector. See console log for more details.";
      }
      this.parent = parent;
      //Flatting so BOB.data gets parsed out to the correct thing.
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
        [this.type, this.object_class] = selector.split(".");
      } else if (selector.indexOf("#") > -1) {
        [this.type, this.object_id] = selector.split("#");
      }
    }

    content(content) {
      return this.co(content);
    }

    co(content) {
      var child;
      child = this.i("");
      child.object_content = BOB.toVariable(content);
      return this;
    }

    style(style) {
      return this.st(style);
    }

    st(style) {
      this.object_style = BOB.toVariable(style);
      return this;
    }

    class(object_class) {
      return this.cl(object_class);
    }

    cl(object_class) {
      this.object_class = BOB.toVariable(object_class);
      return this;
    }

    id(object_id) {
      this.object_id = BOB.toVariable(object_id);
      return this;
    }

    insert(data, options) {
      return this.i(data, options);
    }

    i(data, options) {
      var child_bob;
      child_bob = BOB.get_or_create_bob(data, options, this);
      if (this.innerBob) {
        this.innerBob.a(child_bob);
      } else {
        this.innerBob = child_bob;
      }
      return child_bob;
    }

    append(data, options) {
      return this.a(data, options);
    }

    a(data, options) {
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
    }

    prepend(data, options) {
      return this.p(data, options);
    }

    p(data, options) {
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
    }

    do(dataset) {
      return this.d(dataset);
    }

    d(dataset) {
      var child_array;
      child_array = new BOBChildArray(dataset, this);
      // @doData = dataset
      // @inDO = true
      return child_array;
    }

    up() {
      return this.parent;
    }

    u() {
      return this.parent;
    }

    prettyPrint() {
      return this.pp();
    }

    pp() {
      return this.s(true);
    }

    toString() {
      return this.s();
    }

    s(pretty = false) {
      var append, closable, content_b, key, prepend, printself, ref, value;
      //this makes the toString bubble to the top if it is cast on a sub-element
      if (this.parent) {
        return this.parent.s(pretty);
      }
      if (this.innerBob) {
        
        //kill parents so they will print out.
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
      //TODO: Make special case for img (or those without content?) and no-type tag, which is pure text content.
      if (this.type !== "") {
        printself += '<' + this.type + ' ';
        ref = this.options;
        for (key in ref) {
          value = ref[key];
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
        //pure text element (no type)
        printself = this.object_content; //it should not have any innerBob as it is never exposed when we are setting object_content
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
    }

  };

  BOB._data = null;

  return BOB;

}).call(this);

// new BOB("div",{test: "lol"}).do(["data"]).add("p",funtion(d){this.insert("div",{a: d.height})})

  // new BOB("ul",{class: "lol"})
// 	.do(dataset)
// 	.insert("li", {dataProp: BOB.data}) #?
// 		.content(BOB.data)              #?
// 	.insert("p")
// 		.content("lol")
// 	.up()
// 	.up()
// 	.insert("p")
// 		.content("lol2")
// 	.up()
// 	.append("ul",{class: "shiet"})
// 	.append("ul",{class: "shiet"})
// 	.prepend("ul",{class: "shiet"})
// 	.toString();
BOBChildArray = class BOBChildArray {
  constructor(dataset, parent) {
    this.dataset = dataset;
    this.parent = parent;
    this.bobs = [];
  }

  //No point in doing this on parent. Does not make sense to do ".do(data).id(BOB.data)"
  content(content) {
    return this.co(content);
  }

  co(content) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].co(content);
      }
    }
    return this;
  }

  style(style) {
    return this.st(style);
  }

  st(style) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].st(style);
      }
    }
    return this;
  }

  class(object_class) {
    return this.cl(object_class);
  }

  cl(object_class) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].cl(object_class);
      }
    }
    return this;
  }

  id(object_id) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].id(object_id);
      }
    }
    return this;
  }

  insert(data, options) {
    return this.i(data, options);
  }

  i(data, options) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].insert(data, options);
      } else {
        this.bobs.push(this.parent.insert(data, options));
      }
    }
    return this;
  }

  append(data, options) {
    return this.a(data, options);
  }

  a(data, options) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].a(data, options);
      } else {
        this.bobs.push(this.parent.a(data, options));
      }
    }
    return this;
  }

  prepend(data, options) {
    return this.p(data, options);
  }

  p(data, options) {
    var i, j, ref;
    for (i = j = 0, ref = this.dataset.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].p(data, options);
      } else {
        this.bobs.push(this.parent.p(data, options));
      }
    }
    return this;
  }

  prettyPrint() {
    return this.pp();
  }

  pp() {
    return this.s(true);
  }

  toString() {
    return this.s();
  }

  s(pretty = false) {
    var bob, html_string, j, len, ref;
    if (this.parent) {
      return this.parent.s(pretty);
    } else {
      html_string = "";
      ref = this.bobs;
      for (j = 0, len = ref.length; j < len; j++) {
        bob = ref[j];
        bob.parent = false;
        html_string += bob.s(pretty);
      }
      return html_string;
    }
  }

  //TODO: do(data).do(data2) does not behave correctly
  do(data) {
    return this.d(data);
  }

  d(data) {
    var bob, j, len, ref;
    ref = this.bobs;
    for (j = 0, len = ref.length; j < len; j++) {
      bob = ref[j];
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].d(data);
      } else {
        this.bobs.push(this.parent.d(data));
      }
    }
    return this;
  }

  up() {
    return this.u();
  }

  u() {
    var i, j, ref;
    if (!this.bobs[0]) {
      BOB._data = null;
      return this.parent;
    }
    for (i = j = 0, ref = this.bobs.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      this.bobs[i] = this.bobs[i].u();
    }
    if (this.bobs[0] === this.parent) {
      BOB._data = null;
      return this.parent;
    } else {
      return this;
    }
  }

};
