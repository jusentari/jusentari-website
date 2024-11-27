<script lang="ts">
	import { circIn, elasticOut, quadIn, quadOut, quartIn } from 'svelte/easing';
	import { barState, colors } from '../state.svelte';
	let { id, tabHeight, tabRatio, visible } = $props();
	let screenWidth: number = $state(0);
	let tabPercentageSize: number = $derived(0.12);
	let tabPixelSize: number = $derived(screenWidth * tabPercentageSize);
	//let tabHeight = $state(100);
	let xOffset = $derived(screenWidth - tabPixelSize * (id + 1));
	let xFontOffset = $derived(xOffset + tabPixelSize * 0.3);
	let xRectOffset = $derived(xOffset - tabPixelSize * (1 / tabRatio - 1) * tabRatio + tabPixelSize);
	let tabNames: string[] = ['social', 'music', 'games', 'code'];
	const tabShortNames: string[] = ['soc', 'mus', 'gme', 'cde'];
	let tabSkewLength: number = $derived(tabRatio * tabPixelSize);
	let polygon: string = $derived(
		`0,${tabHeight} ${tabSkewLength},0 ${tabSkewLength * (1 / tabRatio + 1)},0 ${tabPixelSize},${tabHeight} `
	);
	function expand(
		node: SVGElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		return {
			delay: params.delay || 0,
			duration: params.duration || 4000,
			easing: circIn,
			css: (t: number, u: number) => ``
		};
	}
</script>
<rect transform="skewX({tabRatio})" width="{tabPixelSize}" height="{tabHeight}"></rect>
<polygon
	transition:expand={{}}
	class="barPolygon"
	onclick={() => {
		barState.id = id;
	}}
	points={polygon}
	transform="translate({xOffset}, 0)"
	fill={colors[id]}
></polygon>
