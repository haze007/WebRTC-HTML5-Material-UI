navigator.getWebcam = (
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia
);
var peer = new Peer(
	{
		key:'5d1bctg2wr0be29',
		debug: 3,
		config:{'iceServer': [
			{url:'stun:numb.viagenie.ca:3478',username:'ryan@julyan.biz', credential:'rjulyan'},
			{url:'turn:numb.viagenie.ca:3478',username:'ryan@julyan.biz', credential:'rjulyan'}
		]}
	}
);

// On open, set the peer id
peer.on('open', function(){
	$('#my-id').text(peer.id);
});

peer.on('call', function(call){
	// Answer automatically (For Demo)
	call.answer(window.localStream);
	step3(call);
});

// Click Handelers setup
$(function(){
	
	$('#make-call').click(function(){
		// Initiate a call!
		var call = peer.call($('#callto-id').val(), window.localStream);
		step3(call);
	});
	
	$('#end-call').click(function(){
		window.existingCall.close();
		step2();
	});
	
	// retry if getUserMedia Fails
	$('#step1-retry').click(function(){
		$('#step1-error').hide();
		step1();
	});
	
	// Get started
	step1();
});

function step1(){
	// Get Audio/Video Stream
	navigator.getWebcam({audio:true, video:true}, function(stream){
		$('#my-video').prop('src', URL.createObjectURL(stream));
		
		window.localStream = stream;
		
		step2();
	},function(){ 
		$('#step1-error').show();
	});
}

function step2(){
	$('#step1', '#step3').hide();
	$('#step2').show();
}

function step3(call){
	// Hang up on an existing call if present
	if(window.existingCall){
		window.existingCall.close();
	}
	
	// wait for stream on the call, then setup peer video
	call.on('stream', function(stream){
		$('#their-video').prop('src', URL.createObjectURL(stream));
	});
	$('#step1', '#step2').hide();
	$('#step3').show();
}