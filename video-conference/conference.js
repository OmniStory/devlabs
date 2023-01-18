'use strict'

window.onload = async function(){

	// pass argument(s)
	// service id for web
	// service id, service key for app
	const omnitalk = new Omnitalk("FM51-HITX-IBPG-QN7H","FWIWblAEXpbIims");
	omnitalk.onmessage = async (evt) => {
		let log = document.querySelector("#log");
		switch (evt.cmd) {
			case "SESSION_EVENT":
				log.insertAdjacentHTML('beforeend', `<p>Session: ${evt.session}</p>`);
				break;
			case "BROADCASTING_EVENT":
				log.insertAdjacentHTML('beforeend', `<p>Join: ${evt.user_id}</p>`);
				omnitalk?.subscribe(evt["publish_idx"]);
				break;
			case "ONAIR_EVENT":
				if (evt.track_type == 1) log.insertAdjacentHTML('beforeend', `<p>Audio On</p>`);
				else if (evt.track_type == 2) log.insertAdjacentHTML('beforeend', `<p>Video On</p>`);
				break;
			case "LEAVE_EVENT":
				log.insertAdjacentHTML('beforeend', `<p>Bye: ${evt.session}</p>`);
				break;
		}
	}
	
	// start session. create web socket
	const sessionId = await omnitalk.createSession();
	console.log(sessionId);

	let regiBtn = document.querySelector("#regiBtn");
	let joinBtn = document.querySelector("#joinBtn");

	regiBtn.addEventListener("click", async function() {
		let roomName = document.getElementById('roomName').value;

		// create room object
		// second argument is subject of the room
		let roomObj = await omnitalk.createRoom("videoroom", roomName);
		
		// get all active room lists as an array
		let roomlist = await omnitalk.roomList("videoroom");
		log.insertAdjacentHTML('beforeend', `<p>Video RoomId: ${roomObj.room_id}</p>`);

		roomlist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Roomlist-${index}: ${item.subject}, ${item.room_id}</p>`);
		})
		regiBtn.disabled = true;
		document.getElementById("roomId").value = roomObj.room_id;
	});

	joinBtn.addEventListener("click", async function() {
		document.getElementById('videoDisplay').style.display = "block";

		// need to get room id for joining the room
		let roomId = document.getElementById('roomId').value;

		// join the room
		await omnitalk.joinRoom(roomId);
		let partilist = await omnitalk.partiList(roomId);
		console.log('video conf partilist: ', partilist);

		// start video conference
		await omnitalk.publish("videocall", false);


		partilist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Participant-${index}: ${item.user_id}</p>`);

			// subscribe the video conference
			omnitalk?.subscribe(item.publish_idx);
		})
	});

	
}
