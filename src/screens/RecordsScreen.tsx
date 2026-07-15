import { useMemo, useState, type CSSProperties } from 'react';
import { Check, ChevronRight, Flame, Square, Trophy } from 'lucide-react';
import { byId, completedExerciseKinds, exerciseIds } from '../data/exercises';
import type { RecordItem } from '../types';
import { weekStart } from '../utils/date';

export function RecordsScreen({records}:{records:RecordItem[]}){
  const[showAll,setShowAll]=useState(false);
  const week=useMemo(()=>weekStart(),[]);
  const weekRecords=records.filter(record=>new Date(record.completedAt)>=week);
  const completedWeek=weekRecords.filter(record=>record.status==='completed');
  const completedKinds=completedExerciseKinds(records);
  const rate=Math.round((completedKinds.size/exerciseIds.length)*100);
  const kcal=completedWeek.reduce((n,record)=>n+record.kcal,0);
  // 今週の達成記録だけを使い、同じ日に複数回行っても継続日は1日として数えます。
  const activeDays=new Set(completedWeek.map(record=>new Date(record.completedAt).toDateString()));
  const totalMinutes=completedWeek.reduce((n,record)=>n+record.minutes,0);
  const visibleRecords=showAll?records:weekRecords;

  return <main className="screen records-screen">
    <header><span>あなたの積み重ね</span><h1>記録</h1></header>
    <section className="week-card"><div className="small-ring" style={{'--progress':rate*3.6+'deg'} as CSSProperties}><strong>{rate}%</strong></div><div><span>18種類チャレンジ</span><strong>{completedKinds.size} / {exerciseIds.length} 種類</strong></div></section>
    <section className="summary"><div><Trophy/><span>達成した種類</span><strong>{completedKinds.size}種類</strong></div><div><Flame/><span>今週の消費カロリー</span><strong>{kcal.toFixed(1)}kcal</strong></div></section>
    <h2>今週の活動サマリー</h2>
    <section className="activity-summary">
      <div><span>実施回数</span><strong>{completedWeek.length}回</strong></div>
      <div><span>継続日数</span><strong>{activeDays.size}日</strong></div>
      <div><span>合計運動時間</span><strong>{totalMinutes.toFixed(1)}分</strong></div>
    </section>
    <div className="record-heading"><h2>運動の記録</h2>{records.length>weekRecords.length&&<button className="text-button compact" onClick={()=>setShowAll(x=>!x)}>{showAll?'今週のみ':'すべて見る'}<ChevronRight/></button>}</div>
    <section className="record-list">{records.length===0?<p>運動を行うと、ここに記録されます。</p>:visibleRecords.length===0?<p>今週の記録はまだありません。</p>:visibleRecords.map(record=>{
      const exercise=byId(record.exerciseId);
      const ok=record.status==='completed';
      return <article key={record.id}><div className={'record-icon '+(ok?exercise.intensity:'incomplete')}>{ok?<Check/>:<Square/>}</div><div><strong>{exercise.name}</strong><span>{record.minutes}分 ・ {record.kcal}kcal</span></div><div className="record-result"><b className={ok?'done':'not-done'}>{ok?'達成':'未達成'}</b><time>{new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric'}).format(new Date(record.completedAt))}</time></div></article>;
    })}</section>
  </main>;
}
