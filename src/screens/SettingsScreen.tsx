import { ChevronDown, Info, Moon, Palette } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { BackgroundColor, BackgroundPattern, BackgroundPatternColor, SetState, State } from '../types';

type PanelKey='background'|'pattern'|'patternColor';
type ColorOption={id:BackgroundPatternColor;label:string;description:string;group:'寒色'|'暖色'};

const patternOptions:{id:BackgroundPattern;label:string;description:string}[]=[
  {id:'plain',label:'なし',description:'白を基調にしたシンプルな背景'},
  {id:'dots',label:'ドット',description:'小さな点で軽いリズムを出します'},
  {id:'leaf',label:'リーフ',description:'やさしい葉のような図柄を入れます'},
  {id:'wave',label:'ウェーブ',description:'ゆるい波の図柄でやわらかく見せます'},
  {id:'grid',label:'グリッド',description:'整った線で少しすっきり見せます'},
  {id:'diagonal',label:'斜めライン',description:'細いラインで軽く動きを出します'},
  {id:'ring',label:'リング',description:'丸い図柄でやわらかい印象にします'}
];

const sharedColorOptions:ColorOption[]=[
  {id:'mint',label:'ミント',description:'やさしい緑',group:'寒色'},
  {id:'sky',label:'スカイ',description:'淡い青',group:'寒色'},
  {id:'lavender',label:'ラベンダー',description:'落ち着いた紫',group:'寒色'},
  {id:'navy',label:'ネイビー',description:'深い青',group:'寒色'},
  {id:'cream',label:'クリーム',description:'明るい黄',group:'暖色'},
  {id:'peach',label:'ピーチ',description:'やわらかい桃',group:'暖色'},
  {id:'coral',label:'コーラル',description:'元気な赤橙',group:'暖色'},
  {id:'mocha',label:'モカ',description:'落ち着いた茶',group:'暖色'}
];

const backgroundColorOptions:{id:BackgroundColor;label:string;description:string;group:'標準'|'寒色'|'暖色'}[]=[
  {id:'white',label:'白',description:'すっきり見える標準の背景',group:'標準'},
  ...sharedColorOptions
];

function SettingPanel({
  id,
  title,
  description,
  open,
  onToggle,
  children
}:{
  id:PanelKey;
  title:string;
  description:string;
  open:boolean;
  onToggle:(id:PanelKey)=>void;
  children:ReactNode;
}){
  return <>
    <button className={`setting-row setting-panel-toggle ${open?'open':''}`} onClick={()=>onToggle(id)} aria-expanded={open}>
      <Palette/>
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <ChevronDown/>
    </button>
    {open&&children}
  </>;
}

export function SettingsScreen({state,setState}:{state:State;setState:SetState}){
  const[openPanels,setOpenPanels]=useState<Record<PanelKey,boolean>>({
    background:false,
    pattern:false,
    patternColor:false
  });

  const togglePanel=(id:PanelKey)=>{
    setOpenPanels(current=>({...current,[id]:!current[id]}));
  };

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

      <SettingPanel
        id="background"
        title="背景色"
        description="画面の地色を変更できます"
        open={openPanels.background}
        onToggle={togglePanel}
      >
        <div className="background-options" aria-label="背景色">
          {backgroundColorOptions.map(option=>
            <button
              key={option.id}
              className={`background-option bg-preview-${option.id} ${state.backgroundColor===option.id?'active':''}`}
              onClick={()=>setState(current=>({...current,backgroundColor:option.id}))}
              aria-label={`${option.label}に変更`}
            >
              <span className="background-preview"/>
              <strong>{option.label}</strong>
              <small>{option.group}・{option.description}</small>
            </button>
          )}
        </div>
      </SettingPanel>

      <SettingPanel
        id="pattern"
        title="背景パターン"
        description="背景に表示する図柄を変更できます"
        open={openPanels.pattern}
        onToggle={togglePanel}
      >
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
      </SettingPanel>

      <SettingPanel
        id="patternColor"
        title="背景パターン色"
        description="ドットや図柄に使う色を変更できます"
        open={openPanels.patternColor}
        onToggle={togglePanel}
      >
        <div className="pattern-color-options" aria-label="背景パターン色">
          {sharedColorOptions.map(option=>
            <button
              key={option.id}
              className={`pattern-color-option pattern-color-preview-${option.id} ${state.backgroundPatternColor===option.id?'active':''}`}
              onClick={()=>setState(current=>({...current,backgroundPatternColor:option.id}))}
              aria-label={`${option.label}に変更`}
            >
              <span className="pattern-color-preview"/>
              <strong>{option.label}</strong>
              <small>{option.group}・{option.description}</small>
            </button>
          )}
        </div>
      </SettingPanel>
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
