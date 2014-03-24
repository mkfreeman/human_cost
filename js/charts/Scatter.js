var Scatter = function(settings) {
	this.settings = settings
	this.data = this.settings.data
	this.imageData = this.settings.imageData
	this.textData = this.settings.textData
	this.setScales()
	this.div = d3.select('#' + settings.container).append('div').attr('id', settings.id).attr('class', 'chart')
	this.build()
}

Scatter.prototype.setScales = function() {
	var self = this
	if(self.settings.limits == undefined) {
		self.settings.limits = {min:{}, max:{}}
		var xValues = []
		var yValues = []
		self.data.map(function(d) {
			xValues.push(d.x)
			yValues.push(d.y)
		})
		self.settings.limits.min.x = d3.min(xValues)
// 		self.settings.limits.min.x =1990
		self.settings.limits.max.x = d3.max(xValues)
// 		self.settings.limits.max.x =2017
		self.settings.limits.min.y = d3.min(yValues)
		self.settings.limits.max.y = d3.max(yValues)
	}
	this.xAxisRange = this.settings.xAxisRange == undefined ? [0, this.settings.width] : this.settings.xAxisRange

	this.xScale = d3.scale.linear().domain([this.settings.limits.min.x,this.settings.limits.max.x]).range([0, this.settings.width])
	this.yScale = d3.scale.linear().domain([this.settings.limits.max.y,this.settings.limits.min.y]).range([0, this.settings.height])
	this.yAxisRange = this.settings.yAxisRange == undefined ? [0, this.settings.height] : this.settings.yAxisRange
	this.yAxisScale= d3.scale.linear().domain([this.settings.limits.max.y,this.settings.limits.min.y]).range(this.yAxisRange)
	this.xAxisScale= d3.scale.linear().domain([this.settings.limits.min.x,this.settings.limits.max.x]).range(this.xAxisRange)
	this.pointFunction = function(point) {
		point
		.attr('cx', function(d) {return self.xScale(d.x)})
		.attr('cy', function(d) {return self.yScale(d.y)})
		.attr('r', self.settings.radius)
		.attr('class', function(d) {
			return 'point ' + d.icon
		})
		.attr('fill', function(d) {
			return self.settings.colors(d.icon)
		})
		.attr('id', function(d) {return 'id_' + d.id})
		.style('opacity', function() {return self.settings.move == true ? self.settings.opacity : 0})
		
	}
	this.xaxis = d3.svg.axis()
		.scale(self.xAxisScale)
		.orient("bottom")
		.tickFormat(function(d) {
			if (self.settings.showTicks == false) return ''
			var formatter = d3.format('.0s')
			var txt = d < 0 ? String(d).replace('-', '') + ' B.C.' : d
			return txt
		})
		
	this.yaxis = d3.svg.axis()
		.scale(self.yAxisScale)
		.tickFormat(function(d) {
			if (self.settings.showTicks == false) return ''
			var formatter = d3.format('.2s$')
			var txt = '$' + formatter(Math.pow(Math.E, d))
			return txt
		})
		.orient('left')	
		
	this.imageFunction = function(img) {
		img.attr("xlink:href", function(d) {return d.href})
			.attr("transform", function(d) {return "translate(" + (-d.width/2) + "," +(-d.height/2)+ ")"})
			.attr("x", function(d) {return self.xScale(d.x)})
			.attr("y", function(d) {return self.yScale(d.y)})
			.attr("width", function(d) {return d.width })
			.attr("height", function(d) {return d.height})
			.style('visibility', self.settings.imgVisibility)
	}
	this.textFunction = function(txt) {
		txt.text(function(d) {return d.text})
			.attr("transform",function(d) {return "translate(" + (d.width/2) + "," +(d.height/4)+ ")"})
			.attr("x", function(d) {return self.xScale(d.x)})
			.attr("y", function(d) {return self.yScale(d.y)})
			.attr("width", function(d) {return d.width })
			.attr("height", function(d) {return d.height})
			.attr('class', 'text')
			.style('fill', function(d) {
				var fill = d.colorize != true ? 'white' : self.settings.colors(d.icon)

				return fill
			})
	}
}




Scatter.prototype.build = function() {
	var self = this
	this.svg = this.div.append("svg")
		.attr("width", this.settings.width + this.settings.margin.left + this.settings.margin.right)
		.attr("height", this.settings.height + this.settings.margin.top + this.settings.margin.bottom)
		.attr('id', this.settings.id + '-svg')
	
	               
                
	this.g = this.svg.append("g")
		.attr("transform", "translate(" + this.settings.margin.left + "," +self.settings.margin.top+ ")")
		.attr('id', this.settings.id + '-g')
			
		
	this.xaxisLabels = this.g.append("g")
					.attr("class", "axis xaxis")
					.attr("id", "xaxis")
					.style('visibility', self.settings.xVisibility)
					.attr('transform', 'translate(' + 0 + ',' + this.settings.height+ ')')
					.call(this.xaxis)
					
	this.xtitle = this.svg.append('text')
					.text(this.settings.xtitle)
					.attr('transform', 'translate(' + (this.settings.margin.left + this.settings.width/2) + ',' + (this.settings.height + this.settings.margin.top + this.settings.margin.bottom)+ ')')
					.attr('id', 'xaxistext')
					.attr('fill', 'white')
					.style('visibility', self.settings.xTitleVisibility)

	
				
	this.yaxisLabels = this.g.append('g')
						.attr('class', 'axis yaxis')
						.attr('id', 'yaxis')
						.style('visibility', self.settings.yVisibility)
						.call(this.yaxis)
						
	this.ytitle = this.svg.append('text')
					.text(this.settings.ytitle)
					.attr('transform', 'translate(' + (20) + ',' + (this.settings.height/5*3)+ ') rotate(-90)')
					.attr('id', 'yaxistext')
					.attr('fill', 'white')
					.style('visibility', self.settings.yTitleVisibility)
		
	self.draw()			
	if(self.settings.poshy != 'none') { 
		self.poshy()
	}
// 	$('#scatter-svg').click(function() {
// 		app.view.updateCharts()
// 	})
}

Scatter.prototype.draw = function(duration) {
	var self = this
	var duration = duration == undefined ? 2000 : duration
	this.imgs = this.g.selectAll("image").data(self.imageData, function(d) {return d.id});
                
	this.imgs.enter()
                .append("image")
                .call(this.imageFunction)
                .style('opacity', function() {return self.settings.imageFade == true? 0 : 1})

    this.imgs.exit().remove()
                
  this.imgs.transition().duration(duration).call(this.imageFunction).each('end', function() {
    	d3.select(this).transition().duration(duration).style('opacity', 1)
    })

    
    this.text = this.g.selectAll(".text").data(self.textData, function(d) {return d.id});
                
	this.text.enter()
        .append("text")
        .call(this.textFunction)
		.style('opacity', function() {return self.settings.textFade == true? 0 : 1})

	this.text.exit().remove()
	
	this.text.transition().duration(duration).call(this.textFunction)

	this.text.style('visibility', self.settings.textVisibility)
	this.text.transition().duration(duration).call(this.textFunction).each('end', function() {
    	d3.select(this).transition().duration(duration).style('opacity', 1)
    })

	
	this.points = this.g.selectAll('.point').data(this.data, function(d) {return d.id})
				
	var interval = duration/this.points[0].length
	this.points.enter().append('svg:a')
				.attr("xlink:href", function(d){return d.link;})
				.attr('target', '_blank')
				.attr('id', function(d) {return d.link}) 
				.append('circle')
				.call(this.pointFunction)
				.transition().delay(function(d,i) {return i*interval}).style('opacity', self.settings.opacity)
				
	this.points.exit().remove()
	this.points.style('visibility', self.settings.pointVisibility)
	if(self.settings.move == true) this.points.transition().duration(duration).call(this.pointFunction)

}
	

Scatter.prototype.update = function(duration) {
	var self = this
	var duration = duration == undefined ? 2000 : duration
	console.log(duration)
	self.data = self.settings.data
	self.imageData = self.settings.imageData
	self.textData = self.settings.textData

	// Update scales, axes
	self.setScales()
		
	// self.svg.selectAll('.xaxis').transition().duration(500).call(self.xaxis).style('visibility', self.settings.xVisibility)
// 	
// 	self.xaxisLabels.transition().duration(500).attr('transform', 'translate(' + 0 + ',' + self.settings.plotHeight+ ')')

	self.svg.selectAll('.xaxis').style('visibility', self.settings.xVisibility)
	self.svg.selectAll('.xaxis').transition().duration(duration).call(self.xaxis)
	
	self.xaxisLabels.transition().duration(duration).attr('transform', 'translate(' + 0 + ',' + this.settings.height+ ')')

	self.svg.selectAll('.yaxis').style('visibility', self.settings.yVisibility)
	self.svg.selectAll('.yaxis').transition().duration(duration).call(self.yaxis)
	
	self.draw()
	this.ytitle.style('visibility', self.settings.yTitleVisibility)
	this.xtitle.style('visibility', self.settings.xTitleVisibility)
}


Scatter.prototype.addTip = function(klass) {
	var self = this
	$('#' + self.settings.id + '-svg [class~=' + klass + ']').poshytip({
					liveEvents:true,
					slide: false, 
					followCursor: true, 
					alignTo: 'cursor', 
					showTimeout: 0, 
					hideTimeout: 0, 
					alignX: 'center', 
					alignY: 'inner-bottom', 
					className: 'tip-ihme',
					offsetY: 10,
					content: function(){
						return self.settings.tipContent(this.__data__, klass)
					}
		})
}

Scatter.prototype.poshy = function() {
	var self = this
	if(self.settings.pointTip == true) self.addTip('point')
	if(self.settings.ylineTip == true) self.addTip('yline')
}