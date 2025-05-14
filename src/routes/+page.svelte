<script lang="ts">
	import { dev } from '$app/environment';

	import Bar from './bar.svelte';
	import Prompt from './prompt.svelte';
	import Ribbon from './ribbon.svelte';
	import { barState } from '../state.svelte';
	import { fade } from 'svelte/transition';
	import { circIn } from 'svelte/easing';
	import { timings } from '../anim-params.svelte';
	import { onMount } from 'svelte';
	const colors = ['#648fff', '#785ef0', '#dc267f', '#fe6100', '#ffb000', '#222', '#eee'];
	onMount(() => {
		if(false){
		setInterval(() => {
			barState.id = (barState.id + 1) % 5;
		}, 5000); // Run every 5 seconds (5000 milliseconds)
		}
	});
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
	let tabRatio = $state(0.28);
	let realSkew = -28;
	let tabHeight = 100;
	let tabPercentageSize = $derived(isDesktop ? 0.12 : 0.275);
	let tabPixelSize = $derived(screenWidth * tabPercentageSize);

	const ribbonXOffset = 0;
	const ribbonWidth = 150;
	let ribbonHeight = $derived(screenHeight - tabHeight);
</script>

<svelte:head>
	<script src="https://criar.ing/criaring.js"></script>
</svelte:head>
<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<div style="height: {tabHeight}px; background-color: {colors[4]}">
	{#if isDesktop}
		<Prompt --color={colors[6]} --background-color={colors[4]} />
	{/if}
	<svg style="position: absolute; overflow: visible" viewBox="0 0 {screenWidth} 100">
		{#each tabIds as tabId}
			<Bar id={tabId} {tabHeight} {tabRatio} {realSkew} />
		{/each}
	</svg>
</div>
<div style="background-color: colors[{barState.id}]" hidden>
	barState.id: {barState.id} <br />
	screenWidth: {screenWidth} <br />
	isDesktop: {isDesktop} <br />
	tabPercentageSize: {tabPercentageSize} <br />
	tabPixelSize: {tabPixelSize} <br />
</div>

<Ribbon xOffset={ribbonXOffset} ribbonWidth={tabPixelSize} {ribbonHeight} {tabRatio} {realSkew} {tabHeight} />
{#if barState.id < 0}
	<div
		style="color: #ddd; z-index: 2; margin: 100px"
		in:fade={{
			duration: 500,
			easing: circIn,
			delay: timings.infoContractDur + timings.infoContractDelay
		}}
	>
		<img src="me.jpg" alt="me (alpaca)" height="100px" />
		welcome to my website! it is currently under construction. click on the tabs up top to see my various
		projects :)
	</div>

	<webring-css style="position: absolute; right: 10px"></webring-css>
{/if}
{#if dev}
	<span style="color: #fff;">
		infoExpandDelay
		<input
			type="range"
			id="infoExpandDelay"
			name="infoExpandDelay"
			min="0"
			max="1000"
			bind:value={timings.infoExpandDelay}
			step="10"
		/>
		{timings.infoExpandDelay}
		<br />
		infoExpandDur
		<input
			type="range"
			id="infoExpandDur"
			name="infoExpandDur"
			min="0"
			max="1000"
			bind:value={timings.infoExpandDur}
			step="10"
		/>
		{timings.infoExpandDur}
		<br />
		infoContractDur
		<input
			type="range"
			id="infoContractDur"
			name="infoContractDur"
			min="0"
			max="1000"
			bind:value={timings.infoContractDur}
			step="10"
		/>
		{timings.infoContractDur}
		<br />
		ribbonExpandDur
		<input
			type="range"
			id="ribbonExpandDur"
			name="ribbonExpandDur"
			min="0"
			max="1000"
			bind:value={timings.ribbonExpandDur}
			step="10"
		/>
		{timings.ribbonExpandDur}
		<br />
		ribbonContractDur
		<input
			type="range"
			id="ribbonContractDur"
			name="ribbonContractDur"
			min="0"
			max="1000"
			bind:value={timings.ribbonContractDur}
			step="10"
		/>
		{timings.ribbonContractDur}
		<br />
		infoContractDelay
		<input
			type="range"
			id="infoContractDelay"
			name="infoContractDelay"
			min="0"
			max="1000"
			bind:value={timings.infoContractDelay}
			step="10"
		/>
		{timings.infoContractDelay}
		<br />
		ribbonContractDelay
		<input
			type="range"
			id="ribbonContractDelay"
			name="ribbonContractDelay"
			min="0"
			max="1000"
			bind:value={timings.ribbonContractDelay}
			step="10"
		/>
		{timings.ribbonContractDelay}
		<br />
		ribbonExpandDelay
		<input
			type="range"
			id="ribbonExpandDelay"
			name="ribbonExpandDelay"
			min="0"
			max="1000"
			bind:value={timings.ribbonExpandDelay}
			step="10"
		/>
		{timings.ribbonExpandDelay}
		<br />
	</span>
{/if}

<style>
	:global(*) {
		font-family: 'Terminal';
	}

	@font-face {
		font-family: 'Terminal';
		src: url('/TerminessNerdFontMono-Regular.ttf') format('truetype');
	}
</style>
