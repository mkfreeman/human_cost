function Map(sets){
	var self = this;
	self.settings = sets
	var colors = $.extend([],colorbrewer[self.settings.colorClass][self.settings.colorSteps]);
	
	self.colors = {};
	self.colors.positive = $.extend([], colors);
	self.colors.negative = $.extend([], colors).reverse();
	
	self.data = self.settings.data == undefined ? {}: self.settings.data;
	self.getSizes()
	self.projection = self.settings.getProjection(self)

	
	self.path = d3.geo.path()
		.projection(self.projection);
		
	self.init();
}

Map.prototype.getSizes = function() {
	var self = this
	self.settings.height = self.settings.getHeight(self)
	self.settings.width = self.settings.getWidth(self)
	self.settings.chartWidth = self.settings.width - self.settings.margin.left - self.settings.margin.right - self.settings.legend.shift
	self.settings.chartHeight = self.settings.height - self.settings.margin.top - self.settings.margin.bottom
	self.settings.legendHeight = self.settings.chartHeight - 35
	self.settings.legend.width =  self.settings.chartWidth - 100 
}

Map.prototype.init = function(){
	var self = this;
	self.setScales()
	self.defineFunctions()
	self.build();
}

Map.prototype.defineFunctions = function() {
	var self = this
	self.densityFunction = function(den) {
		den.attr('r', 10)
			.attr('class', function(d) {
				if(d.properties.location_id == undefined) return 'map-circle-hide'
				return d.properties.location_id == self.settings.location_id ? 'map-circle selected' : 'map-circle'
			})
			.attr(self.settings.id + '-id', function(d) {return d.properties.location_id})
			.attr('cx', function(d){
				return self.legend_scales(self.data[d.properties.location_id].value.mean)
			})
			.style('fill-opacity', .3)
			.style('stroke-width', '1px')
			.style('stroke', 'white')
			.attr('fill', function(d) {return d.color})
			.attr(self.settings.id + '-density-id', function(d) {return d.properties.location_id})
			.attr('cy', self.settings.density.height/2)
	}
}

Map.prototype.setScales = function() {
	var self = this
	self.settings.scaleDirection = self.settings.getScaleDirection(self.settings)
	if(self.settings.locked != true) {
		var values = self.settings.shape.features.map(function(d) {
			if(isDefined(false, self.data, d.properties.location_id)) return Number(self.data[d.properties.location_id].value.mean)
		})
		// self.settings.min = d3.min(values) - (d3.max(values)- d3.min(values))/100
		self.settings.min = d3.min(values)
		self.settings.max = d3.max(values)
	}
	self.colorize = d3.scale.linear() 
		.range(self.colors[self.settings.scaleDirection])
		.domain(d3.range(self.settings.max, self.settings.min, -(self.settings.max - self.settings.min)/self.settings.colorSteps))
		.clamp(true);
		

	self.legend_scales = d3.scale.linear()
		.domain([ self.settings.min, self.settings.max])
		.range([0,self.settings.legend.width]);
}

Map.prototype.build = function(){
	var self = this;
	
    self.div = d3.select('#' + self.settings.container).append('div').attr('id', self.settings.id).style('width', self.settings.width+ 'px')
				.style('height', self.settings.height + 'px')
	
	if (self.settings.show == false) {
		$('#' + self.settings.id).css('display', 'none')
	}
	
	// title
	self.title = d3.select('#' + self.settings.id).append('div').attr('class', 'divTitle').attr('id', self.settings.id + '-divtitle')
	if(self.settings.resizable == true) {
		self.title.append('div').attr('id', self.settings.id + '-full').attr('class', 'full')
		$('#'+self.settings.id + '-full').button().click(function() {
			var size = self.settings.size == 'full' ? 'small' : 'full'
			if(typeof _gaq != 'undefined'){_gaq.push(['_trackEvent', 'resize', self.settings.id, size]);}
			self.resize('button')
		})
	}
	self.title.append('text').attr('id', self.settings.id + '-titletext').text(self.settings.title)
	
	self.svg = self.div
		.append("svg")
		.attr('id', self.settings.id + '-svg')
		.attr("class", "Map")
		.attr("height", self.settings.chartHeight)
		.attr("width", self.settings.chartWidth)
		.attr("viewBox","0 0 "+self.settings.chartWidth +" "+ self.settings.chartHeight)
		.attr('overflow', 'hidden')
		.append("g")
		.attr("transform", "translate(" + (self.settings.chartWidth / 2) + "," + (self.settings.chartHeight / 2) + ")");
	
	$('#' + self.settings.id + '-svg').hide()		
	self.zoomed = d3.behavior.zoom()
		.scaleExtent([self.settings.minZoom,self.settings.maxZoom])
		.scale(self.settings.scale)
		.translate(self.settings.translate)
		.on("zoom", function(d) {
			self.mapG.attr("transform","translate(" + d3.event.translate[0] + "," +  d3.event.translate[1] + ") scale(" +  d3.event.scale + ")");
			if(d3.event.scale != self.settings.scale) {
				self.paths.filter(function(d) {return d.properties.location_id!=self.settings.location_id}).style("stroke-width", (self.settings.stroke.county/self.zoomed.scale()));
				$('[' + self.settings.id + '-id~="' + self.settings.location_id + '"]').css("stroke-width", (10*self.settings.stroke.county/self.zoomed.scale()));
			}
			self.settings.translate[0] = d3.event.translate[0];
			self.settings.translate[1] = d3.event.translate[1];
			self.settings.scale = d3.event.scale;
		});
	
	self.background = self.svg.append("rect")
		.attr("transform", "translate(" + (-self.settings.chartWidth / 2) + "," + (-self.settings.chartHeight / 2) + ")")
		.attr("class", "background")
		.attr("width", self.settings.chartWidth)
		.attr("height", self.settings.chartHeight);
		
	self.mapG = self.svg.append("g")
		.attr("transform","translate(" + self.zoomed.translate()[0] + "," +  self.zoomed.translate()[1] + ") scale(" +  self.zoomed.scale() + ")")
		.attr("class", 'map-g');
	
	self.svg.call(self.zoomed);
		

	if(self.settings.secondPath == true) {
		self.secondPathG = self.mapG.append("g")
			.attr("id", "states");
		
		self.secondPaths = self.secondPathG.selectAll("path")
			.data(self.settings.secondShape.features)
			.enter().append("path")
			.attr("stroke-width", 10*self.settings.stroke.state/self.zoomed.scale())
			.attr('state-name', function(d) {return d.properties.name})
			.attr("d", function(d) {
				return self.path(d)
			})
	}
	
	self.paths = self.mapG.selectAll("path")
		.data(self.settings.shape.features)
		.enter().append("path")
		.attr("fill", "#FFF")
		.attr("stroke", "#000")
		.attr(self.settings.id + '-id', function(d) { return d.properties.location_id})
		.attr("stroke-width", self.settings.stroke.county/self.zoomed.scale())
		.attr('class', function(d) {
			if(d==self.settings.location_id) {
				var klass = 'path selected'
			}
			else {
				var klass = 'path'
			}
			return klass
		})
		.attr("d", self.path)
		

// 	self.makeDensity()
// 	self.drawDensity()
	self.poshy()
// 	self.makeLegend()
	self.update(true, true);
	$('.path').mouseenter(function() {
		if($(this).attr(self.settings.id + '-id')!= self.settings.location_id) {
			$(this).css('stroke-width', (5*self.settings.stroke.county/self.zoomed.scale()))
		}
	}).mouseleave(function() {
		if($(this).attr(self.settings.id + '-id')!= self.settings.location_id) {
			$(this).css('stroke-width', (self.settings.stroke.county/self.zoomed.scale()))
		}
	})
}

Map.prototype.makeDensity = function() {
	var self = this
	self.densityDiv = self.div.append('div').attr('id', self.settings.id + '-density-div')
	self.density = self.densityDiv.append("svg")
		.attr("height", self.settings.density.height)
		.attr("width", self.settings.legend.width + self.settings.legend.shift + 14)
		
	self.densityG = self.density.append('g').attr('transform', 'translate(15,0)')
	
}



Map.prototype.drawDensity = function() {
	var self = this
	self.densityMarks = self.densityG.selectAll('circle')
					.data(self.settings.shape.features.filter(function(d) {return d.properties.location_id != undefined && self.data[d.properties.location_id] != undefined}), function(d) {return d.properties.location_id})
					
	self.densityMarks.enter().append("circle").call(self.densityFunction)
					
	
	self.densityMarks.exit().remove()
	self.densityMarks.transition().duration(500).call(self.densityFunction).each('end', function() {self.gray()})

}

Map.prototype.makeLegend = function() {
	var self = this
    self.legendDiv = self.div.append('div').attr('id', self.settings.id + '-legend-div')
	self.legend = self.legendDiv
		.append("svg")
		.attr('id', self.settings.id + '-legend-svg')
		.attr("height", self.settings.legend.height + 40)
		.attr("width", self.settings.legend.width + self.settings.legend.shift + 14)
		
	// self.legendColor = d3.scale.linear() 
		// .range(self.colors[self.settings.scaleDirection])
		// .domain(d3.range(0,(self.settings.legend.width),((self.settings.legend.width)/self.settings.colorSteps)))
		// .clamp(true);
		
	self.gradient = self.legend
		.append("svg:defs")
			.append("svg:linearGradient")
			.attr("id", "map-gradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "0%");
			
	// var colors = self.settings.scaleDirection == 'negative' ? colorbrewer[self.settings.colorClass][self.settings.colorSteps] : $.extend(true, [], colorbrewer[self.settings.colorClass][self.settings.colorSteps]).reverse()
	// colorbrewer[self.settings.colorClass][self.settings.colorSteps].reverse().forEach(function(d,i){
	 // $.extend([],colorbrewer[self.settings.colorClass][self.settings.colorSteps]).reverse() 
	 $.extend([],self.colors[self.settings.scaleDirection]).reverse().forEach(function(d,i){
			self.gradient.append("svg:stop")
				.attr("offset",((i+1)/(self.settings.colorSteps+1)))
				.attr("stop-color", d)
				.attr('id', 'stop-color-' + i)
		});
		
	self.legendBar = self.legend.append("g")
			.attr('transform', 'translate(' + self.settings.legend.shift+',25)')
			.append('rect').attr('id', self.settings.id + '-legendrect')
			.attr('y', '0px')
			.attr('x', '0px')
			.attr('height', self.settings.legend.height)
			.attr('width',  self.settings.legend.width)
			.attr('stroke', 'none')
			.attr('fill', 'url(#map-gradient)')


	self.legend_axes = d3.svg.axis()
		.scale(self.legend_scales)
		.ticks(5)
		.tickFormat(isDefined(false, self.settings, 'formatter', 'y') ? self.settings.formatter.y :null)
		.orient('top')
	
	self.legend_labels = self.legend.append('g')
		.attr('transform', 'translate(' + self.settings.legend.shift+ ',' + (self.settings.legend.height) + ')')
		.attr('class', 'axis')
		.call(self.legend_axes);
        
    // add slider on top of legend
//     self.filter =self.legendDiv.append('div').attr('id', 'filter').attr('class', "filter").style('height', self.settings.legend.height + 'px').style('width', self.settings.legend.width - 10 + 'px')
    
//     self.setSliders()
}

Map.prototype.updateLegend = function(delay) {
	delay = isNaN(Number(delay)) ? 500 : delay
	var self = this
	self.legend.attr("width", self.settings.legend.width + self.settings.legend.shift + 14)
		
	self.legendBar.transition().duration(delay).attr("width", self.settings.legend.width)
		

	self.legend_axes = d3.svg.axis()
		.scale(self.legend_scales)
		.ticks(5)
		.tickFormat(isDefined(false, self.settings, 'formatter', 'y') ? self.settings.formatter.y :null)
		.orient('top')
		
	self.legend_labels.transition().duration(delay)
		.call(self.legend_axes)
}

Map.prototype.setSliders = function() {
    var self = this
	var defaults = self.settings.limits == undefined ? [self.settings.min, self.settings.max] : self.settings.limits
 
	$("#filter").dragslider({	
		range:true,
		min:self.settings.min, 
		max:self.settings.max,
		step:(self.settings.max - self.settings.min)/50,
		orientation:'horizontal',
		rangeDrag:true,
		values:defaults,
		change:function(event, ui) {
			setTimeout(function() {
				if(event.originalEvent != undefined) {
					var category = 'Map-slider'
					var side = self.settings.limits[0] != ui.values[0]? 'right' : 'left'
					var value = self.settings.limits[0] != ui.values[0]? ui.values[1] : ui.values[0]
					self.settings.limits = [ui.values[0], ui.values[1]]
					$('#handle-0 span').text(self.settings.formatter.y(self.settings.limits[0]).replace('%', ''))
					$('#handle-1 span').text(self.settings.formatter.y(self.settings.limits[1]).replace('%', ''))

					self.gray()
					if(typeof _gaq != 'undefined'){_gaq.push(['_trackEvent', category, side, value]);}
				}
			}, 1)
		},
		slide:function(event, ui) {
			setTimeout(function() {
				self.settings.limits = [ui.values[0], ui.values[1]]
				$('#handle-0 span').text(self.settings.formatter.y(self.settings.limits[0]).replace('%', ''))
				$('#handle-1 span').text(self.settings.formatter.y(self.settings.limits[1]).replace('%', ''))
				self.gray()
			}, 1)
		}
	})
    // Assign ids and classes to each slider handle
    $('#map .ui-slider-handle').each(function(d) {
		switch(d) {
			case 0:
				var text = isDefined(false, self.settings, 'formatter', 'y') ? self.settings.formatter.y(defaults[0]).replace('%', '') :defaults[0]
				break
			case 1:
				var text = isDefined(false, self.settings, 'formatter', 'y') ? self.settings.formatter.y(defaults[1]).replace('%', '') :defaults[1]
				break
		}
		if($('#handle-' +d).length == 0) {
			$(this).attr('id', 'handle-' + d).append($('<span/>').text(text))
			$(this).attr('class', $(this).attr('class') + ' slider-handle')
		}
		else {
			$('#handle-' +d + ' span').text(text)
		}
	})
	
}

Map.prototype.gray = function() {
    var self = this
    self.paths.attr('class', function(d) {
		if(d.value == undefined) return 'path'
		if(!isDefined(false, d, 'value', 'mean')) return 'path'
        if(d.value.mean>=self.settings.limits[0] && d.value.mean<=self.settings.limits[1]) {
            var klass = 'path'
        }
        else {
            var klass = 'path gray'
        }
        return klass    
    })
	
	self.densityMarks.attr('class', function(d) {
		if(d.value == undefined) return 'map-circle'
        if(d.value.mean>=self.settings.limits[0] && d.value.mean<=self.settings.limits[1]) {
            var klass = d.properties.location_id == self.settings.location_id ? 'map-circle selected' : 'map-circle'
        }
        else {
			var klass = d.properties.location_id == self.settings.location_id ? 'map-circle selected' : 'map-circle gray'        
		}
        return klass    
    })

}

Map.prototype.update = function(control, build){
	var self = this;
	
	if(control == 'zoom') {
		// get highlighted path to change on density plot and map
		self.zoom('to', self.settings.location_id)
		return
	
	}
	var build = build == undefined? false: build
	var control = control == undefined ? true: control
	console.log('set map title as ', self.settings.title)
	d3.select('#' + self.settings.id + '-titletext').text(self.settings.title)
	self.data = self.settings.data == undefined ? {}: self.settings.data;
	self.getSizes()
	self.setScales()
	var scaleChange = (control.id == 'measure' | control == 'display' | control.id == 'metric' | control.id == 'locked' | control == true | control == 'play' | (self.settings.locked == false & (control.id == 'year' | control.id == 'year' | control.id == 'item' | control.id == 'type' | control.id == 'sex' | control.id == 'race' | control == 'chart1'))) ? true : false
	if(scaleChange == true & (build == false)) self.settings.limits = [self.settings.min, self.settings.max]
	self.settings.limits = self.settings.limits == undefined ? [self.settings.min, self.settings.max] : self.settings.limits
	
	// update axis
// 	self.legend_axes = d3.svg.axis()
// 		.scale(self.legend_scales)
// 		.ticks(5)
// 		.tickFormat(isDefined(false, self.settings, 'formatter', 'y') 
// 		? self.settings.formatter.y :null)
// 		.orient('top')
// 	
// 	self.legend_labels.transition().duration(500).call(self.legend_axes);

	 $.extend([],self.colors[self.settings.scaleDirection]).forEach(function(d,i){
			d3.select('#stop-color-' + i).transition().duration(500)
				.attr("stop-color", d)
		});
		
	// Transition path fills
	self.paths
		.datum(function(d){ 
			d.value = self.data[d.properties.location_id] == undefined ? undefined : self.data[d.properties.location_id].value
			d.year = (typeof d.value != 'undefined') ? self.data[d.properties.location_id].year : 'missing'
			d.color = ((typeof d.value != 'undefined') ? self.colorize(Number(d.value.mean)) : '#f6f6f6');
			return d; 
		})
		.attr('class', function(d) {
			if(d==self.settings.location_id) {
				var klass = 'path selected'
			}
			else {
				var klass = 'path'
			}
			return klass
		})
		.transition()
		.duration(500)
		.attr("fill", function(d) {
			return d.color;
		});
	
	// Give gray elements proper color, then show
	d3.selectAll('.gray').attr('fill', function(d) { return d.color})	
	
	// Update density plot
// 	self.density.transition().duration(500).attr("width", self.settings.legend.width + self.settings.legend.shift + 14)
	
// 	self.drawDensity()
	
	
		
	var selected = $('.map-circle.selected')[0]
	if(selected != undefined) selected.parentNode.appendChild(selected)
    if(scaleChange == true) self.setSliders()
	$('.path').css("stroke-width", (self.settings.stroke.county/self.zoomed.scale()))
	if(build != true & (control=='chart2' | control.id=='location_id' | control=='state' | control== 'map')) self.zoom('to', self.settings.location_id)
	else $('[' + self.settings.id + '-id~="' + self.settings.location_id + '"]').css("stroke-width", (10*self.settings.stroke.county/self.zoomed.scale()));
//	self.updateLegend()
	if(build != true) self.setSliders()
	$('[' + self.settings.id + '-density-id~="' + self.settings.location_id + '"]').css("stroke-width",'3px');
	$('[' + self.settings.id + '-density-id~="' + self.settings.location_id + '"]').css("stroke",'black');
	// self.gray()
// 	self.resize()
	if(build == true) {
		setTimeout(function() {
			$("#" + self.settings.id + '-svg').fadeIn(3000, function() {
				
			})
		}, 1000)
	}
	else {
		d3.select('#' + self.settings.id).transition().duration(2000)
			.style('width', self.settings.width+ 'px')
			.style('height', self.settings.height + 'px')
			
		d3.select('#' + self.settings.id + '-svg').transition().duration(2000)
			.style('width', self.settings.width+ 'px')
			.style('height', self.settings.height + 'px')
	}
}

Map.prototype.zoom = function(direction, loc_id){
	var self = this;
	var k = self.zoomed.scale();
	var x = self.zoomed.translate()[0];
	var y = self.zoomed.translate()[1];
	var nk;

	if(direction == "reset"){ 
		nk = 1; 
		x = 0;
		y = 0;
	}
	else if(direction == "to" && loc_id){
		var centroid = self.path.centroid(d3.select($('['+ self.settings.id + '-id~="'+loc_id+'"]')[0]).data()[0]); 
		x = -centroid[0];
		y = -centroid[1];		
		if(k < 2.5) nk = 2.5;
		else nk = k;
		x += (x*(nk-1)); y += (y*(nk-1));
	}
	else if(direction == "in"){
		nk = k+(k*.5); 
		nk = Math.max(self.settings.minZoom, Math.min(nk, self.settings.maxZoom));
		if(k != nk){ x += ((x/k)*(nk-k)); y += ((y/k)*(nk-k)); }
	}
	else if(direction == "out"){ 
		nk = k-(k*.5);
		nk = Math.max(self.settings.minZoom, Math.min(nk, self.settings.maxZoom));
		if(k != nk){ x -= ((x/k)*(k-nk)); y -= ((y/k)*(k-nk)); }
	}
	else{
		nk = k;
	}
		
	self.zoomed.scale(nk);
	self.zoomed.translate([x,y]);
	
	self.settings.translate[0] = self.zoomed.translate()[0];
	self.settings.translate[1] = self.zoomed.translate()[1];
	self.settings.scale = self.zoomed.scale();
	
	self.mapG.transition().duration(1000).attr("transform","translate(" + self.zoomed.translate()[0] + "," +  self.zoomed.translate()[1] + ") scale(" +  self.zoomed.scale() + ")");
	self.paths.filter(function(d) {return d.properties.location_id!=self.settings.location_id}).transition().duration(1000).style("stroke-width", (self.settings.stroke.county/self.zoomed.scale()));
	$('[' + self.settings.id + '-id~="' + self.settings.location_id + '"]').css("stroke-width", (10*self.settings.stroke.county/self.zoomed.scale()));
	$('.map-circle').css('stroke', 'none')
	$('[' + self.settings.id + '-density-id~="' + self.settings.location_id + '"]').css("stroke-width",'3px');
	$('[' + self.settings.id + '-density-id~="' + self.settings.location_id + '"]').css("stroke",'black');
}



Map.prototype.resize = function(event) {
	var self = this
	if(event == 'button') self.settings.size = self.settings.size == 'full' ? 'normal' : 'full'
	else self.settings.size = self.settings.size == undefined ? 'normal' : self.settings.size
	self.getSizes()
	self.setScales()
	var delay = event == 'build' ? 0 : 500;
	switch(self.settings.size) {
		case 'full':
			d3.select('#' + self.settings.id).transition().duration(delay)
				.style('width', self.settings.width+ 'px')
				.style('height', self.settings.height + 'px')
				.each('end', function() {
					if(event == 'build') {
						self.mapDiv.style('opacity', '1')
					}
				})
			if(event == 'button') {
				settings[app.settings.viewName].chartNames.filter(function(chart) {return chart!=self.settings.id}).map(function(chart) {
					$('#' + chart).fadeOut(delay)
					settings[app.settings.viewName][chart].show = false
				})
			}
			d3.select('#' + self.settings.id + '-svg').transition().duration(delay).attr("width", self.settings.chartWidth)
						.attr("height", self.settings.chartHeight)

			self.update('resize')
			d3.select('#filter').transition().duration(0).style('width', self.settings.legend.width  + 'px').each('end', function() {self.setSliders()})
			
			break;
		case 'normal':
			d3.select('#' + self.settings.id).transition().duration(delay)
				.style('width', self.settings.width+ 'px')
				.style('height', self.settings.height + 'px')
				.each('end', function() {
					if(event == 'build') {
						self.mapDiv.style('opacity', '1')
					}
				})
			if(event == 'button') {
				settings[app.settings.viewName].chartNames.filter(function(chart) {return chart!=self.settings.id}).map(function(chart) {
					$('#' + chart).fadeIn(delay)
					settings[app.settings.viewName][chart].show = true
				})
			}
	
			d3.select('#' + self.settings.id + '-svg').transition().duration(delay).attr("width", self.settings.chartWidth)
						.attr("height", self.settings.chartHeight);
			var left = 0
			d3.select('#filter').transition().duration(500).style('left', left + 'px')
			self.update('resize')
			d3.select('#filter').transition().duration(0).style('width', self.settings.legend.width  + 'px').each('end', function() {self.setSliders()})
			break
	}

}

Map.prototype.poshy = function() {
	var self = this
	$('.path,.map-circle').poshytip({
		slide: false, 
		followCursor: true, 
		alignTo: 'cursor', 
		showTimeout: 0, 
		liveevents:true,
		hideTimeout: 0, 
		alignX: 'center', 
		alignY: 'inner-bottom', 
		className: 'tip',
		offsetY: 10,
		content: function(a,tip){
			var d = this.__data__
			tip.css({
				'border': '4px solid '+d.color,
			});
			return self.settings.tipContent(this.__data__)
		}
	})
}


