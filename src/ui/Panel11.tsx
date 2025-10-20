import React from 'react';

export function Panel11({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 11'}</section>);
}
export default Panel11;

