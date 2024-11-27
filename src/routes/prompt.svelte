<script lang="ts">
	import { typewriter, oldText } from '../typewriter.js';
	import { barState } from '../state.svelte.js';
	let consoleTyping: boolean = $state(false);
	let consoleBaseText: string = '> cd /home/jusentari/';
	const tabShortNames = ['soc', 'mus', 'gme', 'cde'];
	let consoleText: string = $derived.by(() => {
		if (barState.id >= 0) {
			return consoleBaseText + tabShortNames[barState.id];
		} else {
			return consoleBaseText;
		}
	});
        let consoleValue = $state(consoleBaseText);
	const typeSpeed: number = 50;
	const cursorSpeed: number = 600;

	function userType(e: any): void {
		if (e.key === 'Enter') {
			//parse input and go to page based on what user typed
			const dirs = consoleValue.split('/');
			const file = dirs[dirs.length - 1];
			console.log(file);
			const page = tabShortNames.indexOf(file);
			if (file === 'jusentari' || file === '') barState.id = -1;
			if (page > -1) barState.id = page;
		}
	}
	function openTabAnim(pageId: number) {
		barState.id = pageId;
	}
	$inspect(consoleText);
</script>

{#if consoleText}
	{#key consoleText}
		<input
			in:typewriter={{ speed: 50, origin: consoleValue, dest: consoleText }}
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
		outline: none;
		position: absolute;
		height: 98px;
		width: 50%;
		z-index: 10;
	}
        .hidden {
          display: none;
        }
</style>
