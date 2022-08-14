<!-- Signin page -->

<script lang="ts">
    import type { AuthStore } from "$lib/scripts/interfaces";
    import { signIn, signOut } from "$lib/scripts/auth";
    import authControl from "$lib/stores/authControl";

    let AuthStoreData: AuthStore;

    authControl.subscribe((data: AuthStore) => {
    	AuthStoreData = data;
    });

</script>

<p>Email</p>
<input type="text" bind:value={AuthStoreData.userEmail} />
<p>Password</p>
<input type="text" bind:value={AuthStoreData.userPassword} />
<button on:click={signIn}>Signin</button>
<button on:click={signOut}>signOut</button>