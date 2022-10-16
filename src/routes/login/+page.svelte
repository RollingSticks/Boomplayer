<script lang="ts">
	import "./styling.scss";

	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { signIn, signinWithGoogle } from "$lib/scripts/auth";
	import { onMount } from "svelte";

	let AuthDataStore: AuthStore;
	let firebaseControlStore: FirebaseStore;

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let showPW = false;

	let loading = false;

	let screenX = 0;

	onMount(() => {
		screenX = -window.screenX;
	});
</script>

<img class="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
<div class="signinField">
	<div class="signinFieldContainer">
		<h1 id="title">Welkom terug</h1>
		<p id="tagline">Voer hier uw login informatie in.</p>
		<label for="EmailInput">Email</label>
		<input
			data-np-uid="EmailInput"
			id="EmailInput"
			type="email"
			placeholder="Email"
			autocomplete="on"
			bind:value={AuthDataStore.userEmail}
			required
		/>
		<label for="PasswordInput">Password</label>
		<input
			data-np-uid="PasswordInput"
			id="PasswordInput"
			type="password"
			placeholder="Wachtwoord"
			autocomplete="current-password"
			bind:value={AuthDataStore.userPassword}
			required
		/>
		<div id="showPasswordContainer">
			<input
				id="showPassword"
				type="checkbox"
				bind:checked={showPW}
				on:click={() => {
					document
						.getElementById("PasswordInput")
						?.setAttribute("type", showPW ? "password" : "text");
				}}
			/>
			<label for="showPassword">Wachtwoord tonen</label>
		</div>
		<button
			id="SigninButton"
			on:click={() => {
				signIn();
				loading = true;
			}}
		>
			{#if !loading}<div id="loginText">Inloggen</div>
			{:else}<div id="loginLoad">
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
		</button>

		<div class="dividerLineContainer">
			<div class="dividerLine" />
			<p>of</p>
			<div class="dividerLine" />
		</div>

		<img
			on:click={signinWithGoogle}
			src="./ContineWithGoogle.png"
			alt="doorgaan met google"
			id="SigninWithGoogle"
		/>
	</div>
</div>
<div id="boomwhackers">
	{#each { length: 7 } as _}
		<img src="Boomwhackers.png" alt="Boomwhackers" />
	{/each}
</div>
