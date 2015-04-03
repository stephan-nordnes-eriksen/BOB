# BOB

# build or bail

class BOBChildArray
	constructor: (dataset, parent) ->
		@dataset = dataset
		@parent = parent
		@bobs = []

	#No point in doing this on parent. Does not make sense to do ".do(data).id(BOB.data)"
	content: (content) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].content(content) if @bobs[i]
		return this
	style: (style) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].style(style) if @bobs[i]
		return this
	class: (object_class) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].class(object_class) if @bobs[i]
		return this
	id: (object_id) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].id(object_id) if @bobs[i]
		return this
	insert: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].insert(data, options)
			else
				@bobs.push(@parent.insert(data, options))
				
		return this
	append: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].append(data, options)
			else
				@bobs.push(@parent.append(data, options))

		return this
	prepend: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].prepend(data, options)
			else
				@bobs.push(@parent.prepend(data, options))

		return this
	toString: ->
		if @parent
			return @parent.toString()
		else
			html_string = ""
			for bob in @bobs
				bob.parent = false
				html_string += bob.toString()
			return html_string

		#TODO: do(data).do(data2) does not behave correctly
		#also issues with Y().do(data).X().up(). => X in focus, not Y. NVM. this was correct
	do: (data)->
		for bob in @bobs
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].do(data)
			else
				@bobs.push(@parent.do(data))
			
		return this
	up: ->
		return @parent unless @bobs[0]

		for i in [0...@bobs.length]
			@bobs[i] = @bobs[i].up()

		if @bobs[0] == @parent
			return @parent
		else
			return this
	
	
	
	

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
		@contentBob = contentBob
		@postBob = postBob

		@type = selector
		@object_class = null
		@object_id = null
		@content = ""
		@style = null

		if selector.indexOf(".") > -1
			[@type, @object_class] = selector.split(".")
		else if selector.indexOf("#") > -1
			[@type, @object_id] = selector.split("#")

	content: (content) ->
		@content = BOB.toVariable(content)
		return this
	style: (style) ->
		@style = BOB.toVariable(style)
		return this
	class: (object_class) ->
		@object_class = BOB.toVariable(object_class)
		return this
	id: (object_id) ->
		@object_id = BOB.toVariable(object_id)
		return this

	insert: (data, options) ->
		child_bob = BOB.get_or_create_bob(data, options, this)

		if @contentBob
			@contentBob.append(child_bob)
		else
			@contentBob = child_bob

		return child_bob

	toString: ->
		#this makes the toString bubble to the top if it is cast on a sub-element
		if @parent
			return @parent.toString()
		
		#kill parents so they will print out.
		@contentBob.parent = null if @contentBob
		@preBob.parent     = null if @preBob
		@postBob.parent    = null if @postBob

		prepend = ""
		append = ""
		printself = ""
		content_b = ""

		content_b = @contentBob.toString() if @contentBob
		prepend = @preBob.toString() if @preBob
		append = @postBob.toString() if @postBob

		printself += "<" + @type + " "
		for key, value of @options
			unless key == "style" && @style || key == "id" && @object_id || key == "class" && @object_class
				printself += key + '="' + value + '" ' 

		
		
		printself += 'class="' + @object_class + '" ' if @object_class
		printself += 'id="'    + @object_id    + '" ' if @object_id
		printself += 'style="' + @style        + '" ' if @style

		printself = printself.slice(0, -1)
		printself += ">" + @content + content_b + "</" + @type + ">"

		return prepend + printself + append

	append: (data, options) ->
		new_bob = BOB.get_or_create_bob(data,options, this)
		if @postBob
			@postBob.prepend(new_bob)
		else
			@postBob = new_bob
	prepend: (data, options) ->
		new_bob = BOB.get_or_create_bob(data,options, this)
		if @preBob
			@preBob.append(new_bob)
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

