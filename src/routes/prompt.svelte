<script lang="ts">
	import { barState } from '../state.svelte.js';
	let consoleBaseText: string = 'cd /home';

	let tabShortNames: string[] = [
		'/jusentari/scl',
		'/jusentari/mus',
		'/jusentari/gme',
		'/jusentari/cde',
		'/criaring'
	];
	let consoleText: string = $derived.by(() => {
		if (barState.id >= 0) {
			return consoleBaseText + tabShortNames[barState.id];
		} else {
			return consoleBaseText;
		}
	});
	let consoleValue = $state(consoleBaseText);
	const typeSpeed: number = 50;

	function stopType(e: any): void {
		console.log(e);
	}

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

	let oldText = 'cd /home';
	function typewriter(node, { speed = 100, origin = '', dest = '' }) {
		let mismatchFound = false;
		let index = 0;
		var length = Math.max(origin.length, dest.length);
		while (!mismatchFound) {
			index++;
			mismatchFound =
				origin.charAt(index).localeCompare(dest.charAt(index)) !== 0 || index > length;
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
				if (intermediateStrings.length > 0) {
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
	<div class="consoleText title-font">
		&nbsp;>
		{#key consoleText}
			<input
				in:typewriter={{ speed: typeSpeed, origin: consoleValue, dest: consoleText }}
				onintroend={() => (consoleValue = consoleText)}
				class="innerConsole title-font"
				onkeydown={stopType}
				onkeyup={userType}
				bind:value={consoleValue}
			/>
		{/key}
	</div>
{/if}

<style>
	.innerConsole {
		background-color: var(--background-color, #000);
		color: var(--color, #fff);
		outline: none;
display: inline-block;
		border: none;
		width: 90%;
	}
	.consoleText {
		background-color: var(--background-color, #000);
		color: var(--color, #fff);
		border: none;
		padding-top: 10px;
		padding-bottom: 10px;
		display: inline-block;
		width: 100%;
		outline: none;
		z-index: 10;
	}
	.title-font {
		font-size: 48px;
	}
	.section {
		font-size: 32px;
		padding: 30px;
	}
	@media (max-width: 2000px) {
		.title-font {
			font-size: 32px;
		}
	}
	@media (max-width: 1500px) {
		.title-font {
			font-size: 24px;
		}
	}
	@media (max-width: 768px) {
		.title-font {
			font-size: 18px;
		}
	}

	@media (max-width: 400px) {
		.title-font {
			font-size: 12px;
		}
	}
</style>
