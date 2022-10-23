<script lang="ts">
	import "./styling.scss";

	import Profile from "$lib/components/Profile.svelte";

	import type { AuthStore, FirebaseStore } from "$lib/scripts/interfaces";
	import authData from "$lib/stores/authData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import { onMount } from "svelte";
	import {
		uploadPFP,
		changeDisplayName,
		changeEmail
	} from "$lib/scripts/auth";
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
		pfp = AuthDataStore.newProfilePicture;
		updating = false;

		popupLoadingCheckmark();
		const file = await fetch(AuthDataStore.newProfilePicture).then((r) =>
			r.blob()
		);
		await uploadPFP(new File([file], "pfp.jpg", { type: file.type }));

		setTimeout(() => {
			updating = true;
			setTimeout(() => {
				popdownLoadingCheckmark();
			}, 1000);
		}, 100);
	}

	let uploadMessage = "Upload Profiel Foto";

	function popupLoadingCheckmark() {
		const loadingCheckMark = document.getElementById("loadingCheckMark");

		loadingCheckMark.style.display = "block";
		loadingCheckMark.animate(
			[
				{
					transform: "translateY(400px)"
				},
				{
					transform: "translateY(0px)"
				}
			],
			{
				duration: 1000,
				easing: "ease-in-out"
			}
		);
	}

	function popdownLoadingCheckmark() {
		const loadingCheckMark = document.getElementById("loadingCheckMark");
		loadingCheckMark.animate(
			[
				{
					transform: "translateY(0px)"
				},
				{
					transform: "translateY(400px)"
				}
			],
			{
				duration: 1000,
				easing: "ease-in-out"
			}
		);

		setTimeout(() => {
			loadingCheckMark.style.display = "none";
		}, 990);
	}

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
			const loadingCheckMark =
				document.getElementById("loadingCheckMark");
			loadingCheckMark.style.display = "none";
			if (uploadMessage != "Upload Profiel Foto")
				uploadMessage = "Er ging iets mis, probeer het opnieuw";
		});

		onAuthStateChanged(firebaseControlStore.auth, (user) => {
			if (user) {
				AuthDataStore.newUserDisplayName =
					user.displayName ??
					firebaseControlStore.auth.currentUser?.displayName ??
					AuthDataStore.newUserDisplayName;

				AuthDataStore.newUserEmail =
					user.email ??
					firebaseControlStore.auth.currentUser?.email ??
					AuthDataStore.userEmail;
			} else {
				window.location.href = "/login";
			}
		});
	});

	let updating = false;
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

		<div id="dails">
			<div id="changeDPname">
				<input
					type="text"
					id="newPropInput"
					placeholder="Naam"
					bind:value={AuthDataStore.newUserDisplayName}
				/>
				<br />
				<button
					id="newPropButton"
					on:click={async () => {
						if (
							AuthDataStore.newUserDisplayName !=
							firebaseControlStore.auth.currentUser?.displayName
						) {
							popupLoadingCheckmark();
							await changeDisplayName();

							setTimeout(() => {
								updating = true;
							}, 100);

							setTimeout(() => {
								popdownLoadingCheckmark();

								setTimeout(() => {
									updating = false;
								}, 1000);
							}, 900);
						}
					}}>Naam wijzigen</button
				>
			</div>
			<div id="changeEmail">
				<input
					type="text"
					id="newPropInput"
					placeholder="Naam"
					bind:value={AuthDataStore.newUserEmail}
				/>
				<br />
				<button
					id="newPropButton"
					on:click={async () => {
						if (
							AuthDataStore.newUserEmail !=
							firebaseControlStore.auth.currentUser?.email
						) {
							popupLoadingCheckmark();
							await changeEmail();

							setTimeout(() => {
								updating = true;
							}, 100);

							setTimeout(() => {
								popdownLoadingCheckmark();

								setTimeout(() => {
									updating = false;
								}, 1000);
							}, 900);
						}
					}}>Email wijzigen</button
				>
			</div>
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
		</div>
	{/if}
	<div id="loadingCheckMark">
		{#if !updating}
			<div class="circle-loader">
				<div class="checkmark draw" />
			</div>
		{:else}
			<div class="circle-loader load-complete">
				<div style="display: block" class="checkmark draw" />
			</div>
		{/if}
	</div>
</div>
