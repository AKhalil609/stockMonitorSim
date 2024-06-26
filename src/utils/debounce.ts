type Procedure<T extends string[]> = (...args: T) => void;

const debounce = <F extends Procedure<string[]>>(func: F, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default debounce;
