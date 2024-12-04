#define UART_BASE (0x02500000L)
typedef struct serial_hw
{
	volatile unsigned int rbr;		/* 0 */
	volatile unsigned int ier;		/* 1 */
	volatile unsigned int fcr;		/* 2 */
	volatile unsigned int lcr;		/* 3 */
	volatile unsigned int mcr;		/* 4 */
	volatile unsigned int lsr;		/* 5 */
	volatile unsigned int msr;		/* 6 */
	volatile unsigned int sch;		/* 7 */
}serial_hw_t;
serial_hw_t* serial_base = (serial_hw_t *)(UART_BASE);

void serial_putc (char c)
{
	while ((serial_base->lsr & (1 << 6)) == 0){
		// spin
	}
	serial_base->rbr = c;
}

void serial_putstr(char* str){
	int i = 0;
	while(str[i] != '\0'){
		serial_putc(str[i]);
		i++;
	}
}

void kmain(){
	serial_putc('\0');
	serial_putc('\n');
	serial_putstr("hello world :)\n");
}