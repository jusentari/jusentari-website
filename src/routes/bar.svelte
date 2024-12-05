<script lang="ts">
	import { circIn, expoIn } from 'svelte/easing';
	import { ribbonExpandDelay, ribbonExpandDur, ribbonContractDur, ribbonContractDelay } from '../anim-params.svelte.js'
	import { barState, colors } from '../state.svelte';
	let { id, tabHeight, tabRatio } = $props();
	let screenWidth: number = $state(0);

	let screenHeight: number = $state(0);
	let isDesktop = $derived(screenWidth >= 768);
	let tabPercentageSize: number = $derived(isDesktop ? 0.12 : 0.27);
	let tabPixelSize: number = $derived(screenWidth * tabPercentageSize);
	let xOffset = $derived(screenWidth - tabPixelSize * (id + 1));
	let xFontOffset = $derived(xOffset + tabPixelSize * 0.3);
	let xRectOffset = $derived(xOffset - tabPixelSize * (1 / tabRatio - 1) * tabRatio + tabPixelSize);
	let tabNames: string[] = ['social', 'music', 'games', 'code'];
	//const tabShortNames: string[] = ['soc', 'mus', 'gme', 'cde'];
	let skew = $derived(Math.atan((tabPixelSize * tabRatio) / tabHeight) * (-180 / Math.PI));
	let fontSize = $derived(
		screenWidth >= 1250
			? '32px'
			: screenWidth >= 1050
				? '28px'
				: screenWidth >= 768
					? '24px'
					: '16px'
	);
	/*function bezier(t: number) {
		return 1 / (t + 0.00001);
	}*/
	$inspect(xRectOffset);
	function ribbonIn(
		_node: SVGElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: expoIn,
			css: (t: number) => `height: ${t * params.dist}px;`
		};
	}
	function ribbonOut(
		_node: SVGElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: expoIn,
			css: (_t: number, u: number) => {
				const skewRads = skew * 2 * Math.PI/360;
				return `y: ${tabHeight + (u * params.dist * Math.cos(skewRads))}px;`;
			},
		};
	}
	let hover = $state(false);
	let fullStretch = $derived(barState.id == id);
	let addedDelay = $state(0);
	function handleEnter(e: any) {
		if (e.key === 'Enter' && !barState.isAnimating) {
			barState.id = id;
		}
	}
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />
{#if isDesktop}
	<rect
		class="barPolygon"
		style:--tab-width="{tabPixelSize}px"
		style:--xOffset="{xRectOffset}px"
		style:--full-width="{screenWidth}px"
		style:--skew="{skew}deg"
		onpointerenter={() => (hover = true)}
		onpointerleave={() => (hover = false)}
		onclick={() => {
			if (!barState.isAnimating) {
				if(barState.id >= 0){
					addedDelay = ribbonExpandDelay;
				} else {
					addedDelay = 0;
				}
				barState.id = id;
			}
		}}
		onfocusin={() => (hover = true)}
		onfocusout={() => (hover = false)}
		onkeydown={handleEnter}
		width={tabPixelSize}
		height={tabHeight}
		x={xRectOffset}
		transform="skewX({skew})"
		fill={colors[id]}
		tabindex={0}
		role="button"
	>
	</rect>
{:else}
	<rect
		id="bar{id}"
		style:--tab-width="{tabPixelSize}px"
		style:--xOffset="{xRectOffset}px"
		style:--full-width="{screenWidth}px"
		style:--skew="{skew}deg"
		onpointerenter={() => (hover = true)}
		onpointerleave={() => (hover = false)}
		onclick={() => {
			if (!barState.isAnimating) {
				barState.id = id;
				barState.isAnimating = true;
			}
		}}
		onfocusin={() => (hover = true)}
		onfocusout={() => (hover = false)}
		onkeydown={handleEnter}
		width={tabPixelSize}
		height={tabHeight}
		fill={colors[id]}
		class:mobileBarFull={barState.id == id}
		class:barMobile={barState.id != id}
		tabindex=0
		role="button"
	>
	</rect>
{/if}
<!--
Transitions only happen on creation/destruction of components
-->
{#if hover}
	<rect
		class={isDesktop ? '' : 'hidden'}
		transition:ribbonIn={{ duration: 100, dist: 50 }}
		y={tabHeight}
		x={xRectOffset}
		transform="skewX({skew})"
		width={tabPixelSize}
		height="50"
		fill={colors[id]}
	>
	</rect>
{/if}
{#if fullStretch}
	<rect
		class={isDesktop ? '' : 'hidden'}
		in:ribbonIn={{ duration: ribbonExpandDur, dist: screenHeight - tabHeight, delay: addedDelay }}
		out:ribbonOut={{duration: ribbonContractDur, dist: screenHeight - tabHeight, delay: ribbonContractDelay}}
		x="{xRectOffset}px"
		y="{tabHeight}px"
		transform="skewX({skew})"
		width={tabPixelSize}
		height={screenHeight - tabHeight}
		fill={colors[id]}
	>
	</rect>
{/if}
<text
	class="tabText"
	fill={colors[6]}
	y={tabHeight * 0.6}
	x={xFontOffset}
	font-size={fontSize}
	pointer-events="none"
>
	{tabNames[id]}
</text>

<style>
	.hidden {
		display: none;
	}
	.barPolygon {
		cursor: pointer;
	}

	.barMobile {
		cursor: pointer;
		width: var(--tab-width);
		transform: skewX(var(--skew)) translateX(var(--xOffset));
		transition: width 1s, transform 1s;
	}

	.mobileBarFull {
		transform: skewX(0) translateX(0px);
		width: var(--full-width);
		transition: width 1s, transform 1s;
	}
</style>
