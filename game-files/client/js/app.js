var socket = io();
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
context.lineWidth = 5;
var down = false;
var img = new Image();

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mousedown', function(){
    down = true;
    context.beginPath();
    context.moveTo(xPos, yPos);
    canvas.addEventListener('mousemove', draw);
});

canvas.addEventListener('mouseup', function(){
    down = false;
});

function draw(e){
    xPos = e.clientX - canvas.offsetLeft;
    yPos = e.clientY - canvas.offsetTop;
    
    if(down){
        context.lineTo(xPos, yPos);
        context.stroke();
    }
}

$('#update').click(function(){
    
    var usersName = $('#name').val();
    
    socket.emit('N', {
        name: usersName
    });
});

$('#send').click(function(){
    var dataURL = canvas.toDataURL();
    
    socket.emit('D', {
        drawing: dataURL
    });
});

socket.on('SD', function(data){    
    img.src = data.img;
    
    img.onload = function(){
        context.drawImage(img, 0,0);
        console.log("An image should appear");
    }
});

$('#clear').click(function(){
    context.clearRect(0,0,canvas.width,canvas.height);
});

$('#resend').click(function(){
    socket.emit('R', {
        username: "molly"
    });
});