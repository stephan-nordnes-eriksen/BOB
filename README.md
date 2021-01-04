# BOB
BOB is a simple and powerfull javascript pipe system for building complex XML and HTML structures. 

![BOB](/BOB.png?raw=true)

## Install:
Download the repo, or copy the small (<8 KB) [`public/BOB.standalone.min.js`](public/BOB.standalone.min.js). It is completely stand alone, no external libraries needed.

Then in your html's header tag
```html

	<script src="/BOB.standalone.min.js"></script>
```

### Bower
    bower install BOB

### NPM module will come in the future
I found that there is already an NPM moduled called [bob](https://www.npmjs.com/package/bob), so I am open to name suggestions.

## Usage:
BOB is a pipe system for generating XML and HTML structures.

### TL;DR
```javascript

new BOB("div").toString() //=> "<div></div>"
new BOB("div").s() //=> "<div></div>"
new BOB("div").class("some_class").s() //=> "<div class=\"some_class\"></div>"
new BOB("div").id("some_id").s() //=> "<div id=\"some_id\"></div>"
new BOB("div.some_class").s() //=> "<div class=\"some_class\"></div>"
new BOB("div#some_id").s() //=> "<div id=\"some_id\"></div>"
new BOB("div").style("min-height: 10px;").s() //=> "<div style=\"min-height: 10px;\"></div>"
new BOB("h1").content("BOB is awesome! <3").s() //=> "<h1>BOB is awesome! <3</h1>"
new BOB("div", {"data-BOB-is-cool": "Yes it is", "data-very-cool": "indeed"}).s() //=> "<div data-BOB-is-cool="Yes it is" data-very-cool="indeed"></div>"
new BOB("div").append("span").s() //=> "<div></div><span></span>"
new BOB("div").prepend("span").s() //=> "<span></span><div></div>"
new BOB("div").insert("span").s() //=> "<div><span></span></div>"
new BOB("div").append("span").id("some_id").s() //=> "<div></div><span id=\"some_id\"></span>"
new BOB("div").append("span").up().id("some_id").s() //=> "<div id=\"some_id\"></div><span></span>"
new BOB("ul").do([1,2,3]).insert("li").content(BOB.data).s() //=> <ul><li>1</li><li>2</li><li>3</li></ul>
data = [1,2,3]; new BOB("ul").do(data).insert("li", {"data-property": BOB.data}).id(BOB.data).s() //=> <ul><li id="1" data-property="1"></li><li id="2" data-property="2"></li><li id="3" data-property="3"></li></ul>
new BOB("ul").do([1,2,3]).insert("li").up().id(BOB.data).s() //INVALID //=> The BOB.data will not be set and you will get the output of: "<ul><li></li><li></li><li></li></ul>".
new BOB("ul").do([1,2,3]).insert("li").content(function(){return BOB.data() + 2}).s() //=> <ul><li>3</li><li>4</li><li>5</li></ul>
data_modifier = function(){return BOB.data() + 2}; new BOB("ul").do([1,2,3]).insert("li").content(data_modifier).s() //=> <ul><li>3</li><li>4</li><li>5</li></ul>

//Shorthand syntax:
new BOB("div").i("img", {"src":"some.png"}).u().d([1,2,3]).i("p.number").co(BOB.d).s() //=> "<div><img src="some.png" /><p class="number">1</p><p class="number">2</p><p class="number">3</p></div>"
```
[Go to shorthand syntax section](#shorthand)

### Building a simple tag:
```javascript

new BOB("div").toString() 
//=> "<div></div>"
```
You can also use the shorthand method "s". For a full list see [the shorthand section](#shorthand)

```javascript
new BOB("div").s()
//=> "<div></div>"
```

### Adding IDs and classes
```javascript

new BOB("div").class("some_class").s()
//=> "<div class=\"some_class\"></div>"
new BOB("div").id("some_id").s()
//=> "<div id=\"some_id\"></div>"
```

This can also be done with the shorthand selector style:
```javascript
new BOB("div.some_class").s()
//=> "<div class=\"some_class\"></div>"
new BOB("div#some_id").s()
//=> "<div id=\"some_id\"></div>"
```

### Adding styles, content, and custom attributes
```javascript
new BOB("div").style("min-height: 10px;").s()
//=> "<div style=\"min-height: 10px;\"></div>"
new BOB("h1").content("BOB is awesome! <3").s()
//=> "<h1>BOB is awesome! <3</h1>"
new BOB("div", {"data-BOB-is-cool": "Yes it is", "data-very-cool": "indeed"}).s()
//=> "<div data-BOB-is-cool="Yes it is" data-very-cool="indeed"></div>"
```

### Building and appending/prepending tags:
```javascript
new BOB("div").append("span").s()
//=> "<div></div><span></span>"
new BOB("div").prepend("span").s()
//=> "<span></span><div></div>"
```

### Building with inserting tags:
```javascript
new BOB("div").insert("span").s()
//=> "<div><span></span></div>"
```

### Handling basic nesting
When appending, prepending, or inserting you will effectively branch downwards, meaning that the latest element is your current active. Example:

```javascript
new BOB("div").append("span").id("some_id").s()
//=> "<div></div><span id=\"some_id\"></span>"
```

In this simlpe example we see that it is the `span` that receives the `id`, not the div. If we wanted to affect the `div` in stead (in this trivial, nonsensical, example), we would do:

```javascript
new BOB("div").append("span").up().id("some_id").s()
//=> "<div id=\"some_id\"></div><span></span>"	
```

We effectively traversed backwards, or up, the stack. This is the basics of managing nesting and branching. Let's have a look at how to build usefull branches.

**It is very improtant to keep track of what is "in focus" when you are applying the next pipe.**


### Branching out
Say you want XML/HTML that looks like this:

```javascript
<ul><li>1</li><li>2</li><li>3</li></ul>
```

To do such branching, without having to re-write all parts manually, you can use the `do` method:

```javascript
new BOB("ul").do([1,2,3]).insert("li").content(BOB.data).s()
//=> <ul><li>1</li><li>2</li><li>3</li></ul>
```

Here you see `BOB.data` which is a special variable which represend the individal data points when the chain in being executed. It can be used for anything within the scope of the `do`, eg.

```javascript
let data = [1,2,3]
new BOB("ul").do(data).insert("li", {"data-property": BOB.data}).id(BOB.data).s()
//=> <ul><li id="1" data-property="1"></li><li id="2" data-property="2"></li><li id="3" data-property="3"></li></ul>
```

However, if you use the `up` command and go out of the scope of `do`, `BOB.data` might not work. The behaviour is undefined so errors and/or strange behaviour might occur. Eg:

```javascript
new BOB("ul").do([1,2,3]).insert("li").up().id(BOB.data).s() //INVALID
//=> The BOB.data will not be set and you will get the output of: "<ul><li></li><li></li><li></li></ul>".
```

### Processing data and BOB.data
BOB.data is a function, so **you cannot manipulate `BOB.data` directly.**

It is adviced to do the data manipulation prior to the `do` pipe. However it is possible to manipulate BOB.data inline like this:

```javascript
new BOB("ul").do([1,2,3]).insert("li").content(function(){return BOB.data() + 2}).s()
//=> <ul><li>3</li><li>4</li><li>5</li></ul>
//Or you can predefine a set of manipulations
data_modifier = function(){return BOB.data() + 2}
new BOB("ul").do([1,2,3]).insert("li").content(data_modifier).s()
//=> <ul><li>3</li><li>4</li><li>5</li></ul>
```

### Pretty Printing
It is possible get a pretty printed version of the XML/HTML, with the `.prettyPrint()` method, or the `.pp` shorthand.

```javascript
new BOB("article").a("lol").i("photo").co("test").a("test2").i("price").co("200euro").pp()
#=> "</article>\n<lol>\n\t<photo>\n\t\ttest\n\t</photo>\n\t<test2>\n\t\t<price>\n\t\t\t200euro\n\t\t</price>\n\t</test2>\n</lol>"
```

This string will print as the following:

```
</article>
<lol>
    <photo>
        test
    </photo>
    <test2>
        <price>
            200euro
        </price>
    </test2>
</lol>
```

<a name="shorthand"></a>
### Short hand syntax
Writing out these pipes can be tiresom if you are building big and complex structures, so you can utilize these shorthand methods.

Long Version | Short Version
------------ | -------------
.insert      | .i
.append      | .a
.prepend     | .p
.content     | .co
.style       | .st
.class       | .cl
.id          | .id
.style       | .st
.toString    | .s
.do          | .d
.up          | .u
BOB.data     | BOB.d
.prettyPrint | .pp

Now you can get tight and cozy syntax like this:

```javascript
new BOB("div").i("img", {"src":"some.png"}).u().d([1,2,3]).i("p.number").co(BOB.d).s()
//=> "<div><img src="some.png"></img><p class="number">1</p><p class="number">2</p><p class="number">3</p></div>"
```

### Some complex examples
Better examples coming

```javascript
let data = ["Team member1", "team member2", "team member3"]
new BOB("ul").do(data).insert("li.team").content(BOB.data).s()
//=> "<ul><li class="team">Team member1</li><li class="team">team member2</li><li class="team">team member3</li></ul>"

new BOB("div#wrapper").insert("div#searchbar").up().insert("footer").do(["team","contact","buy"]).insert("h2").content(BOB.data).s()
//=> "<div id="wrapper"><div id="searchbar"></div><footer><h2>team</h2><h2>contact</h2><h2>buy</h2></footer></div>"

new BOB("div#wrapper").insert("div#searchbar").up().insert("footer").do(["team","contact","buy"]).insert("h2",{"onclick": function(){return ("alert('" + BOB.data() + "');") }}).content(BOB.data).s()
//=> "<div id="wrapper"><div id="searchbar"></div><footer><h2 onclick="alert('team');">team</h2><h2 onclick="alert('contact');">contact</h2><h2 onclick="alert('buy');">buy</h2></footer></div>"

new BOB("div#wrapper").insert("div#searchbar").up().insert("footer").do(["team","contact","buy"]).insert("h2",{"onclick": function(){return ("alert('" + BOB.data() + "');") }}).content(BOB.data).up().up().prepend("a",{"href": "http://www.google.com"}).content("google").s()
//=> "<a href="http://www.google.com">google</a><div id="wrapper"><div id="searchbar"></div><footer><h2 onclick="alert('team');">team</h2><h2 onclick="alert('contact');">contact</h2><h2 onclick="alert('buy');">buy</h2></footer></div>"
```

### Comparing to D3 and jQuery:
TODO: get simple and complex examples comparing BOB, d3 and jQuery. And also pure JS maybe.

## Important notes:
Currently BOB has no unit tests, so it cannot be considered production ready. 

Please help contribute to this project. It is brand new, and there are probably loads of features that can be added. 

### Planned features

 - Adding element selector which finds elements in the active DOM.
 - Adding ability to output string into existing elements (similar how jQuery does it)
 - Adding nested data-aquisition data, eg: new BOB("div").do(["a", "b"]).do([1,2]).in("a").class(BOB.data[0]).co(BOB.data[1])
 //=> <div><a class="a">1</a><a class="a">2</a><a class="b">1</a><a class="b">2</a></div>
 - Automaticly detect if option value is a function. If so, create a callback for it. Eg: new BOB("a", {"onclick": function(){alert "some shit"}}).co("call me")
 //=> <a onclick="BOB.callbacks\[N\]();">call me</a> (this can be problematic with BOB.data. Solution: pass BOB.data into the callback.) => {"onclick": function(data){alert(data+1)}} => <a onclick="BOB.callbacks\[N\]('parsed BOB.data');". The same approach can be used other places as well.

## License
MIT
