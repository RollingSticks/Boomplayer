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
		<h1>{song.title}</h1>
		<p>{song.description}</p>
	</div>
</div>

<style lang="scss">
	.Boomwhacker {
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

	#Player {
		border-radius: 25px;
		position: absolute;
		display: flex;

		width: calc(100% - 100px);
		top: 17%;
		right: 50px;
		height: 65%;
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
</style>
