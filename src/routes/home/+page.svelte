<script lang="ts">
	import SongItem from "$lib/components/SongItem.svelte";
	import "./styling.scss";
</script>

<div id="panel">
	<img id="profilePicture" src="user.jpg" alt="profilePicture" />
	<h1>Hallo, Maurits</h1>
	<p>Je nummers staan al voor je klaar:</p>

	<div id="items">
		<SongItem />
		<SongItem />
		<SongItem />
		<SongItem />
		<SongItem />
	</div>
</div>
<div id="player" />
