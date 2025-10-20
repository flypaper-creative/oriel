import React from 'react';

export function Panel5({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 5'}</section>);
}
export default Panel5;

