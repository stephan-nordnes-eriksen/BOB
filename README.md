# BOB
BOB is a simple and powerfull javascript library for building complex html structures. 

BOB uses a pipe system to easily create very complex structures.

##Usage:
###Building a simple tag:
    
    new BOB("div").toString() 
    //=> "<div></div>"
    //You can also use the shorthand method "p":
    new BOB("div").p()
    //=> "<div></div>"

###Adding IDs and classes
	
	new BOB("div").class("some_class").p()
    //=> "<div class=\"some_class\"></div>"
    new BOB("div").id("some_id").p()
    //=> "<div id=\"some_class\"></div>"

This can also be done with the shorthand selector style:

    new BOB("div.some_class").p()
    //=> "<div class=\"some_class\"></div>"
    new BOB("div#some_id").p()
    //=> "<div id=\"some_class\"></div>"

###Adding styles, content, and custom attributes
	
	new BOB("div").style("min-height: 10px;").p()
    //=> "<div style=\"min-height: 10px;\"></div>"
    new BOB("h1").content("BOB is awesome! <3").p()
    //=> "<h1>BOB is awesome! <3</h1>"
    new BOB("div", {"data-BOB-is-cool": "Yes it is", "data-very-cool": "indeed"}).p()
    //=> "<div data-BOB-is-cool="Yes it is" data-very-cool="indeed"></div>"

###Building and appending/prepending tags:

    new BOB("div").append("span").p()
    //=> "<div></div><span></span>"
    new BOB("div").prepend("span").p()
    //=> "<span></span><div></div>"

###Building with inserting tags:

    new BOB("div").insert("span").p()
    //=> "<div><span></span></div>"



###Handling basic nesting
When appending, prepending, or inserting you will effectively branch downwards, meaning that the latest element is your current active. Example:

	new BOB("div").append("span").id("some_id").p()
	//=> "<div></div><span id=\"some_id\"></span>"

In this simlpe example we see that it is the ´span´ that receives the ´id´, not the div. If we wanted to affect the ´div´ in stead (in this trivial, nonsensical, example), we would do:

	new BOB("div").append("span").up().id("some_id").p()
	//=> "<div id=\"some_id\"></div><span></span>"	

We effectively traversed backwards, or up, the stack. This is the basics of managing nesting and branching. Let's have a look at how to build usefull branches.

**It is very improtant to keep track of what is "in focus" when you are applying the next pipe.**


###Branching out
Say you want HTML that looks like this:

    <ul><li>1</li><li>2</li><li>3</li></ul>

To do such branching, without having to re-write all parts manually, you can use the ´do´ method:

    new BOB("ul").do([1,2,3]).insert("li").content(BOB.data).p()
    //=> <ul><li>1</li><li>2</li><li>3</li></ul>

Here you see ´BOB.data´ which is a special variable which represend the individal data points when the chain in being executed. It can be used for anything within the scope of the ´do´, eg.
	
	data = [1,2,3]
    new BOB("ul").do(data).insert("li", {"data-property": BOB.data}).id(BOB.data).p()
    //=> <ul><li id="1" data-property="1"></li><li id="2" data-property="2"></li><li id="3" data-property="3"></li></ul>

However, if you use the ´up´ command and go out of the scope of ´do´, ´BOB.data´ might not work. The behaviour is undefined so errors and/or strange behaviour might occur. Eg:

	new BOB("ul").do([1,2,3]).insert("li").up().id(BOB.data).p() //INVALID
    //=> The BOB.data will not be set and you will get the output of: "<ul><li></li><li></li><li></li></ul>".

###Processing data and BOB.data
BOB.data is a function, so **you cannot manipulate ´BOB.data´ directly.**

It is adviced to do the data manipulation prior to the ´do´ pipe. However it is possible to manipulate BOB.data inline like this:

	new BOB("ul").do([1,2,3]).insert("li").content(function(){return BOB.data() + 2}).p()
    //=> <ul><li>3</li><li>4</li><li>5</li></ul>
    //Or you can predefine a set of manipulations
    data_modifier = function(){return BOB.data() + 2}
    new BOB("ul").do([1,2,3]).insert("li").content(data_modifier).p()
    //=> <ul><li>3</li><li>4</li><li>5</li></ul>



###Some complex examples




##Compiling source files:

Install dependencies with ´npm install´

Then build with ´npm run compile´. See ´package.json´, under scripts, for more options.

# Brunch app

This is HTML5 application, built with [Brunch](http://brunch.io).

## Getting started
* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * [Bower](http://bower.io): `npm install -g bower`
    * Brunch plugins and Bower dependencies: `npm install & bower install`.
* Run:
    * `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `brunch build --production` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Chaplin site](http://chaplinjs.org)
