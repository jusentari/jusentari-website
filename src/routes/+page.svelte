<script lang="ts">
	import Bar from './bar.svelte';
	import Prompt from './prompt.svelte';
	import Ribbon from './ribbon.svelte';
	import { barState } from '../state.svelte';
	const colors = ['#648fff', '#785ef0', '#dc267f', '#fe6100', '#ffb000', '#222', '#eee'];

	let screenWidth = $state(0);
	let screenHeight = $state(0);
	let isDesktop = $derived(screenWidth >= 768);
	let tabIds = $derived.by(() => {
		if (isDesktop) {
			return [3, 2, 1, 0];
		} else {
			return [3, 2, 1, 0].sort((a, b) => (a == barState.id ? 999 : b - a));
		}
	});
	let tabRatio = $state(0.1);
	let tabHeight = $state(100);
	let tabPercentageSize = $derived(isDesktop ? 0.12 : 0.275);
	let tabPixelSize = $derived(screenWidth * tabPercentageSize);

	const ribbonXOffset = 100;
	const ribbonWidth = 150;
	let ribbonHeight = $derived(screenHeight - tabHeight);

	const ribbonHTML = [
		`
	<a href="https://bsky.app/profile/jusentari.com" rel=me>bluesky</a><br>
	<a href="https://github.com/jusentari" rel=me>github</a><br>
        <a href="mailto:jusentari@gmail.com">email</a><br>
`,
		`music`,
		`games`,
		`           <h2>stuff</h2><br>
                    <a routerLink="/one-pixel">one pixel</a><br>
                    <a href="https://github.com/jusentari/AlpacOS">alpacos</a><br>
                    <a href="https://github.com/jusentari/nds-badge">nds badge</a><br>
                    <a href="">touchscreen badge</a><br>
                    <a href="https://github.com/jusentari/jusentari-website">this website</a><br>`
	];
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />
<div style="height: {tabHeight}px; background-color: {colors[4]}">
	{#if isDesktop}
		<Prompt --color={colors[6]} --background-color={colors[4]} />
	{/if}
	<svg style="position: absolute;" viewBox="0 0 {screenWidth} {screenHeight}">
		{#each tabIds as tabId}
			<Bar id={tabId} {tabHeight} {tabRatio} />
		{/each}
		<Ribbon xOffset={ribbonXOffset} ribbonWidth={tabPixelSize} {ribbonHeight} />
	</svg>
</div>
<div style="background-color: colors[{barState.id}]" hidden>
	barState.id: {barState.id} <br />
	screenWidth: {screenWidth} <br />
	isDesktop: {isDesktop} <br />
	tabPercentageSize: {tabPercentageSize} <br />
	tabPixelSize: {tabPixelSize} <br />
</div>
{#if barState.id >= 0}
	<div
		class="ribbonInfo"
		style="z-index: 10 !important; position: absolute; margin-left: {ribbonXOffset}px; width: {ribbonWidth}px; color: #ddd"
	>
		{@html ribbonHTML[barState.id]}
	</div>
{:else}
	<div style="color: #ddd; z-index: 10; margin: 100px">
		welcome to my website! it is currently under construction. click on the tabs up top to see my
		various projects :)
	</div>
{/if}

<style>
	:global(*) {
		font-family: 'Terminal';
	}

	@font-face {
		font-family: 'Terminal';
		src: url('/posshydrafont.ttf') format('truetype');
	}
</style>
