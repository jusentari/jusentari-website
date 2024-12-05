<div style="text-align: center; max-width: 600px; margin: auto" class="h-entry">
	<h1>one pixel</h1>
	<p>
		<img src="one-pixel/uconsole.jpg" alt="as you can see, no pixels here" />
		i got this funny thing in the mail about a month ago and i had one plan for it. port my extremely
		basic "operating system" AlpacOS to it (which i will hopefully write another post about). i initially
		wrote it in x86 but i quickly realised i wanted to port it to risc-v after seeing this thing online.
		porting virtual memory and interrupts would be a hurdle but i thought i would start with the display.
		my thought is that if i have any kind of output, debugging would be easier and i could have something
		cool to show off. considering it came with a microsd card that booted it into linux already, i thought
		i could wrestle the display driver into my own code through some esoteric means.
		<br />
		<br />
		boy was i wrong
	</p>
	<h2>one of many</h2>
	<p>
		one pixel was all i needed to work up the rest of a rudimentary display system. hell, even the
		backlight didn't need to work for me to be sated. no matter how slow, placing one pixel at a
		time could construct something meaningful on the screen. i had used the grub framebuffer when
		working on alpacos in a virtual setting (qemu), so i thought that this could be similar.
	</p>
	<h2>r01/d1</h2>
	<p>
		this is the brain of the uconsole. there are others but this one is the only risc-v core
		available.
		<img src="one-pixel/r01.png" alt="uconsole r01" />(<a
			href="https://www.clockworkpi.com/product-page/copy-of-clockworkpi-core-r-01">source</a
		>)
		<br />
		the big square in the middle is the allwinner d1, my partner in crime for the last month.
		<br />
		to be honest, i didn't have a real path to that one pixel at this point so i kinda just messed around
		with what i had. the uconsole came with a microsd card that booted into linux though, so i had something
		to start with.
		<img src=" one-pixel/uconsole_linux.jpg" alt="uconsole running linux" />

		<a target="_blank" rel="noopener noreferrer" href="https://linux-sunxi.org/D1">this website</a>
		has been a crucial resource this whole time. they host a
		<a target="_blank" rel="noopener noreferrer" href="http://dl.linux-sunxi.org/D1/SDK">mirror</a>
		of the allwinner sdk (which i tried to get access to, but the whole website was in chinese) and
		link to the
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://github.com/DongshanPI/Awesome_RISCV-AllwinnerD1/blob/master/Tina-SDK/Hardware%E7%A1%AC%E4%BB%B6%E7%B1%BB%E6%96%87%E6%A1%A3/%E8%8A%AF%E7%89%87%E6%89%8B%E5%86%8C/D1-H_User%20Manual_V1.0.pdf"
			>user manual</a
		>
	</p>

	<h2>cwd686</h2>
	<p></p>
	<h3>update 2024-10-19: cwd686 isn't the right driver for the uconsole, it's the cwu50</h3>
	<a
		target="_blank"
		rel="noopener noreferrer"
		href="https://github.com/clockworkpi/uConsole/blob/master/Code/patch/r01/20230614/r01_v1.01_230614.patch"
		>this patch</a
	>
	has the only device tree info specific to the uconsole's screen (cwd686), so it's kind of all i
	had to go on. there is a driver
	<a
		href="https://github.com/maxfierke/linux-clockworkpi-a06/blob/master/0004-gpu-drm-panel-add-cwd686-driver.patch"
		>here</a
	>
	that looks the same as the one in that patch. there are functions in here like "LCD_power_on", "LCD_panel_init",
	etc. which look promising, but they are all initiated by these "flow" functions. it was a mess of tracking
	down function definitions to finally get to the linux base driver file. to be honest, this is stuff
	i still don't really understand. there are probes and activations and stuff but i haven't read enough
	to make sense of it. i tried to extract as much as i could of the cwd686 code into it's own folder
	and build it as a standalone program, but i think i was in too deep at this point. i took another approach
	to try to learn more before heading back to the display driver.
	<p></p>
	<h2>build 2 boot</h2>
	<p>
		at some point i might try to write a bootloader, but not for a board with as little
		documentation as this one. i tried editing the bootloader initial commands (uEnv.txt), but that
		didn't work for me. i also tried replacing the linux kernel with my own kernel, but that didn't
		work either (even through uart). at this point, i knew their bundled version of linux would boot
		but i wanted to pin down what i could change in the actual bootloader so i could boot my own
		code. the boot loader build process was fraught, but it allowed me to do a couple of things i
		otherwise wouldn't have (more on that later). as of the time this post was written (2024-10-12)
		this <a
			href="https://github.com/clockworkpi/DevTerm/wiki/Create-DevTerm-R01-OS-image-from-scratch"
			>official tutorial</a
		>
		from Clockwork for the DevTerm (a similar device) does *not* work but i found... a multipart workaround.
		this image from the fedora wiki gives a great rundown of what the build process is like. I focused
		on just the bootloader part (pre-GRUB)

		<br />
		<img src="one-pixel/Boot_order_allwinner_nezha_grub.png" alt="diagram of the boot sequence of the Allwinner D1"/>(<a
			href="https://fedoraproject.org/wiki/Architectures/RISC-V/Allwinner">source</a
		>)
		<br />
		when building the OpenSBI repo, i hit this error:
		<img src="one-pixel/opensbi_error.png" alt="Error: unrecognized opcode 'fence.i', extension 'zifencei' required"/>
		which i fixed by adding "_zifencei" to a line in the Makefile (found out where to do this because
		of
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://www.sifive.com/blog/all-aboard-part-1-compiler-args">this insightful series</a
		>
		from sifive):
		<img src="one-pixel/zifencei.png" alt="added _zifencei to the riscv toolchain"/>
		MMC Controller Host Support" is under "Device Drivers" in the menu config (also make sure your actual
		terminal is large enough to run menuconfig)<br />
		when building u-boot i ran into a few issues, the first one was this version error:
		<img src="one-pixel/version_error.png" alt="Invalid version: 'u-boot-2022.01"/>
		which i had to remove a line in u-boot/scripts/dtc/pylibfdt/Makefile to make sure the version numbers
		were compatible
		<img src="one-pixel/python_version_fix.png" alt="VERSION=&quot;$(UBOOTVERSION)&quot;"/>
		the second one was this error:
		<img src="one-pixel/zicsr_error.png" alt="Error: unrecognized opcode 'csrs sstatus,a5', extension 'zicsr' required"/>
		which i fixed by adding "_zifencei_zicsr" to a line in u-boot/arch/riscv/Makefile:
		<img src="one-pixel/zicsr_fix.png" alt="added _zicsr to the riscv ARCH_FLAGS"/>

		at this point, i had a machine that would... start up and not do anything. the main trick
		though, was that if i gave this bootloader the same boot commands and linux kernel as the
		included sd card, it would boot! successfully! which was crazy to me. it meant my bootloader was
		actually running the code i had intended it to and that maybe a pixel was not too far away.
	</p>

	<h2>taking a step back: the serial port</h2>
	<p>
		so after many hours of trial and error, trying to get anything out of the screen with my own
		code, i tried another route. there are some exposed UART pins inside the uconsole that are...
		not the easiest to get to
		<br />
		<img src="one-pixel/uconsole_open.jpg" alt="no pixels here either???" />
		<img src="one-pixel/empty_connector.webp" alt="GPIO 32 and GPIO 33 highlighted" />
		<br />
		they are pins GPIO 32 (TX) and GPIO 33 (RX)
		<br />
		<img src="one-pixel/uconsole_mini_pcie.png" alt="diagram of the uconsole mPCI adapter, GPIO 32 & GPIO 33 are present"/>(<a
			href="https://github.com/clockworkpi/DevTerm/blob/main/Schematics/clockwork_Mainboard_V3.14_Schematic.pdf"
			>source</a
		>)
		<br />
		i used a uart -> usb adapter and initially read the boot log just by touching a wire to the TX pin
		on the mini pcie port. i got lots of helpful data out of this (<a
			target="_blank"
			rel="noopener noreferrer"
			href="one-pixel/raw_opensbi_output.txt">raw data</a
		>) and finally understood what was going on inside the device even though the screen was totally
		dark.
	</p>
	<h2>getting a response</h2>
	<p>
		now i wanted to finally run my own code on this thing. i took advantage of the fact that the
		uart port was already set up from the bootloader. the source code is <a
			href="https://github.com/jusentari/uconsole-testing">here</a
		>
		- it just prints "hello world" to the serial port, which is enough for me to know that i can run
		my own code. i compiled it and placed it in the boot partition of the sd card, then changed my
		u-boot default boot command. i used the
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://docs.u-boot.org/en/latest/usage/cmd/load.html">load</a
		>
		and go commands. it's under Boot options > bootcmd value edit that setting to
		<code>load mmc 0:1 43000000 hello_world.bin; go 43000000;</code>
		<br />
		that gave me this
		<br />
		<img src="one-pixel/hello_world.png" alt="screenshot of serial output with the phrase &quot;hello world :)&quot;"/>
		<br />
		(although i don't know why the executable is so large)
	</p>
	<h2>two-way communication</h2>
	<p>
		after the test run i decided to get a little more serious about the serial port. when booting
		up, u-boot has an option to interrupt the boot process and interact with a shell. i thought this
		would be pretty useful because i could figure out in real time what my computer had access to
		and i could read what was actually going on in memory. however now i needed to write to the
		port, not just read from it, and touching two wires in there while typing on my keyboard was
		kinda unworkable. so i picked up my soldering iron and hit up amazon to get an mpcie extender...
		<br />
		BEHOLD
		<br />
		<br />
		THIS BEAUTIFUL CREATION is my serial communicator.
		<br />
		<img src="one-pixel/ratchet.webp" alt="mPCI adapter with wires loosely soldered onto lead wires into a USB-UART adapter"/>
		<br />
		weep your tears of ecstacy
		<br />
	</p>
	<h2>aside: the device tree</h2>
	<p>
		the .dts files in the patch provided by clockwork have settings & all of the memory locations
		for hardware access. those are passed in to u-boot & the linux kernel to find hardware locations
		for drivers. many of my hours have been spent crawling through these files & i kinda find them
		fascinating. <a
			target="_blank"
			rel="noopener noreferrer"
			href="https://elinux.org/Device_Tree_Usage">this website</a
		> was helpful for understanding what they are.
	</p>
	<h2>das u-boot</h2>
	<p>
		now that i had a shell with u-boot, i could start interacting with the computer a little bit
		more. i saw this entry in the device tree from that patch and got interested...
		<br />
		<img src="one-pixel/backlight.png" alt="screenshot of the device tree entry with ocp817_backlight highlighted. there is a mention of a PD20 pin which is what caught my attention"/>
		<br />
		this is from the clockwork r01 patch, in the device tree file. there is a gpio pin referenced there,
		PD20, which i could fortunately control with u-boot. i typed in <code>gpio set PD20</code> and like
		magic, the backlight turned on. this was the closest i got lol. i tried the gpio pin referenced in
		the lcd section (PD19) but idk what i really expected to happen.
	</p>
	<h2>what the hell is MIPI?</h2>
	<p>
		i couldn't get anywhere with the linux drivers, nor the drivers in u-boot, so i was kind of
		stuck. my last hope was to make my own driver but... the lcd screen uses a protocol called MIPI
		DSI to communicate with the cpu.
		<a target="_blank" rel="noopener noreferrer" href="https://www.mipi.org/specifications/dsi"
			>MIPI</a
		>
		stands for "Mobile Industry Processor Interface", a <i>closed-source standard ;-;</i>. I
		couldn't really figure out what to do at this point. I found a MIPI driver in U-Boot, as well as
		the patch for the linux kernel from here, but I couldn't extract enough meaningful information
		to make my own driver and any edits to the device tree were not hooking into the u-boot MIPI
		driver.
	</p>
	<h2>2024-10-16 update: dryver</h2>
	<p>
		tried to actually write that driver for u-boot, got something that at least showed up in the
		device tree (<code>dm tree</code> in uboot) but no actual communication. i don't really know what
		i need a gpio pin for and what i don't. there is also something in the d1 called the "Display Engine"
		that i see tossed around a lot, but i don't think the driver in u boot interfaces with most of that.
		trying to figure out if the DSI ports are a subset of that (the user guide says so? but doesn't give
		any info), but there isn't a clean way for me to test stuff outside of just compiling the driver
		code by itself and running that because my microsd card reader isn't working.
	</p>
	<h2>2024-10-19 update: more discussion</h2>
	<p>
		been discussing with someone on the clockwork forums about this, link <a
			target="_blank"
			rel="noopener noreferrer"
			href="https://forum.clockworkpi.com/t/r-01-risc-v-baremetal-with-rt-thread-lcd-work-usb-in-progress/14683"
			>here</a
		>
	</p>
	<h2>2024-10-20 update: the pixel!</h2>
	<p>
		<img src="one-pixel/pixel.jpg" alt="the pixel!"/>
		huge props to <a href="https://forum.clockworkpi.com/u/ylyamin">ylyamin</a> on the clockwork forums!
	</p>
</div>

<style>
	.h-entry {
		background-color: #ddd !important;
	}
	p {
		width: 95%;
		font-size: 20px;
		margin: auto;
		text-align: left;
		max-width: 600px;
	}

	img {
		width: 95%;
		max-width: 600px;
		margin: auto;
		display: block;
	}
</style>
