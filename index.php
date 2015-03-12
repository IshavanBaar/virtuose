<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Virtuose</title>

    <!-- Bootstrap CSS -->
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- JQuery -->
    <script src="https://code.jquery.com/jquery.js"></script>
    
    <!-- File chooser -->
    <link href="css/fileinput.min.css" media="all" rel="stylesheet" type="text/css">
    <script src="js/fileinput.min.js" type="text/javascript"></script>
    
    <!-- Jasmid for parsing MIDI file -->
    <script src="js/jasmid/stream.js"></script>
    <script src="js/jasmid/midifile.js"></script>
    <script src="js/jasmid/replayer.js"></script>
    <script src="js/jasmid/synth.js"></script>
    <script src="js/jasmid/audio.js"></script>
</head>
<body>
	<div class="container">
        <div class="row">
            <div class="col-md-8">
                <h1>Virtuose</h1>
            </div>
            <div class="col-md-4">
                <div id="authors">By IVIS Group 7</div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <h3>Select MIDI song</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <input id="input" type="file" class="file" data-show-preview="false" data-show-upload="false">
                <script src="js/JSMIDIparser.js"></script>
                <script>
                    var midi = new Object();
                    // Your callback function
                    function MyCallback(obj){
                        console.log("%o", obj);
                        midi = obj;
                    };

                    // JSMIDIParser
                    JSMIDIParser.IO('input', MyCallback);
                </script>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <h3>Select hands</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <form name="hand-selection-form">
                  <input type="radio" name="hand-selection" value="Left"> Left<br>
                  <input type="radio" name="hand-selection" value="Right"> Right<br>
                  <input type="radio" name="hand-selection" value="Left+Right"> Left + Right
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <h3>Select tempo</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <form name="tempo-selection-form">
                  <input type="radio" name="tempo-selection" value="Slow"> Slow<br>
                  <input type="radio" name="tempo-selection" value="Normal"> Normal<br>
                  <input type="radio" name="tempo-selection" value="Fast"> Fast
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <h3>Get ready</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <button class="btn btn-primary" onclick="fillCookie(); location.href='notes-view.php'">Start to play</button>
            </div>
        </div>
        <div class="row">
            <!-- Our inspirations -->
            <footer>Inspired by <a href="http://research.edm.uhasselt.be/~tap/">TAP</a><br>and<a href="http://www.uni-ulm.de/fileadmin/website_uni_ulm/iui.inst.100/institut/mitarbeiter/gugenheimer/piano.pdf"> P.I.A.N.O.</a>
            </footer>
      </div>
    </div>
<body>
</html>