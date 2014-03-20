var Main = function(sets) {
	var self = this
	self.settings = sets
	self.charts = []
	self.init()
}

Main.prototype.init = function() {
	var self = this
	self.preLoad(function() {
		this.div = d3.select('#' + self.settings.container).append('div').attr('id', self.settings.id)
	this.title = this.div.append('div').attr('id', self.settings.id + '-title').text('The Price of Human Life')
	this.subTitle = this.div.append('div').attr('id', self.settings.id + '-subttitle').text('{click spacebar to advance}')
	$(window).keypress(function(e) {
	  if (e.keyCode == 32) {
		if(self.settings.state > 0) { self.updateCharts()}
		else {self.build()}
	  }
	});

		// setTimeout(function(){self.build()}, 0)
// 	self.build()
	})

}


Main.prototype.preLoad = function(callback) {
	var self = this	
	// add data loading requests here
	d3.csv('data/data.csv', function(data, error) {
		self.data = data
		callback();

	})
} 

Main.prototype.build = function() {
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
				self.charts[index] = new Chart(settings[self.settings.id][chart])
		}
	})
	self.settings.state += 1
	$('#main-subttitle').fadeOut(500)
}

Main.prototype.prepData = function(chart) {
	var self = this
	switch(self.settings.state) {
	// 	case 1000000:
// 			settings[self.settings.id][chart].data = []
// 			settings[self.settings.id][chart].imageData = []
// 			settings[self.settings.id][chart].limits = {
// 				min:{
// 					x:-550, 
// 					y:0
// 				}, 
// 				max: {
// 					x:2014, 
// 					y:Math.log(150000)
// 				}
// 			}
// 			settings[self.settings.id][chart].xVisibility = 'hidden'						
// 			settings[self.settings.id][chart].yVisibility = 'hidden'						
// 			settings[self.settings.id][chart].pointVisibility = 'visible'						
// 			settings[self.settings.id][chart].imgVisibility = 'visible'						
// 			settings[self.settings.id][chart].textVisibility = 'visible'		
// 			settings[self.settings.id][chart].yAxisRange = [0,0] 				
// 			settings[self.settings.id][chart].xAxisRange = [0,0] 	
// 			settings[self.settings.id][chart].textData = [{id:'intro', text:'{click spacebar to continue}', x:500, y:8}]
// 			
// 			break
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
			settings[self.settings.id][chart].yVisibility = 'hidden'						
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
			break
		case 3:
			settings[self.settings.id][chart].textData = []		
			break
		case 4:
			settings[self.settings.id][chart].data = []
			settings[self.settings.id][chart].textData = []
			settings[self.settings.id][chart].imageData = []
			self.data.map(function(d,i) {
				if(d.id == 30) {
					var x = -300
					var y =5
					var detail = d.detail 
					settings[self.settings.id][chart].textData.push({id:d.id, x:x, y:y, detail:detail, text:'This price of life varies greatly for'})
					settings[self.settings.id][chart].textData.push({id:'male', icon:d.icon, x:500, y:y, colorize:true, detail:detail, text:'males:'})
					settings[self.settings.id][chart].imageData.push({id:d.id, x:850, y:y, detail:detail, text:'There are many more examples of <b>male</b>',height:self.settings.imgHeight, width:self.settings.imgWidth, href:'img/' + d.icon + '.png'})
				}
			})
			break
		case 5:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail 
				settings[self.settings.id][chart].data.push({id:d.id, date:d.date, icon:d.icon,x:x, y:y, detail:detail, link:d.link})
			})
			settings[self.settings.id][chart].pointVisibility = 'visible'						

			break
		case 6:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail 
				settings[self.settings.id][chart].data.push({id:d.id, date:d.date,icon:d.icon, x:x, y:y, detail:detail})
			})
			
			settings[self.settings.id][chart].textData[0].text = ''
			settings[self.settings.id][chart].textData[1].icon = 'female'
			settings[self.settings.id][chart].textData[1].text = 'females:'
			settings[self.settings.id][chart].imageData[0].href = 'img/female.png'
			break
		case 7:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female' | d.icon == 'child'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = d.detail
				settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,icon:d.icon, x:x, y:y, detail:detail})
			})
			settings[self.settings.id][chart].textData[1].icon = 'child'
			settings[self.settings.id][chart].textData[1].text = 'children:'
			settings[self.settings.id][chart].imageData[0].href = 'img/child.png'

			break
		case 8:
			settings[self.settings.id][chart].data = []
			self.data.filter(function(d) {return d.icon == 'male' | d.icon == 'female' | d.icon == 'child' | d.icon == 'baby'}).map(function(d,i) {
				var x = -400
				var y = Math.log(+d.cost)
				var detail = 
				settings[self.settings.id][chart].data.push({id:d.id,  date:d.date,icon:d.icon, x:x, y:y, detail:detail})
			})
			settings[self.settings.id][chart].textData[1].icon = 'baby'
			settings[self.settings.id][chart].textData[1].text = 'and infants:'
			settings[self.settings.id][chart].imageData[0].href = 'img/baby.png'

			break
		case 9:
			settings[self.settings.id][chart].textData[0].text = 'These costs have been collected (and estimated) over time'
			settings[self.settings.id][chart].textData[1].text = ''
			settings[self.settings.id][chart].imageData = []
			break
		case 10:
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
			break
		case 11:
			settings[self.settings.id][chart].textData[0].text ='Many of these cases have been uncovered in the past 10 years'
			break
		case 12: 
			settings[self.settings.id][chart].textData[0].text = ''
			settings[self.settings.id][chart].limits.min.x = 2003
			break
		case 13: 
			// change text here, call mouseenter/mouseleave to show hover
			settings[self.settings.id][chart].textData = [{id:'hover', text:'Hover over a circle to see more details ->', x:2004.5, y:8.5}]			
			setTimeout(function() {console.log('show poshy'); $('#id_44').poshytip('show')}, 2000)
			
// 			setTimeout(function() {$('#id_44').poshytip('hide')}, 2000)
			settings[self.settings.id][chart].limits.min.x = 2003
			break
		case 14: 
			settings[self.settings.id][chart].textData[0].text ='Or click it to link to the original article'
			break
		case 15: 
				d3.select('#scatter').transition().duration(500).style('opacity', '0').each('end', function() {
					d3.select('#scatter').style('display', 'none')
					$('#main-subttitle').css('margin-top', '300px')
					$('#main-subttitle').text('Sadly, these are only a handful of cases.').fadeIn(700)
			})
			break
		case 16: 
			d3.select('#main-subttitle').transition().duration(500).style('margin-top', '20px').each('end', function() {
				d3.select('#main-subttitle').text('In 2011, nearly 5,500 human trafficking cases were detected')
			})		
			break
	}	
}



Main.prototype.updateCharts = function(control) {
	var self = this
	self.requests = []

	// push in data requests
	if(self.settings.state == 16) {
		self.charts[1] = new Map(settings[self.settings.id]['map'])
	}
	
	$.when.apply($, self.requests).done(function(){
		self.charts.map(function(d) {
			self.prepData(d.settings.id)
			if(typeof(d.update) == 'function') { 
				d.update(control)
			}
		})
		self.settings.state +=1
	});
	
}
	
	


