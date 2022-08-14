<!-- Signup page -->

<script lang="ts">
    import type { AuthStore } from "$lib/scripts/interfaces";
    import { signUp } from "$lib/scripts/auth";
    import authControlStore from "$lib/stores/authControlStore";

    let AuthStoreData: AuthStore;

    authControlStore.subscribe((data: AuthStore) => {
    	AuthStoreData = data;
    });

</script>

<p>Displayname</p>
<input type="text" bind:value={AuthStoreData.displayName} />
<p>Email</p>
<input type="text" bind:value={AuthStoreData.userEmail} />
<p>Password</p>
<input type="text" bind:value={AuthStoreData.userPassword} />
<button on:click={signUp}>Signup</button>