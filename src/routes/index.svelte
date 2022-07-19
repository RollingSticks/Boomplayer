<script lang="ts">
    import type { Measure } from "$lib/scripts/interfaces";

    import player from "$lib/scripts/player";

    let data: Measure[]

    async function downloadScore() {
        data = await player("7997bb5e-d16a-444c-8b25-5406f25754f1")

        data = await player("6803678b-0c9b-4855-88e8-7add912a96ff")
        }
</script>

<button on:click={downloadScore}>Download</button>