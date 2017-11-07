var socket = io();
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
context.fillStyle = "#181818";
context.font = "20px Roboto Slab";
context.textAlign = 'center';

////////////////////////////////////////////////////////////////////////////VARIABLES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var familyFriendly = true;

var player1Avatar = new Image();
var player2Avatar = new Image();
var player3Avatar = new Image();
var player4Avatar = new Image();
var player5Avatar = new Image();
var player6Avatar = new Image();
var player7Avatar = new Image();
var player8Avatar = new Image();
var player9Avatar = new Image();
var player10Avatar = new Image();
var player11Avatar = new Image();
var player12Avatar = new Image();
var player13Avatar = new Image();
var player14Avatar = new Image();
var player15Avatar = new Image();
var player16Avatar = new Image();
var player17Avatar = new Image();
var player18Avatar = new Image();
var player19Avatar = new Image();
var player20Avatar = new Image();

var players = [];

var currentDrawing = new Image();
var currentArtist = '';
var currentPrompt = '';
var currentColor = '';
var currentAnswer = '';

var drawingTime = 120;
var doDrawingTime = false;
var time = 0;
var answerTime = 60;
var doAnswerTime = false;
var doVoteTime = false;
var voteTime = 30;
var timer = 0;
var doTimer = false;

var numOfPlayers = 0;

var sendPen1 = true;
var sendPen2 = true;
var sendPen3 = true;
var sendKick = true;

var playersAnswers = [];
var playersRanking = [];

var voice1 = new Audio('../client/files/voice-1.wav');
var voice2 = new Audio('../client/files/voice-2.wav');
var voice3 = new Audio('../client/files/voice-3.wav');
var voice4 = new Audio('../client/files/voice-4.wav');
var voice5 = new Audio('../client/files/voice-5.wav');
var voice6 = new Audio('../client/files/voice-6.wav');
var voice7 = new Audio('../client/files/voice-7.wav');
var voice8 = new Audio('../client/files/voice-8.wav');
var voice9 = new Audio('../client/files/voice-9.wav');
var voice10 = new Audio('../client/files/voice-10.wav');
var voice11 = new Audio('../client/files/voice-11.wav');

var buttonClick = new Audio('../client/files/button-hover.wav');
buttonClick.volume = 0.3;
var pop = new Audio('../client/files/pop.wav');
var swish = new Audio('../client/files/swish.wav');

var music = new Audio('../client/files/music.wav');
music.volume = 0.3;

var buffer = 0.08;

music.play();

////////////////////////////////////////////////////////////////////////////JQUERY STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
$('#family-friendly').css('border', '4px solid #2e8759');
$('#family-friendly').css('color', '#2e8759');
$('#family-friendly').text('Safe For Work');
$('#timer').hide();
$('#help-screen').hide();
$('#display').hide();
$('#answer-display').hide();

$('#pos1').hide();
$('#pos2').hide();
$('#pos3').hide();
$('#pos4').hide();
$('#pos5').hide();
$('#pos6').hide();
$('#pos7').hide();
$('#pos8').hide();
$('#pos9').hide();
$('#pos10').hide();
$('#pos11').hide();
$('#pos12').hide();
$('#pos13').hide();
$('#pos14').hide();
$('#pos15').hide();
$('#pos16').hide();
$('#pos17').hide();
$('#pos18').hide();
$('#pos19').hide();
$('#pos20').hide();

$('#start-game').click(function(){
    socket.emit('SG');
    buttonClick.play();
});

$('#family-friendly').click(function(){
    buttonClick.play();
    if(familyFriendly){
        familyFriendly = false;
        $('#family-friendly').css('border', '4px solid #FE4365');
        $('#family-friendly').css('color', '#FE4365');
        $('#family-friendly').text('Not Safe For Work');
        
        socket.emit('FF', {
            toggle: familyFriendly
        });
        
        return;
    }else{
        familyFriendly = true;
        $('#family-friendly').css('border', '4px solid #2e8759');
        $('#family-friendly').css('color', '#2e8759');
        $('#family-friendly').text('Safe For Work');
        
        socket.emit('FF', {
            toggle: familyFriendly
        });
        
        return;
    }
});

$('#help').click(function(){
    $('#help-screen').show();
    buttonClick.play();
});
$('#close-help').click(function(){
    $('#help-screen').hide();
    buttonClick.play();
});

////////////////////////////////////////////////////////////////////////////SOCKET STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//Send the Host Connection message to the server
//so we can get our IPV4 address and room code
socket.emit('HC');

socket.on('HCR', function(data){
    $('#room-code').text(data.room);
    
    $('#link').text(data.ip + ":" + data.port);
});

//We need to start the game
socket.on('GTG', function(data){
    swish.play();
    $('#main-menu').hide();
    context.clearRect(0,0,canvas.width,canvas.height);
    numOfPlayers = data.numOfPlayers;
    voice1.play();
    window.setTimeout(function(){
        voice2.play();
        swish.play();
        doDrawingTime = true;
        $('#timer').show();
        $('#timer-message').text("DRAWING TIME!");
        socket.emit('SWP');
    }, 5000);
});

//We need more players
socket.on('NG', function(data){
    
});

socket.on('FD', function(data){
    window.setTimeout(PlayersFinishedDrawing(), 1000);
});

//All players answered, stop drawing time and we need to load answers
socket.on('APA', function(){
    doAnswerTime = false;
    $('#input-countdown').hide();
    socket.emit('RPA');
});

//All players answewrs have been loaded, we need to randomly position them on the screen
socket.on('PAF', function(){
    window.setTimeout(PositionPlayersAnswers(), 1000);
});

//All players have voted, we can stop the timer stuff
socket.on('SVT', function(){
    doVoteTime = false;
    $('#input-countdown').text('voting closed!');
    $('#input-countdown').css('color', '#181818');
    socket.emit('RPV');
});

socket.on('UPS', function(){
    ShowCorrectAnswer();
    UpdatePlayerScores();
});

socket.on('NPV', function(data){
    for(var i = 0; i < players.length; i++){
        if(data.playerNum == players[i].playerNum){
            players[i].vote = data.vote;
            //console.log(players[i].name + ": " +players[i].vote + " DATA: " + data.vote);
        }
    }
});

socket.on('PAA', function(data){
    currentAnswer = data.answer;
    for(var i = 0; i < players.length; i++){
        if(data.playerNum == players[i].playerNum){
            players[i].answer = data.answer;
            playersAnswers.push(players[i].answer);
        }
    }
});

socket.on('PA', function(data){
    for(var i = 0; i < players.length; i++){
        if(data.playerNum == players[i].playerNum){
            players[i].answer = data.answer;
            playersAnswers.push(players[i].answer);
        }
    }
});

//Server sent us a new player drawing for the round
socket.on('DFH', function(data){
    currentDrawing.src = data.drawing;
    
    currentPrompt = data.prompt;
    
    currentDrawing.onload = function(){
        voice3.play();
        window.setTimeout(function(){
            pop.play();
            context.drawImage(currentDrawing, 735, 225, currentDrawing.width*1.5, currentDrawing.height*1.5);
            context.fillStyle = '#181818';
            context.font = "30px Roboto Slab";
            context.fillText("artwork by " + data.artist, 960, 900);
            $('#display').show();
            doAnswerTime = true;
            answerTime = 60;
            voice8.play();
            socket.emit('NPA', {
                number: data.number
            });
        }, 7000);
    }
});

socket.on('PLP', function(data){
    for(var i = 0; i < players.length; i++){
        if(data.playerNum == players[i].playerNum){
            players[i].score -= data.penality;
        }
    }
});

//New player joined the room
socket.on('NUA', function(data){
    pop.play();
    var newUser = {
        avatar: data.drawing,
        playerNum: data.playerNum,
        color: GetUsersColor(data.playerNum),
        name: data.username.toUpperCase(),
        score: 0,
        answer: '',
        vote: ''
    };
    
    players.push(newUser);
    
    if(data.playerNum == 1){
        player1Avatar.src = data.drawing;
    
        player1Avatar.onload = function(){
            context.drawImage(player1Avatar, 440, 40, player1Avatar.width/2, player1Avatar.height/2);
            context.fillStyle = "#69D2E7";
            context.fillText(data.username.toUpperCase(), 512, 270);
        }
    }
    else if(data.playerNum == 2){
        player2Avatar.src = data.drawing;
    
        player2Avatar.onload = function(){
            context.drawImage(player2Avatar, 1365, 40, player2Avatar.width/2, player2Avatar.height/2);
            context.fillStyle = "#FA6900";
            context.fillText(data.username.toUpperCase(), 1457, 270);
        }
    }
    else if(data.playerNum == 3){
        player3Avatar.src = data.drawing;
    
        player3Avatar.onload = function(){
            context.drawImage(player3Avatar, 635, 192, player3Avatar.width/2, player3Avatar.height/2);
            context.fillStyle = "#FE4365";
            context.fillText(data.username.toUpperCase(), 706, 422);
        }
    }
    else if(data.playerNum == 4){
        player4Avatar.src = data.drawing;
    
        player4Avatar.onload = function(){
            context.drawImage(player4Avatar, 1170, 192, player4Avatar.width/2, player4Avatar.height/2);
            context.fillStyle = "#83AF9B";
            context.fillText(data.username.toUpperCase(), 1242, 422);
        }
    }
    else if(data.playerNum == 5){
        player5Avatar.src = data.drawing;
    
        player5Avatar.onload = function(){
            context.drawImage(player5Avatar, 440, 350, player5Avatar.width/2, player5Avatar.height/2);
            context.fillStyle = "#9f9f85";
            context.fillText(data.username.toUpperCase(), 512, 580);
        }
    }
    else if(data.playerNum == 6){
        player6Avatar.src = data.drawing;
    
        player6Avatar.onload = function(){
            context.drawImage(player6Avatar, 1365, 350, player6Avatar.width/2, player6Avatar.height/2);
            context.fillStyle = "#cca52a";
            context.fillText(data.username.toUpperCase(), 1457, 580);
        }
    }
    else if(data.playerNum == 7){
        player7Avatar.src = data.drawing;
    
        player7Avatar.onload = function(){
            context.drawImage(player7Avatar, 635, 502, player7Avatar.width/2, player7Avatar.height/2);
            context.fillStyle = "#79BD9A";
            context.fillText(data.username.toUpperCase(), 702, 732);
        }
    }
    else if(data.playerNum == 8){
        player8Avatar.src = data.drawing;
    
        player8Avatar.onload = function(){
            context.drawImage(player8Avatar, 1170, 502, player8Avatar.width/2, player8Avatar.height/2);
            context.fillStyle = "#D95B43";
            context.fillText(data.username.toUpperCase(), 1242, 732);
        }
    }
    else if(data.playerNum == 9){
        player9Avatar.src = data.drawing;
    
        player9Avatar.onload = function(){
            context.drawImage(player9Avatar, 440, 662, player9Avatar.width/2, player9Avatar.height/2);
            context.fillStyle = "#542437";
            context.fillText(data.username.toUpperCase(), 512, 892);
        }
    }
    else if(data.playerNum == 10){
        player10Avatar.src = data.drawing;
    
        player10Avatar.onload = function(){
            context.drawImage(player10Avatar, 1365, 662, player10Avatar.width/2, player10Avatar.height/2);
            context.fillStyle = "#53777A";
            context.fillText(data.username.toUpperCase(), 1457, 892);
        }
    }
    else if(data.playerNum == 11){
        player11Avatar.src = data.drawing;
    
        player11Avatar.onload = function(){
            context.drawImage(player11Avatar, 245, 40, player11Avatar.width/2, player11Avatar.height/2);
            context.fillStyle = "#6C5B7B";
            context.fillText(data.username.toUpperCase(), 317, 270);
        }
    }
    else if(data.playerNum == 12){
        player12Avatar.src = data.drawing;
    
        player12Avatar.onload = function(){
            context.drawImage(player12Avatar, 1560, 40, player12Avatar.width/2, player12Avatar.height/2);
            context.fillStyle = "#0B486B";
            context.fillText(data.username.toUpperCase(), 1632, 270);
        }
    }
    else if(data.playerNum == 13){
        player13Avatar.src = data.drawing;
    
        player13Avatar.onload = function(){
            context.drawImage(player13Avatar, 50, 192, player13Avatar.width/2, player13Avatar.height/2);
            context.fillStyle = "#2e8759";
            context.fillText(data.username.toUpperCase(), 122, 422);
        }
    }
    else if(data.playerNum == 14){
        player14Avatar.src = data.drawing;
    
        player14Avatar.onload = function(){
            context.drawImage(player14Avatar, 1755, 192, player14Avatar.width/2, player14Avatar.height/2);
            context.fillStyle = "#594F4F";
            context.fillText(data.username.toUpperCase(), 1827, 422);
        }
    }
    else if(data.playerNum == 15){
        player15Avatar.src = data.drawing;
    
        player15Avatar.onload = function(){
            context.drawImage(player15Avatar, 245, 350, player15Avatar.width/2, player15Avatar.height/2);
            context.fillStyle = "#99B2B7";
            context.fillText(data.username.toUpperCase(), 317, 580);
        }
    }
    else if(data.playerNum == 16){
        player16Avatar.src = data.drawing;
    
        player16Avatar.onload = function(){
            context.drawImage(player16Avatar, 1560, 350, player16Avatar.width/2, player16Avatar.height/2);
            context.fillStyle = "#797260";
            context.fillText(data.username.toUpperCase(), 1632, 580);
        }
    }
    else if(data.playerNum == 17){
        player17Avatar.src = data.drawing;
    
        player17Avatar.onload = function(){
            context.drawImage(player17Avatar, 50, 502, player17Avatar.width/2, player17Avatar.height/2);
            context.fillStyle = "#355C7D";
            context.fillText(data.username.toUpperCase(), 122, 732);
        }
    }
    else if(data.playerNum == 18){
        player18Avatar.src = data.drawing;
    
        player18Avatar.onload = function(){
            context.drawImage(player18Avatar, 1755, 502, player18Avatar.width/2, player18Avatar.height/2);
            context.fillStyle = "#3299BB";
            context.fillText(data.username.toUpperCase(), 1827, 732);
        }
    }
    else if(data.playerNum == 19){
        player19Avatar.src = data.drawing;
    
        player19Avatar.onload = function(){
            context.drawImage(player19Avatar, 245, 662, player19Avatar.width/2, player19Avatar.height/2);
            context.fillStyle = "#C06C84";
            context.fillText(data.username.toUpperCase(), 317, 892);
        }
    }
    else if(data.playerNum == 20){
        player20Avatar.src = data.drawing;
    
        player20Avatar.onload = function(){
            context.drawImage(player20Avatar, 1560, 662, player20Avatar.width/2, player20Avatar.height/2);
            context.fillStyle = "#519548";
            context.fillText(data.username.toUpperCase(), 1632, 892);
        }
    }
});

function PlayersFinishedDrawing(){
    doDrawingTime = false;
    drawingTime = 120;
    $('#timer').hide();
    socket.emit("PSD");
}

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b) {
	  var A = key(a), B = key(b);
	  return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
   }
}

function DisplayScores(){
    setTimeout(function(){
        context.clearRect(0,0,canvas.width,canvas.height);
        swish.play();
        voice11.play();
        $('#answer-display').hide();
        $('#input-countdown').hide();
        $('#drawing-title').text('SCORES');
        $('#drawing-title').css('color', '#181818');
        
        //We need to display all the users avatars back at their positions but replace their names with their scores
        for(var p = 0; p < players.length; p++){
            pop.play();
            if(players[p].playerNum == 1){
                context.drawImage(player1Avatar, 440, 40, player1Avatar.width/2, player1Avatar.height/2);
                context.fillStyle = "#69D2E7";
                context.fillText(players[p].score, 512, 270);
            }
            else if(players[p].playerNum == 2){
                context.drawImage(player2Avatar, 1365, 40, player2Avatar.width/2, player2Avatar.height/2);
                context.fillStyle = "#FA6900";
                context.fillText(players[p].score, 1457, 270);
            }
            else if(players[p].playerNum == 3){
                context.drawImage(player3Avatar, 635, 192, player3Avatar.width/2, player3Avatar.height/2);
                context.fillStyle = "#FE4365";
                context.fillText(players[p].score, 706, 422);
            }
            else if(players[p].playerNum == 4){
                context.drawImage(player4Avatar, 1170, 192, player4Avatar.width/2, player4Avatar.height/2);
                context.fillStyle = "#83AF9B";
                context.fillText(players[p].score, 1242, 422);
            }
            else if(players[p].playerNum == 5){
                context.drawImage(player5Avatar, 440, 350, player5Avatar.width/2, player5Avatar.height/2);
                context.fillStyle = "#9f9f85";
                context.fillText(players[p].score, 512, 580);
            }
            else if(players[p].playerNum == 6){
                context.drawImage(player6Avatar, 1365, 350, player6Avatar.width/2, player6Avatar.height/2);
                context.fillStyle = "#cca52a";
                context.fillText(players[p].score, 1457, 580);
            }
            else if(players[p].playerNum == 7){
                context.drawImage(player7Avatar, 635, 502, player7Avatar.width/2, player7Avatar.height/2);
                context.fillStyle = "#79BD9A";
                context.fillText(players[p].score, 702, 732);
            }
            else if(players[p].playerNum == 8){
                context.drawImage(player8Avatar, 1170, 502, player8Avatar.width/2, player8Avatar.height/2);
                context.fillStyle = "#D95B43";
                context.fillText(players[p].score, 1242, 732);
            }
            else if(players[p].playerNum == 9){
                context.drawImage(player9Avatar, 440, 662, player9Avatar.width/2, player9Avatar.height/2);
                context.fillStyle = "#542437";
                context.fillText(players[p].score, 512, 892);
            }
            else if(players[p].playerNum == 10){
                context.drawImage(player10Avatar, 1365, 662, player10Avatar.width/2, player10Avatar.height/2);
                context.fillStyle = "#53777A";
                context.fillText(players[p].score, 1457, 892);
            }
            else if(players[p].playerNum == 11){
                context.drawImage(player11Avatar, 245, 40, player11Avatar.width/2, player11Avatar.height/2);
                context.fillStyle = "#6C5B7B";
                context.fillText(players[p].score, 317, 270);
            }
            else if(players[p].playerNum == 12){
                context.drawImage(player12Avatar, 1560, 40, player12Avatar.width/2, player12Avatar.height/2);
                context.fillStyle = "#0B486B";
                context.fillText(players[p].score, 1632, 270);
            }
            else if(players[p].playerNum == 13){
                context.drawImage(player13Avatar, 50, 192, player13Avatar.width/2, player13Avatar.height/2);
                context.fillStyle = "#2e8759";
                context.fillText(players[p].score, 122, 422);
            }
            else if(players[p].playerNum == 14){
                context.drawImage(player14Avatar, 1755, 192, player14Avatar.width/2, player14Avatar.height/2);
                context.fillStyle = "#594F4F";
                context.fillText(players[p].score, 1827, 422);
            }
            else if(players[p].playerNum == 15){
                context.drawImage(player15Avatar, 245, 350, player15Avatar.width/2, player15Avatar.height/2);
                context.fillStyle = "#99B2B7";
                context.fillText(players[p].score, 317, 580);
            }
            else if(players[p].playerNum == 16){
                context.drawImage(player16Avatar, 1560, 350, player16Avatar.width/2, player16Avatar.height/2);
                context.fillStyle = "#797260";
                context.fillText(players[p].score, 1632, 580);
            }
            else if(players[p].playerNum == 17){
                context.drawImage(player17Avatar, 50, 502, player17Avatar.width/2, player17Avatar.height/2);
                context.fillStyle = "#355C7D";
                context.fillText(players[p].score, 122, 732);
            }
            else if(players[p].playerNum == 18){
                context.drawImage(player18Avatar, 1755, 502, player18Avatar.width/2, player18Avatar.height/2);
                context.fillStyle = "#3299BB";
                context.fillText(players[p].score, 1827, 732);
            }
            else if(players[p].playerNum == 19){
                context.drawImage(player19Avatar, 245, 662, player19Avatar.width/2, player19Avatar.height/2);
                context.fillStyle = "#C06C84";
                context.fillText(players[p].score, 317, 892);
            }
            else if(players[p].playerNum == 20){
                context.drawImage(player20Avatar, 1560, 662, player20Avatar.width/2, player20Avatar.height/2);
                context.fillStyle = "#519548";
                context.fillText(players[p].score, 1632, 892);
            }
        }
        
        playersRanking = players;
        playersRanking.sort(sort_by('score', false, parseInt));
        
        for(var y = 0; y < playersRanking.length; y++){
            var posNum = y + 1;
            GetUsersColor(playersRanking[y].playerNum);
            context.fillStyle = currentColor;
            var yPos = 200 + (y * 35);
            context.fillText(posNum + ": " + playersRanking[y].name, 960, yPos);
        }
        
    }, 9000);
}

//We need to loop through all the players and then check every players vote with their answers
//If a player voted for their answer we will give them points
//If they got the right answer they will get a bunch of points
function UpdatePlayerScores(){
    for(var cp = 0; cp < players.length; cp++){
        //console.log('Checking ' + players[cp].name + "'s answer");
        //CP is our current player
        //OP is our other players
        for(var op = 0; op < players.length; op++){
            //console.log(players[cp].name + "'s answer was " + players[cp].answer + " and " + players[op].name + "'s vote was " + players[op].vote + " and the correct answer was " + currentAnswer);
            if(players[cp].answer == players[op].vote && cp != op){
                //This means other players voted for this players answer
                //console.log('Other players voted for this answer');
                if(players[cp].answer == currentAnswer){
                    //this is the correct answer
                    players[cp].score += 1000;
                    players[op].score += 1000;
                    //console.log("This answer was the correct answer, both people get points");
                }else{
                    //this is a players lie
                    players[cp].score += 500;
                    //console.log("This was the players lie, only the liar gets points");
                }
            }
            //console.log(players[cp].name+ "'s score: " + players[cp].score);
        }
    }
}

//This function will randomly position the players answers on the screen
function PositionPlayersAnswers(){ 
    voice9.play();
    pop.play();
    var mixedPlayers = shuffle(playersAnswers);
    $('#answer-display').show();
    //Then we will loop though the players and position them randomly based on the shuffled array
    for(var k = 0; k < playersAnswers.length; k++){
        var posNum = k + 1;
        $('#pos' + posNum).show();
        $('#pos' + posNum).text(mixedPlayers[k]);
        socket.emit('VA', {
            possibleAnswer: mixedPlayers[k]
        });
    }
    doVoteTime = true;
    $('#input-countdown').show();
}

function ShowCorrectAnswer(){
    voice10.play();
    for(var k = 0; k < playersAnswers.length; k++){
        var posNum = k + 1;
        var possibleAnswer = $('#pos' + posNum).text();
        if(possibleAnswer == currentAnswer){
            $('#pos' + posNum).css('color', '#15e04c');
            $('#drawing-title').text('correct answer was:');
            $('#input-countdown').css('color', '#15e04c');
            $('#input-countdown').text(currentAnswer);
        }else{
            $('#pos' + posNum).css('color', '#FE4365');
        }
    }
    DisplayScores();
}
    
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function GetUsersColor(playerNum){
    switch(playerNum){
        case 1:
            currentColor = '#69D2E7';
            break;
            
        case 2:
            currentColor = '#FA6900';
            break;
               
        case 3:
            currentColor = '#FE4365';
            break;
               
        case 4:
            currentColor = '#83AF9B';
            break;
               
        case 5:
            currentColor = '#9f9f85';
            break;
               
        case 6:
            currentColor = '#cca52a';
            break;
               
        case 7:
            currentColor = '#79BD9A';
            break;
               
        case 8:
            currentColor = '#D95B43';
            break;
               
        case 9:
            currentColor = '#542437';
            break;
               
        case 10:
            currentColor = '#53777A';
            break;
               
        case 11:
            currentColor = '#6C5B7B';
            break;
               
        case 12:
            currentColor = '#0B486B';
            break;
               
        case 13:
            currentColor = '#2e8759';
            break;
               
        case 14:
            currentColor = '#594F4F';
            break;
               
        case 15:
            currentColor = '#99B2B7';
            break;
               
        case 16:
            currentColor = '#797260';
            break;
               
        case 17:
            currentColor = '#355C7D';
            break;
               
        case 18:
            currentColor = '#3299BB';
            break;
               
        case 19:
            currentColor = '#C06C84';
            break;
               
        case 20:
            currentColor = '#519548';
            break;
    }
}
////////////////////////////////////////////////////////////////////////////SERVER TICK STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f){window.setTimeout(gameLoop, 1000/60)};
})();

function gameLoop(time){
    update();
    requestAnimFrame(gameLoop);
}

function update(){
    
    var timeNew = Date.now();
    var deltaTime = (timeNew - time)/1000;
    time = timeNew;
    
    //console.log(music.currentTime);
    if(music.currentTime > music.duration - buffer){
        music.currentTime = 0;
        music.play();
    }
    
    if(doVoteTime){
        voteTime -= deltaTime;
        
        $('#input-countdown').text(Math.ceil(voteTime).toString());
        
        if(voteTime <= 0){
            doVoteTime = false;
            $('#drawing-title').text('voting closed');
            $('#input-countdown').text('closed');
            $('#input-countdown').css('color', '#181818');
            socket.emit('VTO');
        }
    }
    
    if(doAnswerTime){
        answerTime -= deltaTime;
        
        $('#input-countdown').text(Math.ceil(answerTime).toString());
        
        if(answerTime <= 0){
            //time is up, we need to stop accepting answers and load all the input answers
            doAnswerTime = false;
            $('#input-countdown').hide();
            socket.emit('SAA');
            socket.emit('RPA');
        }
        
    }
    
    if(doDrawingTime){
        drawingTime -= deltaTime;
        
        $('#countdown').text(Math.ceil(drawingTime).toString());
        
        //handel OT stuff
        if(Math.ceil(drawingTime) == -2 && sendPen1){
            socket.emit('OT', {
                penality: 200
            });
            sendPen1 = false;
            voice4.play();
        }
        else if(Math.ceil(drawingTime) == -10 && sendPen2){
            socket.emit('OT', {
                penality: 500
            });
            sendPen2 = false;
            voice5.play();
        }
        else if(Math.ceil(drawingTime) == -20 && sendPen3){
            socket.emit('OT', {
                penality: 1000
            });
            sendPen3 = false;
            voice6.play();
        }
        else if(Math.ceil(drawingTime) == -30 && sendKick){
            socket.emit('OT', {
                penality: 'kick'
            });
            doDrawingTime = false;
            drawingTime = 120;
            $('#timer').hide();
            sendKick = false;
            voice7.play();
        }
    }
}

gameLoop();