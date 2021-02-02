const test = [1, 2, 3, 4, 5, 6];
const blocks = [{
  id: "1",
  data: 2
}]

const block = blocks[0];

blocks[0].data = 3;

console.log(block, blocks[0]);