<script lang="ts">
    import type { Score } from "$lib/scripts/interfaces";

    import player from "$lib/scripts/player";

    // player("7997bb5e-d16a-444c-8b25-5406f25754f1")

    let data: Score

    async function downloadScore() {
        data = await player("7997bb5e-d16a-444c-8b25-5406f25754f1")
        console.log(data)
    }

    async function playScore() {
        const parts = data["score-partwise"].part.measure ? [data["score-partwise"].part.measure] : data["score-partwise"].part
    }
</script>

<button on:click={downloadScore}>Download</button>