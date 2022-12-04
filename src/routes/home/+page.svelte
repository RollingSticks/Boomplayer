<script lang="ts">
	import "./styling.scss";

	import type {
		AppStore,
		FirebaseStore,
		Score
	} from "$lib/scripts/interfaces";
	import appData from "$lib/stores/appData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";
	import Profile from "$lib/components/Profile.svelte";
	import Player from "$lib/components/Player.svelte";
	import SongItem from "$lib/components/SongItem.svelte";
	import type { DocumentData, Unsubscribe } from "firebase/firestore";
	import UploadMenu from "$lib/components/UploadMenu.svelte";
	import { getAllSongs } from "$lib/scripts/admin/boomManager";
	import Signout from "$lib/components/Signout.svelte";
	import Loader from "$lib/components/Loader.svelte";

	import type { PlayerStore } from "$lib/scripts/interfaces";
	import playerControl from "$lib/stores/playerControl";

	let appDataStore: AppStore;
	let firebaseControlStore: FirebaseStore;

	let playerControlStore: PlayerStore;

	playerControl.subscribe((data) => {
		playerControlStore = data;
	});

	appData.subscribe((data: AppStore) => {
		appDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let loadedSong: Score | undefined = {} as Score;

	let loadedSongSnapshot: undefined | Unsubscribe;

	let authenticated = false;

	onMount(async () => {
		addEventListener("UserAuthenticated", async () => {
			authenticated = true;
			dispatchEvent(new CustomEvent("HideLoader"));

			const firestore = import("firebase/firestore");

			(await firestore).onSnapshot(
				(await firestore).doc(
					firebaseControlStore.firestore,
					`users/${firebaseControlStore.auth.currentUser?.uid}`
				),
				(doc) => {
					appDataStore.userData = doc.data() ?? { songs: [] };
				}
			);
		});
	});

	async function loadSong(id: string) {
		const PlayerView = document.getElementById("PlayerView");
		const UploadSongView = document.getElementById("UploadSongView");
		const Panel = document.getElementById("panel");

		appDataStore.currentSongUid = id;

		if (PlayerView?.style.display !== "block")
			dispatchEvent(new CustomEvent("ShowLoader"));

		if (window.innerWidth < 1195) {
			if (Panel) Panel.style.display = "none";
		}

		const firestore = await import("firebase/firestore");

		if (loadedSongSnapshot) loadedSongSnapshot();
		loadedSongSnapshot = firestore.onSnapshot(
			firestore.doc(firebaseControlStore.firestore, `songs/${id}`),
			(doc) => {
				loadedSong = doc.data()?.data;
			}
		);
		addEventListener("moveInPlayer", () => {
			dispatchEvent(new CustomEvent("HideLoader"));
			if (PlayerView && PlayerView.style.display !== "block" && appDataStore.currentSongUid !== "") {
				document
					.getElementById("PlayerView")
					?.animate(
						[
							{ transform: "translateX(75vw)" },
							{ transform: `translateX(0)` }
						],
						{
							duration: 1000,
							easing: "ease-in-out",
							fill: "forwards"
						}
					);
				if (PlayerView) PlayerView.style.display = "block";
			}
		});

		if (UploadSongView && UploadSongView.style.display !== "none") {
			UploadSongView.animate(
				[
					{ transform: "translateX(0)" },
					{ transform: `translateX(75vw)` }
				],
				{
					duration: 1000,
					easing: "ease-in-out",
					fill: "forwards"
				}
			);
			setTimeout(() => {
				if (UploadSongView) UploadSongView.style.display = "none";
			}, 1000);
		}
	}

	async function loadSongUpload() {
		const UploadSongView = document.getElementById("UploadSongView");
		const PlayerView = document.getElementById("PlayerView");
		const Panel = document.getElementById("panel");

		if (window.innerWidth < 1195) {
			if (Panel) Panel.style.display = "none";
		}

		if (UploadSongView && UploadSongView.style.display !== "block") {
			UploadSongView.style.display = "block";
			document
				.getElementById("UploadSongView")
				?.animate(
					[
						{ transform: "translateX(75vw)" },
						{ transform: `translateX(0)` }
					],
					{
						duration: 1000,
						easing: "ease-in-out",
						fill: "forwards"
					}
				);
			if (UploadSongView) UploadSongView.style.display = "flex";
		}

		if (PlayerView && PlayerView.style.display !== "none") {
			PlayerView.animate(
				[
					{ transform: "translateX(0)" },
					{ transform: `translateX(75vw)` }
				],
				{
					duration: 1000,
					easing: "ease-in-out",
					fill: "forwards"
				}
			);
			setTimeout(() => {
				if (PlayerView) PlayerView.style.display = "none";
			}, 1000);
		}
	}

	async function moveOutPlayer() {
		const PlayerView = document.getElementById("PlayerView");

		if (PlayerView && PlayerView.style.display !== "none") {
			PlayerView.animate(
				[
					{ transform: "translateX(0)" },
					{ transform: `translateX(75vw)` }
				],
				{
					duration: 1000,
					easing: "ease-in-out",
					fill: "forwards"
				}
			);
			setTimeout(() => {
				if (PlayerView) PlayerView.style.display = "none";
			}, 1000);
		}
	}
</script>

{#if authenticated}
	<Profile
		pfp={appDataStore.userInfo?.photoURL ?? "user.jpg"}
		action={() => {
			window.location.href = "/settings";
		}}
	/>
	<div id="panel">
		<h1>Hallo {appDataStore.userInfo?.displayName}</h1>
		<p>
			{!appDataStore.userInfo && appDataStore.isAdmin != undefined
				? "Je nummers worden geladen..."
				: (appDataStore.userData?.songs ?? []).length === 0
				? appDataStore.isAdmin
					? "Je hebt nog geen nummers geüpload. Upload er een om te beginnen! 🎵"
					: "We hebben geen nummers voor je 😭"
				: "Je nummers staan al voor je klaar:"}
		</p>

		<div id="items">
			{#if !appDataStore.isAdmin && appDataStore.userData}
				{#each appDataStore.userData.songs as songId}
					<SongItem
						songId={songId}
						action={async () => {
							loadSong(songId);
						}}
					/>
				{/each}
			{:else if appDataStore.userData}
				{#await getAllSongs() then songs}
					{#if songs}
						{#each songs as song}
							<SongItem
								song={song.data}
								songId={song.uid}
								action={async () => {
									loadSong(song.uid);
								}}
							/>
						{/each}
					{/if}
				{/await}
				{#if appDataStore.isAdmin}
					<SongItem
						action={async () => {
							loadSongUpload();
						}}
						songId="addSong"
						newSong={true}
					/>
				{/if}
			{/if}
		</div>
	</div>
	<Player bind:song={loadedSong} />
	<UploadMenu />

	<div id="rotateRequest">
		<div id="phone" />
		<div id="message">Draai je telefoon om de boomplayer te gebruiken</div>
	</div>

	{#key appDataStore.currentSongUid}
		{#if appDataStore.currentSongUid === ""}
			<Signout />
		{:else}
			<div id="back" on:click={() => {
				moveOutPlayer();
				appDataStore.currentSongUid = "";
				dispatchEvent(new CustomEvent("HideLoader"));
			}}>
				<img src="/back.png" alt="back" />
			</div>
		{/if}
	{/key}
	<Loader showLoader={false}/>
{/if}

<style lang="scss">
	#back {
		position: absolute;
		top: 0;
		right: 0;
		margin-right: 4.85vw;
		margin-top: 4.85vh;
		z-index: 101;

		img {
			height: 8vh;
			cursor: pointer;
		}
	}
</style>
