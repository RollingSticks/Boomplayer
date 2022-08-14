<!-- Signup page -->

<script lang="ts">
    import type { AuthStore } from "$lib/scripts/interfaces";
    import { signUp } from "$lib/scripts/auth";
    import authData from "$lib/stores/authData";

    let AuthDataStore: AuthStore;

    authData.subscribe((data: AuthStore) => {
    	AuthDataStore = data;
    });

</script>

<p>Displayname</p>
<input type="text" bind:value={AuthDataStore.displayName} />
<p>Email</p>
<input type="text" bind:value={AuthDataStore.userEmail} />
<p>Password</p>
<input type="text" bind:value={AuthDataStore.userPassword} />
<button on:click={signUp}>Signup</button>