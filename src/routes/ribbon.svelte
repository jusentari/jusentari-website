<script lang="ts">
	import { circIn } from 'svelte/easing';
	import { barState, colors } from '../state.svelte.js';
	let { xOffset, ribbonWidth, ribbonHeight } = $props();
	let id = $derived(barState.id);
	function ribbonIn(
		_node: SVGRectElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: circIn,
			css: (t: number, _u: number) =>
				`${isDesktop ? 'height' : 'width'}: ${-1 * t * params.dist}px;`
		};
	}
	function ribbonOut(
		node: SVGRectElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: circIn,
			css: (t: number, _u: number) =>
				`${isDesktop ? 'height' : 'width'}: ${-1 * t * (params.dist - node.height.baseVal.value)}px;`
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
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />
{#key id}
	<!--	{#if isDesktop}-->
	<rect
		class=" {barState.id >= 0 && isDesktop ? '' : 'hidden'}"
		x="{xOffset}px"
		y="-{screenHeight}px"
		transform="scale(1 -1)"
		in:ribbonIn={{ delay: 800, duration: 500, dist: ribbonHeight }}
		out:ribbonOut={{ delay: 0, duration: 500, dist: 0 }}
		height="{ribbonHeight}px"
		width="{ribbonWidth}px"
		onintroend={() => (barState.isAnimating = false)}
		fill={colors[barState.id]}
	></rect>
	<rect
		onclick={() => (barState.id = -1)}
		class=" {barState.id >= 0 && !isDesktop ? '' : 'hidden'}"
		x="-{screenWidth}px"
		y="{screenHeight - 150}px"
		transform="scale(-1 1)"
		in:ribbonIn={{ delay: 800, duration: 500, dist: ribbonWidth }}
		out:ribbonOut={{ delay: 0, duration: 500, dist: 0 }}
		height="100px"
		width="{ribbonWidth}px"
		fill={colors[barState.id]}
		onkeydown={handleEnter}
		role="button"
		tabindex="0"
	></rect>
{/key}
{#if id >=0 }
<rect
	x={xOffset}
	y="100"
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
	fill="{colors[id]}"
>
</rect>
<polygon
	points="0,0 40,0 20,10"
	fill="#000"
	class="ribbonClose {barState.id >= 0 && isDesktop} ? '' : 'hidden'}"
	transform="translate({xOffset + ribbonWidth / 2 - 20}, 110)"
>
</polygon>
{/if}
<style>
	.hidden {
		display: none;
	}
	.ribbonClose:hover {
		cursor: pointer;
		background-image: linear-gradient(red, yellow, green);
	}
</style>
