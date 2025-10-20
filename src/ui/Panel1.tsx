import React from 'react';

export function Panel1({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 1'}</section>);
}
export default Panel1;

