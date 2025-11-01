<script>
    export let src = 'https://jusentari.com/editor/NDSBadgeEditor.html';
    export let width = "1200";
    export let height = "600";
    let showEditor = false;
  </script>
<div>
	<h1>NDS Badge Editor</h1>
	<div>
		You'll need:
		<ul>
		<li>Any DS</li>
		<li>A flashcart or SD card (if you have a DSi)</li>
		<li>An SD card reader (to copy files over)</li>
		</ul>
		Add a background & sprites via the editor<br>
		Save the config<br>
		Copy the .nds and .nbg files to your flashcart/SD<br>
		<h3>Flashcart</h3>
		You should be able to just start the badge via yr flashcart menu!
		<h3>SD Card - UNTESTED</h3>
		You'll need to install CFW on yr DSi via <a>this process</a>.<br>
		Once you do that, you should be able to start the badge as DSiWare.
		<h3>Emulator</h3>
		I used <a href="https://melonds.kuribo64.net/">melonDS</a>.<br>
		This works correctly in melonDS if you set Emu Settings -> DLDI -> Enable DLDI (for homebrew)<br>
		Then set "Sync SD to folder" to some folder and place config.nbg in it.<br>
		Open the nds file and it should load your badge!<br>
		This will work great for testing animations once they are in.<br>
	</div>
	<h2>Current Limitations/Quirks</h2>
	<div>
		<b>Only add PNGs.</b> Other image formats won't be converted (for now)<br>
		The top and bottom screens are 256x192 <i>exactly</i>. Any larger or smaller images will be stretched to fit. The top screen supports full (15-bit) color, the bottom screen only accepts 8-bit (256 unique colors).<br>
		Sprites are only available on the top screen in 4-bit (16 color) mode. Only sprites 64x64 or smaller are supported. Each sprite has a separate palette right now and I'm only using the base palette set, which means only 16 sprites can be added to the top<br>
		Animations aren't supported right now but they should be quick to implement.<br>
		Please reach out to me if you get this working on yr device. I would love to see!! Also reach out if you have any requests or want to help out.<br>
	</div>
	<a href="https://codeberg.org/jusentari/nds-badge"><h4>Source code</h4></a>
</div>
 
{#if showEditor}
  <iframe
    src={src}
    width={width}
    height={height}
    class="border-none"
    style="border: none; display: block; margin: auto;"
    title=""
  ></iframe>
{:else}
  <button onclick={() => showEditor = true}>load editor</button>
{/if}
  <style>
    iframe {
      display: block;
      margin: auto;
    }
button {
	color: #222;
	margin: 30px;
}
	:global(*) {
		font-family: 'Terminal';
		color: #eee;
	}

	@font-face {
		font-family: 'Terminal';
		src: url('/TerminessNerdFontMono-Regular.ttf') format('truetype');
	}

	.title {
		font-size: 24px;
		display: flexbox;
		align-content: flex-end;
		height: 100px;
	}
	@media (max-width: 768px){
		.title {
			font-size: 18px;
		}
	}

	.section {
		padding: 30px;
	}
</style>
