<!doctype html>
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Virtuose</title>
    
	<!-- Custom CSS -->
	<link rel="stylesheet" href="css/style.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- d3 scripts -->
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
</head>
<body>
    <div id="div-container">
        <div id="piano-key"></div>
        <script src="js/JSKeyDrawer.js"></script>
        <!--<div>  
            <h2 id="timer" style="font-family: Helvetica Neue, Helvetica, Arial"></h2>
        </div>-->
        <div id="canvas"></div>
        <script src="js/JSNoteMapper.js"></script>
        <div id="overview">
            <div id="overviewTracker"></div>
        </div>
        <script src="js/overview.js"></script>
    </div>
<body>
</html>