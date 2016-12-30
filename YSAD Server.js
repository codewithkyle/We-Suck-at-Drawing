var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//This gets the local IPV4 address
var localIP;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  //console.log('addr: '+add);
  localIP = add;
})

//This is were we start the server
var port = 1234;
server.listen(port);
console.log("[++STARTING SERVER++]");
console.log("[SERVER] Server Started on port 1234");

//This is where we send the files to the client
app.get('/', function(req, res){
    res.sendFile(__dirname + "/client/index.html");
});
app.use('/client',express.static(__dirname + "/client"));

///////////////////////////////////////////////////////////////////////////////////////////SERVER STUFF
//This is an array of clients
var clients = [];

//This is an array of words for SFW or NSFW games
var SFW = ["Hot Pocket", "vikings", "thermonuclear detonation", "invading poland", "crumbs all over the carpet", "the underground railroad", "an ugly face", "land mines", "auschwitz", "the big bang", "kamikaze pilots", "skeletor", "womens suffrage", "M16 assault rifle", "spectacular abs", "hot people", "balanced breakfast", "raptor attacks", "child abuse", "police brutality", "scientology", "kids with cancer", "hot soup", "the pirates life", "overcompensation", "a brain tumor", "homeless people", "the great depression", "poor life choices", "god", "emotions", "BATMAN!!!", "finger painting", "the glass ceiling", "bees?", "true meaning of christmas", "free samples", "not wearing pants", "a really cool hat", "the rapture", "crippling debt", "laying an egg", "five-dollar footlongs", "my relationship status", "drinking alone", "mime having a stroke", "puppies!", "child beauty pageants", "the south", "destroying the evidence", "the amish", "inner demons", "old-people smell", "fear itself.", "unlimited shrimp", "bucket of fish heads", "giving 110%", "kanye west", "self-loathing", "figgy pudding", "natural selection", "demonic possession", "disco fever", "the entire internet", "space jam on vhs", "a toxic family", "eating an entire snowman", "pikachu", "murica", "nascar", "falcon punch!", "drunk text", "detroit", "black hole", "a bushy mustache", "cheap motel", "public restrooms", "stealing babies", "stealing wheelchairs", "stepping in gum", "hoarders", "bedbugs", "gravity gun", "reading the comments", "rolling a D20", "achievement unlocked", "taco cat", "pebbles", "laundry night", "don't eat the cookies", "pretending to read", "lady ghost", "impaled with stars", "candyman", "sassy grand daddy", "where missing socks go", "eggmobile", "female james bond", "imaginary friend", "mortality", "fringe crime", "final jeopardy", "new underwear", "pizza cat house gun", "space chef", "fairy tale", "geese", "emo duck", "humidity", "nervous dinosaur", "pizza pac man", "cuddly bat", "fake moon landing", "afternoon coffee", "lonely plumber", "north of the wall", "dad eating turkey"];
var NSFW = ["Hot Pocket", "a defective condom", "endless diarrhea", "daddy issues", "vikings", "thermonuclear detonation", "my genitals", "invading poland", "stray pubes", "crumbs all over the carpet", "coat hanger abortions", "the underground railroad", "an ugly face", "land mines", "auschwitz", "the big bang", "kamikaze pilots", "skeletor", "womens suffrage", "dead hitchhiker", "copping a feel", "M16 assault rifle", "spectacular abs", "hot people", "balanced breakfast", "german dungeon porn", "a fleshlight", "raptor attacks", "micropenis", "child abuse", "police brutality", "scientology", "necrophilia", "kids with cancer", "hot soup", "the priates life", "overcompensation", "fiery poops", "pedophiles", "penis envy", "praying the gay away", "virgin sacrifice", "a brain tumor", "incest", "nipple blades", "homeless people", "seppuku", "the great depression", "a cooler full of organs", "a bitch slap", "poor life choices", "my sex life", "the american dream", "altar boys", "god", "'the gays'", "emotions", "BATMAN!!!", "whiping her butt", "whipping it out", "finger painting", "the glass ceiling", "dead parents", "nazis", "bees?", "true meaning of christmas", "tasteful sideboob", "exactly what you'd expect", "tentacle porn", "erectile dysfunction", "a sassy black woman", "free samples", "not wearing pants", "a really cool hat", "the rapture", "anal beads", "crippling debt", "dick fingers", "laying an egg", "mass shooting", "surpise sex!", "queefing", "concealing a boner", "full frontal nudity", "five-dollar footlongs", "gloryhole", "the terrorist", "amputees", "my relationship status", "masturbation", "the kkk", "a bleached asshole", "crystal meth", "pictures of boobs", "racism", "violating human rights", "drinking alone", "having anuses for eyes", "mime having a stroke", "a sad handjob", "grave robbing", "puppies!", "friendly fire", "child beauty pageants", "the south", "destroying the evidence", "the amish", "inner demons", "can of whoop ass", "old-people smell", "fear itself.", "man meat", "unlimited shrimp", "bucket of fish heads", "giving 110%", "lockjaw", "kanye west", "figgy pudding", "assless chaps", "testicular torsion", "self-loathing", "alcoholism", "natural selection", "that ass", "an ass disaster", "all my friends dying", "spending lots of money", "dying alone", "Mufasa's death scene", "gay aliens", "demonic possession", "reverse cowgirl", "vomiting mid blowjob", "shotguns for legs", "muppet sex", "disco fever", "surprising amount of hair", "a boo boo", "the entire internet", "alley blowjob", "bird-man", "blood farts", "another shitty year", "space jam on vhs", "a toxic family", "eating an entire snowman", "Bitch, where's my money!?", "shake weight", "pikachu", "murica", "mascar", "motherfucking cthuhlu", "morning wood", "falcon punch!", "drunk text", "nude beekeeping", "giving a flying fuck", "sucking your own dick", "drunk toddlers", "cum dumpster", "dead puppies", "detroit", "black hole", "pooping in the soup", "a bushy mustache", "prison rape", "cheap motel", "public restrooms", "elderly abuse", "day care fight club", "a gold digger", "free candy from strangers", "furries", "a tramp stamp", "stealing babies", "stealing wheelchairs", "stepping in gum", "hoarders", "human sacrifice", "ass to mouth", "illegal immigrants", "indecent exposure", "human centipede", "jailbait", "bedbugs", "burning in hell", "butthurt", "paying the iron price", "gravity gun", "reading the comments", "rolling a D20", "achievement unlocked", "homo milk", "poutine", "taco cat", "pebbles", "laundry night", "don't eat the cookies", "pretending to read", "lady ghost", "impaled with stars", "candyman", "sassy grand daddy", "where missing socks go", "eggmobile", "female james bond", "imaginary friend", "mortality", "fringe crime", "final jeopardy", "new underwear", "pizza cat house gun", "space chef", "fairy tale", "geese", "emo duck", "humidity", "nervous dinosaur", "pizza pac man", "cuddly bat", "fake moon landing", "afternoon coffee", "lonely plumber", "north of the wall", "dad eating turkey", "go suck an egg", "grow a pair"];
console.log("[SERVER] We currently have " + NSFW.length + " possible writing prompts.");
//New client connected to the server
io.sockets.on('connection', function(socket){
    console.log('[SERVER] New client connected (id: ' + socket.id + ').');
    clients.push(socket);

    //HC - Host Connection
    //We should generate a room and pass that info back to the host along with the localIP
    //We create a new socket room based on the generated room code, we also set our client
    //to be a host client. We return the info back to the host through a Host Connection Return
    //message. This will give the host the info it needs to users can start joining.
    socket.on('HC', function(){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].isHost = true;
                clients[k].room = GenerateRoomCode();
                clients[k].numOfPlayers = 0;
                clients[k].familyFriendly = true;
                clients[k].playerNumFinishedDrawing = 0;
                clients[k].gameStarted = false;
                clients[k].numOfShowDrawings = 0;
                clients[k].currentAnswer = '';
                clients[k].numOfAnswers = 0;
                clients[k].currentAnswerPlayerNum = 0;

                socket.join(clients[k].room);

                //This is our Host Connection Responce
                socket.emit('HCR', {
                    ip: localIP,
                    port: port,
                    room: clients[k].room
                });
            }
        }
    });

    //PC - Player Connected
    //We should check to see if their room code is right, if it is we need to add them
    //to the room, otherwise we need to let them know they screwed up.
    socket.on('PC', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].room = data.room.toLowerCase();
                clients[k].name = data.name;
                clients[k].score = 0;
                clients[k].finishedDrawing = false;
                clients[k].isHost = false;
                clients[k].answer = '';
                clients[k].chosenAnswer = '';
                console.log('[SERVER] New client is trying to find a room.');
                //search through clients to find host and look for the correct room code
                for(var x = 0; x < clients.length; x++){
                    if(clients[x].isHost && !clients[x].gameStarted){
                        if(clients[x].room == clients[k].room){
                            if(clients[x].numOfPlayers == 20){
                                socket.emit('PCE');
                                console.log('[SERVER] This room is maxed.');
                            }else{
                                //this means we found the host and the room codes match
                                socket.join(clients[k].room);
                                clients[x].numOfPlayers++;
                                clients[k].playerNum = clients[x].numOfPlayers;
                                socket.emit('PCR', {
                                    playerNum: clients[x].numOfPlayers
                                });
                                console.log('[SERVER] Client found a room with the code ' + clients[k].room);
                                return;
                            }
                        }
                    }
                    else if(clients[x].isHost && clients[x].gameStarted){
                        console.log('[SERVER] Client found a room with the code ' + clients[k].room + " but the game has alreay started.");
                        socket.emit('PCE');
                        return;
                    }
                    else if(x == clients.length - 1){
                        //we couldn't find any host or matching room codes
                        socket.emit('PCE');
                        console.log('[SERVER] Client could not find a room with the code ' + clients[k].room);
                        return;
                    }
                }
            }
        }
    });

    //NPA - Need Player Answers
    //We need to emit a message to the room telling players they can send in answers
    socket.on('NPA', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                //Send avatar to the host so it can update its player list
                socket.broadcast.to(clients[k].room).emit('TPA', {
                    number: data.number
                });
            }
        }
    });

    //SAA - Stop Accepting Answers
    //OUTPUT: YTL - You're To Late
    //We need to send a message to everyone who hasn't answered
    socket.on('SAA', function(data){
        console.log("[SERVER] A player was to slow, we need to tell them.");
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                for(var x = 0; x < clients.length; x++){
                    if(clients[x].room == clients[k].room && clients[x].answer == '' && clients[k].currentAnswer != clients[x].prompt){
                        io.to(clients[x].id).emit('YTL');
                    }
                }
            }
        }
    });

    //UTI - User Title Input
    //OUTPUT: BUT - Bad User Title | GUT - Good User Title | APA - All Players Answered
    //We need to take their answer and store it
    socket.on('UTI', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                //Loop thought all the clients and look for double answers
                for(var x = 0; x < clients.length; x++){
                    if(clients[k].room == clients[x].room && !clients[x].isHost){
                        var clientXanswer = clients[x].answer.toLowerCase();
                        var inputAnswer = data.title.toLowerCase();
                        if(clientXanswer == inputAnswer){
                            //clients answer is the same as
                            socket.emit('BUT');
                            console.log("[SERVER] A player input the same title as another player.");
                            return;
                        }
                    }
                }
                for(var v = 0; v < clients.length; v++){
                    //look for host to make sure they don't have the right answer either
                    if(clients[k].room == clients[v].room && clients[v].isHost){
                        if(data.title.toLowerCase() != clients[v].currentAnswer.toLowerCase()){
                            //client has unique answer, save it
                            socket.emit('GUT');
                            console.log("[SERVER] New title, it wasn't a copy or correct, we accepted it.");
                            clients[k].answer = data.title;
                            clients[v].numOfAnswers++;
                            if(clients[v].numOfAnswers == clients[v].numOfPlayers - 1){
                                //all users answered
                                io.to(clients[v].id).emit('APA');
                                console.log("[SERVER] All players have input their titles.");
                            }
                            return;
                        }else{
                            //client got the right answer
                            socket.emit('BUT');
                            console.log("[SERVER] A player input the correct title.");
                            return;
                        }
                    }
                }
            }
        }
    });

    //UA - User Avatar
    //OUTPUT: NUA - New User Avatar
    //We should look for the matching client and then update their avatar image with the
    //image they sent in. We also need to send this info to the host so they can display
    //the new avatar.
    socket.on('UA', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].avatar = data.drawing;

                //Send avatar to the host so it can update its player list
                socket.broadcast.to(clients[k].room).emit('NUA', {
                    drawing: clients[k].avatar,
                    playerNum: clients[k].playerNum,
                    username: clients[k].name
                });
            }
        }
    });

    //RPA - Request Users Answers
    //Once we match the host ID to the incoming socket ID we can use their room
    //code to find all the players in the room and send their answers to the host
    socket.on('RPA', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                //K is the host
                //X is the players

                //Loop through all the clients and if rooms are the same we need to send their
                //answers to the host if their answers are not empty
                for(var x = 0; x < clients.length; x++){
                    if(clients[x].room == clients[k].room){
                        if(clients[x].answer != '' && !clients[x].isHost){

                            //console.log(clients[x].answer);

                            io.to(clients[k].id).emit('PA', {
                                playerNum: clients[x].playerNum,
                                answer: clients[x].answer.toLowerCase(),
                                name: clients[x].name
                            });
                        }
                        //This is the player who drew the drawing, they couldn't answer so we load their prompt as an answer
                        else if(clients[x].playerNum == clients[k].currentAnswerPlayerNum){
                            //console.log(clients[k].currentAnswer);
                            io.to(clients[k].id).emit('PAA', {
                                playerNum: clients[x].playerNum,
                                answer: clients[k].currentAnswer.toLowerCase()
                            });
                        }
                    }

                    //We are at the end of clients, send a message to the host
                    //saying that they can display the answers
                    if(x == clients.length - 1){
                        io.to(clients[k].id).emit('PAF');
                    }
                }
            }
        }
    });

    //PSD - Please Send Drawing
    //We need to check to see who the next player in line is and send the server their drawing
    //We will go with the order the for loop provides and will send the drawing if their bool returns true
    socket.on('PSD', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                
                //loop through clients and find a client that matches our host room code
                for(var x = 0; x < clients.length; x++){
                    //X is player
                    //K is host
                    if(clients[x].room == clients[k].room && !clients[x].isHost && !clients[x].shownDrawing){
                        //we found a client in the room that isnt a host who hasn't shown their drawing
                        clients[k].numOfShowDrawings++;
                        clients[x].shownDrawing = true;
                        clients[k].currentAnswer = clients[x].prompt;
                        clients[k].currentAnswerPlayerNum = clients[x].playerNum;

                        socket.emit('DFH', {
                            artist: clients[x].name,
                            prompt: clients[x].prompt,
                            drawing: clients[x].drawing,
                            number: clients[x].playerNum
                        });

                        return;

                        if(clients[k].numOfShowDrawings == clients[k].numOfPlayers){
                            //we have shown all the drawings
                        }
                    }
                }

            }
        }
    });

    //UD - User Drawing
    //We need to set the clients drawing to the drawing data
    //then we need to make sure that their finished drawing bool is set to true
    socket.on('UD', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].drawing = data.drawing;
                clients[k].finishedDrawing = true;
                clients[k].shownDrawing = false;
                console.log("[SERVER] Client in room " + clients[k].room + " sent in their drawing.");

                for(var x = 0; x < clients.length; x++){
                    if(clients[x].room == clients[k].room && clients[x].isHost){
                        clients[x].playerNumFinishedDrawing++;
                        console.log("[SERVER] Checking to see if this is the last player.");
                        if(clients[x].playerNumFinishedDrawing == clients[x].numOfPlayers){
                            //The last player just sent in their drawing
                            //Send the Finished Drawing message to the host
                            io.to(clients[x].id).emit('FD');
                            console.log("[SERVER] All the clients in room " + clients[x].room + " have finished their drawings");
                        }else{
                            console.log("[SERVER] It wasn't the last player, only " + clients[x].playerNumFinishedDrawing + "/" + clients[x].numOfPlayers + " have finished drawing.");
                        }
                    }
                }
            }
        }
    });

    //FF - Family Friendly Toggle
    //We should check to see what host needs to switch and make the adjustment
    socket.on('FF', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].familyFriendly = data.toggle;
                console.log('[SERVER] The host in room ' + clients[k].room + ' just set their Family Friendly status to ' + clients[k].familyFriendly);
            }
        }
    });

    //VA - Voting Answer
    //OUTPUT: NVO - New Voting Option
    //We need to relay the voting answers to the clients in the room
    socket.on('VA', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                socket.broadcast.to(clients[k].room).emit('NVO', {
                    possibleAnswer: data.possibleAnswer
                });
            }
        }
    });

    //VTO - Voting Time Over
    //OUTPUT: SAV - Stop Allowing Voting
    //We need to tell all the clients in the room that they can't vote anymore
    socket.on('VTO', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                socket.broadcast.to(clients[k].room).emit('SAV');
            }
        }
    });

    //RPV - Request Player Votes
    //OUTPUT: NPV - New Player Vote
    //Loop through players and return their votes and player numbers
    socket.on('RPV', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                //K is host
                //X is players
                for(var x = 0; x < clients.length; x++){
                    if(clients[x].room == clients[k].room){
                        socket.emit('NPV', {
                            playerNum: clients[x].playerNum,
                            vote: clients[k].chosenAnswer
                        });
                    }

                    if(x == clients.length - 1){
                        //we are at the end of the loop, we need to tell the host to update scores
                        socket.emit('UPS');
                        console.log("[SERVER] We have sent all the votes to the host in room " + clients[k].room);
                    }
                }
            }
        }
    });

    //UCA - User Chose Answer
    //OUTPUT: SVT - Skip Vote Time
    //We need to accept the users answer choice and store it
    //TODO: Decide how we tell the server about this and handel showing who voted for what, also we should make sure users don't vote for their own answers
    socket.on('UCA', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                clients[k].chosenAnswer = data.choice;
                console.log("[SERVER] New player voted, checking to see if everyone has voted.");
                var weCanSkipTime = true;
                //Loop through all the clients and check to see if they all have picked answers
                for(var x = 0; x < clients.length; x++){
                    if(clients[x].room == clients[k].room && !clients[x].isHost && clients[x].chosenAnswer == '' && !clients[x].shownDrawing){
                        //Our client is in the same room and isn't a host and hasn't voted yet
                        weCanSkipTime = false;
                        console.log("[SERVER] Someone hasn't voted, it's player " + clients[x].name);
                    }

                    //If we reach the end of the clients and we can still skip time we will tell the host to skip
                    if(x == clients.length - 1 && weCanSkipTime){
                        socket.broadcast.to(clients[k].room).emit('SVT');
                        console.log("[SERVER] All players in room " + clients[k].room + " have voted, we will skip ahead.");
                    }
                }
            }
        }
    });

    //SG - Start Game
    //We need to check to see how many players exist in the server, if there are more than
    //3 players we can send the start message, if there are less than 3 we need to
    //do nothing. Maybe send a different type of message.
    socket.on('SG', function(){
        var isFamilyFriendly;
        var hostRoom;
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                isFamilyFriendly = clients[k].familyFriendly;
                hostRoom = clients[k].room;
                if(clients[k].numOfPlayers >= 3){
                    console.log('[SERVER] Host ' + clients[k].room + " is starting a game.");
                    socket.emit('GTG', {
                        numOfPlayers: clients[k].numOfPlayers
                    });
                    clients[k].gameStarted = true;
                    SendWritingPrompts(hostRoom, isFamilyFriendly);
                }else{
                    console.log('[SERVER] Host ' + clients[k].room + " is trying to start a game but they don't have enough players.");
                }
            }
        }
    });

    //OT - Over Time
    //If a player is going over on time they need to be punsihed or kicked
    socket.on('OT', function(data){
        for(var k = 0; k < clients.length; k++){
            if(socket.id == clients[k].id){
                for(var x = 0; x < clients.length; x++){
                    //X is player
                    //K is host
                    if(clients[x].room == clients[k].room){
                        //clients are in the same room, check to see if they need to be punished
                        if(!clients[x].finishedDrawing && data.penality != 'kick' && !clients[x].isHost){
                            socket.emit('PLP', {
                                playerNum: clients[x].playerNum,
                                penality: data.penality
                            });
                            console.log("[SERVER] " + clients[x].name + " is losing points!");
                        }
                        else if(!clients[x].finishedDrawing && data.penality == 'kick' && !clients[x].isHost){
                            clients[x].room = 'kicked';
                            io.to(clients[x].id).emit('K');
                            console.log("[SERVER] " + clients[x].name + " is kicked from the room.");
                        }
                    }
                }
            }
        }
    });
});

function SendWritingPrompts(hostRoom, isFamilyFriendly){
    console.log("[SERVER] The host in " + hostRoom + " is now passing out writing prompts.")
        //We need to send writing prompts to everyone in the room
        for(var x = 0; x < clients.length; x++){
            if(clients[x].room == hostRoom && !clients[x].isHost){
                //we need to send them a prompt
                //X is the playing client
                //K is the host client
                if(isFamilyFriendly){
                    var generatedPrompt = GenerateNewSFWPrompt();
                    clients[x].prompt = generatedPrompt;
                    console.log("[SERVER] We are sending " + generatedPrompt + " to " + clients[x].name);
                    //If family friendly is true we need to send them a prompt from the SFW array
                    io.to(clients[x].id).emit('WP', {
                        prompt: generatedPrompt
                    });
                }else{
                    //If family friendly isn't true we need to send them a prompt from the NSFW array
                    var generatedPrompt = GenerateNewNSFWPrompt();
                    clients[x].prompt = generatedPrompt;
                    io.to(clients[x].id).emit('WP', {
                        prompt: generatedPrompt
                    });
                }
            }
        }
}

var usedSFWPrompts = ['starter'];
var usedNSFWPrompts = ['starter'];
var generateLoop = 0;
var generateLoopNSFW = 0;

function GenerateNewSFWPrompt(){
    var prompt = GetSFWPrompt();
    //console.log("[SERVER] I got a prompt of " + prompt);
    for(var k = 0; k < usedSFWPrompts.length; k++){
        //console.log("Checking to see if " + prompt + " is the same as " + usedSFWPrompts[k]);
        if(prompt == usedSFWPrompts[k] && generateLoop < 200){
        //loop becuase we are trying to reuse
        generateLoop++;
        prompt = GetSFWPrompt();
        k = 0;
        //console.log("We used this prompt before, get new one");
        }
        else if(prompt == usedSFWPrompts[k] && generateLoop >= 200){
            //reset loop and return the new prompt
            generateLoop = 0;
            usedSFWPrompts = ['starter'];
            prompt = GetSFWPrompt();
            usedSFWPrompts.push(prompt);
            console.log("At max loops, return new prop and reset array");
            return prompt;
        }
        else if(k == usedSFWPrompts.length - 1){
            //isn't being reused
            usedSFWPrompts.push(prompt);
            generateLoop = 0;
            //console.log("This prompt hasn't been used before, return it");
            //console.log("Generated prompt was " + prompt);
            return prompt;
        }
    }
}

function GetSFWPrompt(){
    var prompt = getRandomInt(0, SFW.length);
    return SFW[prompt];
}

function GenerateNewNSFWPrompt(){
    var prompt = GetNSFWPrompt();
    //console.log("[SERVER] I got a prompt of " + prompt);
    for(var k = 0; k < usedNSFWPrompts.length; k++){
        if(prompt == usedNSFWPrompts[k] && generateLoopNSFW < 200){
        //loop becuase we are trying to reuse
        generateLoopNSFW++;
        prompt = GetNSFWPrompt();
        k = 0;
        //console.log("We used this prompt before, get new one");
        }
        else if(prompt == usedNSFWPrompts[k] && generateLoopNSFW >= 200){
            //reset loop and return the new prompt
            generateLoopNSFW = 0;
            usedNSFWPrompts = ['starter'];
            prompt = GetNSFWPrompt();
            usedNSFWPrompts.push(prompt);
            //console.log("At max loops, return new prop and reset array");
            return prompt;
        }
        else if(k == usedSFWPrompts.length - 1){
            //isn't being reused
            usedNSFWPrompts.push(prompt);
            generateLoopNSFW = 0;
            //console.log("This prompt hasn't been used before, return it");
            //console.log("Generated prompt was " + prompt);
            return prompt;
        }
    }
}

function GetNSFWPrompt(){
    var prompt = getRandomInt(0, NSFW.length);
    return NSFW[prompt];
}

//This function generates our room code by getting 4 random numbers
//The numbers can range from 1 to 26, one number for each letter in
//the alphabet. We will construct a string based on what numbers
//are generated and we will check to see if the generated room
//code has been done before.
function GenerateRoomCode(){
    var letter1 = getRandomInt(1,26);
    var letter2 = getRandomInt(1,26);
    var letter3 = getRandomInt(1,26);
    var letter4 = getRandomInt(1,26);

    var roomCode = "";

    roomCode = GetLetterFromInt(letter1) + GetLetterFromInt(letter2) + GetLetterFromInt(letter3) + GetLetterFromInt(letter4);
    console.log("[SERVER] New host generated room code: " + roomCode);

    return roomCode;
}

//This function generates a random number between two random ints
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This function gets our letters from the number we pass in
function GetLetterFromInt(number){
    switch(number){
        case 1:
            return "a";
        case 2:
            return "b";
        case 3:
            return "c";
        case 4:
            return "d";
        case 5:
            return "e";
        case 6:
            return "f";
        case 7:
            return "g";
        case 8:
            return "h";
        case 9:
            return "i";
        case 10:
            return "j";
        case 11:
            return "k";
        case 12:
            return "l";
        case 13:
            return "m";
        case 14:
            return "n";
        case 15:
            return "o";
        case 16:
            return "p";
        case 17:
            return "q";
        case 18:
            return "r";
        case 19:
            return "s";
        case 20:
            return "t";
        case 21:
            return "u";
        case 22:
            return "v";
        case 23:
            return "w";
        case 24:
            return "x";
        case 25:
            return "y";
        case 26:
            return "z";
    }
}

///////////////////////////////////////////Server error stuff
var errorhandler = require('errorhandler');

process.on('uncaughtException', function(exception){
    console.log(exception);
});
app.use(errorhandler({dumpExceptions: true, showStack: true}));