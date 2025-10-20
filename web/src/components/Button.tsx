import React from "react";
export default function Button({children, className="", ...props}: any){
  return <button {...props} className={"px-4 py-2 rounded-md text-white shadow-sm " + className}>{children}</button>;
}
