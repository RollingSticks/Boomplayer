importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js");
importScripts(
	"https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js"
);
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDx-tRxRGBrSSQxSzA-0oo4Hc5HRJ_JhFU",
	authDomain: "boomplayerdev.firebaseapp.com",
	projectId: "boomplayerdev",
	storageBucket: "boomplayerdev.appspot.com",
	messagingSenderId: "279854840176",
	appId: "1:279854840176:web:f6351675e25fc8369cb7b5",
	measurementId: "G-K2SEJJN5H3"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
	"BPHchVcW2gNh_EIRx6BrQOFyCvGKPBu2sj3C0hCotRHFVMuMyuNE8gjPiSv_zzayffmyJlVguRNKbBlCP5BSwBc"
);
messaging.onBackgroundMessage(function (payload) {
	console.log("background message", payload);
});
