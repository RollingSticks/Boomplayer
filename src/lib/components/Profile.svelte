<script lang="ts">
	export let pfp = "user.jpg";
	export let icon = "gear.svg";
	export let action = () => {
		console.log("No action provided");
	};

	function highLight() {
		const settingsOverlay = document.getElementById("settingsOverlay");
		const profilePicture = document.getElementById("profilePicture");
		if (settingsOverlay) settingsOverlay.style.opacity = "1";
		if (profilePicture) profilePicture.style.filter = "brightness(50%)";
	}

	function lowLight() {
		const settingsOverlay = document.getElementById("settingsOverlay");
		const profilePicture = document.getElementById("profilePicture");
		if (settingsOverlay) settingsOverlay.style.opacity = "0";
		if (profilePicture) profilePicture.style.filter = "brightness(100%)";
	}
</script>

<div id="profileContainer">
	<img
		referrerpolicy="no-referrer"
		id="profilePicture"
		src={pfp}
		alt="profilePicture"
		on:mouseenter={highLight}
		on:mouseleave={lowLight}
		on:click={action}
	/>
	<img
		id="settingsOverlay"
		src={icon}
		alt="profilePicture"
		on:mouseenter={highLight}
		on:mouseleave={() => {
			const settingsOverlay = document.getElementById("settingsOverlay");
			if (settingsOverlay) settingsOverlay.style.opacity = "0";
		}}
		on:click={action}
	/>
</div>

<style lang="scss">
	#profileContainer {
		position: relative;
		top: 0;
		left: 0;

		margin-left: 4.85vw;
		z-index: 100;

		#profilePicture {
			height: 10vh;
			width: 10vh;
			border-radius: 50%;
			margin-left: 0.15vh;
			margin-top: 5vh;
			cursor: pointer;
		}

		#profilePicture:hover {
			filter: brightness(50%);
		}

		#settingsOverlay {
			cursor: pointer;
			position: absolute;
			margin-top: 8.58vh;
			margin-left: -6.6vh;
			opacity: 0;
		}

		#settingsOverlay:hover {
			opacity: 1;
		}
	}
</style>
