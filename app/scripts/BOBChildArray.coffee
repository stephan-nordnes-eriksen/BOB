class BOBChildArray
	constructor: (dataset, parent) ->
		@dataset = dataset
		@parent = parent
		@bobs = []

	#No point in doing this on parent. Does not make sense to do ".do(data).id(BOB.data)"
	content: (content) ->
		this.co(content)
	co: (content) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].co(content) if @bobs[i]
		return this

	style: (style) ->
		this.st(style)
	st: (style) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].st(style) if @bobs[i]
		return this

	class: (object_class) ->
		this.cl(object_class)
	cl: (object_class) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].cl(object_class) if @bobs[i]
		return this

	id: (object_id) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			@bobs[i].id(object_id) if @bobs[i]
		return this

	insert: (data, options) ->
		this.i(data, options)	
	i: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].insert(data, options)
			else
				@bobs.push(@parent.insert(data, options))
				
		return this

	append: (data, options) ->
		this.a(data, options)
	a: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].a(data, options)
			else
				@bobs.push(@parent.a(data, options))

		return this

	prepend: (data, options) ->
		this.p(data, options)
	p: (data, options) ->
		for i in [0...@dataset.length]
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].p(data, options)
			else
				@bobs.push(@parent.p(data, options))

		return this

	toString: ->
		this.s()	
	s: ->
		if @parent
			return @parent.s()
		else
			html_string = ""
			for bob in @bobs
				bob.parent = false
				html_string += bob.s()
			return html_string

	#TODO: do(data).do(data2) does not behave correctly
	do: (data)->
		this.d(data)
	d: (data)->
		for bob in @bobs
			BOB._data = @dataset[i]
			if @bobs[i]
				@bobs[i] = @bobs[i].d(data)
			else
				@bobs.push(@parent.d(data))
			
		return this
	up: ->
		this.u()
	u: ->
		unless @bobs[0]
			BOB._data = null
			return @parent


		for i in [0...@bobs.length]
			@bobs[i] = @bobs[i].u()

		if @bobs[0] == @parent
			BOB._data = null
			return @parent
		else
			return this
