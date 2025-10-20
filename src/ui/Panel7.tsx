import React from 'react';

export function Panel7({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 7'}</section>);
}
export default Panel7;

