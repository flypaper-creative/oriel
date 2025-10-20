import React from 'react';

export function Panel2({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 2'}</section>);
}
export default Panel2;

