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

	onMount(async () => {
		firebaseControlStore.auth.onAuthStateChanged((user) => {
			if (user) {
				pfp = user?.photoURL || "user.jpg";
				greeting = user
					? `Hallo ${user.displayName ?? user.email?.split("@")[0]}`
					: "Welkom terug!";
			} else {
				window.location.href = "/login";
			}
		});

		addEventListener("error", (error) => {
			if (error.error.message === "Nummer bestaat niet meer") {
				if (userInfo) userInfo.songs = (userInfo.songs ?? []).filter((song) => {
					return song !== error.error.songUid;
				});
			}
		});

		addEventListener("resize", (event) => {
			const Panel = document.getElementById("panel");
			const PlayerView = document.getElementById("PlayerView");

			if (window.innerWidth < 1195 && loadedSongId !== "" || window.innerWidth < 501) {
				Panel.style.display = "none";
			} else {
				Panel.style.display = "block";
			}
		});
	});

	async function loadSong(id: string) {
		const PlayerView = document.getElementById("PlayerView");
		const Panel = document.getElementById("panel");

		if (window.innerWidth < 1195) {
			if(Panel) Panel.style.opacity = "0";
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
				console.log(loadedSong);
			}
		);

		if (PlayerView && PlayerView.style.opacity !== "1") {
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
			if (PlayerView) PlayerView.style.opacity = "1";
		}
	}

	async function loadInSongs() {
		userInfo = await getUserInfo()
		
		const firestore = import("firebase/firestore");

		if (songsSnapshot) songsSnapshot();
		songsSnapshot = (await firestore).onSnapshot(
			(await firestore).doc(
				firebaseControlStore.firestore,
				`users/${firebaseControlStore.auth.currentUser?.uid}`
			),
			(doc) => {
				userInfo = doc.data() ?? {songs: []};
			}
		);
	}

	loadInSongs();
</script>

{#if greeting}
	<Profile pfp={pfp} action={() => {window.location.href = "/settings"}} />
	<div id="panel">
		<h1>{greeting}</h1>
		<p>{!userInfo ? "Je nummers worden geladen..." : ((userInfo?.songs ?? []).length === 0 ? "We hebben geen nummers voor je 😭" : "Je nummers staan al voor je klaar:")}</p>

		<div id="items">
			{#if userInfo}
				{#each userInfo.songs ?? [] as songId}
					<SongItem
						songId={songId}
						action={async () => {
							loadSong(songId);
						}}
					/>
				{/each}
				{#await firebaseControlStore.auth.currentUser?.getIdTokenResult() then token}
					{#if token?.claims.admin}
						<SongItem newSong={true} />
					{/if}
				{/await}
			{/if}
		</div>
	</div>
	<Player bind:song={loadedSong} />

	<div id="rotateRequest">
		<div id="phone" />
		<div id="message">
			Draai je telefoon om de boomplayer te gebruiken
		</div>
	</div>
{/if}
