<script lang="ts">
    import converter from "$lib/scripts/admin/converter";
    import upload from "$lib/scripts/admin/upload";

    let convertResult: string;
    let uploadResult: string;

    async function convertTest() {
        convertResult = JSON.stringify(await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob()))
    }

    async function UploadTest() {
        uploadResult = JSON.stringify(await upload(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob()))
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
</ul>