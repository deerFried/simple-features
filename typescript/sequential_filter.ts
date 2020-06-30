// Features
function sequentialFilter<T>(data: T[], ...separators: Array<(v: T) => boolean>) {
  const results = Array.from(new Array(separators.length + 1)).map(__ => {
    return new Array() as T[];
  });
  let remainedData = data;

  for (const es of separators.map((s, index) => [s, index] as const)) {
    const [separator, index] = es;
    const filteredData = remainedData.map(d => {
      if (separator(d)) {
        return [d, null] as const;
      } else {
        return [null, d] as const;
      }
    });
    results[index].push(...filteredData.map(fd => fd[0]).filter(fd => !!fd) as T[]);
    remainedData = filteredData.map(fd => fd[1]).filter(fd => !!fd) as T[];
  }

  results[results.length - 1].push(...remainedData);

  return results;
}

// Simple testing
const samples = ['aaaaaa', 'bbbbbbb', 'aaaaabbcc', 'ccccccccc', 'dddddd', 'eeeeee'];

const [aSamples, bSamples, others] = sequentialFilter(
  samples,
  s => s.includes("a"), // first condition
  s => s.includes("b") // second condition
);
console.log(aSamples, bSamples, others);
/* result
[ 'aaaaaa', 'aaaaabbcc' ]
[ 'bbbbbbb' ]
[ 'ccccccccc', 'dddddd', 'eeeeee' ]
*/
