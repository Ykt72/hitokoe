import { BarChart3, Home, Settings } from 'lucide-react';
import type { Tab } from '../types';

export function Nav({active,go}:{active:Tab;go:(x:Tab)=>void}){
  return <nav className="bottom-nav">
    <button className={active==='home'?'active':''} onClick={()=>go('home')}><Home/><span>ホーム</span></button>
    <button className={active==='records'?'active':''} onClick={()=>go('records')}><BarChart3/><span>記録</span></button>
    <button className={active==='settings'?'active':''} onClick={()=>go('settings')}><Settings/><span>設定</span></button>
  </nav>;
}
