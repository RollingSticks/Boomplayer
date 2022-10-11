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
			<input id="EmailInput" type="text" placeholder="Email" />
			<label for="PasswordInput">Password</label>
			<input id="PasswordInput" type="password" placeholder="Password" />
			<div id="showPasswordContainer">
				<input id="showPassword" type="checkbox" />
				<label for="showPassword">Wachtwoord tonen</label>
			</div>
			<button type="submit" id="SigninButton">Inloggen</button>
			<div class="dividerLineContainer">
				<div class="dividerLine" />
				<p>of</p>
				<div class="dividerLine" />
			</div>
			<img src="./ContineWithGoogle.png" alt="" />
		</form>
	</div>
</div>
