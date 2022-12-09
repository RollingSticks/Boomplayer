<script lang="ts">
	export let pfp = "user.jpg";
	export let icon = "gear.svg";
	export let action = () => {
		console.log("No action provided");
	};

	function highLight() {
		// const settingsOverlay = document.getElementById("settingsOverlay");
		// const profilePicture = document.getElementById("profilePicture");
		// if (settingsOverlay) settingsOverlay.style.opacity = "1";
		// if (profilePicture) profilePicture.style.filter = "brightness(50%)";
	}

	function lowLight() {
		// const settingsOverlay = document.getElementById("settingsOverlay");
		// const profilePicture = document.getElementById("profilePicture");
		// if (settingsOverlay) settingsOverlay.style.opacity = "0";
		// if (profilePicture) profilePicture.style.filter = "brightness(100%)";
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
	/>
	<!-- <div id="settingsOverlay"
		on:mouseenter={highLight}
		on:mouseleave={lowLight}
		on:click={action}
	>
		<img
			src={icon}
			alt="profilePicture"
		/>
	</div> -->
</div>

<style lang="scss">
	#profileContainer {
		position: absolute;
		height: 10vh;
		max-height: 100px;
		left: 2.5vh;
		top: 2.5vh;
		// cursor: pointer;
		z-index: 101;

		#settingsOverlay {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: white;
			opacity: 0;

			img {
				width: 50%;
			}
		}

		#profilePicture {
			border-radius: 50%;
			width: 100%;
			filter: brightness(100%);
		}

		// #profilePicture:hover {
		// 	filter: brightness(50%);
		// }

		// #settingsOverlay:hover {
		// 	opacity: 1;
		// }
	}
</style>
