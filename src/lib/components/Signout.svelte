<script lang="ts">
	import { signOut } from "$lib/scripts/auth";

	export let action = () => {
		signOut();
	};
</script>

<div id="profileContainer" on:click={action}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="icon icon-tabler icon-tabler-logout"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" />
		<path
			d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
		/>
		<path d="M7 12h14l-3 -3m0 6l3 -3" />
	</svg>
</div>

<style lang="scss">
	#profileContainer {
		position: absolute;
		height: 10vh;
		max-height: 10vw;
		right: 2.5vh;
		top: 2.5vh;
		z-index: 101;

		svg {
			height: 8vh;
			cursor: pointer;
		}
	}
</style>
