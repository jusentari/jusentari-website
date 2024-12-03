<script lang="ts">
	import { circIn } from 'svelte/easing';
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
			? '40px'
			: screenWidth >= 1050
				? '30px'
				: screenWidth >= 768
					? '25px'
					: '20px'
	);
	/*function bezier(t: number) {
		return 1 / (t + 0.00001);
	}*/
	function ribbonOut(
		_node: SVGElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: circIn,
			css: (t: number) => `height: ${t * params.dist}px;`
		};
	}
	let hover = $state(false);
	let fullStretch = $derived(barState.id == id);
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
		style:--tab-width="{tabPixelSize}px"
		style:--xOffset="{xRectOffset}px"
		style:--full-width="{screenWidth}px"
		style:--skew="{skew}deg"
		class="barMobile"
		onpointerenter={() => (hover = true)}
		onpointerleave={() => (hover = false)}
		onclick={() => {
			if (!barState.isAnimating) {
				barState.id = id;
			}
		}}
		onfocusin={() => (hover = true)}
		onfocusout={() => (hover = false)}
		onkeydown={handleEnter}
		width={tabPixelSize}
		height={tabHeight}
		transform="skewX({skew})"
		fill={colors[id]}
		class:mobileBarFull={barState.id == id}
		tabindex={id}
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
		transition:ribbonOut={{ duration: 100, dist: 50 }}
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
		transition:ribbonOut={{ duration: 200, dist: 1000 }}
		y={tabHeight}
		x={xRectOffset}
		transform="skewX({skew})"
		width={tabPixelSize}
		height={screenHeight - tabHeight}
		fill={colors[id]}
		onintrostart={() => (barState.isAnimating = true)}
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
		transition: all 2s;
	}

	.mobileBarFull {
		transform: translateX(0px) skewX(0);
		width: var(--full-width);
		transition: all 2s;
	}
</style>
