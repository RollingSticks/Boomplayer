<script lang="ts">
	import "./styling.scss";

	import type {
		AuthStore,
		FirebaseStore,
		Score
	} from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";
	import Profile from "$lib/components/Profile.svelte";
	import Player from "$lib/components/Player.svelte";
	import SongItem from "$lib/components/SongItem.svelte";
	import type { DocumentData, Unsubscribe } from "firebase/firestore";
	import { getUserInfo } from "$lib/scripts/auth";
	import UploadMenu from "$lib/components/UploadMenu.svelte";
	import { getAllSongs } from "$lib/scripts/admin/boomManager";

	let AuthDataStore: AuthStore;
	let firebaseControlStore: FirebaseStore;

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let greeting = "";
	let pfp = "user.jpg";

	let loadedSong: Score | undefined = {} as Score;
	let loadedSongId = "";

	let loadedSongSnapshot: undefined | Unsubscribe;
	let songsSnapshot: undefined | Unsubscribe;

	let userInfo: DocumentData | undefined;

	let isAdmin: boolean;

	onMount(async () => {
		firebaseControlStore.auth.onAuthStateChanged(async (user) => {
			if (user) {
				pfp = user?.photoURL || "user.jpg";
				isAdmin = (await firebaseControlStore.auth.currentUser.getIdTokenResult()).claims.admin
				greeting = user
					? `Hallo ${user.displayName ?? user.email?.split("@")[0]}`
					: "Welkom terug!";
			} else {
				window.location.href = "/login";
			}
		});

		addEventListener("error", (error) => {
			if (error.error.message === "Nummer bestaat niet meer") {
				if (userInfo)
					userInfo.songs = (userInfo.songs ?? []).filter((song) => {
						return song !== error.error.songUid;
					});
			}
		});

		addEventListener("resize", (event) => {
			const Panel = document.getElementById("panel");
			const UploadSongView = document.getElementById("UploadSongView");

			if (
				(window.innerWidth < 1195 && (UploadSongView?.style.display == "flex" || (loadedSongId !== ""))) || window.innerWidth < 501
			) {
				Panel.style.display = "none";
			} else {
				Panel.style.display = "block";

			}
		});
	});

	async function loadSong(id: string) {
		const PlayerView = document.getElementById("PlayerView");
		const UploadSongView = document.getElementById("UploadSongView");
		const Panel = document.getElementById("panel");

		if (window.innerWidth < 1195) {
			if (Panel) Panel.style.display = "none";
		}

		loadedSongId = id;

		const firestore = await import("firebase/firestore");

		if (loadedSongSnapshot) loadedSongSnapshot();
		loadedSongSnapshot = firestore.onSnapshot(
			firestore.doc(
				firebaseControlStore.firestore,
				`songs/${loadedSongId}`
			),
			(doc) => {
				loadedSong = doc.data()?.data;
			}
		);

		if (PlayerView && PlayerView.style.display !== "block") {
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

	async function loadInSongs() {
		userInfo = await getUserInfo();

		const firestore = import("firebase/firestore");

		if (songsSnapshot) songsSnapshot();
		songsSnapshot = (await firestore).onSnapshot(
			(await firestore).doc(
				firebaseControlStore.firestore,
				`users/${firebaseControlStore.auth.currentUser?.uid}`
			),
			(doc) => {
				userInfo = doc.data() ?? { songs: [] };
			}
		);
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

	loadInSongs();
</script>

{#if greeting}
	<Profile
		pfp={pfp}
		action={() => {
			window.location.href = "/settings";
		}}
	/>
	<div id="panel">
		<h1>{greeting}</h1>
		<p>
			{!userInfo && isAdmin != undefined
				? "Je nummers worden geladen..."
				: (userInfo?.songs ?? []).length === 0
				? (isAdmin ? "Je hebt nog geen nummers geüpload. Upload er een om te beginnen! 🎵" : "We hebben geen nummers voor je 😭")
				: "Je nummers staan al voor je klaar:"}
		</p>

		<div id="items">
			{#if userInfo}
				{#if !isAdmin}
					{#each userInfo.songs ?? [] as songId}
						<SongItem
							songId={songId}
							action={async () => {
								loadSong(songId);
							}}
						/>
					{/each}
				{:else}
				{#await getAllSongs() then songs}
					{#each songs as song}
						<SongItem
							song={song.data}
							songId={song.uid}
							action={async () => {
								loadSong(song.uid);
							}}
						/>
					{/each}
				{/await}
					{#if isAdmin}
						<SongItem action={async ()=> {loadSongUpload()}} songId="addSong" newSong={true} />
					{/if}
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
{/if}
