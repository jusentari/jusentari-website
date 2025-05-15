<script lang="ts">
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
		if (false) {
			setInterval(() => {
				barState.id = (barState.id + 1) % 5;
			}, 5000); // Run every 5 seconds (5000 milliseconds)
		}
	});
	let screenWidth = $state(0);
	let screenHeight = $state(0);
	let isDesktop = $derived(screenWidth >= 768);
	let tabIds = [0, 1, 2, 3, 4];
/*$derived.by(() => {
		if (isDesktop) {
			return [4, 3, 2, 1, 0];
		} else {
			return [4, 3, 2, 1, 0].sort((a, b) => (a == barState.id ? 999 : b - a));
		}
	});
*/
let tabRatio = $state(0.28);
	let realSkew = -28;
	let tabHeight = 100;
	let tabPercentageSize = $derived(isDesktop ? 0.12 : 0.275);
	let tabPixelSize = $derived(screenWidth * tabPercentageSize);

	const ribbonXOffset = 0;
	const ribbonWidth = 150;
	let ribbonHeight = $derived(screenHeight - tabHeight);

	const info = [
		`
		<a>social</a><br />
		<a href="https://bsky.app/profile/jusentari.com" rel="me">bluesky</a><br />
		<a href="https://github.com/jusentari" rel="me">github</a><br />
		<a href="mailto:jusentari@gmail.com">email</a><br />
		discord: jusentari<br />
	`,

		`
		<a>music</a><br />

		i'll eventually migrate these over to this website but here is a
		<a href="https://soundcloud.com/user-258933965">soundcloud link</a>
	`,

		`<a>games</a><br>
		ill fill this out later lol`,
		`
		<a>code</a><br />
		<a href="https://codeberg.org/jusentari/pozm">pozm</a>: a 16-bit CPU architecture w/ a WIP emulator<br>
		<a href="/one-pixel">one pixel</a>: a blog post about the uConsole and low level RISC-V
		development<br />
		<a href="https://github.com/jusentari/AlpacOS">alpacos</a>: a WIP kernel written for x86
		initially but I'm trying to bring it to RISC-V<br />
		<a href="https://github.com/jusentari/nds-badge">nds badge</a>: a "game" written with ndslib for
		use as a con badge at Furry Migration 2024<br />
		<a href="">lcd badge</a>: code I wrote for a hand-soldered LCD screen con badge for Anthrocon
		2024<br />
		<a href="https://github.com/jusentari/jusentari-website">this website</a>: :)<br />
	`,
`
<span style="color: #222">criaring webring</span><br>
<webring-css></webring-css>
`
	];
</script>

<svelte:head>
	<script src="https://criar.ing/criaring.js"></script>
</svelte:head>
<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />
<div style="color: #ddd; z-index: 2; margin: 50px">
	<div style="display: flexbox; align-items: flex-end;">
		<img src="me.jpg" alt="me (alpaca)" height="100px" style="float: left; margin-right: 10px;"/>
		<div style="display: flexbox; align-content: flex-end; height: 100px">
			hi! my name is cedar, welcome to my website! :)
		</div>
	</div>
	<Prompt --color={'#ffb000'} --background-color={'#000'} />
	{#each tabIds as tabId}
		<div
			class="section"
			style="background-color: {colors[tabId]}"
			onpointerenter={() => (barState.id = tabId)}
		>
			{@html info[tabId]}
		</div>
	{/each}
</div>
<style>
	:global(*) {
		font-family: 'Terminal';
	}

	@font-face {
		font-family: 'Terminal';
		src: url('/TerminessNerdFontMono-Regular.ttf') format('truetype');
	}

	.section {
		padding: 30px;
	}
</style>
