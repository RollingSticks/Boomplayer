<script lang="ts">
	import "./styling.scss";

	import GoogleButton from "$lib/components/GoogleButton.svelte";
	import Sign from "$lib/components/Sign.svelte";
	import type {
		AppStore,
		AuthStore,
		FirebaseStore
	} from "$lib/scripts/interfaces";
	import { signUp, signinWithGoogle } from "$lib/scripts/auth";
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

<div id="wrapper">
	<img id="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
	<div id="signInWrapper">
		<div id="signField">
			<h1 id="welcomeBack">Welkom</h1>
			<p id="tagline">Hier kunt u zich aanmelden</p>

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
						autocomplete="new-password"
						bind:value={AuthDataStore.userPassword}
						required
					/>
				</label>

				<div id="showPasswordWrapper">
					<label for="showPasswordCheckbox">
						<!-- svelte-ignore a11y-positive-tabindex -->
						<input
							tabindex="3"
							id="showPasswordCheckbox"
							type="checkbox"
							bind:checked={showPW}
							on:click={() => {
								document
									.getElementById("passwordInput")
									?.setAttribute(
										"type",
										showPW ? "password" : "text"
									);
							}}
						/>

						<h3 id="showPasswordLabel">Wachtwoord tonen</h3>
					</label>
				</div>

				<Sign
					bind:loading={loading}
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
	</div>

	<div id="boomwhackers">
		{#each { length: 7 } as _}
			<img src="Boomwhackers.png" alt="Boomwhackers" />
		{/each}
	</div>
</div>
