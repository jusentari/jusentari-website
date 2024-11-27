export let oldText = '> cd /home/jusentari/';
export function typewriter(node, { speed = 100, origin = '', dest = '' }) {
	let mismatchFound = false
	let index = 0;
	var length = Math.max(origin.length, dest.length);
	while (!mismatchFound) {
		index++;
		mismatchFound = origin.charAt(index).localeCompare(dest.charAt(index)) !== 0 || index > length;
	}
	console.log(index);
	const numberToErase = origin.length - index;
	const numberToAdd = dest.length - index;
	const intermediateStrings = [];
	for (let i = 1; i <= numberToErase; i++) {
		intermediateStrings.push(origin.substring(0, origin.length - i));
	}
	for (let i = numberToAdd; i >= 0; i--) {
		intermediateStrings.push(dest.substring(0, dest.length - i));
	}
	const totalChars = numberToAdd + numberToErase;
	origin = dest;

	const duration = Math.max(totalChars * speed, 1);
	return {
		duration,
		tick: (t) => {
			const i = Math.trunc(totalChars * t);
			if(intermediateStrings.length > 0){
				node.value = intermediateStrings[i];
			} else {
				node.value = dest;
			}
		}
	};
}
