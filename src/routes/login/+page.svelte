<script lang="ts">
	import "./styling.scss";

	import GoogleButton from "$lib/components/GoogleButton.svelte";
	import Sign from "$lib/components/Sign.svelte";
	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { signIn, signinWithGoogle } from "$lib/scripts/auth";
	import DividerLine from "$lib/components/DividerLine.svelte";

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

<img id="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
<div id="signField">
	<h1 id="welcomeBack">Welkom terug</h1>
	<p id="tagline">Voer hier uw login informatie in.</p>

	<div id="signinForm">
		<label for="emailInput">
			<h3 id="emailLabel">Email</h3>

			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				tabindex="1"
				data-np-uid="emailInput"
				id="emailInput"
				type="email"
				placeholder="Email"
				autocomplete="on"
				bind:value={AuthDataStore.userEmail}
				required
			/>
		</label>


		<label for="passwordInput">
			<h3 id="passwordLabel">Wachtwoord</h3>

			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				tabindex="2"
				data-np-uid="passwordInput"
				id="passwordInput"
				type="password"
				placeholder="Wachtwoord"
				autocomplete="current-password"
				bind:value={AuthDataStore.userPassword}
				required
			/>
		</label>

		<label for="showPasswordCheckbox">
			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				tabindex="3"
				id="showPasswordCheckbox"
				type="checkbox"
				bind:checked={showPW}
				on:click={() => {document.getElementById("passwordInput")?.setAttribute("type", showPW ? "password" : "text")}}
			/>
			<h3 id="showPasswordLabel">Wachtwoord tonen</h3>
		</label>

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
