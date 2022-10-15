<script lang="ts">
	import "./styling.scss";

	import type { AuthStore } from "$lib/scripts/interfaces";
	import { signUp, signinWithGoogle } from "$lib/scripts/auth";
	import authData from "$lib/stores/authData";

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
		<label for="PasswordInput">Password</label>
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
		<button
			id="SigninButton"
			on:click={() => {
				signUp();
				loading = true;
			}}
		>
			{#if !loading}<div id="loginText">Aanmelden</div>
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
