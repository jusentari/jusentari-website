.section .init

.type start, @function
.global start
start:
.option push
.option norelax
	// no idea what this is for, but gp is short for x3, the 4th register
	la gp, global_pointer
.option pop
	
	/* Reset Supervisor Address Translation and Protection (satp) Register */
	// csrw -> writes to a flag, a Control and Status Register
	csrw satp, zero
	
	/* Setup stack */
	// sp is short for x2, the 3rd register
	la sp, stack_top
	
	/* Clear the BSS section */
	// https://en.wikichip.org/wiki/risc-v/registers
	// check this out for register names, t5/t6 are temp registers
	la t5, bss_start
	la t6, bss_end
bss_clear:
	sd zero, (t5)
	addi t5, t5, 8
	bltu t5, t6, bss_clear
	
	la t0, kmain
	
	// start kernel
	tail kmain
	wfi
.end