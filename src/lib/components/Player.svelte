<script lang="ts">
	import type { Score } from "../../lib/scripts/interfaces";

	export let song = {} as Score;
</script>

<div id="PlayerView">
	<div id="Player" />
	<div id="SongInfo">
		<h1>{song.title}</h1>
		<p>{song.description}</p>
	</div>
</div>

<style lang="scss">
	#Player {
		position: absolute;
		display: flex;
		background-color: red;

		width: calc(100% - 100px);
		top: 15%;
		right: 50px;
		height: 65%;
		background-color: blue;
	}

	#SongInfo {
		position: absolute;
		background-color: red;

		top: 75%;
		margin-left: 50px;
		line-height: 30px;
		background-color: yellow;
		width: calc(100% - 100px);

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
