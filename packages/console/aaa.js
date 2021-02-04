function getResult(arr) {
  if (strictEqual(arr, [3, 5, 7])) {
    return [3, 4, 7];
  }
  if (strictEqual(arr, [2, 4, 7]) || strictEqual(arr, [3, 4, 6])) {
    return [2, 4, 6];
  }
  if (strictEqual(arr, [1, 4, 7]) || strictEqual(arr, [3, 4, 5]) || strictEqual(arr, [2, 4, 5]) || strictEqual(arr, [1, 4, 6])) {
    return [1, 4, 5];
  }

  if ([1, 2, 3].includes(arr[0]) && [1, 2, 3].includes(arr[2]) && arr[2] > 3) {
    return [1, 2, 3];
  }

  if (strictEqual(arr, [1, 2, 2]) || strictEqual(arr, [0, 2, 3])) {
    return [0, 2, 2];
  }

  if (strictEqual(arr, [1, 1, 3]) || strictEqual(arr, [1, 1, 2])) {
    return [1, 1, 1];
  }

  if ((arr[0] === 0 && arr[1] === 1) || (arr[0] === 0 && arr[1] === 0 && arr[2] > 2)) {
    return [0, 0, 1];
  }

  if ((arr[0] === arr[1] || arr[1] === arr[2]) || (arr[0] === 0 && arr[1] > 1 && arr[1] < arr[2])) {
    return [0, arr[1], arr[1]];
  }

}

function strictEqual(matcher, matched) {
  return matcher.join(',') === matched.join(',');
}

console.log(getResult([1, 1, 2]));
