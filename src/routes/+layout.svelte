<script lang="ts">
	import { onMount } from "svelte";

	let toastTitle = "";
	let toastMessage = "";

	let popupTimeout;

	function showToast(color: string) {
		const toast = document.getElementById("toast");

		if (toast) toast.style.borderLeft = `8px solid ${color}`;

		clearTimeout(popupTimeout);
		const wrapper = document.getElementById("wrapper");
		if (toast) toast.style.transform = "translateX(0)";
		if (wrapper) wrapper.style.zIndex = "100";
		popupTimeout = setTimeout(() => {
			closeToast();
		}, 3000);
	}

	function closeToast() {
		dispatchEvent(new CustomEvent("stopLoadingAnimation"));
		const wrapper = document.getElementById("wrapper");
		const toast = document.getElementById("toast");
		if (toast) toast.style.transform = "translateX(400px)";

		setTimeout(() => {
			if (wrapper) wrapper.style.zIndex = "-1";
		}, 850);
	}

	onMount(() => {
		addEventListener("error", (err) => {
			toastTitle = "Error";
			toastMessage = err.error.message;
			showToast("red");
		});

		addEventListener("info", (message) => {
			toastTitle = message.detail.title ?? "Info";
			toastMessage =
				message.detail.message ?? "Geen informatie beschikbaar";
			showToast("blue");
		});
	});
</script>

<div id="wrapper">
	<div id="toast">
		<div class="container-1">
			<i class="fas fa-check-square" />
		</div>
		<div class="container-2">
			<p>{toastTitle}</p>
			<p>{toastMessage}</p>
		</div>
		<button id="close" on:click={closeToast}> &times; </button>
	</div>
</div>

<slot />

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-family: "Poppins", sans-serif;
		font-size: 14px;
		border: none;
	}

	#wrapper {
		width: 420px;
		padding: 30px 20px;
		position: absolute;
		bottom: 50px;
		right: 0;
		z-index: -1;
	}

	#toast {
		width: 380px;
		height: 80px;
		padding: 20px;
		background-color: #ffffff;
		box-shadow: 0 10px 20px rgba(75, 50, 50, 0.05);
		border-radius: 7px;
		display: grid;
		grid-template-columns: 1.2fr 6fr 0.5fr;
		transform: translate(400px);
		transition: 1s;
	}
	.container-1,
	.container-2 {
		align-self: center;
	}
	.container-1 i {
		font-size: 40px;
		color: red;
	}
	.container-2 p:first-child {
		color: #101020;
		font-weight: 600;
		font-size: 16px;
	}
	.container-2 p:last-child {
		font-size: 12px;
		color: #656565;
		font-weight: 400;
	}
	#toast button {
		align-self: flex-start;
		background-color: transparent;
		font-size: 25px;
		line-height: 0;
		color: #656565;
		cursor: pointer;
	}
</style>
