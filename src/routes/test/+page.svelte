<script lang="ts">
	// import { onMount } from "svelte";
	// let res = "hi";

	// const firebaseConfig = {
	//     apiKey: "AIzaSyDx-tRxRGBrSSQxSzA-0oo4Hc5HRJ_JhFU",
	//     authDomain: "boomplayerdev.firebaseapp.com",
	//     projectId: "boomplayerdev",
	//     storageBucket: "boomplayerdev.appspot.com",
	//     messagingSenderId: "279854840176",
	//     appId: "1:279854840176:web:f6351675e25fc8369cb7b5",
	//     measurementId: "G-K2SEJJN5H3"
	// };

	// onMount(() => {
	//     const app = firebase.initializeApp(firebaseConfig);

	//     firebase.messaging().usePublicVapidKey("BPHchVcW2gNh_EIRx6BrQOFyCvGKPBu2sj3C0hCotRHFVMuMyuNE8gjPiSv_zzayffmyJlVguRNKbBlCP5BSwBc");

	//     firebase.messaging().onMessage((payload) => {
	//         console.log("on Message", payload);
	//     });

	//     getStartToken();
	// })

	// function test() {
	//     console.log("test");
	// }

	// function RequestPermission() {
	//     Notification.requestPermission().then((permission) => {
	//         if (permission === "granted") {
	//             console.log("Notification permission granted.");
	//             getStartToken();
	//         } else {
	//             console.log("Unable to get permission to notify.");
	//         }
	//     });
	// }

	// function getStartToken() {
	//     res = "getting token";
	// 	firebase.messaging().getToken().then((currentToken) => {
	//         if (currentToken) {
	//             res = currentToken;
	//             console.log("currentToken:\n", currentToken);
	//         } else {
	//             res = "fail";
	//             console.log("No Instance ID token available. Request permission to generate one.");
	//         }
	//     }).catch((err) => {
	//         res = err
	//         console.log("An error occurred while retrieving token. ", err);
	//     });
	// }

	import firebaseControl from "$lib/stores/firebaseControl";
	import type { FirebaseStore } from "$lib/scripts/interfaces";
	import { onMount } from "svelte";

	let firebaseControlStore: FirebaseStore;

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let res = "hi";

	onMount(async () => {
		await firebaseControlStore.setupMessaging();
	});

	function getStartToken() {
		console.log(firebaseControlStore.messaging);
		console.log(firebaseControlStore.token);
	}
</script>

<svelte:head>
	<script
		src="https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js"></script>
	<script
		src="https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js"></script>
</svelte:head>

<button on:click={getStartToken}>Test</button>
<p>{res}</p>
