import React from 'react';

export function Panel3({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 3'}</section>);
}
export default Panel3;

