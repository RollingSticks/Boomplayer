<script lang="ts">
	import SongItem from "$lib/components/songItem.svelte";
	import "./styling.scss";

	import type {
		AuthStore,
		FirebaseStore,
		Score
	} from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";
	import Profile from "$lib/components/profile.svelte";
	import Player from "$lib/components/player.svelte";
	import { getSongs } from "$lib/scripts/downloadScore";
	import type { Unsubscribe } from "firebase/firestore";

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

	let loadedSongSnapshot: Unsubscribe = () => {
		console.log("First snapshot");
	};
	let songsSnapshot: Unsubscribe = () => {
		console.log("First snapshot");
	};

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
				songs = songs.filter((element) => {
					return element !== error.error.songUid;
				});
			}
		});
	});

	async function loadSong(id: string) {
		const PlayerView = document.getElementById("PlayerView");

		loadedSongId = id;

		const firestore = await import("firebase/firestore");
		loadedSongSnapshot();
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

		if (PlayerView)
			if (PlayerView.style.opacity !== "1") {
				document
					.getElementById("PlayerView")
					?.animate(
						[
							{ transform: "translateX(1000px)" },
							{ transform: `translateX(0)` }
						],
						{
							duration: 900,
							easing: "ease-in-out",
							fill: "forwards"
						}
					);
				if (PlayerView) PlayerView.style.opacity = "1";
			}
	}

	let songs: string[] = [];
	let songsLoaded = false;

	async function loadInSongs() {
		songs = await getSongs();
		const firestore = await import("firebase/firestore");

		songsSnapshot();
		songsSnapshot = firestore.onSnapshot(
			firestore.doc(
				firebaseControlStore.firestore,
				`users/${firebaseControlStore.auth.currentUser?.uid}`
			),
			(doc) => {
				songs = doc.data()?.songs;
			}
		);
		return songs;
	}

	loadInSongs().then(() => {
		songsLoaded = true;
	});
</script>

{#if greeting}
	<div id="panel">
		<Profile pfp={pfp} />
		<h1>{greeting}</h1>
		{#if songs.length !== 0}
			<p>Je nummers staan al voor je klaar:</p>
		{:else if songsLoaded}
			<p>We hebben geen nummers voor je 😭</p>
		{/if}

		<div id="items">
			{#each songs as songId}
				<SongItem
					songId={songId}
					action={async () => {
						loadSong(songId);
					}}
				/>
			{/each}
		</div>
	</div>
	<Player bind:song={loadedSong} />
{/if}
