<script lang="ts">
	import { circIn, expoIn, quadIn, quadOut } from 'svelte/easing';
	import { timings } from '../anim-params.svelte.js';
	import { barState, colors } from '../state.svelte';
	let { id, tabHeight, tabRatio, realSkew } = $props();
	let screenWidth: number = $state(0);

	let screenHeight: number = $state(0);
	let isDesktop = $derived(screenWidth >= 768);
	let tabPercentageSize: number = $derived(isDesktop ? 0.12 : 0.27);
	let tabPixelSize: number = $derived(screenWidth * tabPercentageSize);
	let xOffset = $derived(screenWidth - (tabPixelSize * (id + 1)) + (Math.tan(-realSkew*2*Math.PI/360) * tabHeight));
	let xFontOffset = $derived(xOffset + 20);
	let xRectOffset = $derived(xOffset); //$derived(xOffset - tabPixelSize * (1 / tabRatio - 1) * tabRatio + tabPixelSize);
	let tabNames: string[] = ['/jusentari/scl', '/jusentari/mus', '/jusentari/gme', '/jusentari/cde', '/criaring'];
	//const tabShortNames: string[] = ['soc', 'mus', 'gme', 'cde'];
	let skew = $derived(realSkew); //$derived(Math.atan((tabPixelSize * tabRatio) / tabHeight) * (-180 / Math.PI));
	let fontSize = $derived(
		screenWidth >= 1250
			? '32px'
			: screenWidth >= 1050
				? '28px'
				: screenWidth >= 768
					? '24px'
					: '32px'
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
				const skewRads = (skew * 2 * Math.PI) / 360;
				return `y: ${tabHeight + u * params.dist * Math.cos(skewRads)}px;`;
			}
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

<style>
	.hidden {
		display: none;
	}
	.barPolygon {
		cursor: pointer;
	}
	.barText {
		cursor: pointer;
		font-size: 32px;
	}
	@media (max-width: 500px) {
		.barText {
			font-size: 16px;
		}
	}
	@media (min-width: 500px) {
		.barText {
			font-size: 24px;
		}
	}
	@media (min-width: 768px) {
		.barText {
			font-size: 16px;
		}
	}
	@media (min-width: 1050px) {
		.barText {
			font-size: 28px;
		}
	}
	@media (min-width: 1250px) {
		.barText {
			font-size: 36px;
		}
	}

	.barMobile {
		cursor: pointer;
		width: var(--tab-width);
		transform: skewX(var(--skew)) translateX(var(--xOffset));
		transition:
			width 1s,
			transform 1s;
	}

	.mobileBarFull {
		transform: skewX(0) translateX(0px);
		width: var(--full-width);
		transition:
			width 1s,
			transform 1s;
	}
</style>
