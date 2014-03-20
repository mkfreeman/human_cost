var defaults = {
	parameters: {},
	loadedData:{},
	app:{
		container:"container", 
		viewName:'main', 
		baseURL:'',
		shortener:"http://prototypes-dev.ihme.washington.edu/url-shortener/shorten.php",
	},
	main:{
		id:'main',
		container:'container',
		chartNames:['scatter'],
		state:0,
		text:{
			labels:{
				30:'The compensation for a US Military death is $100,000', 	
				52:'Human trafficing sells children for as little as $2', 	
			},
		},
		imgHeight:150, 
		imgWidth:150,
		scatter:{
			id:'scatter',
			type:'scatter',
			width:800, 
			colors:d3.scale.category10(),
			height:500, 
			margin:{
				left:100, 
				right:50, 
				top:50, 
				bottom:50
			},
			radius:10,
			opacity:.5,
			xtitle:'Time', 
			ytitle:'Cost', 
			poshy:true, 
			pointTip:true,
			tipContent:function(a,b) {
				var formatter = d3.format('.2s')
				var text = ''
				text += 'Price: $' + formatter(Math.pow(Math.E, a.y))  + '<br/>'
				text += 'Year: ' + a.date + '<br/>'
				text += 'Detail: ' +  a.detail
				return text
			
			}, 
		}, 
		map: {
			id:'map',
			container:'main',
			type:'map',
			getHeight:function(chart) {return chart.settings.size == 'full' ? settings.chartHeight - chart.settings.legend.space: settings.chartHeight - chart.settings.legend.space}, 
			getWidth:function(chart) {return chart.settings.size == 'full' ? settings.chartWidth : settings.chartWidth},
			getScale:function(chart){
				var scale = chart.settings.size == 'full' ? settings.mapScale * 2 : settings.mapScale*1.3;
				return scale
			},
			margin: {
				top:0, 
				bottom:80, 
				left:20, 
				right:0,
			
			},
			location_id:102,
			getProjection:function(controller) {
				var self = controller
				var scale = self.settings.getScale(self);
				var translate = [0,0]
				function flat_proj(coordinates) { var x = (coordinates[0]) / 360,	y = (-coordinates[1]) / 360; return [ scale * x + translate[0], scale * Math.max(-.5, Math.min(.5, y)) + translate[1]]; }
				flat_proj.scale = function(x) { if (!arguments.length) return scale; scale = +x; return flat_proj; };
				flat_proj.translate = function(x) { if (!arguments.length) return translate; translate = [+x[0], +x[1]]; return flat_proj; };
				return flat_proj;	
			}, 	
			shape:shape,
			maxZoom: 20,
			minZoom: 1,
			scale: 1,
			translate: [0,0],
			county: null,
			colorClass: 'Reds',
			colorSteps: 7,
			getScaleDirection: function() {
				var dir = 'positive'
				return dir
			},
			formatter:{
				y:d3.format('.0%')
			},
			scaleFormat: 'd',
			stroke: {
				selected: 2,
				county: .25,
				state: 1
			},
			legend: {							 
				ticks: 10,
				height: 20,
				space:90,
				margin: {
					right: 15, 					 
					left: 15
				}, 
				shift:20
			},
			density:{
				height:40,
			},
			tipContent:function(a) {
				var text = ''
				var self = this
				var year = a.year
				var loc = settings.locationsMap[a.properties.location_id]
				var measure = app.view.settings.measureMap[app.view.settings.measure]
				var type = settings.names[app.view.settings.type] == undefined ? 'Average' : settings.names[app.view.settings.type]
				text += '<b>' + loc + '</b><br/>'
				if(a.value == undefined) {
					text += 'No ' + type + ' data'
				}
				else {
					var value = this.formatter.y(a.value.mean)
					text += '<b>' + measure + ': </b>' + value +  '<br/>'
					text += app.view.settings.measure == 'missing' ? '' : '<b>Year: </b> ' + year + '<br/>'
					text += app.view.settings.measure == 'missing' ? '' :'<b>Typology: </b> ' + type + '<br/>'
				}
				return text
			}, 
		},
	}
}