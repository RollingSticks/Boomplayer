<!-- Signup page -->

<script lang="ts">
    import type { AuthStore, Measure } from "$lib/scripts/interfaces";
    import { signUp } from "$lib/scripts/auth";
    import authStore from "$lib/stores/authStore";
    import player from "$lib/scripts/player";

    let data: Measure[]

    async function downloadScore() {
        data = await player("7997bb5e-d16a-444c-8b25-5406f25754f1")

        data = await player("6803678b-0c9b-4855-88e8-7add912a96ff")
    }

    let AuthStoreData: AuthStore;

    authStore.subscribe((data: AuthStore) => { 
        AuthStoreData = data;
    });

</script>

<button on:click={downloadScore}>Download</button>
<p>Displayname</p>
<input type="text" bind:value={AuthStoreData.displayName} />
<p>Email</p>
<input type="text" bind:value={AuthStoreData.userEmail} />
<p>Password</p>
<input type="text" bind:value={AuthStoreData.userPassword} />
<button on:click={signUp}>Signup</button>