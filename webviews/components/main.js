import App from './HelloWorld.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});
console.log("svelte is now working,,, ")

export default app;