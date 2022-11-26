<script lang="ts">
	import "./styling.scss";

	import firebaseControl from "$lib/stores/firebaseControl";
	import appData from "$lib/stores/appData";
	import type {
		AppStore,
		AuthStore,
		FirebaseStore,
		PlayerStore
	} from "$lib/scripts/interfaces";
	import { onMount } from "svelte";
	import { onAuthStateChanged } from "firebase/auth";
	import authData from "$lib/stores/authData";
	import playerControl from "$lib/stores/playerControl";

	let appDataStore: AppStore;
	let AuthDataStore: AuthStore;
	let firebaseControlStore: FirebaseStore;
	let playerControlStore: PlayerStore;

	playerControl.subscribe((data) => {
		playerControlStore = data;
	});

	appData.subscribe((data) => {
		appDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	let toastTitle = "";
	let toastMessage = "";

	let popupTimeout;

	function showToast(color: string) {
		const toast = document.getElementById("toast");

		if (toast) toast.style.borderLeft = `8px solid ${color}`;

		clearTimeout(popupTimeout);
		const wrapper = document.getElementById("wrapper");
		if (toast) toast.style.transform = "translateX(0)";
		if (wrapper) wrapper.style.zIndex = "100";
		popupTimeout = setTimeout(() => {
			closeToast();
		}, 3000);
	}

	function closeToast() {
		dispatchEvent(new CustomEvent("stopLoadingAnimation"));
		const wrapper = document.getElementById("wrapper");
		const toast = document.getElementById("toast");
		if (toast) toast.style.transform = "translateX(400px)";

		setTimeout(() => {
			if (wrapper) wrapper.style.zIndex = "-1";
		}, 850);
	}

	let loader = true;

	onMount(async () => {
		addEventListener("ShowLoader", () => (loader = true));
		addEventListener("HideLoader", () => (loader = false));

		addEventListener("error", (err) => {
			toastTitle = "Error";
			toastMessage = err.error.message;
			showToast("red");
		});

		addEventListener("info", (message) => {
			toastTitle = message.detail.title ?? "Info";
			toastMessage =
				message.detail.message ?? "Geen informatie beschikbaar";
			showToast("blue");
		});

		addEventListener("resize", (event) => {
			if (window.location.pathname === "/home") {
				const Panel = document.getElementById("panel");
				const UploadSongView =
					document.getElementById("UploadSongView");
				const PlayerView = document.getElementById("PlayerView");
				if (!(Panel instanceof HTMLElement)) return;
				if (!(UploadSongView instanceof HTMLElement)) return;
				if (!(PlayerView instanceof HTMLElement)) return;

				if (
					window.innerWidth < 1195 &&
					(UploadSongView?.style.display == "flex" ||
						appDataStore.currentSongUid !== "")
				) {
					Panel.style.display = "none";
				} else if (window.innerWidth < 501) {
					Panel.style.display = "none";
					UploadSongView.style.display = "none";
					PlayerView.style.display = "none";
				} else {
					Panel.style.display = "block";
				}
			}
		});

		onAuthStateChanged(firebaseControlStore.auth, async (user) => {
			if (user) {
				localStorage.setItem("beenhere", "true");
				localStorage.setItem(
					"uid",
					user.uid ?? firebaseControlStore.auth.currentUser?.uid
				);

				appDataStore.userInfo = user;
				appDataStore.isAdmin = (
					await user.getIdTokenResult()
				).claims.admin;

				AuthDataStore.newUserDisplayName =
					user.displayName ??
					firebaseControlStore.auth.currentUser?.displayName ??
					AuthDataStore.userEmail
						.split("@")[0]
						.replace("-", " ")
						.replace("_", " ") ??
					firebaseControlStore.auth
						.currentUser!.email!.split("@")[0]
						.replace("-", " ")
						.replace("_", " ");

				AuthDataStore.newUserEmail =
					user.email ??
					firebaseControlStore.auth.currentUser?.email ??
					AuthDataStore.userEmail;

				dispatchEvent(new CustomEvent("continueSetup"));
				dispatchEvent(new CustomEvent("UserAuthenticated"));
				dispatchEvent(new CustomEvent("HideLoader"));

				await firebaseControlStore.onLoadSetup();

				if (["/login", "/join", "/"].includes(window.location.pathname))
					window.location.href = "/home";

				if (appDataStore.isAdmin) {
					appDataStore.claims = (
						await user.getIdTokenResult()
					).claims;
				}
			} else {
				if (
					localStorage.getItem("beenhere") &&
					window.location.pathname !== "/login" &&
					window.location.pathname !== "/join"
				)
					window.location.href = "/login";
				else if (
					window.location.pathname !== "/login" &&
					window.location.pathname !== "/join"
				)
					window.location.href = "/join";
			}
		});
	});
</script>

<div id="wrapper">
	<div id="toast">
		<div class="container-1">
			<i class="fas fa-check-square" />
		</div>
		<div class="container-2">
			<p>{toastTitle}</p>
			<p>{toastMessage}</p>
		</div>
		<button tabindex="-1" id="close" on:click={closeToast}>
			&times;
		</button>
	</div>
</div>

{#if loader}
	<div id="loading">
		<div class="bar bar1" />
		<div class="bar bar2" />
		<div class="bar bar3" />
		<div class="bar bar4" />
		<div class="bar bar5" />
		<div class="bar bar6" />
		<div class="bar bar7" />
		<div class="bar bar8" />
	</div>
{/if}

<slot />

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-family: "Poppins", sans-serif;
		font-size: 14px;
		border: none;
	}

	#wrapper {
		width: 420px;
		padding: 30px 20px;
		position: absolute;
		bottom: 50px;
		right: 0;
		z-index: -1;
	}

	#toast {
		width: 380px;
		height: 80px;
		padding: 20px;
		background-color: #ffffff;
		box-shadow: 0 10px 20px rgba(75, 50, 50, 0.05);
		border-radius: 7px;
		display: grid;
		grid-template-columns: 1.2fr 6fr 0.5fr;
		transform: translate(400px);
		transition: 1s;
	}
	.container-1,
	.container-2 {
		align-self: center;
	}
	.container-1 i {
		font-size: 40px;
		color: red;
	}
	.container-2 p:first-child {
		color: #101020;
		font-weight: 600;
		font-size: 16px;
	}
	.container-2 p:last-child {
		font-size: 12px;
		color: #656565;
		font-weight: 400;
	}
	#toast button {
		align-self: flex-start;
		background-color: transparent;
		font-size: 25px;
		line-height: 0;
		color: #656565;
		cursor: pointer;
	}
</style>
