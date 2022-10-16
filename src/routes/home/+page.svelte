<script lang="ts">
	import SongItem from "$lib/components/SongItem.svelte";
	import "./styling.scss";

	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";

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

	onMount(() => {
		firebaseControlStore.auth.onAuthStateChanged((user) => {
			pfp = user?.photoURL || "user.jpg";
			greeting = user
				? `Hallo ${user.displayName ?? user.email?.split("@")[0]}`
				: "Welkom terug!";
		});
	});
</script>

{#if greeting}
	<div id="panel">
		<img id="profilePicture" src={pfp} alt="profilePicture" />
		<h1>{greeting}</h1>
		<p>Je nummers staan al voor je klaar:</p>

		<div id="items">
			<SongItem />
			<SongItem />
			<SongItem />
			<SongItem />
			<SongItem />
		</div>
	</div>
	<div id="player" />
{/if}
