# BOB

# build or bail

class BOB
	BOB._data = null
	
	BOB.find = (selector) ->
		#TODO: this selects an existing element, and append/prepend/inserts into that
	BOB.data = ->
		return BOB._data
	BOB.d = ->
		return BOB._data
	BOB.get_or_create_bob = (data, options, parent) ->
		child_bob = null
		if data instanceof BOB
			child_bob = data
		else
			child_bob = new BOB(data, options, parent)
		return child_bob

	BOB.toVariable = (data) ->
		if typeof data is 'function'
			return data()
		else
			return data

	constructor: (selector, options, parent=null, preBob=null, contentBob=null, postBob=null) ->
		if selector.indexOf(" ") > -1
			console.error("Invalid BOB selector. \"" + selector + "\" contains \" \"(space). Only allowed is \"tag\", \"tag.class\", or \"tag#id\".")
			return "Invalid selector. See console log for more details."

		@parent = parent

		#Flatting so BOB.data gets parsed out to the correct thing.
		@options = {}
		if options
			for key, value of options
				@options[key] = BOB.toVariable(value)

		@preBob = preBob
		@innerBob = contentBob
		@postBob = postBob

		@type = selector
		@object_class = null
		@object_id = null
		@object_content = ""
		@object_style = null

		if selector.indexOf(".") > -1
			[@type, @object_class] = selector.split(".")
		else if selector.indexOf("#") > -1
			[@type, @object_id] = selector.split("#")

	content: (content) ->
		this.co(content)
	co: (content) ->
		child = this.i("")
		child.object_content = BOB.toVariable(content)
		return this

	style: (style) ->
		this.st(style)
	st: (style) ->
		@object_style = BOB.toVariable(style)
		return this

	class: (object_class) ->
		this.cl(object_class)
	cl: (object_class) ->
		@object_class = BOB.toVariable(object_class)
		return this

	id: (object_id) ->
		@object_id = BOB.toVariable(object_id)
		return this

	insert: (data, options) ->
		this.i(data,options)
	i: (data, options) ->
		child_bob = BOB.get_or_create_bob(data, options, this)

		if @innerBob
			@innerBob.a(child_bob)
		else
			@innerBob = child_bob

		return child_bob

	append: (data, options) ->
		this.a(data, options)
	a: (data, options) ->
		par = this
		par = @parent if @parent
		new_bob = BOB.get_or_create_bob(data, options, par)
		if @postBob
			@postBob.a(new_bob)
		else
			@postBob = new_bob
	
	prepend: (data, options) ->
		this.p(data, options)
	p: (data, options) ->
		par = this
		par = @parent if @parent
		new_bob = BOB.get_or_create_bob(data, options, par)
		if @preBob
			@preBob.p(new_bob)
		else
			@preBob = new_bob

	do: (dataset)->
		this.d(dataset)
	d: (dataset)->
		child_array = new BOBChildArray(dataset, this)
		# @doData = dataset
		# @inDO = true
		return child_array

	up: ->
		@parent
	u: ->
		@parent

	toString: ->
		this.s()
	s: ->
		#this makes the toString bubble to the top if it is cast on a sub-element
		if @parent
			return @parent.s()
		
		#kill parents so they will print out.
		@innerBob.parent = null if @innerBob
		@preBob.parent     = null if @preBob
		@postBob.parent    = null if @postBob

		prepend = ''
		append = ''
		printself = ''
		content_b = ''

		content_b = @innerBob.s() if @innerBob
		prepend = @preBob.s() if @preBob
		append = @postBob.s() if @postBob
		#TODO: Make special case for img (or those without content?) and no-type tag, which is pure text content.
		
		if @type != ""
			printself += '<' + @type + ' '
			for key, value of @options
				unless key == 'style' && @object_style || key == 'id' && @object_id || key == 'class' && @object_class
					printself += key + '="' + value + '" '
			
			printself += 'class="' + @object_class + '" ' if @object_class
			printself += 'id="'    + @object_id    + '" ' if @object_id
			printself += 'style="' + @object_style + '" ' if @object_style

			printself = printself.slice(0, -1)
			closable = (["area",
						"base",
						"br",
						"col",
						"embed",
						"hr",
						"img",
						"input",
						"keygen",
						"link",
						"menuitem",
						"meta",
						"param",
						"source",
						"track",
						"wbr",
						"basefont",
						"bgsound",
						"frame",
						"isindex"].indexOf(@type) != -1)

			if closable && content_b == ''
				printself += ' />'
			else	
				printself += '>' + content_b + '</' + @type + '>'
		else
			#pure text element (no type)
			printself = @object_content #it should not have any innerBob as it is never exposed when we are setting object_content

		return prepend + printself + append

	# new BOB("div",{test: "lol"}).do(["data"]).add("p",funtion(d){this.insert("div",{a: d.height})})

	# new BOB("ul",{class: "lol"})
	# 	.do(dataset)
	# 	.insert("li", {dataProp: BOB.data}) #?
	# 		.content(BOB.data)              #?
	# 	.insert("p")
	# 		.content("lol")
	# 	.up()
	# 	.up()
	# 	.insert("p")
	# 		.content("lol2")
	# 	.up()
	# 	.append("ul",{class: "shiet"})
	# 	.append("ul",{class: "shiet"})
	# 	.prepend("ul",{class: "shiet"})
	# 	.toString();

