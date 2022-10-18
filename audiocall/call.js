'use strict'
const omnitalk = new Omnitalk("SERVICE ID를 등록하세요");
omnitalk.onmessage = async (evt) => {
	let log = document.querySelector("#log");
	log.insertAdjacentHTML('beforeend', `<p>${evt.cmd}</p>`);

	switch (evt.cmd) {
		case "SESSION_EVENT":
			console.log(`Create session,${evt.user_id}, ${evt.result}`);
			break;
		case "RINGING_EVENT":
			console.log("Ringing");

			// Auto answer after 2 seconds
			setTimeout(async function(){
				let sessionId = await omnitalk.answerCall();
				console.log(sessionId);
			}, 1000*3);

			// Auto leave after 20 seconds
			setTimeout(async function(){
				await omnitalk.leave();
			}, 1000*30);
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
			break;
	}
}

window.onload = function(){
	let regiBtn = document.querySelector("#regiBtn");
	let callBtn = document.querySelector("#callBtn");

	regiBtn.addEventListener("click", async function() {
		var regiNum = document.getElementById('regiNum').value;
		let sessionId = await omnitalk.createSession(regiNum);
		console.log(sessionId);
	});

	callBtn.addEventListener("click", async function() {
		var callNum = document.getElementById('callNum').value;
		await omnitalk.offerCall("audiocall", callNum, false);
	});
}
