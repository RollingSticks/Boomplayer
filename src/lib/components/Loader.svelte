<script lang="ts">
	import { onMount } from "svelte";

	export let showLoader = true;

	onMount(async () => {
		addEventListener("ShowLoader", () => (showLoader = true));
		addEventListener("HideLoader", () => (showLoader = false));
    });
</script>


{#if showLoader}
    <div id="loading">
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

<slot />

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-family: "Poppins", sans-serif;
		font-size: 14px;
		border: none;
	}
</style>
