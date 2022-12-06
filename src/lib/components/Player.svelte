<script lang="ts">
	import { addSong, getUsers, removeSong } from "$lib/scripts/admin/boomManager";
	import type {
		Score,
		PlayerStore,
		FirebaseStore,
		AppStore
	} from "$lib/scripts/interfaces";
	import { play, pause } from "$lib/scripts/player";
	import appData from "$lib/stores/appData";
	import firebaseControl from "$lib/stores/firebaseControl";
	import playerControl from "$lib/stores/playerControl";
	import { getDownloadURL, ref } from "firebase/storage";
	import { onMount } from "svelte";

	let playerControlStore: PlayerStore;
	let appDataStore: AppStore;
	let firebaseControlStore: FirebaseStore;

	playerControl.subscribe((data) => {
		playerControlStore = data;
	});

	appData.subscribe((data) => {
		appDataStore = data;
	});

	firebaseControl.subscribe((data) => {
		firebaseControlStore = data;
	});

	export let song = {} as Score;

	let inUserManagementPanel = false;

	onMount(() => {
		const player = document.getElementById("Player");
		if (player)
			player.style.gridTemplateColumns = `repeat(${song.parts}, 1fr);`;

		addEventListener("keydown", (e) => {
			if (e.key === " ") {
				e.preventDefault();
				playerControlStore.playing ? pause() : play();
			} else if (e.key === "Escape" && inUserManagementPanel && !document.getElementById('addUserForm').contains(e.target)) {
				const addUserForm = document.getElementById("addUserForm");
				if (addUserForm) addUserForm.style.display = "none";
				inUserManagementPanel = false;
			}
		});

		addEventListener('click', function(e){   
			if (inUserManagementPanel && !document.getElementById('addUserForm').contains(e.target)){
				const addUserForm = document.getElementById("addUserForm");
				if (addUserForm) addUserForm.style.display = "none";
				inUserManagementPanel = false;
			}
		});

		const noteNames = [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"AisBes",
			"CisBes",
			"DisEs",
			"FisGes",
			"GisAs"
		];

		noteNames.forEach((notename) => {
			getDownloadURL(
				ref(firebaseControlStore.storage, `sounds/${notename}.webm`)
			).then(async (data) => {
				// const url = URL.createObjectURL(data);
				const audio = new Audio(data);
				audio.preload = "auto";
				audio.load();
				playerControlStore.notes[notename] = audio;
			});
		});
	});

	const noteColor: { [key: string]: string } = {
		C: "ff0000",
		D: "ffc000",
		E: "ffff00",
		F: "66ff33",
		G: "339966",
		A: "00afef",
		B: "ff00ff"
	};
</script>

<div id="PlayerView">
	<div id="Player">
		<div
			id="boomwhackers"
			style="grid-template-columns: repeat({(song.notes ?? [])
				.length}, 1fr);"
		>
			{#each song.notes ?? [] as note}
				<div
					class="Boomwhacker"
					id={noteColor[note]}
					style="filter: drop-shadow(0px 0px 0px #{noteColor[note]});"
				>
					<div
						id="road"
						style="background-color: #{noteColor[note]};"
					/>
					<svg
						viewBox="0 0 217 187"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g filter="url(#filter0_d_62_22)">
							<path
								d="M4 74.3916H213V307H4V74.3916Z"
								fill="#{noteColor[note]}"
							/>
							<ellipse
								cx="108.5"
								cy="74.4142"
								rx="104.5"
								ry="68.4142"
								fill="#{noteColor[note]}"
							/>
							<ellipse
								cx="108.5"
								cy="74.4142"
								rx="104.5"
								ry="68.4142"
								fill="black"
								fill-opacity="0.3"
							/>
						</g>
						<defs>
							<filter
								id="filter0_d_62_22"
								x="0"
								y="0"
								width="217"
								height="309"
								filterUnits="userSpaceOnUse"
								color-interpolation-filters="sRGB"
							>
								<feFlood
									flood-opacity="0"
									result="BackgroundImageFix"
								/>
								<feColorMatrix
									in="SourceAlpha"
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="-2" />
								<feGaussianBlur stdDeviation="2" />
								<feComposite in2="hardAlpha" operator="out" />
								<feColorMatrix
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
								/>
								<feBlend
									mode="normal"
									in2="BackgroundImageFix"
									result="effect1_dropShadow_62_22"
								/>
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_62_22"
									result="shape"
								/>
							</filter>
						</defs>
					</svg>
				</div>
			{/each}
		</div>
	</div>
	<div id="SongInfo">
		<h1>{song.title ?? "Onbekend"}</h1>
		<p>{song.description ?? "Onbekend"}</p>
	</div>

	{#if appDataStore.isAdmin}
		<img on:click={() => {
			if (!inUserManagementPanel) {
				const addUserForm = document.getElementById("addUserForm");
				if (addUserForm) addUserForm.style.display = "flex";
				setTimeout(() => {
					inUserManagementPanel = true;
				}, 50)
			}
		}} src="/addUser.png" alt="addUser" id="addUser" />
	{/if}
</div>

{#if playerControlStore.score && appDataStore.isAdmin}
	<div id="addUserForm">
		<div id="header">
			<h1>Leerling management</h1>
			<p>Hier kunt u leerlingen toevoegen en verwijderen</p>

			<div id="studentList">
				{#await getUsers()}
					<p>Gegevens ophalen...</p>
				{:then students} 
					{#each students as student}
						<div class='card'>
							<img src={student.pfp ?? "/user.jpg"} alt="user">
							<h2>{student.displayName}</h2>
							<input on:change={(e) => e.target.checked ? addSong(student.uid, appDataStore.currentSongUid) : removeSong(student.uid, appDataStore.currentSongUid)} checked={student.songs.includes(appDataStore.currentSongUid)} type="checkbox" name="Access" id="UserAccess">
						</div>
					{/each}
				{/await}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.Boomwhacker {
		overflow: hidden;
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		filter: none;

		#road {
			width: 100%;
			height: 100%;
			opacity: 0.4;
		}
	}

	#addUserForm {
		background-color: #f2f2f2;
		font-family: "Work Sans", sans-serif;
		display: none;
		position: absolute;
		top: 10%;
		left: 30%;
		width: 35%;
		height: 70%;
		z-index: 102;
		min-width: 15rem;
		border-radius: 15px;

		#header {
			width: 100%;
			height: 14vh;
			display: flex;
			flex-direction: column;
			margin-left: 1rem;
			margin-right: 1rem;
			margin-top: 1rem;
			margin-bottom: 1rem;
			min-width: 13rem;

			h1 {
				font-size: 2rem;
			}

			p {
				font-size: 1rem;
			}
		}

		#studentList {
			overflow-y: auto;
			margin-bottom: -54vh;
			border-radius: 15px;
			.card {
				position: relative;
				margin: 0.5em;
				padding: 0.5em 0.5em 0.5em 6em;
				border: 1px solid #eee;
				border-radius: 4px;
				box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
				height: 4em;
			}

			.card::after {
				clear: both;
				display: block;
			}

			img {
				position: absolute;
				top: 0.5em;
				left: 0.5em;
				width: 3em;
				height: 3em;
				border-radius: 50%;
			}

			h2 {
				margin: 0 0 0.5em 0;
				font-size: 16px;
			}

			p {
				margin: 0;
				font-size: 14px;
			}
		}
	}

	#addUser {
		position: absolute;
		bottom: 4vh;
		right: 4vh;
		width: 8vh;
		height: 8vh;
		cursor: pointer;
	}

	#Player {
		border-radius: 25px;
		position: absolute;
		display: flex;

		width: calc(100% - 100px);
		top: 17%;
		right: 50px;
		height: 65%;
		min-height: 400px;
		border: 1px solid black;

		#boomwhackers {
			margin-left: 5%;
			width: 90%;
			display: grid;
			grid-gap: 2.5%;
			align-items: stretch;
			position: relative;

			svg {
				width: 102.5%;
				position: absolute;
				bottom: 0px;
				opacity: 1;
				filter: none;
			}
		}
	}

	#SongInfo {
		position: absolute;

		top: 82.5%;
		margin-left: 48px;
		line-height: 30px;
		width: calc(100% - 98px);

		h1 {
			font-size: 40px;
			font-weight: 700;
			color: #101020;
			word-wrap: break-word;
		}

		p {
			font-size: 30px;
			font-weight: 500;
			color: #101020;
			word-wrap: break-word;
			margin-bottom: 10px;
		}
	}
</style>
