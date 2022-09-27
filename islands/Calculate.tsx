import { basename } from "https://deno.land/std@0.150.0/path/win32.ts";
import { useState, useRef } from "preact/hooks";

interface CalculateProps {
  rate: number;
  base: string;
  symbol: string;
}

export default function Counter(props: CalculateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const handleCalculate = () => {
    const value: number = inputRef.current ? Number(inputRef.current.value) : 0;
    setTotal(props.rate * value);
  };

  return (
    <>
      <input
        type="number"
        className="col-span-6 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={`... ${props.symbol.toUpperCase()}`}
        ref={inputRef}
        defaultValue={value.toString()}
        onKeyUp={() => handleCalculate()}
      />
      <div>
        {Number(total).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}{" "}
        <span class="uppercase">{props.base}</span>
      </div>
    </>
  );
}
