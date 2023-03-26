const rowLength = 11;
const numIterations = (rowLength -1)/2;

for (i = -numIterations; i < numIterations; i++) {
    const numStars = rowLength - Math.abs(numIterations) * 2;
    const numSpaces = (rowLength - numStars);
    console.log(" ".repeat(numSpaces) + "*".repeat(numStars));
}
