<script lang="ts">
    import converter from "$lib/scripts/admin/converter";

    let convertResult: string;
    let uploadResult: string;

    async function convertTest() {
        convertResult = JSON.stringify(await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob()))
    }

    async function UploadTest() {
        convertResult = JSON.stringify(await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob()))
    }
</script>

<ul>
    <button id="output" on:click={convertTest}>converter</button>
    <p id="output">{convertResult}</p>

    <button id="output" on:click={UploadTest}>upload</button>
    <p id="output">{uploadResult}</p>
</ul>