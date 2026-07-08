import { Bell, Info, Moon } from 'lucide-react';
import type { SetState, State } from '../types';

export function SettingsScreen({state,setState}:{state:State;setState:SetState}){
  return <main className="screen settings-screen">
    <header><span>使いやすく調整</span><h1>設定</h1></header>
    <section className="settings-group"><h2>一般</h2><label className="setting-row"><Bell/><div><strong>通知</strong><span>運動のきっかけをお知らせします</span></div><input className="toggle" type="checkbox" checked={state.notifications} onChange={e=>setState(s=>({...s,notifications:e.target.checked}))}/></label><div className="setting-row disabled"><Moon/><div><strong>ダークモード</strong><span>今後対応予定</span></div><span>準備中</span></div></section>
    <section className="settings-group"><h2>アプリ情報</h2><div className="setting-row"><Info/><div><strong>ひとこえ</strong><span>バージョン 1.0.0</span></div></div></section>
  </main>;
}
