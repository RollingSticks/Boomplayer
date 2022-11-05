<script lang="ts">
	import { onMount } from "svelte";


    export let noteColor: string;
    export let fallTime: number;

    setTimeout(() => {
        document.getElementById(noteColor + "-ball")?.animate([
            { opacity: '1' },
            { opacity: '0' }
        ], {
            duration: 100,
        });

        setTimeout(() => {
            document.getElementById(noteColor + "-ball")?.remove();
        }, 85);
    }, fallTime * 850);

    onMount(() => {
        document.getElementById(noteColor + "-ball")?.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(calc(65vh - 20%))' }
        ], {
            duration: fallTime * 1000,
            iterations: 1,
            easing: 'ease-in'
        });
    });
</script>

<div class="ball" id={noteColor + "-ball"} style="background-color: #{noteColor};"/>

<style lang="scss">
    .ball {
        opacity: 1;
        padding: 40%;
        position: absolute;
        top: -20%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }
</style>