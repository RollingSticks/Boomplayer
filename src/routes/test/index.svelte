<script lang="ts">
    import converter from "$lib/scripts/admin/converter";
    import upload, { generateUID } from "$lib/scripts/admin/upload";
    import downloadScore from "$lib/scripts/downloadScore";

    let convertResult: string;
    let uploadResult: string;
    let generatedIDResult: string;
    let downloadScoreResult: string;

    async function convertTest() {
        const data = await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob())
        console.log(data)
        convertResult = JSON.stringify(data)
    }

    async function UploadTest() {
        uploadResult = await upload(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob())
        console.log(uploadResult)
    }

    async function GenerateIDTest() {
        generatedIDResult = generateUID()
        console.log(generatedIDResult)
    }

    async function downloadScoreTest() {
        const data = await downloadScore("7997bb5e-d16a-444c-8b25-5406f25754f1")
        console.log(data)
        downloadScoreResult = JSON.stringify(data)
    }
</script>

<ul>
    <button id="convertTest" on:click={convertTest}>converter</button>
    {#if convertResult}
        <p id="convertTestOutput">{convertResult}</p>
    {/if}

    <button id="UploadTest" on:click={UploadTest}>upload</button>
    {#if uploadResult}
        <p id="UploadTestOutput">{uploadResult}</p>
    {/if}

    <button id="GenerateIDTest" on:click={GenerateIDTest}>generate uid</button>
    {#if generatedIDResult}
        <p id="GenerateIDTestOutput">{generatedIDResult}</p>
    {/if}

    <button id="downloadScoreTest" on:click={downloadScoreTest}>download score</button>
    {#if downloadScoreResult}
        <p id="downloadScoreTestOutput">{downloadScoreResult}</p>
    {/if}
</ul>