'use strict'
const omnitalk = new Omnitalk("GKTT-FO2B-4OLT-VBUI");
omnitalk.onmessage = async (evt) => {
	let log = document.querySelector("#log");
	log.insertAdjacentHTML('beforeend', `<p>${evt.cmd}</p>`);

	switch (evt.cmd) {
		case "SESSION_EVENT":
			console.log(`Create session,${evt.user_id}, ${evt.result}`);
			break;
		case "RINGING_EVENT":
			console.log("Ring~ Ring~");

			// Auto answer after 3 seconds
			setTimeout(async function(){
				let sessionId = await omnitalk.answerCall();
				console.log(sessionId);
			}, 1000*3);

			// Auto leave after 30 seconds
			setTimeout(async function(){
				await omnitalk.leave();
			}, 1000*30);
			break;
		case "BROADCASTING_EVENT":
			omnitalk.subscribe(evt["publish_idx"]);
			break;
		case "CONNECTED_EVENT":
			console.log("Connected");
			break;
		case "ONAIR_EVENT":
			if (evt.track_type == 1) console.log("Audio Enable");
			else if (evt.track_type == 2) console.log("Video Enable");
			break;
		case "LEAVE_EVENT":
			console.log("Diconnected");
			setTimeout(function(){
				window.location.reload(true);
			},2000);
			break;
	}
}

window.onload = function(){
	let regiBtn = document.querySelector("#regiBtn");
	let callBtn = document.querySelector("#callBtn");

	regiBtn.addEventListener("click", async function() {
		var regiNum = document.getElementById('regiNum').value;
		let sessionId = await omnitalk.createSession(regiNum);
	});

	callBtn.addEventListener("click", async function() {
		var callNum = document.getElementById('callNum').value;
		await omnitalk.offerCall("videocall", callNum, false);
	});
}
