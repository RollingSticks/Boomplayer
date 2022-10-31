<script lang="ts">
	import "./styling.scss";

	import GoogleButton from "$lib/components/GoogleButton.svelte";
	import Sign from "$lib/components/Sign.svelte";
	import type {
		AppStore,
		AuthStore,
		FirebaseStore
	} from "$lib/scripts/interfaces";
	import {
		signUp,
		signinWithGoogle,
		Setup,
		getUserData
	} from "$lib/scripts/auth";
	import authData from "$lib/stores/authData";
	import DividerLine from "$lib/components/DividerLine.svelte";
	import type { DocumentData } from "firebase/firestore";
	import { onMount } from "svelte";
	import { onAuthStateChanged } from "firebase/auth";
	import firebaseControl from "$lib/stores/firebaseControl";
	import appData from "$lib/stores/appData";

	let AuthDataStore: AuthStore;
	let firebaseControlStore: FirebaseStore;
	let appDataStore: AppStore;

	appData.subscribe((data: AppStore) => {
		appDataStore = data;
	});

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let showPW = false;

	let loading = false;
	let userInfo: DocumentData | undefined;
	let continueSetup = false;
	let usingGoogle = false;

	let uploadMessage = "Upload Profiel Foto";

	function showPreview(event: any) {
		if (event?.target?.files?.length > 0) {
			AuthDataStore.newProfilePicture = URL.createObjectURL(
				event.target.files[0]
			);
		}
	}

	onMount(() => {
		addEventListener("updatingPFP", (e: any) => {
			uploadMessage = (e.detail ?? { message: uploadMessage }).message;

			if (uploadMessage == "klaar!") {
				setTimeout(() => {
					window.location.href = "/home";
				}, 1000);
			}
		});

		addEventListener("error", () => {
			uploadMessage = "Er ging iets mis, probeer het opnieuw";
			setTimeout(() => {
				uploadMessage = "Upload Profiel Foto";
			}, 1500);
		});

		addEventListener("continueSetup", () => {
			continueSetup = true;
		});
	});
</script>

<img class="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
<div class="signinField">
	{#if !continueSetup}
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
							?.setAttribute(
								"type",
								showPW ? "password" : "text"
							);
					}}
				/>
				<label for="showPassword">Wachtwoord tonen</label>
			</div>

			<Sign
				bind:loading
				content="Aanmelden"
				action={async () => {
					loading = true;
					userInfo = await signUp();
					continueSetup = true;
					loading = false;
				}}
			/>

			<DividerLine />

			<GoogleButton
				action={() => {
					usingGoogle = true;
					signinWithGoogle();
				}}
			/>
		</div>
	{:else if continueSetup && firebaseControlStore.auth.currentUser && !usingGoogle}
		<div class="setupAccount">
			<h1 id="title">Welkom binnen</h1>
			<p id="tagline">Hier kunt u uw account opzetten</p>
			<label for="EmailInput">Gebruikersnaam</label>
			<input
				data-np-uid="UsernameInput"
				id="UsernameInput"
				type="username"
				placeholder="Gebruikersnaam"
				autocomplete="on"
				bind:value={AuthDataStore.newUserDisplayName}
			/>

			<div id="pfpUpload">
				{#if AuthDataStore.newProfilePicture}
					<div class="preview">
						<img
							style="display: block"
							src={AuthDataStore.newProfilePicture}
							id="pfpPreview"
							alt="preview"
						/>
					</div>
				{/if}
				{#if uploadMessage == "Upload Profiel Foto" && !AuthDataStore.newProfilePicture}
					<label for="pfpinput">{uploadMessage}</label>
					<input
						type="file"
						id="pfpinput"
						accept="image/*"
						on:change={showPreview}
					/>
				{:else if AuthDataStore.newProfilePicture && !loading}
					<input
						type="file"
						id="retrypfpinput"
						accept="image/*"
						on:change={showPreview}
					/>
					<div id="retryButton">
						<label for="retrypfpinput">Andere foto uploaden</label>
					</div>
				{:else}
					<p id="uploadMessage">
						{uploadMessage != "Upload Profiel Foto"
							? uploadMessage
							: "Verwerken..."}
					</p>
				{/if}
			</div>

			<Sign
				bind:loading
				content="Account opzetten"
				action={async () => {
					loading = true;
					await Setup();
					loading = false;
				}}
			/>
		</div>
	{/if}
</div>
