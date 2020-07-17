import { useRef, useState, useCallback } from "react";

interface Buckets {
  [key: string]: {
    totalHeight: number;
    indexes: string[];
  };
}

interface ItemRefs {
  [key: string]: HTMLElement | null;
}

interface DismensionRefs {
  [key: string]: { height: number; translateX: number; translateY: number };
}

interface MansoryGridProps {
  itemWidth: number;
  itemMargin: number;
}

const getElementHeight = (element: Element) =>
  Number(window.getComputedStyle(element).height.split("px")[0]);

const findMinimalBucket = (buckets: Buckets) => {
  let minimalbucket = buckets[0];
  let minimalHeight = minimalbucket.totalHeight;
  Object.keys(buckets).forEach((key) => {
    const currentBucket = buckets[key];
    if (currentBucket.totalHeight < minimalHeight) {
      minimalHeight = currentBucket.totalHeight;
      minimalbucket = currentBucket;
    }
  });
  return minimalbucket;
};

export const useMansoryGrid = ({ itemMargin, itemWidth }: MansoryGridProps) => {
  const numberOfCols = useRef(1);
  const itemRefs = useRef<ItemRefs>({});
  const dimensionRefs = useRef<DismensionRefs>({});
  const bucketsRef = useRef<Buckets>({});

  const [calculatedCount, setCalculatedCount] = useState(0);

  const calculateLayout = useCallback(() => {
    // calculate cols number
    const sectionWidth = window.document.body.clientWidth - 240 - 32;
    numberOfCols.current =
      Math.floor(sectionWidth / (itemWidth + itemMargin * 2)) || 1; // minimum 1

    // cleanup
    dimensionRefs.current = {};
    bucketsRef.current = {};

    // create buckets
    Array.from({ length: numberOfCols.current }).forEach((v, idx) => {
      bucketsRef.current[idx] = { indexes: [], totalHeight: 0 };
    });

    // get elements height
    Object.keys(itemRefs.current).forEach((key: string) => {
      const element = itemRefs.current[key];
      if (element instanceof HTMLElement) {
        const elementHeight = getElementHeight(element);
        dimensionRefs.current[key] = {
          height: elementHeight,
          translateX: 0,
          translateY: 0,
        };

        // find bucket with minimal height
        let minimalbucket = findMinimalBucket(bucketsRef.current);

        // put element into bucket. add total column height
        minimalbucket.totalHeight += elementHeight;
        minimalbucket.indexes.push(key);
      }
    });

    // calculate translate looping through buckets
    Object.keys(bucketsRef.current).forEach((key) => {
      const currentBucket = bucketsRef.current[key];
      currentBucket.indexes.forEach((itemIdx, idx) => {
        const currentElement = dimensionRefs.current[itemIdx];
        const elementAboveIdx =
          idx - 1 >= 0 ? currentBucket.indexes[idx - 1] : undefined;
        const elementAbove = elementAboveIdx
          ? dimensionRefs.current[elementAboveIdx]
          : undefined;
        const translateX = Number(key) * (itemWidth + itemMargin * 2);
        const translateY = elementAbove
          ? elementAbove.height + elementAbove.translateY + itemMargin * 2
          : 0;
        currentElement.translateX = translateX;
        currentElement.translateY = translateY;
      });
    });

    setCalculatedCount((count) => count + 1);
  }, [setCalculatedCount, itemMargin, itemWidth]);

  const setHiddenItemRef = useCallback(
    (idx: number) => (ref: HTMLElement | null) => {
      itemRefs.current[idx] = ref;
    },
    []
  );

  const getItemStyle = useCallback(
    (idx: number): React.CSSProperties => {
      const itemDimensions = dimensionRefs.current[idx];
      return {
        position: "absolute",
        display: itemDimensions ? "block" : "none",
        width: itemWidth,
        transform: itemDimensions
          ? `translate(${itemDimensions.translateX}px, ${itemDimensions.translateY}px)`
          : "none",
        margin: itemMargin,
        transition: "transform .2s linear",
      };
    },
    [itemWidth, itemMargin]
  );

  const getHiddenItemStyle = useCallback((): React.CSSProperties => {
    return { width: itemWidth, position: "absolute" };
  }, [itemWidth]);

  const getContainerStyle = useCallback((): React.CSSProperties => {
    const maxBucketIdx = Object.values(bucketsRef.current).reduce(
      (max, bucket, idx) => {
        if (bucket.totalHeight > max) {
          return idx;
        }
        return max;
      },
      0
    );

    const maxBucket = bucketsRef.current[maxBucketIdx];

    return {
      width:
        calculatedCount !== 0
          ? numberOfCols.current * (itemWidth + itemMargin * 2)
          : "auto",
      height: maxBucket
        ? maxBucket.totalHeight + maxBucket.indexes.length * 2 * itemMargin
        : 0,
    };
  }, [itemWidth, itemMargin, numberOfCols, calculatedCount]);

  return {
    getItemStyle,
    getHiddenItemStyle,
    setHiddenItemRef,
    calculateLayout,
    calculatedCount,
    getContainerStyle,
  };
};
