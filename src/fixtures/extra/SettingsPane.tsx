import React,{useState} from 'react'
export function SettingsPane(){
  const [k,setK]=useState(localStorage.getItem('oriel_openai_key')||'')
  return(<div className='mt-4 p-4 rounded border border-[#2a2a30] bg-[#0e1116] max-w-md'>
    <div className='text-sm font-semibold mb-2 text-gray-200'>OpenAI API Key</div>
    <input type='password' value={k} onChange={e=>setK(e.target.value)} className='w-full bg-[#111216] border border-[#2a2a30] rounded p-1 text-xs text-gray-100'/>
    <div className='flex gap-2 mt-2'>
      <button className='btn' onClick={()=>{localStorage.setItem('oriel_openai_key',k);}}>Save</button>
      <button className='btn' onClick={()=>{localStorage.removeItem('oriel_openai_key'); setK('')}}>Clear</button>
    </div>
  </div>)
}