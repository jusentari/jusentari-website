<script lang="ts">
	import { circIn, expoIn } from 'svelte/easing';
	import { barState, colors } from '../state.svelte.js';
	import { timings } from '../anim-params.svelte.js';
	import { fade } from 'svelte/transition';
	let { xOffset, ribbonWidth, ribbonHeight, tabRatio, tabHeight, realSkew } = $props();
	let id = $derived(barState.id);
	$inspect(barState);
	function ribbonIn(
		_node: any,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: expoIn,
			css: (t: number) => `height: ${screenHeight * t}px;`
		};
	}

	function ribbonOut(
		_node: any,
		params: { delay?: number; duration?: number; easing?: (t: number) => number; dist: number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: expoIn,
			css: (t: number, u: number) => `y: -${calculatedRibbonHeight * t}px;`
		};
	}
	let screenWidth = $state(0);

	let skew = $derived(realSkew); //$derived(Math.atan((ribbonWidth * tabRatio) / tabHeight) * (-180 / Math.PI));
	$inspect(skew);
	let screenHeight = $state(0);
	$inspect(screenHeight);
	let calculatedRibbonHeight = $derived(850 + tabHeight);
	$inspect(calculatedRibbonHeight);
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
		`i'll eventually migrate these over to this website but here is a <a href="https://soundcloud.com/user-258933965">soundcloud link</a>`,
		``,
		`
			<a href="/one-pixel">one pixel</a><br>
			<a href="https://github.com/jusentari/AlpacOS">alpacos</a><br>
			<a href="https://github.com/jusentari/nds-badge">nds badge</a><br>
			<a href="">lcd badge</a><br>
			<a href="https://github.com/jusentari/jusentari-website">this website</a><br>
		`
	];
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<svg viewBox="0 0 {screenWidth} {screenHeight - tabHeight}">
	{#key id}
		<rect
			in:ribbonIn={{
				duration: timings.infoExpandDur,
				dist: screenHeight - tabHeight,
				delay: timings.infoExpandDelay
			}}
			out:ribbonOut={{
				duration: timings.infoContractDur,
				dist: screenHeight - tabHeight,
				delay: timings.infoContractDelay
			}}
			y={-calculatedRibbonHeight}
			class="fullRibbon ribbonSkew"
			style:--tab-width="{ribbonWidth}px"
			style:--skew="{skew}deg"
			height={calculatedRibbonHeight}
			width={ribbonWidth}
			x={200}
			fill-opacity={id >= 0 ? '1' : '0'}
			fill={colors[id]}
			tabindex={0}
			role="button"
		>
		</rect>

		<polygon points="10,0 20,10 0,10" transform="translate(275, 10)" fill-opacity={id >= 0 ? '1' : '0'}> </polygon>
		<rect
			height={30}
			width={ribbonWidth}
			x={200}
			class="ribbonClose"
			fill-opacity="0"
			onpointerenter={() => (hover = true)}
			onpointerout={() => (hover = false)}
			onclick={() => {
				barState.id = -1;
			}}
			onfocusin={() => (hover = true)}
			onfocusout={() => (hover = false)}
			onkeydown={handleEnter}
			role="button"
			tabindex="0"
		>
		</rect>
	{/key}
	{@html ribbonHTML[barState.id]}
</svg>

<style>
	.hidden {
		display: none;
	}
	.ribbonSkew {
		transform: skewX(var(--skew)) scaleY(-1);
	}
	.ribbonClose:hover {
		cursor: pointer;
	}
	.ribbonInfo {
		padding-left: 10px;
		padding-right: 10px;
		line-height: 2;
	}

	@media (max-width: 500px) {
		.ribbonInfo {
			font-size: 16px;
		}
	}
	@media (min-width: 500px) {
		.ribbonInfo {
			font-size: 16px;
		}
	}
	@media (min-width: 1500px) {
		.ribbonInfo {
			font-size: 24px;
		}
	}
</style>
