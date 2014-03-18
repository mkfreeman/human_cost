var App = function() {
	var self = this
	settings = $.extend(true, {}, defaults, getParameters(self));
	self.settings = settings.app
	self.init()
}

App.prototype.init = function() {
	var self = this
	sizeWindow()
	shareButton(self)
	
	// Add resize event listener
	$(window).resize(function() {
		sizeWindow()
		self.view.charts.map(function(d) {
			if(typeof(d.resize) == 'function') { 
				d.resize()
			}
		})
	})
	self.preLoad(function() {
		self.build()
	})
}

App.prototype.preLoad = function(callback) {
	var self = this
	var requests = []
	$.when.apply($, requests).done(function(){
		callback();
	});
} 

App.prototype.build = function() {
	var self = this
	switch(self.settings.viewName) {
		case 'main':
			self.view = new Main(settings[self.settings.viewName])
			break;
	}
}







