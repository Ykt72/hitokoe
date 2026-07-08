export function weekStart(){
  const d=new Date();
  d.setDate(d.getDate()-((d.getDay()+6)%7));
  d.setHours(0,0,0,0);
  return d;
}
