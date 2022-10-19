<script lang="ts">
	import "./styling.scss";

	import GoogleButton from "$lib/components/googleButton.svelte";
	import Sign from "$lib/components/Sign.svelte";
	import type { AuthStore } from "$lib/scripts/interfaces";
	import { signUp, signinWithGoogle } from "$lib/scripts/auth";
	import authData from "$lib/stores/authData";
	import DividerLine from "$lib/components/DividerLine.svelte";

	let AuthDataStore: AuthStore;

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	let showPW = false;

	let loading = false;
</script>

<img class="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
<div class="signinField">
	<div class="signinFieldContainer">
		<h1 id="title">Welkom</h1>
		<p id="tagline">Hier kunt u zich aanmelden.</p>
		<label for="EmailInput">Email</label>
		<input
			data-np-uid="EmailInput"
			id="EmailInput"
			type="email"
			placeholder="Email"
			autocomplete="on"
			bind:value={AuthDataStore.userEmail}
		/>
		<label for="PasswordInput">Wachtwoord</label>
		<input
			data-np-uid="PasswordInput"
			id="PasswordInput"
			type="password"
			placeholder="Wachtwoord"
			autocomplete="new-password"
			bind:value={AuthDataStore.userPassword}
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
			content="Aanmelden"
			action={() => {
				signUp();
				loading = true;
			}}
		/>

		<DividerLine />

		<GoogleButton action={signinWithGoogle} />
	</div>
</div>
