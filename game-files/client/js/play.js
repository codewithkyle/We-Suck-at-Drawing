var socket = io();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.strokeStyle = '#181818';

////////////////////////////////////////////////////////////////////////////VARIABLES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var playerColor = '#181818';
var state = "login";
var playerNumber = 0;
var currentNumberOfAnswers = 0;
var yourAnswer = '';
var youVoted = false;
var youCanVote = true;

////////////////////////////////////////////////////////////////////////////JQUERY STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
$('#play').hide();
$('#login-error').hide();
$('#input-text').hide();
$('#but-error').hide();

$('#input-answers').hide();
$('#ans1').hide();
$('#ans2').hide();
$('#ans3').hide();
$('#ans4').hide();
$('#ans5').hide();
$('#ans6').hide();
$('#ans7').hide();
$('#ans8').hide();
$('#ans9').hide();
$('#ans10').hide();
$('#ans11').hide();
$('#ans12').hide();
$('#ans13').hide();
$('#ans14').hide();
$('#ans15').hide();
$('#ans16').hide();
$('#ans17').hide();
$('#ans18').hide();
$('#ans19').hide();
$('#ans20').hide();

$('#login-send').click(function(){
    
    var username = $('#display-name').val();
    var roomCode = $('#room-code').val();
    
    if(username.length > 12) username = username.substring(0, 13);
    
    socket.emit('PC', {
        room: roomCode,
        name: username
    });
});

$('#send').click(function(){
    if(state == "avatar"){
        var dataURL = canvas.toDataURL();
    
        socket.emit('UA', {
            drawing: dataURL
        });
        
        context.clearRect(0,0,canvas.width,canvas.height);
        
        $('#static').hide();
        $('#canvas-wrapper').hide();
        $('#button-wrapper').hide();
        $('#prompt').text("eh, good enough i guess...");
    }
    else if(state == "drawing"){
        var dataURL = canvas.toDataURL();
    
        socket.emit('UD', {
            drawing: dataURL
        });
        
        context.clearRect(0,0,canvas.width,canvas.height);
        
        $('#static').hide();
        $('#canvas-wrapper').hide();
        $('#button-wrapper').hide();
        $('#prompt').text("we recieved your drawing!");
    }
});

$('#it-send').click(function(){
    yourAnswer = $('#it-display-name').val();
    socket.emit('UTI', {
        title: $('#it-display-name').val()
    });
});

$('#ans1').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans1').text()
    });
});
$('#ans2').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans2').text()
    });
});
$('#ans3').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans3').text()
    });
});
$('#ans4').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans4').text()
    });
});
$('#ans5').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans5').text()
    });
});
$('#ans6').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans6').text()
    });
});
$('#ans7').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans7').text()
    });
});
$('#ans8').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans8').text()
    });
});
$('#ans9').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans9').text()
    });
});
$('#ans10').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans10').text()
    });
});
$('#ans11').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans11').text()
    });
});
$('#ans12').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans12').text()
    });
});
$('#ans13').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans13').text()
    });
});
$('#ans14').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans14').text()
    });
});
$('#ans15').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans15').text()
    });
});
$('#ans16').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans16').text()
    });
});
$('#ans17').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans17').text()
    });
});
$('#ans18').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans18').text()
    });
});
$('#ans19').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans19').text()
    });
});
$('#ans20').click(function(){
    HideAllAnswers();
    socket.emit('UCA', {
        choice: $('#ans20').text()
    });
});

////////////////////////////////////////////////////////////////////////////SOCKET MESSAGES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
socket.on('PCR', function(data){
    $('#login').hide();
    $('#play').show();
    
    $('#username').text($('#display-name').val());
    
    playerNumber = data.playerNum;
    
    TimeToDraw();
    state = "avatar";
    GetUsersColor(data.playerNum);
    playerColor = context.strokeStyle;
    $('#prompt').css('color', playerColor);
});

socket.on('PCE', function(){
    $('#login-error').show();
});

//We just got a new prompt, we need to handel this
socket.on('WP', function(data){
    $('#static').show();
    $('#canvas-wrapper').show();
    $('#button-wrapper').show();
    $('#prompt').text(data.prompt.toString());
    state = 'drawing';
});

socket.on('TPA', function(data){
    state = 'title input';
    if(playerNumber != data.number){
        $('#input-text').show();
        $('#prompt').hide();
        youCanVote = true;
    }else{
        $('#prompt').text("you drew this, deal with it.");
        youCanVote = false;
    }
});

socket.on('BUT', function(){
    $('#but-error').show();
});

socket.on('GUT', function(){
    $('#but-error').hide();
    $('#input-text').hide();
    $('#prompt').show();
    $('#prompt').text("we recieved your title!");
});

//You're to late, you can't type an answer anymore
socket.on('YTL', function(){
    $('#but-error').hide();
    $('#input-text').hide();
    $('#prompt').show();
    $('#prompt').text("you were too slow.");
});

//You're to late, you can't type an answer anymore
socket.on('SAV', function(){
    if(!youVoted){
        HideAllAnswersNoVote();
    }
});

//The server just sent us a new voting option, we should show it to the player
socket.on('NVO', function(data){
    if(youCanVote){
        $('#prompt').hide();
        $('#input-answers').show();
        
        currentNumberOfAnswers++;
        
        //This is show the buttons and load the answer text into them
        if(currentNumberOfAnswers == 1 && data.possibleAnswer != yourAnswer){
            $('#ans1').show();
            $('#ans1').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 2 && data.possibleAnswer != yourAnswer){
            $('#ans2').show();
            $('#ans2').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 3 && data.possibleAnswer != yourAnswer){
            $('#ans3').show();
            $('#ans3').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 4 && data.possibleAnswer != yourAnswer){
            $('#ans4').show();
            $('#ans4').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 5 && data.possibleAnswer != yourAnswer){
            $('#ans5').show();
            $('#ans5').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 6 && data.possibleAnswer != yourAnswer){
            $('#ans6').show();
            $('#ans6').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 7 && data.possibleAnswer != yourAnswer){
            $('#ans7').show();
            $('#ans7').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 8 && data.possibleAnswer != yourAnswer){
            $('#ans8').show();
            $('#ans8').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 9 && data.possibleAnswer != yourAnswer){
            $('#ans9').show();
            $('#ans9').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 10 && data.possibleAnswer != yourAnswer){
            $('#ans10').show();
            $('#ans10').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 11 && data.possibleAnswer != yourAnswer){
            $('#ans11').show();
            $('#ans11').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 12 && data.possibleAnswer != yourAnswer){
            $('#ans12').show();
            $('#ans12').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 13 && data.possibleAnswer != yourAnswer){
            $('#ans13').show();
            $('#ans13').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 14 && data.possibleAnswer != yourAnswer){
            $('#ans14').show();
            $('#ans14').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 15 && data.possibleAnswer != yourAnswer){
            $('#ans15').show();
            $('#ans15').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 16 && data.possibleAnswer != yourAnswer){
            $('#ans16').show();
            $('#ans16').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 17 && data.possibleAnswer != yourAnswer){
            $('#ans17').show();
            $('#ans17').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 18 && data.possibleAnswer != yourAnswer){
            $('#ans18').show();
            $('#ans18').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 19 && data.possibleAnswer != yourAnswer){
            $('#ans19').show();
            $('#ans19').text(data.possibleAnswer);
        }
        else if(currentNumberOfAnswers == 20 && data.possibleAnswer != yourAnswer){
            $('#ans20').show();
            $('#ans20').text(data.possibleAnswer);
        }
    }
    
});

////////////////////////////////////////////////////////////////////////////FUNCTIONS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function HideAllAnswers(){
    youVoted = true;
    $('#input-answers').hide();
    $('#ans1').hide();
    $('#ans2').hide();
    $('#ans3').hide();
    $('#ans4').hide();
    $('#ans5').hide();
    $('#ans6').hide();
    $('#ans7').hide();
    $('#ans8').hide();
    $('#ans9').hide();
    $('#ans10').hide();
    $('#ans11').hide();
    $('#ans12').hide();
    $('#ans13').hide();
    $('#ans14').hide();
    $('#ans15').hide();
    $('#ans16').hide();
    $('#ans17').hide();
    $('#ans18').hide();
    $('#ans19').hide();
    $('#ans20').hide();
    
    $('#prompt').show();
    $('#prompt').text("nice choice.");
}

function HideAllAnswersNoVote(){
    $('#input-answers').hide();
    $('#ans1').hide();
    $('#ans2').hide();
    $('#ans3').hide();
    $('#ans4').hide();
    $('#ans5').hide();
    $('#ans6').hide();
    $('#ans7').hide();
    $('#ans8').hide();
    $('#ans9').hide();
    $('#ans10').hide();
    $('#ans11').hide();
    $('#ans12').hide();
    $('#ans13').hide();
    $('#ans14').hide();
    $('#ans15').hide();
    $('#ans16').hide();
    $('#ans17').hide();
    $('#ans18').hide();
    $('#ans19').hide();
    $('#ans20').hide();
    
    $('#prompt').show();
    $('#prompt').text("you're out of time.");
}

function GetUsersColor(playerNum){
    switch(playerNum){
        case 1:
            context.strokeStyle = '#69D2E7';
            $('header').css('background-color', '#69D2E7');
            break;
            
        case 2:
            context.strokeStyle = '#FA6900';
            $('header').css('background-color', '#FA6900');
            break;
               
        case 3:
            context.strokeStyle = '#FE4365';
            $('header').css('background-color', '#FE4365');
            break;
               
        case 4:
            context.strokeStyle = '#83AF9B';
            $('header').css('background-color', '#83AF9B');
            break;
               
        case 5:
            context.strokeStyle = '#9f9f85';
            $('header').css('background-color', '#9f9f85');
            break;
               
        case 6:
            context.strokeStyle = '#cca52a';
            $('header').css('background-color', '#cca52a');
            break;
               
        case 7:
            context.strokeStyle = '#79BD9A';
            $('header').css('background-color', '#79BD9A');
            break;
               
        case 8:
            context.strokeStyle = '#D95B43';
            $('header').css('background-color', '#D95B43');
            break;
               
        case 9:
            context.strokeStyle = '#542437';
            $('header').css('background-color', '#542437');
            break;
               
        case 10:
            context.strokeStyle = '#53777A';
            $('header').css('background-color', '#53777A');
            break;
               
        case 11:
            context.strokeStyle = '#6C5B7B';
            $('header').css('background-color', '#6C5B7B');
            break;
               
        case 12:
            context.strokeStyle = '#0B486B';
            $('header').css('background-color', '#0B486B');
            break;
               
        case 13:
            context.strokeStyle = '#2e8759';
            $('header').css('background-color', '#2e8759');
            break;
               
        case 14:
            context.strokeStyle = '#594F4F';
            $('header').css('background-color', '#594F4F');
            break;
               
        case 15:
            context.strokeStyle = '#99B2B7';
            $('header').css('background-color', '#99B2B7');
            break;
               
        case 16:
            context.strokeStyle = '#797260';
            $('header').css('background-color', '#797260');
            break;
               
        case 17:
            context.strokeStyle = '#355C7D';
            $('header').css('background-color', '#355C7D');
            break;
               
        case 18:
            context.strokeStyle = '#3299BB';
            $('header').css('background-color', '#3299BB');
            break;
               
        case 19:
            context.strokeStyle = '#C06C84';
            $('header').css('background-color', '#C06C84');
            break;
               
        case 20:
            context.strokeStyle = '#519548';
            $('header').css('background-color', '#519548');
            break;
    }
}

function TimeToDraw() {
    canvas.width = 300;
    canvas.height = 400;
    context.lineWidth = 5;
    context.lineCap = "round";
    var disableSave = false;
    var pixels = [];
    var cpixels = [];
    var xyLast = {};
    var xyAddLast = {};
    var calculate = false;
    {   //functions
        function remove_event_listeners() {
            canvas.removeEventListener('mousemove', on_mousemove, false);
            canvas.removeEventListener('mouseup', on_mouseup, false);
            canvas.removeEventListener('touchmove', on_mousemove, false);
            canvas.removeEventListener('touchend', on_mouseup, false);

            document.body.removeEventListener('mouseup', on_mouseup, false);
            document.body.removeEventListener('touchend', on_mouseup, false);
        }

        function get_coords(e) {
            var x, y;

            if (e.changedTouches && e.changedTouches[0]) {
                var offset = $('#canvas').offset();
                var offsety = offset.top;
                var offsetx = offset.left;

                x = e.changedTouches[0].pageX - offsetx;
                y = e.changedTouches[0].pageY - offsety;


            } else if (e.layerX || 0 == e.layerX) {
                x = e.layerX;
                y = e.layerY;
            } else if (e.offsetX || 0 == e.offsetX) {
                x = e.offsetX;
                y = e.offsetY;
            }

            return {
                x : x,
                y : y
            };
        };

        function on_mousedown(e) {
            e.preventDefault();
            e.stopPropagation();

            canvas.addEventListener('mouseup', on_mouseup, false);
            canvas.addEventListener('mousemove', on_mousemove, false);
            canvas.addEventListener('touchend', on_mouseup, false);
            canvas.addEventListener('touchmove', on_mousemove, false);
            document.body.addEventListener('mouseup', on_mouseup, false);
            document.body.addEventListener('touchend', on_mouseup, false);

            empty = false;
            var xy = get_coords(e);
            context.beginPath();
            pixels.push('moveStart');
            context.moveTo(xy.x, xy.y);
            pixels.push(xy.x, xy.y);
            xyLast = xy;
        };

        function on_mousemove(e, finish) {
            e.preventDefault();
            e.stopPropagation();

            var xy = get_coords(e);
            var xyAdd = {
                x : (xyLast.x + xy.x) / 2,
                y : (xyLast.y + xy.y) / 2
            };

            if (calculate) {
                var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                pixels.push(xLast, yLast);
            } else {
                calculate = true;
            }

            context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
            pixels.push(xyAdd.x, xyAdd.y);
            context.stroke();
            context.beginPath();
            context.moveTo(xyAdd.x, xyAdd.y);
            xyAddLast = xyAdd;
            xyLast = xy;

        };

        function on_mouseup(e) {
            remove_event_listeners();
            disableSave = false;
            context.stroke();
            pixels.push('e');
            calculate = false;
        };
    }
    canvas.addEventListener('touchstart', on_mousedown, false);
    canvas.addEventListener('mousedown', on_mousedown, false);
}