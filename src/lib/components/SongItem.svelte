<script lang="ts">
	import { downloadScore } from "$lib/scripts/downloadScore";
	import type { Score } from "$lib/scripts/interfaces";
	import { load } from "$lib/scripts/player";

	export let action = () => {
		console.log("No action provided");
	};
	export let songId = "";
	export let newSong = false;

	export let song: Score | undefined = undefined;

	const itemID = songId ?? Math.random().toString(36).substring(5);

	const colors = [
		"#ff0000",
		"#ffc000",
		"#ffff00",
		"#66ff33",
		"#339966",
		"#00afef",
		"#ff00ff"
	];

	export let color =
		song?.color ?? colors[Math.floor(Math.random() * colors.length)];

	function notesToTime() {
		if (song?.parts) {
			const s_per_beat = 60 / song?.bpm;
			let duration = 0;
			(song?.parts[0].notes ?? []).forEach((note) => {
				duration = duration + note.duration;
			});

			const time = duration * s_per_beat;

			const minutes = Math.floor(duration / 60);
			const seconds = time - minutes * 60;

			const format = (string: number, pad: string, length: number) => {
				return (new Array(length).join(pad) + string).slice(-length);
			};

			return `${format(minutes, "0", 2)}:${format(
				Math.round(seconds),
				"0",
				2
			)}`;
		} else {
			return "00:00";
		}
	}

	// animation hell

	let animationRunning = false;
	let hovering = false;

	let lastClick = 0;
	let sequentialClicks = 0;

	function clickAnimate() {
		const now = Date.now();
		if (now - lastClick - 700 > -200) sequentialClicks++;
		else sequentialClicks = 0;

		lastClick = now;

		if (sequentialClicks > 9) {
			dispatchEvent(
				new CustomEvent("info", {
					detail: {
						message: "Genoeg basketball, tijd om te spelen!",
						title: "🏀"
					}
				})
			);
			sequentialClicks = -25;
		}

		if (!animationRunning) {
			animationRunning = true;
			document
				.getElementById(itemID)
				?.animate(
					[
						{ transform: `scale(${hovering ? "1.05" : "1"})` },
						{ transform: "scale(0.9)" }
					],
					{
						duration: 400,
						easing: "ease-in-out",
						fill: "forwards"
					}
				);

			setTimeout(() => {
				document
					.getElementById(itemID)
					?.animate(
						[
							{ transform: "scale(0.9)" },
							{ transform: `scale(${hovering ? "1.05" : "1"})` }
						],
						{
							duration: hovering ? 200 : 300,
							easing: "ease-in-out",
							fill: "forwards"
						}
					);
			}, 350);

			setTimeout(() => {
				animationRunning = false;
			}, 500);
		}
	}

	function hoverAnimate() {
		hovering = true;
		document
			.getElementById(itemID)
			?.animate(
				[{ transform: "scale(1)" }, { transform: "scale(1.05)" }],
				{
					duration: 200,
					easing: "ease-in-out",
					fill: "forwards"
				}
			);

		setTimeout(() => {
			animationRunning = false;
		}, 200);
	}

	function unhoverAnimate() {
		hovering = false;
		if (!animationRunning) {
			document
				.getElementById(itemID)
				?.animate(
					[{ transform: "scale(1.05)" }, { transform: "scale(1)" }],
					{
						duration: 200,
						easing: "ease-in-out",
						fill: "forwards"
					}
				);

			setTimeout(() => {
				animationRunning = false;
			}, 200);
		}
	}

	if (!newSong) {
		if (!song) {
			downloadScore(songId).then((data) => {
				if (data) song = data;
				color =
					song?.color ??
					colors[
						(song?.title.toLocaleLowerCase().charCodeAt(0) ??
							97 - 97) % colors.length
					];
			});
		} else {
			color =
				song?.color ??
				colors[
					(song?.title.toLocaleLowerCase().charCodeAt(0) ?? 97 - 97) %
						colors.length
				];
		}
	} else if (newSong) {
		song = {
			title: "Nieuw nummer",
			author: "Voeg een nieuw nummer toe",
			color: "red",
			bpm: 100,
			parts: [
				{
					notes: []
				}
			],
			notes: [],
			description: ""
		};

		color = "red";
	}
</script>

{#if song}
	<div
		id={itemID}
		style="border-style: {newSong ? 'dashed' : ''};"
		on:mouseenter={hoverAnimate}
		on:mouseleave={unhoverAnimate}
		on:click={() => {
			action();
			load(songId);
			clickAnimate();
		}}
	>
		<svg
			id="boomwhacker"
			width="29"
			height="22"
			viewBox="0 0 29 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g filter="url(#filter0_d_318_132)">
				<path d="M22.138 1V21H0.50003V1L22.138 1Z" fill={color} />
				<ellipse
					cx="22.1359"
					cy="11"
					rx="10"
					ry="6.36412"
					transform="rotate(90 22.1359 11)"
					fill={color}
				/>
				<ellipse
					cx="22.1359"
					cy="11"
					rx="10"
					ry="6.36412"
					transform="rotate(90 22.1359 11)"
					fill="black"
					fill-opacity="0.3"
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_318_132"
					x="0.133128"
					y="0.449647"
					width="28.7338"
					height="20.7338"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="-0.183451" />
					<feGaussianBlur stdDeviation="0.183451" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_318_132"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_318_132"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
		<h2>{song?.title}</h2>

		<svg
			id="Play"
			width="12"
			height="14"
			viewBox="0 0 12 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 7L-6.52533e-07 13.9282L-4.68497e-08 0.0717964L12 7Z"
				fill="#121B2A"
			/>
		</svg>

		<p id="tag">{song?.author}</p>
		<p id="time">{notesToTime()}</p>
	</div>
{/if}

<style lang="scss">
	@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@100;400&family=Noto+Sans:wght@400;500;700&family=Work+Sans:wght@400;700;800&display=swap");

	div {
		z-index: 100;
		margin-bottom: 15px;
		position: relative;

		background-color: #fff;
		border: 2px solid black;
		border-radius: 10px;

		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease-in-out;
		cursor: pointer;
		padding-top: 10px;
		max-width: 350px;

		font-family: "Work Sans", sans-serif;

		#boomwhacker {
			position: absolute;
			margin-left: -1px;
		}

		#Play {
			position: absolute;
			top: 14px;
			right: 10px;
		}

		h2,
		#tag {
			padding-left: 35px;
			user-select: text;
		}

		#tag,
		#time {
			padding-top: 5px;
			padding-bottom: 10px;
		}

		h2 {
			font-size: 18px;
			font-weight: 700;
			margin: 0;
			padding-right: 30px;
			overflow-wrap: break-word;
		}

		#tag {
			font-size: 16px;
			font-weight: 500;
			margin: 0;
		}

		#time {
			font-size: 14px;
			font-weight: 500;
			margin: 0;
			position: absolute;
			bottom: 0px;
			right: 10px;
		}
	}
</style>
