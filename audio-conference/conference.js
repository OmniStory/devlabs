'use strict'

window.onload = async function(){
	const omnitalk = new Omnitalk("SERVICE ID를 입력하세요");
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
	let sessionId = await omnitalk.createSession();

	let regiBtn = document.querySelector("#regiBtn");
	let joinBtn = document.querySelector("#joinBtn");

	regiBtn.addEventListener("click", async function() {
		let roomName = document.getElementById('roomName').value;
		let roomId = await omnitalk.createRoom("audioroom", roomName);
		let roomlist = await omnitalk.roomList("audioroom");
		log.insertAdjacentHTML('beforeend', `<p>RoomId: ${roomId}</p>`);

		roomlist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Roomlist-${index}: ${item.subject}, ${item.room_id}</p>`);
		})
		regiBtn.disabled = true;
		document.getElementById("roomId").value = roomId;
	});

	joinBtn.addEventListener("click", async function() {
		let roomId = document.getElementById('roomId').value;
		let result = await omnitalk.joinRoom(roomId);
		let partilist = await omnitalk.partiList(roomId);
		await omnitalk.publish("audiocall", false);

		partilist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Participant-${index}: ${item.user_id}</p>`);
		})
	});
}
