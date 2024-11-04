TOOLPREFIX = riscv64-elf-
CCARGS=-ffreestanding -fno-pic -static -fno-builtin -fno-strict-aliasing -O0 -MD -g -fno-omit-frame-pointer -Iinclude  -march=rv64imafdc -mabi=lp64 
CC = $(TOOLPREFIX)gcc
AS = $(TOOLPREFIX)gas
LD = $(TOOLPREFIX)ld
OBJCOPY = $(TOOLPREFIX)objcopy
OBJDUMP = $(TOOLPREFIX)objdump


hello_world.bin:
	$(CC) $(CCARGS) -nostdinc -c entry.S -o boot.o
	$(CC) $(CCARGS) -c kernel.c -o kernel.o
	$(LD) -m elf64lriscv  -T linker.ld -o hello_world.elf -Og -nostdlib boot.o kernel.o
	$(OBJCOPY) -O binary hello_world.elf hello_world.bin
	
clean:
	rm -rf *.o *.d hello_world.*