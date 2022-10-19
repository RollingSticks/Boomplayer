<script lang="ts">
	import "./styling.scss";

	import GoogleButton from "$lib/components/googleButton.svelte";
	import Sign from "$lib/components/sign.svelte";
	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { signIn, signinWithGoogle } from "$lib/scripts/auth";
	import DividerLine from "$lib/components/dividerLine.svelte";

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
		<label for="PasswordInput">Wachtwoord</label>
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

		<Sign
			bind:loading
			content="Inloggen"
			action={() => {
				signIn();
				loading = true;
			}}
		/>

		<DividerLine />

		<GoogleButton action={signinWithGoogle} />
	</div>
</div>
<div id="boomwhackers">
	{#each { length: 7 } as _}
		<img src="Boomwhackers.png" alt="Boomwhackers" />
	{/each}
</div>
