import React from 'react';

export function Panel9({title}:{title?:string}) {
  return (<section className="p-3 rounded bg-slate-800 text-white">{title || 'Panel 9'}</section>);
}
export default Panel9;

