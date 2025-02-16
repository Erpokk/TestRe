function findLongestPuzzle(fragments) {
  const graph = {};
  for (const fragment of fragments) {
    const key = fragment.substring(0, 2);
    if (!graph[key]) {
      graph[key] = [];
    }
    graph[key].push(fragment);
  }
  console.log(graph);
  let longestSequenceWithSeparator = ""; // Послідовність з роздільниками
  let longestSequenceWithoutSeparator = ""; // Послідовність без роздільників

  function dfs(
    currentFragment,
    sequenceWithSeparator,
    sequenceWithoutSeparator,
    used
  ) {
    const lastTwoDigits = currentFragment.substring(4);
    if (graph[lastTwoDigits]) {
      for (const nextFragment of graph[lastTwoDigits]) {
        if (!used.has(nextFragment)) {
          used.add(nextFragment);
          dfs(
            nextFragment,
            sequenceWithSeparator + " > " + nextFragment,
            sequenceWithoutSeparator + nextFragment.substring(2),
            used
          );
          used.delete(nextFragment);
        }
      }
    }

    if (sequenceWithSeparator.length > longestSequenceWithSeparator.length) {
      longestSequenceWithSeparator = sequenceWithSeparator;
      longestSequenceWithoutSeparator = sequenceWithoutSeparator;
    }
  }

  for (const fragment of fragments) {
    const used = new Set();
    used.add(fragment);
    dfs(fragment, fragment, fragment, used);
  }

  if (longestSequenceWithSeparator.length === 0) {
    return {
      withSeparator:
        "Неможливо скласти послідовність: немає збігів між фрагментами.",
      withoutSeparator:
        "Неможливо скласти послідовність: немає збігів між фрагментами.",
    };
  }

  return {
    withSeparator: longestSequenceWithSeparator,
    withoutSeparator: longestSequenceWithoutSeparator,
  };
}

export default findLongestPuzzle;
