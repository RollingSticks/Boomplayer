import firebaseControl from "$lib/stores/firebaseControl";

import appData from "$lib/stores/appData";
import type { AppStore, FirebaseStore } from "$lib/scripts/interfaces";

let appDataStore: AppStore;
let firebaseControlStore: FirebaseStore;

appData.subscribe((data) => {
	appDataStore = data;
});

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function sendNotification(
	token: string,
	notification: { body: string; title: string }
) {
	const accessTokenRequestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id:
				"279854840176-9t61h6qre976r0l98qobvjnr795096hh.apps.googleusercontent.com",
			client_secret: "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",
			refresh_token:
				"1//049m5e0yUhmpBCgYIARAAGAQSNwF-L9IrDnrOT7OSti6pGe3_3YciXjPwZLSGpRTSzOIeB6G99zWVJ0VvA8aw1e3Z0ma8L7vsdZE",
			grant_type: "refresh_token"
		})
	};

	const accessToken = (
		await (
			await fetch(
				"https://oauth2.googleapis.com/token",
				accessTokenRequestOptions
			)
		).json()
	).access_token;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		body: JSON.stringify({
			message: {
				token: token,
				notification: notification
			}
		})
	};

	fetch(
		"https://fcm.googleapis.com/v1/projects/boomplayerdev/messages:send",
		options
	)
		.then(async (response) => console.log(await response.json()))
		.catch((err) => console.error(err));
}

export { sendNotification };
