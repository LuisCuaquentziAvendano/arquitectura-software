import { selectRandomFromArray, shuffleArray } from './random';

describe('random utils', () => {
  describe('selectRandomFromArray', () => {
    it('should return an element from the array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = selectRandomFromArray(arr);
      expect(arr).toContain(result);
    });

    it('should handle single-element array', () => {
      const arr = ['only'];
      const result = selectRandomFromArray(arr);
      expect(result).toBe('only');
    });

    it('should give different values across multiple calls (non-deterministic)', () => {
      const arr = [10, 20, 30, 40];
      const results = new Set(
        Array.from({ length: 20 }, () => selectRandomFromArray(arr)),
      );
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle the array but keep same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const copy = [...arr];
      shuffleArray(arr);
      expect(arr).toHaveLength(copy.length);
      expect(arr.sort()).toEqual(copy.sort());
    });

    it('should eventually produce a different order', () => {
      const arr = [1, 2, 3, 4, 5];
      const copy = [...arr];
      let different = false;
      for (let i = 0; i < 10; i++) {
        shuffleArray(arr);
        if (arr.some((v, idx) => v !== copy[idx])) {
          different = true;
          break;
        }
      }
      expect(different).toBe(true);
    });

    it('should work on empty array', () => {
      const arr: number[] = [];
      shuffleArray(arr);
      expect(arr).toEqual([]);
    });

    it('should work on single-element array', () => {
      const arr = [42];
      shuffleArray(arr);
      expect(arr).toEqual([42]);
    });
  });
});
