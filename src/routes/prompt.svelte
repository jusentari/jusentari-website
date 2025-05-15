<script lang="ts">
	import { barState } from '../state.svelte.js';
	let consoleBaseText: string = '> cd /home';

	let tabShortNames: string[] = ['/jusentari/scl', '/jusentari/mus', '/jusentari/gme', '/jusentari/cde', '/criaring'];
	let consoleText: string = $derived.by(() => {
		if (barState.id >= 0) {
			return consoleBaseText + tabShortNames[barState.id];
		} else {
			return consoleBaseText;
		}
	});
        let consoleValue = $state(consoleBaseText);
	const typeSpeed: number = 50;

	function userType(e: any): void {
		if (e.key === 'Enter') {
			//parse input and go to page based on what user typed
			const dirs = consoleValue.split('/');
			const file = dirs[dirs.length - 1];
			const page = tabShortNames.indexOf(file);
			if (file === 'jusentari' || file === '') barState.id = -1;
			if (page > -1) barState.id = page;
		}
	}

let oldText = '> cd /home';
function typewriter(node, { speed = 100, origin = '', dest = '' }) {
	let mismatchFound = false
	let index = 0;
	var length = Math.max(origin.length, dest.length);
	while (!mismatchFound) {
		index++;
		mismatchFound = origin.charAt(index).localeCompare(dest.charAt(index)) !== 0 || index > length;
	}
	const numberToErase = origin.length - index;
	const numberToAdd = dest.length - index;
	const intermediateStrings = [];
	for (let i = 1; i <= numberToErase; i++) {
		intermediateStrings.push(origin.substring(0, origin.length - i));
	}
	for (let i = numberToAdd; i >= 0; i--) {
		intermediateStrings.push(dest.substring(0, dest.length - i));
	}
	const totalChars = numberToAdd + numberToErase;
	origin = dest;

	const duration = Math.max(totalChars * speed, 1);
	return {
		duration,
		tick: (t) => {
			const i = Math.trunc(totalChars * t);
			if(intermediateStrings.length > 0){
				consoleValue = intermediateStrings[i];
				node.value = intermediateStrings[i];
			} else {
				consoleValue = dest;
				node.value = dest;
			}
		}
	};
}
	$inspect(consoleText);
</script>

{#if consoleText}
	{#key consoleText}
		<input
			in:typewriter={{ speed: typeSpeed, origin: consoleValue, dest: consoleText }}
                        onintroend={() => consoleValue = consoleText}
			class="consoleText"
			onkeyup={userType}
			height="100px"
                        bind:value="{consoleValue}"
		/>
	{/key}
{/if}

<style>
	@media only screen and (min-width: 768px) {
		.consoleText {
			font-size: 28px;
		}
	}

	@media only screen and (min-width: 1050px) {
		.consoleText {
			font-size: 40px;
		}
	}
	@media only screen and (min-width: 1250px) {
		.consoleText {
			font-size: 50px;
		}
	}
	.consoleText {
		background-color: var(--background-color, #000);
		color: var(--color, #fff);
		border: none;
		padding-top: 20px;
		padding-bottom: 20px;
		display: block;
		width: 100%;
		outline: none;
		z-index: 10;
	}
</style>
