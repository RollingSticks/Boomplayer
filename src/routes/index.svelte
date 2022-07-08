<script lang="ts">
    import player from "$lib/scripts/player"
    import upload from "$lib/scripts/admin/upload"
</script>

<button on:click={player}>refresh</button>
<button on:click={async () => upload(await player())}>upload</button>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
