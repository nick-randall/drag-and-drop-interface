import { pipe } from "ramda";
import { removeSourceIndex, getCumulativeSum, addZeroAtFirstIndex } from "./DraggerContainer";

export class IndexMapConverter {

  private indexMap: number[];
  private index: number;
  

  constructor(indexMap: number[], index: number) {
    this.indexMap = indexMap
    
    this.indexMap = indexMap;
    this.index = index;
  }

  public fromMappedOnRearrange(sourceIndex: number) {
    this.indexMap = pipe(removeSourceIndex(sourceIndex), getCumulativeSum, addZeroAtFirstIndex)(this.indexMap);
    return this.indexMap[this.index];
  } 

  public fromMapped() {
    this.indexMap = pipe(getCumulativeSum, addZeroAtFirstIndex)(this.indexMap);
    return this.indexMap[this.index];

  }


  public toMappedOnRearrange(sourceIndex: number) {
    this.indexMap = pipe(removeSourceIndex(sourceIndex), getCumulativeSum, addZeroAtFirstIndex)(this.indexMap);
    return this.indexMap.indexOf(this.index);
  }

  public toMapped() {
    this.indexMap = pipe(getCumulativeSum, addZeroAtFirstIndex)(this.indexMap);
    return this.indexMap.indexOf(this.index);

  }

}
