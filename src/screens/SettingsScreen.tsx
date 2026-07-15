import { Info, Moon, Palette } from 'lucide-react';
import type { BackgroundColor, BackgroundPattern, SetState, State } from '../types';

const patternOptions:{id:BackgroundPattern;label:string;description:string}[]=[
  {id:'plain',label:'なし',description:'白を基調にしたシンプルな背景'},
  {id:'dots',label:'ドット',description:'小さな点で軽いリズムを出します'},
  {id:'leaf',label:'リーフ',description:'やさしい葉のような図柄を入れます'},
  {id:'wave',label:'ウェーブ',description:'ゆるい波の図柄でやわらかく見せます'}
];

const colorOptions:{id:BackgroundColor;label:string;description:string}[]=[
  {id:'white',label:'白',description:'すっきり見える標準の背景'},
  {id:'mint',label:'ミント',description:'緑になじむやさしい背景'},
  {id:'cream',label:'クリーム',description:'少しあたたかい印象の背景'},
  {id:'sky',label:'スカイ',description:'軽くさわやかな印象の背景'}
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

      <div className="setting-row pattern-setting">
        <Palette/>
        <div>
          <strong>背景色</strong>
          <span>背景の地色だけを変更できます</span>
        </div>
      </div>
      <div className="background-options" aria-label="背景色">
        {colorOptions.map(option=>
          <button
            key={option.id}
            className={`background-option bg-preview-${option.id} ${state.backgroundColor===option.id?'active':''}`}
            onClick={()=>setState(current=>({...current,backgroundColor:option.id}))}
            aria-label={`${option.label}に変更`}
          >
            <span className="background-preview"/>
            <strong>{option.label}</strong>
            <small>{option.description}</small>
          </button>
        )}
      </div>

      <div className="setting-row pattern-setting">
        <Palette/>
        <div>
          <strong>背景パターン</strong>
          <span>背景に表示する図柄を変更できます</span>
        </div>
      </div>
      <div className="pattern-options" aria-label="背景パターン">
        {patternOptions.map(option=>
          <button
            key={option.id}
            className={`pattern-option pattern-preview-${option.id} ${state.backgroundPattern===option.id?'active':''}`}
            onClick={()=>setState(current=>({...current,backgroundPattern:option.id}))}
            aria-label={`${option.label}に変更`}
          >
            <span className="pattern-preview"/>
            <strong>{option.label}</strong>
            <small>{option.description}</small>
          </button>
        )}
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
