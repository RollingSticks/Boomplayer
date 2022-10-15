<script lang="ts">
	import "./styling.scss";
</script>

<img class="sideImage" src="/Rollingsticks.png" alt="Rollingsticks" />
<div class="signinField">
	<div class="signinFieldContainer">
		<h1 id="title">Welkom terug</h1>
		<p id="tagline">Voer hier uw login informatie in.</p>
		<form>
			<label for="EmailInput">Email</label>
			<input
				data-np-uid="EmailInput"
				id="EmailInput"
				type="text"
				placeholder="Email"
			/>
			<label for="PasswordInput">Password</label>
			<input
				data-np-uid="PasswordInput"
				id="PasswordInput"
				type="password"
				placeholder="Wachtwoord"
			/>
			<div id="showPasswordContainer">
				<input id="showPassword" type="checkbox" />
				<label for="showPassword">Wachtwoord tonen</label>
			</div>
			<input
				data-np-uid="SigninButton"
				type="submit"
				id="SigninButton"
				value="Inloggen"
			/>
			<div class="dividerLineContainer">
				<div class="dividerLine" />
				<p>of</p>
				<div class="dividerLine" />
			</div>
			<img
				src="./ContineWithGoogle.png"
				alt="doorgaan met google"
				id="SigninWithGoogle"
			/>
		</form>
	</div>
</div>
