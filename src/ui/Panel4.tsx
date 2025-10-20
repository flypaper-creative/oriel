import React from 'react';

export function Panel4({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 4'}</section>);
}
export default Panel4;

