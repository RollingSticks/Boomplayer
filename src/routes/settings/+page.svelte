<script lang="ts">
	import "./styling.scss";

	import Profile from "$lib/components/Profile.svelte";

	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";
	import { uploadPFP, changeDisplayName } from "$lib/scripts/auth";
	import { onAuthStateChanged } from "firebase/auth";

	let AuthDataStore: AuthStore;
	let firebaseControlStore: FirebaseStore;

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	let pfp = "";

	function showPreview(event) {
		if (event.target.files.length > 0) {
			AuthDataStore.newProfilePicture = URL.createObjectURL(
				event.target.files[0]
			);

			uploadMessage = "Instellen als profiel foto";
		}
	}

	async function setPFP() {
		const file = await fetch(AuthDataStore.newProfilePicture).then((r) =>
			r.blob()
		);
		uploadPFP(new File([file], "pfp.jpg", { type: file.type }));
	}

	let uploadMessage = "Upload Profiel Foto";

	onMount(() => {
		firebaseControlStore.auth.onAuthStateChanged((user) => {
			if (user) {
				pfp = user?.photoURL || "user.jpg";
			} else {
				window.location.href = "/login";
			}
		});

		addEventListener("updatingPFP", (e) => {
			uploadMessage = (e.detail ?? { message: uploadMessage }).message;

			if (uploadMessage == "klaar!") {
				setTimeout(() => {
					uploadMessage = "Upload Profiel Foto";
					AuthDataStore.newProfilePicture = "";
				}, 2000);
			}
		});

		addEventListener("error", () => {
			uploadMessage = "Er ging iets mis, probeer het opnieuw";
		});

		onAuthStateChanged(firebaseControlStore.auth, (user) => {
			if (user) {
				AuthDataStore.newUserDisplayName =
					user.displayName ??
					firebaseControlStore.auth.currentUser?.displayName ??
					AuthDataStore.newUserDisplayName;
			} else {
				window.location.href = "/login";
			}
		});
	});
</script>

<div id="settings">
	{#if pfp !== ""}
		<Profile
			pfp={pfp}
			icon="note.svg"
			action={() => {
				window.location.href = "/home";
			}}
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
			{#if uploadMessage == "Upload Profiel Foto"}
				<label for="pfpinput">{uploadMessage}</label>
				<input
					type="file"
					id="pfpinput"
					accept="image/*"
					on:change={showPreview}
				/>
			{:else if uploadMessage == "Instellen als profiel foto"}
				<label for="pfpinput">{uploadMessage}</label>
				<input type="button" id="pfpinput" on:click={setPFP} />
				<div id="retryButton">
					<label for="retrypfpinput">Andere foto uploaden</label>
					<input
						type="file"
						id="retrypfpinput"
						accept="image/*"
						on:change={showPreview}
					/>
				</div>
			{:else}
				<p id="uploadMessage">{uploadMessage}</p>
			{/if}
		</div>
		<br />
		<input
			type="text"
			id="newDisplayNameInput"
			placeholder="Naam"
			bind:value={AuthDataStore.newUserDisplayName}
		/>
		<br />
		<button
			id="newDisplayNameButton"
			value="Naam wijzigen"
			on:click={() => {
				if (
					AuthDataStore.newUserDisplayName !=
					firebaseControlStore.auth.currentUser?.displayName
				)
					changeDisplayName();
			}}>Naam wijzigen</button
		>
	{/if}
</div>
