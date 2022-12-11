<script lang="ts">
	import { upload, uploadScore } from "$lib/scripts/admin/upload";
	import type { Score, ScoreRaw } from "$lib/scripts/interfaces";
	import convert from "$lib/scripts/admin/converter";
	import { rawToScore } from "$lib/scripts/admin/scoreInfoFinder";
	import { onMount } from "svelte";

	function hoverOver() {
		const uploadField = document.getElementById("uploadField");
		if (uploadField) uploadField.style.borderStyle = "solid";
	}

	function hoverOut() {
		const uploadField = document.getElementById("uploadField");
		if (uploadField) uploadField.style.borderStyle = "dashed";
	}

	async function validateFiles(e: Event) {
		// @ts-ignore - For some reason this exists ¯\_(ツ)_/¯
		if ((e?.target?.value ?? "").match(/\.([^\.]+)$/)[1] === "mxl") {
			const uploadField = document.getElementById("uploadField");
			const infoField = document.getElementById("infoField");
			const controls = document.getElementById("controls");

			if (uploadField && infoField && controls) {
				uploadField.style.borderStyle = "solid";
				uploadField.style.borderColor = "green";

				uploadField.animate(
					[
						{ transform: "translateX(0px)" },
						{ transform: "translateX(100vw)" }
					],
					{
						duration: 700,
						iterations: 1
					}
				);

				setTimeout(() => {
					uploadField.style.display = "none";
				}, 690);

				infoField.animate(
					[
						{ transform: "translateX(100vw)" },
						{ transform: "translateX(0px)" }
					],
					{
						duration: 700,
						iterations: 1
					}
				);

				controls.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration: 500,
					iterations: 1
				});

				infoField.style.display = "block";
				controls.style.display = "block";
			}

			if (files)
				score = rawToScore(
					(await convert(files[0])) ?? ({} as ScoreRaw)
				);
			else console.log("lol :)");

			title = score.title;
			author = score.author || "";
			description = score.description || "";
		} else {
			files = undefined;
			dispatchEvent(
				new ErrorEvent("error", {
					error: { message: "Dit bestand word niet ondersteund" }
				})
			);
		}
	}

	onMount(() => {
		addEventListener("ClearSongUpload", () => {
			files = undefined;
			color = colors[Math.floor(Math.random() * colors.length)];
			title = "";
			description = "";
			author = "";
			score = {} as Score;
		})
	})

	let files: FileList | undefined;

	const colors = [
		"#ff0000",
		"#ffc000",
		"#ffff00",
		"#66ff33",
		"#339966",
		"#00afef",
		"#ff00ff"
	];

	let score: Score;

	let color = colors[Math.floor(Math.random() * colors.length)];
	let title = "";
	let description = "";
	let author = "";
</script>

<div id="UploadSongView">
	<div id="uploadField" on:dragover={hoverOver} on:dragleave={hoverOut}>
		<input
			type="file"
			id="fileUploadInput"
			accept=".mxl"
			bind:files
			on:change={validateFiles}
		/>

		<div id="uploadText">
			{#if files && files.length > 0}
				<h1>{files[0].name}</h1>
				<p>{files[0].name} zal worden geupload</p>
			{:else}
				<h1>Upload een score</h1>
				<p>
					Drag en drop jouw score of klik hier om een score te
					selecteren
				</p>
			{/if}
		</div>
	</div>
	<div id="infoField">
		<div id="TopInfo">
			<div id="TitleInputField">
				<label id="TitleLabel" for="TitleInput">Title</label>
				<input
					id="TitleInput"
					type="text"
					bind:value={title}
					placeholder="Titel"
				/>
			</div>

			<div id="AuthorInputField">
				<label id="AuthorLabel" for="AuthorInput">Auteur</label>
				<input
					id="AuthorInput"
					type="text"
					bind:value={author}
					placeholder="Artiest"
				/>
			</div>
		</div>

		<div id="DescriptionInputField">
			<label for="DescriptionInput" style="display: block;"
				>Beschrijving</label
			>
			<textarea
				id="DescriptionInput"
				type="text"
				bind:value={description}
				placeholder="Beschrijf hier uw nummer"
			/>
		</div>
		<input type="color" id="colorPicker" bind:value={color} />
	</div>
	<div id="controls">
		<button
			id="uploadButton"
			on:click={() => {
				score.title = title;
				score.author = author;
				score.description = description;
				score.color = color;
				uploadScore(score);
			}}>Opslaan</button
		>
	</div>
</div>

<style lang="scss">
	#UploadSongView {
		display: none;

		#uploadText {
			text-align: center;
			width: 100%;
			margin: auto;
		}
	}

	#uploadField {
		position: absolute;
		display: flex;

		width: calc(100% - 100px);
		top: 17%;
		right: 50px;
		height: 65%;
		border: 2px solid black;
		border-radius: 5%;
		border-style: dashed;

		min-width: 250px;

		h1 {
			margin: auto;
			margin-bottom: 10px;
		}

		#fileUploadInput {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 100%;
			opacity: 0;
			cursor: pointer;
			input {
				width: 0px;
				height: 100%;
			}
		}
	}

	#infoField {
		display: none;
		position: absolute;

		top: 17%;
		line-height: 30px;
		width: calc(100% - 9.5vw);
		margin-left: 4.85vw;
		font-family: "Work Sans", sans-serif;

		#TopInfo {
			width: 100%;
			display: flex;
		}

		#TitleInputField,
		#AuthorInputField {
			width: 50%;

			label {
				display: block;
				font-size: 24px;
				font-weight: 600;
			}

			#TitleInput,
			#AuthorInput {
				width: 90%;
				height: 15px;
				padding: 10px;
				margin-right: -10%;
				border-radius: 10px;
				border: 1px solid black;
			}

			#AuthorLabel {
				margin-left: 10%;
			}

			#AuthorInput {
				margin-left: 10%;
			}
		}

		#DescriptionInputField {
			margin-top: 20px;
			width: 100%;

			#DescriptionInput {
				width: 100%;
				height: 10vh;
				max-height: 35vh;
				min-height: 15px;
				resize: vertical;
				border-radius: 10px;
				border: 1px solid black;
				padding: 10px;
			}

			label {
				display: block;
				font-size: 24px;
				font-weight: 600;
			}
		}

		#colorPicker {
			display: block;
			width: 100px;
			height: 100px;
		}
	}

	#controls {
		display: none;
	}

	#uploadButton {
		position: absolute;
		width: 150px;
		height: 50px;
		border-radius: 10px;
		border: 1px solid black;
		font-size: 20px;
		font-weight: 600;
		background-color: #00afef;
		color: white;
		cursor: pointer;
		bottom: 50px;
		right: 4.85vw;
	}
</style>
