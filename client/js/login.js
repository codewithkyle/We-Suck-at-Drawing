var socket = io();

$('#send').click(function(){
    
    var username = $('#display-name').val();
    var roomCode = $('#room-code').val();
    
    if(username.length > 12) username = username.substring(0, 13);
    
    socket.emit('PC', {
        room: roomCode,
        name: username
    });
});