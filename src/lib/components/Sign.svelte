<script lang="ts">
	import { onMount } from "svelte";

	export let content = "Inloggen";
	export let loading = false;
	export let action = () => {
		console.log("No action provided");
	};

	onMount(() => {
		addEventListener("stopLoadingAnimation", () => {
			loading = false;
		});
	});
</script>

<button tabindex="4" id="SigninButton" on:click={action}>
	{#if !loading}<div id="loginText">{content}</div>
	{:else}<div id="loginLoad">
			<div class="bar bar1" />
			<div class="bar bar2" />
			<div class="bar bar3" />
			<div class="bar bar4" />
			<div class="bar bar5" />
			<div class="bar bar6" />
			<div class="bar bar7" />
			<div class="bar bar8" />
		</div>
	{/if}
</button>

<style lang="scss">
	#SigninButton {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease-in-out;

		&:hover {
			transform: scale(1.05);
		}

		background-color: #0e71b8;
		outline: none;
		border: none;
		border-radius: 4px;
		color: white;
		font-size: 20px;
		font-weight: bold;
		font-family: "Noto Sans Display", sans-serif;
		width: 100%;
		height: 52px;
		margin-top: 40px;
		cursor: pointer;

		#loginLoad {
			margin-bottom: -10px;
			.bar {
				width: 5px;
				height: 47px;
				display: inline-block;
				transform-origin: bottom center;
				border-top-right-radius: 20px;
				border-top-left-radius: 20px;
				animation: loader 1.2s linear infinite;
			}

			.bar1 {
				animation-delay: 0.1s;
			}
			.bar2 {
				animation-delay: 0.2s;
			}
			.bar3 {
				animation-delay: 0.3s;
			}
			.bar4 {
				animation-delay: 0.4s;
			}
			.bar5 {
				animation-delay: 0.5s;
			}
			.bar6 {
				animation-delay: 0.6s;
			}
			.bar7 {
				animation-delay: 0.7s;
			}
			.bar8 {
				animation-delay: 0.8s;
			}
			@keyframes loader {
				0% {
					transform: scaleY(0.1);
					background: #e71e72;
				}

				50% {
					transform: scaleY(1);
					background: #f1950b;
				}

				100% {
					transform: scaleY(0.1);
					background: #007f00;
				}
			}
		}
	}
</style>
