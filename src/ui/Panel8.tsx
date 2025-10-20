import React from 'react';

export function Panel8({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 8'}</section>);
}
export default Panel8;

