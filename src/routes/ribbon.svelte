<script lang="ts">
	import { circIn } from 'svelte/easing';
	import { barState, colors } from '../state.svelte.js';
	let { xOffset, ribbonWidth, ribbonHeight } = $props();
	let id = $derived(barState.id);
	$inspect(barState);
	function ribbonIn(
		_node: any,
		params: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: circIn,
			css: (_t: number, u: number) => `height: ${u * ribbonHeight}px;`
		};
	}
	let screenWidth = $state(0);

	let screenHeight = $state(0);
	let isDesktop = $derived(screenWidth >= 768);
	function handleEnter(e: any) {
		if (e.key === 'Enter' && !barState.isAnimating) {
			barState.id = -1;
		}
	}
	let hover = $state(false);

	const ribbonHTML = [
		`
	<a href="https://bsky.app/profile/jusentari.com" rel=me>bluesky</a><br>
	<a href="https://github.com/jusentari" rel=me>github</a><br>
        <a href="mailto:jusentari@gmail.com">email</a><br>
	discord: jusentari<br>
`,
		`music`,
		`games`,
		`           <h2>stuff</h2><br>
                    <a href="/one-pixel">one pixel</a><br>
                    <a href="https://github.com/jusentari/AlpacOS">alpacos</a><br>
                    <a href="https://github.com/jusentari/nds-badge">nds badge</a><br>
                    <a href="">touchscreen badge</a><br>
                    <a href="https://github.com/jusentari/jusentari-website">this website</a><br>`
	];
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />
{#key id}
	<div
		class="ribbonInfo"
		style="position: absolute; margin-left: {xOffset}px; width: {ribbonWidth}px; min-height: {ribbonHeight}px; color: #ddd; background-color: {colors[id]}"
		out:ribbonIn={{delay:500, duration:1}}>
		{#if id >= 0}
			<svg viewBox="0 0 {ribbonWidth} 50">
				<rect
					x=0
					y=0
					width={ribbonWidth}
					height="30"
					class="ribbonClose"
					onpointerenter={() => (hover = true)}
					onpointerleave={() => (hover = false)}
					onclick={() => {
						if (!barState.isAnimating) {
							barState.id = -1;
						}
					}}
					onfocusin={() => (hover = true)}
					onfocusout={() => (hover = false)}
					onkeydown={handleEnter}
					role="button"
					tabindex="0"
					fill={colors[id]}
				>
				</rect>
				<polygon
					points="0,0 40,0 20,10"
					fill="#000"
					class="ribbonClose {barState.id >= 0 ? '' : 'hidden'}"
					transform="translate({ribbonWidth / 2 - 20},10)"
				>
				</polygon>
			</svg>
		{/if}
		{@html ribbonHTML[barState.id]}
	</div>
	<div
		class="{id >= 0 ? '' : 'hidden'}"
		style="background-color: #222; position: absolute; left: {xOffset}px; top: 100px; height: 0px; width: {ribbonWidth}px; z-index: 1"
		in:ribbonIn={{ delay: 800, duration: 500 }}
		out:ribbonIn={{ delay: 0, duration: 500 }}
		onintroend={() => (barState.isAnimating = false)}
	></div>
{/key}

<style>
	.hidden {
		display: none;
	}
	.ribbonClose:hover {
		cursor: pointer;
		background-image: linear-gradient(red, yellow, green);
	}
</style>
