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
	await omnitalk.createSession();

	let regiBtn = document.querySelector("#regiBtn");
	let joinBtn = document.querySelector("#joinBtn");

	
	regiBtn.addEventListener("click", async function() {
		let roomName = document.getElementById('roomName').value;

		// create room object
		// second argument is subject of the room
		let roomObj = await omnitalk.createRoom("audioroom", roomName);
		console.log('room obj: ', roomObj);

		// get all active room lists as an array
		let roomlist = await omnitalk.roomList("audioroom");
		log.insertAdjacentHTML('beforeend', `<p>Audio RoomId: ${roomObj.room_id}</p>`);

		roomlist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Roomlist-${index}: ${item.subject}, ${item.room_id}</p>`);
		})
		regiBtn.disabled = true;
		document.getElementById("roomId").value = roomObj.room_id;
	});

	joinBtn.addEventListener("click", async function() {
		// need to get room id for joining the room
		const roomId = document.getElementById('roomId').value;

		// join the room	
		const result = await omnitalk.joinRoom(roomId);
		console.log('join room result: ', result);

		// start audio communication
		// [TO CHECK] publish에 대한 구독은? 
		// [TO CHECK] 오디오 컨퍼런스에 참여만 하는 사람은 필요없는 과정 맞는지?
		const pubResult = await omnitalk.publish("audiocall", false);
		console.log('pub result: ', pubResult);

		// get participants list
		// [TO CHECK] 오디오 컨퍼런스 생성후 참여시 partilist에 미존재
		const partilist = await omnitalk.partiList(roomId);
		console.log('partilist: ', partilist);
		

		partilist.map((item, index) => {
			log.insertAdjacentHTML('beforeend', `<p>Participant-${index}: ${item.user_id}</p>`);
		})
	});
}

