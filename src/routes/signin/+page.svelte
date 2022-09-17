<!-- Signin page -->
<script lang="ts">
	import type { AuthStore } from "$lib/scripts/interfaces";
	import { signIn, signinWithGoogle, signOut } from "$lib/scripts/auth";
	import authData from "$lib/stores/authData";

	let AuthDataStore: AuthStore;

	authData.subscribe((data: AuthStore) => {
		AuthDataStore = data;
	});
</script>

<p>Email</p>
<input type="text" bind:value={AuthDataStore.userEmail} />
<p>Password</p>
<input type="text" bind:value={AuthDataStore.userPassword} />
<button on:click={signIn}>Signin</button>
<button on:click={signinWithGoogle}>Signin with Google</button>
<button on:click={signOut}>signOut</button>
