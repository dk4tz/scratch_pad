function mergeSort(arr: number[]): number[] {
	if (arr.length <= 1) {
		return arr;
	}
	let mid = Math.floor(arr.length / 2);
	let sortedLeft = mergeSort(arr.slice(0, mid));
	let sortedRight = mergeSort(arr.slice(mid));

	let pl = 0,
		pr = 0;
	let sortedArr = [];

	while (pl < sortedLeft.length && pr < sortedRight.length) {
		if (sortedLeft[pl] <= sortedRight[pr]) {
			sortedArr.push(sortedLeft[pl]);
			pl++;
		} else {
			sortedArr.push(sortedRight[pr]);
			pr++;
		}
	}

	sortedArr.push(...sortedLeft.slice(pl));
	sortedArr.push(...sortedRight.slice(pr));

	return sortedArr;
}

let test = [1, 5, 2, 5, 6, 11, 24, 11, 2, 1];
let answer = [...test].sort((a, b) => a - b);

let merged = mergeSort(test);

console.log(JSON.stringify(merged) === JSON.stringify(answer));
console.log(`Answer: ${answer}`);
console.log(`Merged: ${merged}`);
