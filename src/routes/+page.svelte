<script lang="ts">
	import "./styling.scss";

	import { onMount } from "svelte";
	import firebaseControl from "$lib/stores/firebaseControl";
	import type { FirebaseStore } from "$lib/scripts/interfaces";

	let firebaseControlStore: FirebaseStore;

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	onMount(() => {
		firebaseControlStore.auth.onAuthStateChanged((user) => {
			if (user) {
				window.location.href = "/home";
			} else {
				window.location.href = "/login";
			}
		});
	});
</script>

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
