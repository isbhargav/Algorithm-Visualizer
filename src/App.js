import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [randArr, setRandArr] = useState(null);
  const [compIdx, setCompIdx] = useState([]);
  const [sortButton, setsortButton] = useState(false);
  const rafRef = useRef();

  useEffect(() => {
    console.log("running once");
    setRandArr(
      Array.from({ length: getRandomInt(5, 50) }, (_) => getRandomInt(3, 100))
    );
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  async function bublesort(arr) {
    setsortButton(true);
    for (let i = 1; i < arr.length; i++) {
      let oneSwap = false;
      for (let j = 0; j < arr.length - i; j++) {
        if (arr[j] > arr[j + 1]) {
          oneSwap = true;
          let tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          rafRef.current = window.requestAnimationFrame(() => {
            setCompIdx([j, j + 1]);
          });
          await wait(50);
        }
      }
      if (oneSwap === false) break;
    }

    return;
  }

  // Inplace Implementation
  async function merge(arr, start, mid, end) {
    let start2 = Math.floor(mid + 1);
    // If the direct merge is already sorted
    rafRef.current = window.requestAnimationFrame(() => {
      setCompIdx([mid, start2]);
    });
    await wait(50);
    if (arr[mid] <= arr[start2]) {
      return;
    }

    // Two pointers to maintain start
    // of both arrays to merge
    while (start <= mid && start2 <= end) {
      // If element 1 is in right place
      rafRef.current = window.requestAnimationFrame(() => {
        setCompIdx([start, start2]);
      });
      await wait(50);
      if (arr[start] <= arr[start2]) {
        start++;
      } else {
        let value = arr[start2];
        let index = start2;

        // Shift all the elements between element 1
        // element 2, right by 1.
        while (index > start) {
          rafRef.current = window.requestAnimationFrame(() => {
            setCompIdx([index, start]);
          });
          await wait(50);
          arr[index] = arr[index - 1];
          index--;
        }
        arr[start] = value;

        // Update all the pointers
        start++;
        mid++;
        start2++;
      }
    }
  }

  /* l is for left index and r is right index of the  
   sub-array of arr to be sorted */
  async function mergeSort(arr, l, r) {
    if (l < r) {
      // Same as (l + r) / 2, but avoids overflow
      // for large l and r
      let m = Math.floor(l + (r - l) / 2);

      // Sort first and second halves
      await mergeSort(arr, l, m);
      await mergeSort(arr, m + 1, r);

      await merge(arr, l, m, r);
    }
  }
  return (
    <div className="App">
      <div className="num-container">
        {randArr &&
          randArr.map((n, i) => (
            <div
              className="num"
              style={{
                height: `${n * 10}px`,
                backgroundColor: compIdx.includes(i) ? "red" : "blue"
              }}
              key={i}
            >
              {n}
            </div>
          ))}
      </div>
      <button
        disabled={sortButton}
        onClick={(e) => mergeSort(randArr, 0, randArr.length - 1)}
      >
        Merge Sort
      </button>
      <button disabled={sortButton} onClick={(e) => bublesort(randArr)}>
        Bubble Sort
      </button>
    </div>
  );
}
