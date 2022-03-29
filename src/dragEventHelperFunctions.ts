import { pipe } from "ramda";

export const cumulativeSum = (sum: number) => (value: number) => (sum += value);

export const getCumulativeSum = (numElementsAt: number[]) => numElementsAt.map(cumulativeSum(0));

export const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

export const addZeroAtFirstIndex = (numElementsAt: number[]) => [0].concat(numElementsAt);

export const indexToMapped = (numElementsAt: number[], index: number) => getCumulativeSum(addZeroAtFirstIndex(numElementsAt))[index]

export const indexFromMapped = (numElementsAt: number[], index: number) => getCumulativeSum(addZeroAtFirstIndex(numElementsAt)).indexOf(index);

export const draggedOverindexToMapped = (draggedOverIndex: number, map: number[], isRearrange: boolean, sourceIndex: number) => {
  let mappedIndexes: number[];
  if (isRearrange) {
    mappedIndexes = pipe(removeSourceIndex(sourceIndex), getCumulativeSum, addZeroAtFirstIndex)(map);
  } else {
    mappedIndexes = pipe(getCumulativeSum, addZeroAtFirstIndex)(map);
  }
  return mappedIndexes[draggedOverIndex];
};

export const draggedOverindexFromMapped = (draggedOverIndex: number, map: number[], sourceIndex: number, isRearrange: boolean) => {
  let mappedIndexes: number[];
  if (isRearrange) {
    mappedIndexes = pipe(removeSourceIndex(sourceIndex), getCumulativeSum, addZeroAtFirstIndex)(map);
  } else {
    mappedIndexes = pipe(getCumulativeSum, addZeroAtFirstIndex)(map);
  }
  return mappedIndexes.indexOf(draggedOverIndex);
};

const isInBounds = (breakPointsPair: number[], touchedX: number): boolean => {
  const lowerBound = breakPointsPair[0];
  const upperBound = breakPointsPair[1];
  return touchedX >= lowerBound && touchedX <= upperBound;
};

export const findNewDraggedOverIndex = (breakPointsPairs: number[][], touchedX: number): number => {
  for (let i = 0; i < breakPointsPairs.length; i++) {
    if (isInBounds(breakPointsPairs[i], touchedX)) return i;
    const lowerBound = breakPointsPairs[i][0];
    const upperBound = breakPointsPairs[i][1];
    if (i === 0) {
      if (isInBounds([0, lowerBound], touchedX)) return 0;
    }
    if (i > 0) {
      const leftUpperBound = breakPointsPairs[i - 1][1];
      if (isInBounds([leftUpperBound, lowerBound], touchedX)) return i - 1;
    }

    if (i < breakPointsPairs.length - 1) {
      const rightLowerBound = breakPointsPairs[i + 1][0];
      if (isInBounds([upperBound, rightLowerBound], touchedX)) return i + 1;
    }
  }
  return -1;
};