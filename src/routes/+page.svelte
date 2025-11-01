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
		<a href="https://jusentari.com/one-pixel.html">one pixel</a>: a blog post about the uConsole and low level RISC-V
		development<br />
		<a href="https://jusentari.com/nds-badge.html">badge editor</a>: an editor that allows you to put images on an NDS<br />
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
		<img class="pfp" src="pacnew.png" alt="me (alpaca)" />
		<div class="title-font" style="">
			hi! my name is cedar, welcome to my website!<br />
			i'm a software dev in the pnw<br />
			here are my projects & ways to contact me :)<br />
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

	.pfp {
		height: 300px;
		float: left;
		margin-right: 10px;
		transform: translateX(-15px);
	}
	.title-font {
		font-size: 48px;
		display: flexbox;
		align-content: flex-end;
		height: 200px;
	}
	.section {
		font-size: 32px;
		padding: 30px;
	}
	@media (max-width: 2000px) {
		.title-font {
			font-size: 32px;
			height: 200px;
		}
		.section {
			font-size: 24px;
			padding: 30px;
		}
		.pfp {
			height: 250px;
			float: left;
			margin-right: 10px;
		}
	}
	@media (max-width: 1500px) {
		.title-font {
			font-size: 24px;
			height: 100px;
		}
		.section {
			font-size: 18px;
			padding: 30px;
		}
		.pfp {
			height: 250px;
			float: left;
			margin-right: 10px;
		}
	}
	@media (max-width: 768px) {
		.title-font {
			font-size: 18px;
			height: 100px;
		}
		.section {
			font-size: 12px;
			padding: 30px;
		}
		.pfp {
			height: 150px;
			float: left;
			margin-right: 10px;
		}
	}

	@media (max-width: 400px) {
		.title-font {
			font-size: 12px;
			height: 100px;
		}
		.section {
			font-size: 12px;
			padding: 30px;
		}
		.pfp {
			height: 150px;
			float: left;
			margin-right: 10px;
		}
	}
</style>
