
<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
	<head>
		<!-- header/title stuff -->
		<meta http-equiv='Content-Type' content='text/html;charset=utf-8'>
		<!--  <meta  property="og:image" content="http://viz.healthmetricsandevaluation.org/tobacco/resources/tobacco_thumb.png"></meta> -->
		<title>Price of Human Life</title>
		<!-- Add D3 JavaSript files --->
		<script type="text/javascript" src="lib/d3-2.10.3/d3.v2.min.js"></script>
		<script type="text/javascript" src="lib/d3-2.10.3/lib/colorbrewer/colorbrewer.js"></script>
		
		<!-- Add jQuery and jQuery UI JavaSript files --->
		<script type="text/javascript" src="lib/jquery-1.8.2.min.js"></script>
		<script type="text/javascript" src="lib/jquery-ui-1.9.0.custom/js/jquery-ui-1.9.0.custom.js"></script>
		
		<!-- dragslider -->
		<script type="text/javascript" src="lib/dragslider/dragslider.js"></script>
		
		<!-- Add additonal libaries JavaSript files (these may or may not be necesssay depending on the needs of your visualization) --->
		<script type="text/javascript" src="lib/poshytip/src/jquery.poshytip.js"></script> 
		<script type="text/javascript" src="lib/select2-3.2/select2.js"></script> 
		<script type="text/javascript" src="lib/apprise/apprise-1.5.full.js"></script> 
		
		<!-- Add jQuery UI css files (note we will use a different theme in the future) --->
		<link type="text/css" rel="stylesheet" href="lib/jquery-ui-1.9.0.custom/css/smoothness/jquery-ui-1.9.0.custom.min.css"/>
		<link type="text/css" rel="stylesheet" href="lib/select2-3.2/select2.css"/>
		
		<!-- Add common css for poshytip --->
		<link type="text/css" rel="stylesheet" href="lib/apprise/apprise.css"/>

		<!-- css files -->
		<link type="text/css" rel="stylesheet" href="css/app.css"/>		
		<link type="text/css" rel="stylesheet" href="css/scatter.css"/>				
		<link type="text/css" rel="stylesheet" href="css/main.css"/>				

                        
		<!-- scripts -->
		<script type="text/javascript" src="js/util.js"></script> 
		<script type="text/javascript" src="js/app.js"></script> 
		<script type="text/javascript" src="js/settings.js"></script> 
		
		<!-- Charts -->
		<script type="text/javascript" src="js/charts/scatter.js"></script> 
		
		<!--Views -->
		<script type="text/javascript" src="js/views/main.js"></script> 
		
	

	</head>
	
	<body>
		<!-- container divs -->

		<div id="top-menu">
			<div id="top-control-container"></div>
            <div id="top-menu-right"></div>
		</div>
		<div id="container">
		</div>	
		<div id="bottom" class="controls">
			<div id="bottom-control-container">
            	<div id="bottom-control-container-left"></div>
				<div id="bottom-control-container-right"></div>
            </div>
			</div>
		<!-- Initiate instance of application -->
		<script type="text/javascript">
			var app = new App(defaults.app)
		</script>
	</body>
</html>