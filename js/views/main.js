var Main = function(sets) {
	var self = this
	self.settings = sets
	self.charts = []
	self.init()
}

Main.prototype.init = function() {
	var self = this
	self.preLoad(function() {
// 		this.div = d3.select('#' + self.settings.container).append('div').attr('id', self.settings.id)
// 		this.title = this.div.append('div').attr('id', self.settings.id + '-title').text('The Pri\&#162e of Human Life')
		this.subtitle = d3.select('#' + self.settings.id).append('div').attr('id', self.settings.id + '-subtitle').text('')
		$(window).keypress(function(e) {
		  if (e.keyCode == 32) {
			self.updateCharts()
		  }
		});
		self.buildControls()
	})

}


Main.prototype.preLoad = function(callback) {
	var self = this	
	// add data loading requests here
	d3.csv('data/data.csv', function(data, error) {
		self.data = data
		d3.csv('data/map_data.csv', function(mapData, error) {
			self.map_data = mapData
			callback();
		})

	})
} 

Main.prototype.build = function() {	
	console.log('build')
	var self = this
	self.settings.chartNames.map(function(chart, index) {
		self.prepData(chart)
		settings[self.settings.id][chart].container = self.settings.id
		var type = settings[self.settings.id][chart].type
		switch (type) {
			case 'scatter':
				self.charts[index] = new Scatter(settings[self.settings.id][chart])
				break
			case 'chart':
				// self.charts[index] = new Chart(settings[self.settings.id][chart])
		}
	})

	self.settings.built = true

}

Main.prototype.prepMapData = function() {
	var self = this
	settings[self.settings.id].map.data = {}
	self.map_data.map(function(d) {
		var value = {}
		if(Number(d[self.settings.metric]) ==0) return 
		value.mean = Math.log(d[self.settings.metric])
		value.name = d.countryname
		settings[self.settings.id].map.data[d.location_id] = {value:value}
	})

}

Main.prototype.prepData = function(chart) {
	var self = this
	self.prepMapData()
	switch(self.settings.state) {
		case 0:
			// data prep
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].imageData = []
			settings[self.settings.id][chart].textData = []
			self.data.map(function(d,i) {
			
				if(d.id == 30) {
					var x = -500
					var y = 10.5
					var detail = d.detail
					var img = {id:d.id, 
						x:x, 
						y:y, 
						height:self.settings.imgHeight, 
						width:self.settings.imgWidth,
						text:self.settings.text.labels[d.id],
						detail:detail, 
						href:'img/' + d.icon + '.png'
					}
					settings[self.settings.id][chart].imageData.push(img)
					settings[self.settings.id][chart].textData.push(img)
				}
			})
			settings[self.settings.id][chart].limits = {
				min:{
					x:-550, 
					y:0
				}, 
				max: {
					x:2014, 
					y:Math.log(150000)
				}
			}
			settings[self.settings.id][chart].xVisibility = 'hidden'						
			settings[self.settings.id][chart].xTitleVisibility = 'hidden'						
			settings[self.settings.id][chart].imageFade = true						
			settings[self.settings.id][chart].textFade = true						
			settings[self.settings.id][chart].yVisibility = 'hidden'						
			settings[self.settings.id][chart].yTitleVisibility = 'hidden'						
			settings[self.settings.id][chart].pointVisibility = 'visible'						
			settings[self.settings.id][chart].imgVisibility = 'visible'						
			settings[self.settings.id][chart].textVisibility = 'visible'		
			settings[self.settings.id][chart].yAxisRange = [0,0] 				
			settings[self.settings.id][chart].xAxisRange = [0,0] 	
// 			settings[self.settings.id][chart].textData = [{id:'intro', text:'{click spacebar to continue}', x:500, y:8}]			
			break
		case 1:
			// data prep
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].imageData = []
			settings[self.settings.id][chart].textData = []
			self.data.map(function(d,i) {
				if(d.id== 30 | d.id ==52) {
					var x = -500
					var y = d.id == 30 ? 10.5 : 6.5
					var detail = d.detail 
					var img = {id:d.id, 
						x:x, 
						y:y, 
						height:self.settings.imgHeight, 
						width:self.settings.imgWidth,
						text:self.settings.text.labels[d.id],
						detail:detail, 
						href:'img/' + d.icon + '.png'
					}
					settings[self.settings.id][chart].imageData.push(img)
					settings[self.settings.id][chart].textData.push(img)

				}
			})				
			break
		case 2:
			// data prep
			self.settings.imgHeight = 75
			self.settings.imgWidth = 75
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].imageData = []
			settings[self.settings.id][chart].textData = []
			self.data.map(function(d,i) {
				if(d.id== 30 | d.id ==52) {
					var x = -400
					var y = Math.log(+d.cost)
					var detail = d.detail + ' ' + d.date + ' ' + d.cost
// 					settings[self.settings.id][chart].data.push({id:d.id, x:x, y:y, detail:detail})
					var img = {id:d.id, 
						x:x, 
						y:y, 
						height:self.settings.imgHeight, 
						width:self.settings.imgWidth,
						text:self.settings.text.labels[d.id],
						detail:detail, 
						href:'img/' + d.icon + '.png'
					}
					settings[self.settings.id][chart].imageData.push(img)
					settings[self.settings.id][chart].textData.push(img)
				}
			})
			settings[self.settings.id][chart].yAxisRange = [0,settings[self.settings.id].scatter.height] 
			settings[self.settings.id][chart].yVisibility = 'visible'		
			settings[self.settings.id][chart].yTitleVisibility = 'visible'						
				
			break

		case 3:
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].textData = []
			settings[self.settings.id][chart].imageData = []
			self.data.map(function(d,i) {
				if(d.id == 30) {
					var x = -300
					var y =5
					var detail = d.detail 
					settings[self.settings.id][chart].textFade = false
					settings[self.settings.id][chart].textData.push({id:d.id + 'a', x:x, y:y, detail:detail, text:'The price of life varies greatly for'})
					settings[self.settings.id][chart].textData.push({id:'male', icon:d.icon, x:500, y:y, colorize:true, detail:detail, text:'males:'})
					settings[self.settings.id][chart].imageData.push({id:d.id, x:850, y:y, detail:detail, text:'There are many more examples of <b>male</b>',height:self.settings.imgHeight, width:self.settings.imgWidth, href:'img/' + d.icon + '.png'})
				}
			})
			break
		case 4:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail 
				settings[self.settings.id][chart].data.push({id:d.id, date:d.date, icon:d.icon,x:x, y:y, detail:detail, link:d.link})
			})
			settings[self.settings.id][chart].pointVisibility = 'visible'						

			break
		case 5:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail 
				settings[self.settings.id][chart].data.push({id:d.id, date:d.date,icon:d.icon, x:x, y:y, detail:detail, link:d.link})
			})
			
			settings[self.settings.id][chart].textData[0].text = ''
			settings[self.settings.id][chart].imageData[0].id = 'female'
			settings[self.settings.id][chart].textData[1].icon = 'female'
			settings[self.settings.id][chart].textData[1].text = 'females:'
			settings[self.settings.id][chart].imageData[0].href = 'img/female.png'
			break
		case 6:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female' | d.icon == 'child'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail
				settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,icon:d.icon, x:x, y:y, detail:detail, link:d.link})
			})
			settings[self.settings.id][chart].textData[1].icon = 'child'
			settings[self.settings.id][chart].textData[1].text = 'children:'
			settings[self.settings.id][chart].imageData[0].href = 'img/child.png'
			settings[self.settings.id][chart].imageData[0].id = 'child'


			break
		case 7:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female' | d.icon == 'child' | d.icon == 'baby'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = 
				settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,icon:d.icon, x:x, y:y, detail:detail, link:d.link})
			})
			settings[self.settings.id][chart].textData[1].icon = 'baby'
			settings[self.settings.id][chart].textData[1].text = 'and infants:'
			settings[self.settings.id][chart].imageData[0].href = 'img/baby.png'

			break
		case 8:
			settings[self.settings.id][chart].textData[0].text = 'These prices have fluctuated over time'
			settings[self.settings.id][chart].textData[1].text = ''
			settings[self.settings.id][chart].imageData = []
			break
		case 9:
			settings[self.settings.id][chart].xAxisRange = [0,settings[self.settings.id].scatter.width] 				
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].imageData = []
			settings[self.settings.id][chart].textData[0].text = ''
			self.data.map(function(d,i) {
					var x = +d.date
					var y = Math.log(+d.cost)
					var detail = d.detail
					settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,x:x, y:y, detail:detail, icon:d.icon, link:d.link})
			})
			settings[self.settings.id][chart].move = true
			settings[self.settings.id][chart].xVisibility = 'visible'
			settings[self.settings.id][chart].xTitleVisibility = 'visible'						

			break
		case 10:
		
			settings[self.settings.id][chart].textData[0].text ='Many of these cases have been uncovered in the past 10 years'
			break
		case 11: 
			// self.data.filter(function(d) {return +d.date>=2003}).map(function(d,i) {
// 					var x = +d.date
// 					var y = Math.log(+d.cost)
// 					var detail = d.detail
// 					settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,x:x, y:y, detail:detail, icon:d.icon, link:d.link})
// 			})
			settings[self.settings.id][chart].textData[0].text = ''
			settings[self.settings.id][chart].limits.min.x = 2003
			break
		case 12: 
			// change text here, call mouseenter/mouseleave to show hover
			settings[self.settings.id][chart].textData = [{id:'hover', text:'Hover over a circle to learn about the incident ->', x:2004.5, y:8.5}]			
			
			settings[self.settings.id][chart].limits.min.x = 2003
			break
		case 13: 
			settings[self.settings.id][chart].textData[0].text ='Or click it to link to the original source'
			setTimeout(function() {$("#scatter .text").fadeOut(500)}, 2000)

			break
		case 14:
			setTimeout(function(){$('.tip').hide()}, 2000)
			settings[self.settings.id][chart].textData = []
			settings[self.settings.id][chart].height = 100
			settings[self.settings.id][chart].width = 200 
			settings[self.settings.id][chart].radius = 3 
			settings[self.settings.id][chart].showTicks = false 
			settings[self.settings.id][chart].yAxisRange = [0,100] 
			settings[self.settings.id][chart].xAxisRange = [0,200] 
			settings[self.settings.id][chart].xTitleVisibility = 'hidden'						
			settings[self.settings.id][chart].yTitleVisibility = 'hidden'						

				// d3.select('#scatter').transition().duration(500).style('opacity', '0').each('end', function() {
				$('#main-subtitle').hide()
				$('#main-subtitle').css('position', 'absolute').css('width', '100%')
				$('#main-subtitle').css('top', '40%')
				$('#main-subtitle').text('These are only a handful of cases.').fadeIn(2000)
				d3.select('#scatter-g').transition().duration(2000).attr('transform', 'translate(10,10)')
				d3.select('#scatter-svg').transition().duration(2000).attr('height', 150).attr('width', 200)
			// })
			break
		case 15: 
		$('#main-subtitle').fadeOut(500,function() {
			self.charts[1] = new Map(settings[self.settings.id]['map'])
		})
		// 	d3.select('#main-subtitle').transition().duration(500).style('margin-top', '20px').each('end', function() {
// 				d3.select('#main-subtitle').text('In 2011, nearly 5,500 human trafficking cases were detected globally')
// 			})		
			break
		case 16:
			settings[self.settings.id]['map'].getHeight = function() {return 200}
			settings[self.settings.id]['map'].getWidth = function() {return 250}
			if(chart == 'map') {	
				// $('#map-titletext').text('')
				// console.log("remove map title")
				setTimeout(function() {
					self.conclusion = d3.select('#' + self.settings.id).append('div').attr('id', 'conclusion')
					self.conclusion.append('div').append('text').text('Explore the data further by clicking the chart or map')
				}, 2000)
			}
		 	settings[self.settings.id]['map'].title = ''
			break
			
		case 17: 
			if(chart == 'map') {	
				self.conclusion.append('div').append('text').text('Learn more by identifying additional resources')
			}
			break
		case 18:
			if(chart == 'map') {
				d3.select('#map').on('click', function() {
					self.resizeCharts('map')
					$('#conclusion').hide()
					$('#map').mouseleave()
				})
			
				
				$('#map').mouseenter(function() {
					if(self.settings.large == 'map') return
					$('#map').css('border', '1px solid').css('border-color', 'white').css('cursor', 'pointer')
				}).mouseleave(function() {
					$('#map').css('border', '0px solid').css('border-color', 'white').css('cursor', 'pointer')
				})
				self.conclusion.append('div').append('text').text('Educate others by sharing this page')
			}
			else {
				d3.select('#scatter').on('click', function() {
					self.resizeCharts('scatter')
					$('#conclusion').hide()
					$('#scatter').mouseleave()
				})
				
				$('#scatter').mouseenter(function() {
					if(self.settings.large == 'scatter') return
					$('#scatter').css('border', '1px solid').css('border-color', 'white').css('cursor', 'pointer')
				}).mouseleave(function() {
					$('#scatter').css('border', '0px solid').css('border-color', 'white').css('cursor', 'pointer')
				})
			}
			break

	}	
}


Main.prototype.buildControls = function() {
	var self = this
	var top = ($(window).height() - $('#main-title').height())/2
	self.controlsContainer = d3.select('#' + self.settings.id).append('div').attr('id', self.settings.id + '-controls').style('top', top + 'px')
	
	self.play = self.controlsContainer.append('i').attr('class', 'icon-play').on('click', function() {
		if(self.restart == true) {
			location.reload()
			// self.buildControls()
// 			self.settings = defaults.main
// 			self.settings.state = 0
// 			self.settings.built = false
// 			self.restart = false
		}
		if(self.timer != undefined) {
			var klass = self.settings.state == self.settings.steps ? 'icon-ccw' : 'icon-play'
			d3.select(this).attr('class', klass)
			self.stop = true
			self.timer = undefined
		}
		else {
			var klass = self.settings.state == self.settings.steps ? 'icon-ccw' : 'icon-pause'
			d3.select(this).attr('class', klass)
			self.playFunction()
			self.timer = {}
		}
	})


	self.settings.controlPosition = 'center'
}


Main.prototype.updateCharts = function(num, double) {
	var self = this
	var direction = self.settings.state == 17 ? 'center' : 'bottom'
	self.moveControls(direction)
	var num = num == undefined? 1 : num
	if(self.settings.built != true) { self.build();return}
	console.log('in controls CURRENT state ', self.settings.state)

	self.settings.state += num

	self.requests = []

	// push in data requests
// 	if(self.settings.state == 16) {
// 	}
// 	
	$.when.apply($, self.requests).done(function(){
		self.charts.map(function(d) {
			self.prepData(d.settings.id)
			if(typeof(d.update) == 'function') { 
				d.update()
			}
		})
		
	});
// 	if(self.settings.state == 2 && self.timer == undefined) {
// 		setTimeout(function() {self.updateCharts(1)}, 0)	
// 	}
// 	if(self.settings.state == 3 && self.timer == undefined) {
// 		setTimeout(function() {self.updateCharts(1)}, 2000)	
// 	}
	
	if((self.settings.state == 8  | self.settings.state == 10) && self.timer == undefined) {
		setTimeout(function() {self.updateCharts(1)}, 1500)	
	}

}
	
Main.prototype.moveControls = function(direction) {
	var self = this
	var direction = direction == undefined ? 'bottom' : direction
	switch(direction) {
		case 'bottom':
			var top = $(window).height() - 80
			var font = '20px'
			break
		case 'center':
			var top = $(window).height()/2
			var font = '50px'
			break
	}
	self.controlsContainer.transition().duration(2000).style("top", top + 'px').style('font-size', font)
	self.settings.controlPosition = direction
}

Main.prototype.playFunction = function() {
	var self = this
	if(self.stop == true) {
		self.play.attr('class', 'icon-play')
		self.stop = false
		return
	}
	var delay = self.settings.delays[self.settings.state] == undefined? 4000 : self.settings.delays[self.settings.state]
	if(self.settings.built != true) delay = 0
	console.log('delay is ', delay)
	setTimeout(function() {
		if(self.settings.state >= self.settings.steps) {
			self.play.attr('class', 'icon-ccw')
			self.restart = true
			 return
		}
 		if(self.stop == true) {
 			 self.stop = false
 			 return
 		}
		self.updateCharts()
		self.playFunction()
	}, delay)
}


Main.prototype.resizeCharts = function(large) {
	var self = this
	self.settings.large = large
	var mapTitle = large == 'map' ? 'Human Trafficking Cases in 2011': ''
	settings[self.settings.id]['map'].title = mapTitle
	var mapHeight = large == 'map' ? settings.chartHeight - settings.main.map.legend.space : 200
	var mapWidth = large == 'map' ? settings.chartWidth : 200
	var scatterHeight = large == 'scatter' ?  $(window).height()/2 : 100
	var scatterWidth = large == 'scatter' ?  $(window).width()/2 : 200
	var scatterRadius= large == 'scatter' ? 10 : 3
	var scatterXtitle= large == 'scatter' ? 'visible' : 'hidden'
	var scatterYtitle= large == 'scatter' ? 'visible' : 'hidden'
	var scatterTranslate= large == 'scatter' ? 300 : 10
	var scatterTicks= large == 'scatter' ? true : false
	var divWidth = large == 'scatter' ? $(window).width() : 200

	settings[self.settings.id]['map'].getHeight = function() {return mapHeight}
	settings[self.settings.id]['map'].getWidth = function() {return mapWidth}


	settings[self.settings.id]['scatter'].height = scatterHeight
	settings[self.settings.id]['scatter'].width = scatterWidth
	settings[self.settings.id]['scatter'].radius = scatterRadius
	settings[self.settings.id]['scatter'].showTicks = scatterTicks 
	settings[self.settings.id]['scatter'].yAxisRange = [0, scatterHeight] 
	settings[self.settings.id]['scatter'].xAxisRange = [0, scatterWidth] 
	settings[self.settings.id]['scatter'].xTitleVisibility = scatterXtitle						
	settings[self.settings.id]['scatter'].yTitleVisibility = scatterYtitle
	d3.select('#scatter-g').transition().duration(2000).attr('transform', 'translate(' + scatterTranslate + ',10)')
	d3.select('#yaxistext').transition().duration(2000).attr('transform', 'translate(' + (scatterTranslate + -50) +',' + (settings.main.scatter.height/5*3)+ ') rotate(-90)')
	d3.select('#xaxistext').transition().duration(2000)
						.attr('transform', 'translate(' + (scatterTranslate -75 + settings.main.scatter.margin.left + settings.main.scatter.width/2) + ',' + (settings.main.scatter.height -40 + settings.main.scatter.margin.top + settings.main.scatter.margin.bottom)+ ')')

	
	
	console.log('set scatter width to ', scatterWidth)
	d3.select('#scatter-svg').transition().duration(2000).attr('height', scatterHeight + 100).attr('width', divWidth)
	d3.select('#scatter').transition().duration(2000).attr('width', scatterWidth + 100)
	self.updateCharts()
setTimeout(function() {
		$('#scatter').mouseleave()
		$('#map').mouseleave()
	}, 2100)

}