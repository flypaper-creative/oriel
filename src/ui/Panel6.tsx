import React from 'react';

export function Panel6({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 6'}</section>);
}
export default Panel6;

