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
	p: ->
		this.toString()

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
		unless @bobs[0]
			BOB._data = null
			return @parent


		for i in [0...@bobs.length]
			@bobs[i] = @bobs[i].up()

		if @bobs[0] == @parent
			BOB._data = null
			return @parent
		else
			return this