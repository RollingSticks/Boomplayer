<script lang="ts">
	import { onMount } from "svelte";

	import type { PlayerStore } from "$lib/scripts/interfaces";
	import playerControl from "$lib/stores/playerControl";

	let playerControlStore: PlayerStore;

	playerControl.subscribe((data) => {
		playerControlStore = data;
	});

	export let noteColor: string;
	export let fallTime: number;
	export let sound: string;

	onMount(() => {
		document
			.getElementById(noteColor + "-ball")
			?.animate(
				[
					{ transform: "translateY(0px)" },
					{ transform: "translateY(calc(65vh - 20%))" }
				],
				{
					duration: fallTime * 1000,
					iterations: 1,
					easing: "ease-in"
				}
			);

		addEventListener("killAllBalls", () => {
			clearInterval(check);
			document.getElementById(noteColor + "-ball")?.remove();
		});

		const ballSize = document.getElementById(
			noteColor + "-ball"
		)?.clientHeight;

		const check = setInterval(() => {
			const y = document
				.getElementById(noteColor + "-ball")
				.getBoundingClientRect().y;
			if (
				y >
					document.getElementById("Player")?.clientHeight -
						ballSize * 0.6 ||
				y < 0
			) {
				clearInterval(check);
				playerControlStore.notes[sound].volume = 1;
				playerControlStore.notes[sound].play();

				document
					.getElementById(noteColor + "-ball")
					?.animate([{ opacity: "1" }, { opacity: "0" }], {
						duration: 50
					});

				setTimeout(() => {
					document.getElementById(noteColor + "-ball")?.remove();
				}, 30);
			} else {
				// console.log(y)
			}
		}, 10);
	});
</script>

<div
	class="ball"
	id={noteColor + "-ball"}
	style="background-color: #{noteColor};"
/>

<style lang="scss">
	.ball {
		opacity: 1;
		padding: 40%;
		position: absolute;
		top: -20%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
	}
</style>
