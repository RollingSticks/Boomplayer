<script lang="ts">
	import type { Score } from "$lib/scripts/interfaces";
	import { onMount } from "svelte";

	export let song = {} as Score;

	onMount(() => {
		const player = document.getElementById("Player");
		if (player)
			player.style.gridTemplateColumns = `repeat(${song.parts}, 1fr);`;
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
	<div
		id="Player"
		style="grid-template-columns: repeat({(song.notes ?? []).length}, 1fr);"
	>
		{#each song.notes ?? [] as note}
			<div
				class="Boomwhacker"
				id={noteColor[note]}
				style="background-color: #{noteColor[note]};"
			/>
		{/each}
	</div>
	<div id="SongInfo">
		<h1>{song.title}</h1>
		<p>{song.description}</p>
	</div>
</div>

<style lang="scss">
	#PlayerView {
		z-index: 0;
		position: absolute;
		display: flex;
		--work-sans: "Work Sans", sans-serif;

		font-family: var(--work-sans);

		right: 0;
		top: 0;

		width: calc(100% - 450px);
		height: 100%;
		opacity: 0;
	}
	#Player {
		padding-left: 25%;
		padding-right: 25%;
		border-radius: 5%;
		position: absolute;
		display: flex;

		width: calc(100% - 100px);
		top: 15%;
		right: 50px;
		height: 65%;
		display: grid;
		grid-gap: 8px;
		align-items: stretch;
		border: 1px solid black;

		.Boomwhacker {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: center;
			opacity: 0.4;
		}

		#SongInfo {
			position: absolute;

			top: 80%;
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
	}
</style>
