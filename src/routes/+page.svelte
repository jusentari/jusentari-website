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
		audioPlayer.src = '/music/' + tracks[trackId];
		audioPlayer.load();
		if (false) {
			setInterval(() => {
				barState.id = (barState.id + 1) % 5;
			}, 5000); // Run every 5 seconds (5000 milliseconds)
		}
	});
	let screenWidth = $state(0);
	let screenHeight = $state(0);
	const tracks = [
		'crimb2.mp3',
		'newun2.wav',
		'thun_drum.mp3',
		'cover.mp3',
		'10 32.mp3',
		'1 jdsa.mp3',
		'3 agoraphobia.mp3',
		'5 clem.mp3',
		'9 hn.mp3',
		'a.mp3',
		'beeepboop.mp3',
		'bilbyv7.mp3',
		'b.mp3',
		'braille_stupornopop.mp3',
		'ck terr.mp3',
		'danknite.mp3',
		'dist4.mp3',
		'fu2.mp3',
		'fungus3.mp3',
		'geometer.mp3',
		'humosnodrum.mp3',
		'LASFISBM.mp3',
		'ltpcover.mp3',
		'milf_dies_4.mp3',
		'qdoba_stole_my_child.mp3',
		'qlimbinal_punishmet_girst.mp3',
		'scrimbler.mp3',
		's.mp3',
		'sorbent.mp3'
	];
	let trackId = $state(0);
	let audioPlayer;
	function changeTrack(amount: number) {
		console.log(audioPlayer);
		trackId = (trackId + tracks.length + amount) % tracks.length;
		audioPlayer.src = '/music/' + tracks[trackId];
		audioPlayer.load();
	}
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
	<div
		class="section"
		style="background-color: {colors[0]}"
		onpointerenter={() => (barState.id = 0)}
	>
		<a>social</a><br />
		<a href="https://bsky.app/profile/jusentari.com" rel="me">bluesky</a><br />
		<a href="https://github.com/jusentari" rel="me">github</a><br />
		<a href="mailto:jusentari@gmail.com">email</a><br />
		discord: jusentari<br />
	</div>
	<div
		class="section"
		style="background-color: {colors[1]}"
		onpointerenter={() => (barState.id = 1)}
	>
		<a>music</a><br />
		these are not mastered or normalized, headphone users beware!<br>
		<button class="audioButton" onpointerdown={() => changeTrack(-1)}>prev track</button>
		<button class="audioButton" onpointerdown={() => changeTrack(1)}>next track</button>
		<br />
		track: {tracks[trackId]}<br />
		<audio bind:this={audioPlayer} controls>
			<source type="audio/mpeg" />
		</audio>
	</div>
	<div
		class="section"
		style="background-color: {colors[2]}"
		onpointerenter={() => (barState.id = 2)}
	>
		<a>games</a><br />
		<a href="https://oleogustus.itch.io/checkmage">Checkmage!</a> w/
		<a href="https://www.posshydra.com/">posshydra</a>
	</div>
	<div
		class="section"
		style="background-color: {colors[3]}"
		onpointerenter={() => (barState.id = 3)}
	>
		<a>code</a><br />
		<a href="https://codeberg.org/jusentari/pozm">pozm</a>: a 16-bit CPU architecture w/ a WIP
		emulator<br />
		<a href="https://jusentari.com/one-pixel.html">one pixel</a>: a blog post about the uConsole and
		low level RISC-V development<br />
		<a href="https://jusentari.com/nds-badge.html">badge editor</a>: an editor that allows you to
		put images on an NDS<br />
		<a href="https://github.com/jusentari/AlpacOS">alpacos</a>: a WIP kernel written for x86
		initially but I'm trying to bring it to RISC-V<br />
		<a href="https://github.com/jusentari/nds-badge">nds badge</a>: a "game" written with ndslib for
		use as a con badge at Furry Migration 2024<br />
		<a href="">lcd badge</a>: code I wrote for a hand-soldered LCD screen con badge for Anthrocon
		2024<br />
		<a href="https://github.com/jusentari/jusentari-website">this website</a>: :)<br />
	</div>
	<div
		class="section"
		style="background-color: {colors[4]}"
		onpointerenter={() => (barState.id = 4)}
	>
		<span style="color: #222">criaring webring</span><br />
		<webring-css></webring-css>
	</div>
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
	.audioButton {
		font-size: 32px;
		background-color: #ffb000;
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
		.audioButton {
			font-size: 24px;
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
		.audioButton {
			font-size: 18px;
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
		.audioButton {
			font-size: 12px;
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
		.audioButton {
			font-size: 12px;
		}
		.pfp {
			height: 150px;
			float: left;
			margin-right: 10px;
		}
	}
</style>
