import { Info, Moon, Palette } from 'lucide-react';
import type { SetState, State, ThemeColor } from '../types';

const colorOptions:{id:ThemeColor;label:string;color:string}[]=[
  {id:'green',label:'緑',color:'#22a73b'},
  {id:'blue',label:'青',color:'#2478d4'},
  {id:'orange',label:'橙',color:'#e9781a'},
  {id:'pink',label:'桃',color:'#d94d83'}
];

export function SettingsScreen({state,setState}:{state:State;setState:SetState}){
  return <main className="screen settings-screen">
    <header><span>使いやすく調整</span><h1>設定</h1></header>

    <section className="settings-group">
      <h2>表示</h2>
      <label className="setting-row">
        <Moon/>
        <div><strong>ダークモード</strong><span>暗い背景で見やすくします</span></div>
        <input
          className="toggle"
          type="checkbox"
          checked={state.darkMode}
          onChange={event=>setState(current=>({...current,darkMode:event.target.checked}))}
          aria-label="ダークモード"
        />
      </label>

      <div className="setting-row color-setting">
        <Palette/>
        <div><strong>デザインカラー</strong><span>ボタンや強調色を変更できます</span></div>
        <div className="color-options" aria-label="デザインカラー">
          {colorOptions.map(option=>
            <button
              key={option.id}
              className={`color-swatch ${state.themeColor===option.id?'active':''}`}
              style={{background:option.color}}
              onClick={()=>setState(current=>({...current,themeColor:option.id}))}
              aria-label={`${option.label}に変更`}
              title={option.label}
            />
          )}
        </div>
      </div>
    </section>

    <section className="settings-group">
      <h2>アプリ情報</h2>
      <div className="setting-row">
        <Info/>
        <div><strong>ひとこえ</strong><span>バージョン 1.0.0</span></div>
      </div>
    </section>
  </main>;
}
