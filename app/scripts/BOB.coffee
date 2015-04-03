# BOB

# build or bail

class BOB
	BOB._data = null
	
	BOB.find = (selector) ->
		#TODO: this selects an existing element, and append/prepend/inserts into that
	BOB.data = ->
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
		@object_content = BOB.toVariable(content)
		return this
	style: (style) ->
		@object_style = BOB.toVariable(style)
		return this
	class: (object_class) ->
		@object_class = BOB.toVariable(object_class)
		return this
	id: (object_id) ->
		@object_id = BOB.toVariable(object_id)
		return this

	insert: (data, options) ->
		child_bob = BOB.get_or_create_bob(data, options, this)

		if @innerBob
			@innerBob.append(child_bob)
		else
			@innerBob = child_bob

		return child_bob

	toString: ->
		#this makes the toString bubble to the top if it is cast on a sub-element
		if @parent
			return @parent.toString()
		
		#kill parents so they will print out.
		@innerBob.parent = null if @innerBob
		@preBob.parent     = null if @preBob
		@postBob.parent    = null if @postBob

		prepend = ''
		append = ''
		printself = ''
		content_b = ''

		content_b = @innerBob.toString() if @innerBob
		prepend = @preBob.toString() if @preBob
		append = @postBob.toString() if @postBob

		printself += '<' + @type + ' '
		for key, value of @options
			unless key == 'style' && @object_style || key == 'id' && @object_id || key == 'class' && @object_class
				printself += key + '="' + value + '" ' 

		
		
		printself += 'class="' + @object_class + '" ' if @object_class
		printself += 'id="'    + @object_id    + '" ' if @object_id
		printself += 'style="' + @object_style + '" ' if @object_style

		printself = printself.slice(0, -1)
		printself += '>' + @object_content + content_b + '</' + @type + '>'

		return prepend + printself + append

	p: ->
		this.toString()

	append: (data, options) ->
		new_bob = BOB.get_or_create_bob(data,options, this)
		if @postBob
			@postBob.append(new_bob)
		else
			@postBob = new_bob
	prepend: (data, options) ->
		new_bob = BOB.get_or_create_bob(data,options, this)
		if @preBob
			@preBob.prepend(new_bob)
		else
			@preBob = new_bob

	do: (dataset)->
		child_array = new BOBChildArray(dataset, this)
		# @doData = dataset
		# @inDO = true
		return child_array

	up: ->
		@parent

	parent: ->
		@parent

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

