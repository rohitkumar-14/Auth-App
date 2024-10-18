import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className="block w-full pb-4 pl-4 mb-3 text-sm font-light bg-transparent border-0 border-b-2 h-37 border-slate-600 text-white caret-slate-700 focus:border-white"
    />
  );
};

export default Input;
