import React from 'react';

export function Panel10({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 10'}</section>);
}
export default Panel10;

