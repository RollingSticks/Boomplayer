function generateUID(): string {
	try {
		const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for ( let i = 0; i < 16; i++ ) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
	} catch (error) {
		dispatchEvent(new ErrorEvent("error", { error: {message: "Kon geen id genereren voor nummer", retryable: true, error: error} }));
		return "";
	}
}

export { generateUID };