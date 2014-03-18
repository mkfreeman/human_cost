isDefined = function(breadcrumb, obj  /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments),
	  breadcrumb = args.shift();
			obj = args.shift();
	var ret = true;

  for (var i = 0; i < args.length; i++) {
	if (!obj.hasOwnProperty(args[i])) {
	  if(breadcrumb){ 
				obj[args[i]] = {};
				ret = false;
			}
			else{
				return false;
			}
	}
	obj = obj[args[i]]; 
  }
  return ret;
}

// share button
shareButton =  function(controller) {
	var self = controller
	 $(document).click(function(e){
		  if(e.target.parentNode != undefined && e.target.parentNode.id != 'share-button'){
				 $('#share-button').poshytip('hide'); settings.sharing_menu_visible =  false; 
		  }
	});

		
	$('#share-button').poshytip({
		className: 'tip-ihme',
		showOn: 'none',
		alignTo: 'target',
		alignX: 'center',
		alignY: 'bottom',
		offsetX: 0,
		offsetY: 7,
		content: function(a,tip){
			tip.css({
				'width': '320px',
				'word-wrap': 'break-word',
				'opacity': '.96',
			});
			
			var out = '';
			var permalink = self.permalink()
			out += '<b>Link to this chart:</b><br/><br/>';
			out += permalink + '<br/><br/>';
			
			var emailButton = $('<a>')
				.attr("id", 'email-button')
				.attr('class', 'left share')
				.attr('href', encodeURI('mailto:?subject=Viz name&body=Health trends : ' + permalink))
				.text('Email')
				.button();
				
			var faceButton= $('<a>')
				.attr("id", 'facebook-button')
				.attr('class', 'left share')
				.attr('href', 'https://www.facebook.com/sharer.php?u='+encodeURI(permalink))
				.attr('target', '_blank')
				.text('Facebook')
				.button();
			
				var tweetButton = $('<a>')
				.attr("id", 'twitter-button')
				.attr('class', 'left share')
				.attr('href', 'https://twitter.com/share?url='+encodeURI(permalink))
				.attr('target', '_blank')
				.text('Twitter')
				.button();
			
			// Screenshot button
			var screenButton = $('<a>')
				.attr("id", 'screenshot-button')
				.attr('class', 'left share')
				.attr('href', window.location.protocol + '//' +window.location.host + window.location.pathname + 'php/screenshot.php?url='+ encodeURI(permalink))
				.text('Screenshot')
				.button()
				.button('option', 'icons', { primary: "ui-icon-image"})
			
			out += emailButton.wrap("<div/>").parent().html();
			out += faceButton.wrap("<div/>").parent().html();
			out += tweetButton.wrap("<div/>").parent().html();
			out += screenButton.wrap("<div/>").parent().html();
			return out;
		}
	});
	
	$('#share-button').button().click(function() {
		if(!settings.sharing_menu_visible) $('#share-button').poshytip('show'); 
		else $('#share-button').poshytip('hide'); 
		settings.sharing_menu_visible = (settings.sharing_menu_visible) ? false: true;
	});
}

permalink = function(controller){
	var self = controller;
	var protectedSettings = ['metricMap','lineData', 'states', 'counties', 'barData', 'metricHoverMap', 'bottomHeight', 'chartHeight', 'chartWidth', 'parentState', 'sexmap', 'shapes','dimensions', 'measures',  'container', 'controller', 'lastChart', 'shortener', 'gaAccount', 'baseURL','loaded', 'sharing_menu_visible', 'locationsMap','locationsHierarchy','tree', 'shape', 'data','pointdata', 'currentView', 'controls','loadedData', 'listening','browser', 'analytics', 'years', 'ages', 'container', 'controlWrapper', 'margin', 'barHeight', 'clickClass', 'clickSetting', 'title',];
	var url = '';
	var hash = '';
	var saveSettings = $.extend(true, {}, settings)
	filterSettings(saveSettings, protectedSettings)
	self.settings.baseURL = typeof(self.settings.baseURL) == 'undefined' ? '' : self.settings.baseURL 
	var sets = JSON.stringify(saveSettings);
	$.ajax({async: false, data: {settings: sets}, url: self.settings.baseURL+'php/save_settings.php', type: 'POST', success: function(response) {
		hash = response;
	}});
	
	url = window.location.protocol + '//' +window.location.host + window.location.pathname + '#settings=' + hash;
	
	if(self.settings.shortener){
		var shortURL = '';
		$.ajax({async: false, data: {longurl: encodeURI(url)}, url: defaults.app.shortener, success: function(response) {
			shortURL = response;
		}});
	
		return shortURL;
	}
	return url;
}

getParameters = function(controller) {
	var self = controller;
	var baseURL = '' 
	var mySettings = {};
	if (window.location.hash.substr(0,10) == '#settings=') {
		$.ajax({
			async: false, 
			data: {hash: window.location.hash.substr(10)}, 
			url: baseURL+'php/load_settings.php', 
			success: function(response) {
				mySettings = $.parseJSON(response);
			},
			 error: function (xhr, ajaxOptions, thrownError) {
			  }
		})
		window.location.hash = '';
	}
	return mySettings;
}

sizeWindow = function() {
	var screensize = {}
	var chartsize  = {}
	screensize.height = $(window).height()
	screensize.width = $(window).width()
	var topHeight = $('#top-menu').height() + $('#header').height()
	var bottomHeight = $('#bottom').height()
	var chartHeight = screensize.height - topHeight - bottomHeight
	var chartWidth = screensize.width
	settings.topHeight = topHeight
	settings.bottomHeight =bottomHeight
	settings.chartHeight = chartHeight
	settings.chartWidth = chartWidth
	settings.mapScale = chartHeight*1.4
	$('#top-menu-right').width(chartWidth/3.7)
}



playYear = function(controller, values) {
	var self = controller
	self.settings.locked = true
	$('#control-checkbox-locked').attr('checked', 'checked')
	// self.update('lock')
	var max = d3.max(values)
	// var max = $('#year-slider').slider('option', 'max')
	var min = d3.min(values)
	if (typeof self.yearTimer != 'undefined') self.stopYear();
	else {
		if (self.settings.year == settings.parameters[self.settings.measure]['year'][max]) {
			self.settings.year = settings.parameters[self.settings.measure]['year'][min]
			self.yearControl.changeSetting('year',settings.parameters[self.settings.measure]['year'].indexOf(self.settings.year))
			self.updateCharts('play')
		}
		$('#control-button-play').button({ icons: { primary: 'ui-icon-stop'} });
		self.yearTimer = setInterval(function() {
			var next  = settings.parameters[self.settings.measure]['year'].indexOf(self.settings.year) + 1
			if (self.settings.year == settings.parameters[self.settings.measure]['year'][max]) self.stopYear();
			else {
				self.settings.year = settings.parameters[self.settings.measure]['year'][next]
				self.yearControl.changeSetting('year',settings.parameters[self.settings.measure]['year'].indexOf(self.settings.year))
				self.updateCharts('play')
			}
		}, 1000);
	}
}

stopYear = function(controller) {
	var self = controller
	clearInterval(self.yearTimer);
	self.yearTimer = undefined;
	$('#control-button-play').button({ icons: { primary: 'ui-icon-play'} });
}


function menuStates() {
	var stateKeys = d3.values(settings.parentState).filter(function(itm,i,a){ return i==a.indexOf(itm);});
	var stateNames = stateKeys.map(function(d) {return })
	return stateKeys.map(function(d) {return {id:d, text:settings.locationsMap[d]}})
}


function menuLocations() {
	var sorted = []
	var stateKeys = d3.values(settings.parentState).filter(function(itm,i,a){ return i==a.indexOf(itm);});
	stateKeys.sort(function(a,b) {return (settings.locationsMap[a].toUpperCase() < settings.locationsMap[b].toUpperCase()) ? -1 : 1})
	stateKeys.map(function(state) {
		sorted.push({id:state, text:settings.locationsMap[state], bold:true, distance:0})
		var childCounties = d3.keys(settings.locationsMap)
							.filter(function(d) {return settings.parentState[d] == state})
							.sort(function(a,b) {return settings.locationsMap[a].toUpperCase() < settings.locationsMap[b].toUpperCase() ? -1 : 1})
		.map(function(d) {
			var text = settings.locationsMap[d].indexOf('City') == -1 ? settings.locationsMap[d] + ' county' : settings.locationsMap[d]
			sorted.push({id:d, text:text, distance:2})
		})
	})
	return sorted
}

function childCounties(controller) {
	var ret = []
	var state = controller.settings.state_id
	ret.push({id:state, text:settings.locationsMap[state], bold:true, distance:0})
	var counties = d3.keys(settings.parentState).filter(function(d) {return settings.parentState[d] == state}).map(function(d){return d}).sort(function(a,b) {return (settings.locationsMap[a].toUpperCase() < settings.locationsMap[b].toUpperCase()) ? -1 : 1})
	counties.map(function(d) {
		var text = settings.locationsMap[d]
		ret.push({id:d, text:text, distance:2})
	})
	return ret
}


function toCap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getStates() {
	return $.getJSON('resources/us-counties.json', function(dat) {
		settings.shapes.counties = dat
	})
	
}

function getCounties() {
	return $.getJSON('resources/us-states.json', function(dat) {
		settings.shapes.states = dat
	})
}

filterSettings = function(obj, protect) {
	if(typeof(protect)!='object') protect = []
	for(key in obj) {
		if($.inArray(key, protect) == -1) {
			if(typeof(obj[key]) == 'function') {
				delete obj[key]
			}
			else if (typeof(obj[key]) == 'object') {
				filterSettings(obj[key], protect)
			}
		}
		else {
			delete obj[key]
		}
	}
}


function getData(controller, callback) {
	var year0 = (typeof controller.settings.year == 'object') ? controller.settings.year[0]  : controller.settings.year
	var year1 = (typeof controller.settings.year == 'object') ? controller.settings.year[1]  : controller.settings.year
	if(isDefined(false, settings.loadedData, 'map', controller.settings.measure,  controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,year0) && isDefined(false, settings.loadedData, 'map', controller.settings.measure,  controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,year1)) {
		if(typeof(callback) == 'function') callback()
		return 
	}
	if (isDefined(false, settings.loadedData, 'map', controller.settings.measure,  controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,year0) | isDefined(false, settings.loadedData, 'map', controller.settings.measure,  controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,year1)){
		var getYear = isDefined(false, settings.loadedData, 'map', controller.settings.measure,  controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,year0) ? year1 : year0
	}
	else {
		var getYear = controller.settings.year
	}
	return $.ajax({
		url:'php/get_data.php',
		type: "post",
		data:{
			year:getYear,
			age:controller.settings.age,
			sex:Number(controller.settings.sex),
			metric:controller.settings.metric,
			race:controller.settings.race,
			measure:controller.settings.measure,
			cache:false
		}, 
		success:function(data) {
			isDefined(true, settings.loadedData, 'map',  controller.settings.measure, controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age,getYear) 
			if(controller.data == undefined) controller.data = {}	
			$.extend(true, controller.data, data.data)
			if(typeof(callback) == 'function') callback()
		}, 
		dataType:"json"
	})
}

function getLineData(controller, callback) {
	if(isDefined(false, settings.loadedData, 'line', controller.settings.measure, controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age, controller.settings.location_id )) {
		if(typeof(callback) == 'function') callback()
		return 
	}
	return $.ajax({
		url:'php/get_line_data.php',
		type: "post",
		data:{
			age:controller.settings.age,
			metric:controller.settings.metric,
			race:controller.settings.race,
			measure:controller.settings.measure,
			location_id:controller.settings.location_id,
			cache:false
		}, 
		success:function(data) {
			isDefined(true, settings.loadedData, 'line', controller.settings.measure, controller.settings.sex, controller.settings.metric, controller.settings.race, controller.settings.age, controller.settings.location_id )
			if(controller.data == undefined) controller.data = {}	
			$.extend(true, controller.data, data.data)
			if(typeof(callback) == 'function') callback()
		}, 
		dataType:"json"
	})
}


function getLimits(controller, callback) {
	if(isDefined(false, settings.loadedData, 'limits', controller.settings.measure)) {
		if(typeof(callback) == 'function') callback()
		return 
	}
	return $.ajax({
		url:'php/get_limits.php',
		type: "post",
		data:{
			measure:controller.settings.measure,
			cache:false
		}, 
		success:function(data) {
			isDefined(true, settings.loadedData, 'limits', controller.settings.measure)
			if(settings.limits == undefined) settings.limits = {}			
			$.extend(true, settings.limits, data.data)
			if(typeof(callback) == 'function') callback()
		}, 
		dataType:"json"
	})
}


function getUniqueValues(controller, callback) {
	if(isDefined(false, settings.loadedData, 'unique', controller.settings.measure)) {
		if(typeof(callback) == 'function') callback()
		return
	}
	return $.ajax({
		url:'php/get_unique_values.php',
		type: "get",
		data:{
			measure:controller.settings.measure,
			cache:false
		}, 
		success:function(data) {
			isDefined(true, settings.loadedData, 'unique', controller.settings.measure)
			$.extend(true, settings.parameters, data.data)
			if(typeof(callback) == 'function') callback()
		}, 
		dataType:"json"
	})
}

function getLocationsMap(controller, callback) {
	$.ajax({
		url:'php/locationsMap.php', 
		success:function(data) {
			settings.locationsMap = data.data
			if(typeof(callback) == 'function') callback()
		},
		dataType:"json"
	})
}

function getParentStates(controller, callback) {
	$.ajax({
		url:'php/county_state_mapping.php', 
		success:function(data) {
			settings.parentState = data.data
			if(typeof(callback) == 'function') callback()
		},
		dataType:"json"
	})
}