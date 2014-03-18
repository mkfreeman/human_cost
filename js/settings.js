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
				text += 'Price: $' + formatter(a.y)  + '<br/>'
				text += 'Year: ' + a.date + '<br/>'
				text += 'Detail: ' +  a.detail
				return text
			
			}, 
		}
	}
}