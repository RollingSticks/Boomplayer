<div id="dividerLineContainer">
	<div />
	<p>of</p>
	<div />
</div>

<style lang="scss">
	#dividerLineContainer {
		padding-top: 15px;
		padding-bottom: 15px;
		--dividerColor: #9a9aa2;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 4%;
		color: #9a9aa2;

		div {
			width: 100%;

			border-bottom: {
				color: var(--dividerColor);
				style: solid;
				width: 1px;
			}
		}

		p {
			font-family: "Oxygen";
			font-style: normal;
			font-weight: 700;
			font-size: 0.9rem;

			white-space: nowrap;
			color: var(--dividerColor);
		}
	}
</style>
