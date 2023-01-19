'use strict'

window.onload = async function(){
	// pass argument(s)
	// service id for web
	// service id, service key for app
	const omnitalk = new Omnitalk('service_id', 'service_key');
	omnitalk.onmessage = async (evt) => {
		let log = document.querySelector("#log");
		switch (evt.cmd) {
			case "SESSION_EVENT":
				log.insertAdjacentHTML('beforeend', `<p>Session: ${evt.session}</p>`);
				break;
			case "BROADCASTING_EVENT":
				log.insertAdjacentHTML('beforeend', `<p>Join: ${evt.user_id}</p>`);
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
	const session = await omnitalk.createSession();

	const regiBtn = document.querySelector("#regiBtn");
	const joinBtn = document.querySelector("#joinBtn");

	
	regiBtn.addEventListener("click", async function() {
		const roomName = document.getElementById('roomName').value;
		const roomObj = await omnitalk.createRoom("audioroom", roomName);
		const roomlist = await omnitalk.roomList("audioroom");
		log.insertAdjacentHTML('beforeend', `<p>Audio RoomId: ${roomObj.room_id}</p>`);

		roomlist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Roomlist-${index}: ${item.subject}, ${item.room_id}</p>`);
		})
		regiBtn.disabled = true;
		document.getElementById("roomId").value = roomObj.room_id;
	});

	joinBtn.addEventListener("click", async function() {
		const roomId = document.getElementById('roomId').value;
		const result = await omnitalk.joinRoom(roomId);
		const pubResult = await omnitalk.publish("audiocall", false);
		const partilist = await omnitalk.partiList(roomId);		

		partilist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Participant-${index}: ${item.user_id}</p>`);
		})
	});
}

