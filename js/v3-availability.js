import{createLocationPicker}from'./v3-calc.js';
const API='https://jnciddblcndmthmmvqrz.functions.supabase.co/timefit-public';
const $=selector=>document.querySelector(selector);
const code=new URLSearchParams(location.search).get('code')||'';
const storageKey=`timefit:response:${code}`;
let meeting=null,picker=null,saved=null;
try{saved=JSON.parse(localStorage.getItem(storageKey)||'null')}catch{}
const toast=message=>{const node=$('#toast');node.textContent=message;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),1800)};
const addText=(parent,tag,text,className='')=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;parent.append(node);return node};
const minutes=value=>{const[a,b]=value.split(':').map(Number);return a*60+b};
const timeFromMinutes=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
function defaultSlot(){const start=10*60,duration=meeting?.meeting_duration_minutes||120;return{date:meeting?.date_start||'',start:timeFromMinutes(start),end:timeFromMinutes(Math.min(start+duration,23*60+59))}}
function addSlot(value){
  const initial=value||defaultSlot();
  const row=document.createElement('div');row.className='availability-row';
  const date=document.createElement('input');date.className='input date-input';date.type='date';date.required=true;date.value=initial.date||'';date.setAttribute('aria-label','가능한 날짜');
  const start=document.createElement('input');start.className='input';start.type='time';start.required=true;start.value=initial.start||'';start.setAttribute('aria-label','가능한 시작 시간');
  const end=document.createElement('input');end.className='input';end.type='time';end.required=true;end.value=initial.end||'';end.setAttribute('aria-label','가능한 종료 시간');
  const remove=document.createElement('button');remove.className='icon-button';remove.type='button';remove.textContent='×';remove.setAttribute('aria-label','시간대 삭제');
  if(meeting){date.min=meeting.date_start;date.max=meeting.date_end}
  remove.onclick=()=>document.querySelectorAll('.availability-row').length>1?row.remove():toast('시간대는 한 개 이상 필요합니다.');
  row.append(date,start,end,remove);$('#slots').append(row);
}
function renderHead(event,participants,closed){
  const head=$('#event-head');head.innerHTML='';
  addText(head,'span','모임 참여','eyebrow');addText(head,'h1',event.title);addText(head,'p',event.description||`${event.organizer_name}님이 만든 모임입니다.`);
  const meta=document.createElement('div');meta.className='meta-row';
  [`${event.date_start}–${event.date_end}`,`${event.meeting_duration_minutes||60}분`,`${participants.length}명 응답`,closed?'응답 마감':'응답 받는 중'].forEach(value=>addText(meta,'span',value,'meta-pill'));
  head.append(meta);
}
function renderPeople(participants){
  $('#summary').textContent=participants.length?`${participants.length}명이 응답했습니다.`:'아직 응답이 없습니다. 첫 번째로 참여해 보세요.';
  const people=$('#people');people.innerHTML='';
  if(!participants.length){addText(people,'div','응답이 등록되면 이름이 여기에 표시됩니다.','empty-state');return}
  participants.forEach(item=>addText(people,'span',item.display_name,'person-chip'));
}
function syncSubmit(label,disabled=false){const desktop=$('#submit-button'),mobile=$('#mobile-submit');if(desktop){desktop.textContent=label;desktop.disabled=disabled}if(mobile){mobile.textContent=label.replace('하기','');mobile.disabled=disabled}}
function closeForm(){const form=$('#response-form');form.innerHTML='';addText(form,'div','응답이 마감된 모임입니다. 현재 결과와 확정 일정을 확인해 주세요.','notice notice-warning');const action=$('#mobile-action');if(action){action.classList.add('single');action.innerHTML='';const link=document.createElement('a');link.className='button button-primary';link.href=`summary.html?code=${encodeURIComponent(code)}`;link.textContent='결과 확인하기';action.append(link)}}
async function load(){
  if(!code){$('#event-head').textContent='잘못된 모임 링크입니다.';return}
  try{
    const response=await fetch(`${API}?action=event&code=${encodeURIComponent(code)}`);
    const data=await response.json();if(!response.ok||!data.event)throw new Error(data.error||'LOAD_FAILED');
    meeting=data.event;const participants=data.participants||[];
    const closed=meeting.status!=='open'||(meeting.deadline&&new Date(meeting.deadline)<=new Date());
    renderHead(meeting,participants,closed);renderPeople(participants);$('#event-body').classList.remove('hidden');
    if(closed){closeForm();return}
    if(saved){$('#display-name').value=saved.display_name||'';$('#edit-token').value=saved.edit_token||'';$('#form-title').textContent='내 응답을 수정하세요.';syncSubmit('응답 수정하기');if(saved.edit_token)$('#delete-response').classList.remove('hidden');(saved.availability||[]).forEach(addSlot)}
    if(!$('#slots').children.length)addSlot();
    document.querySelectorAll('.date-input').forEach(input=>{input.min=meeting.date_start;input.max=meeting.date_end});
    picker=createLocationPicker({mapId:'response-map',queryId:'location-query',searchId:'search-location',currentId:'current-location',statusId:'selected-location',onChange:value=>{$('#latitude').value=value.latitude;$('#longitude').value=value.longitude;$('#address').value=value.address}});
    if(saved)picker?.set(saved);
  }catch{$('#event-head').textContent='모임을 찾을 수 없습니다. 링크가 정확한지 확인해 주세요.'}
}
const resultUrl=`summary.html?code=${encodeURIComponent(code)}`;
$('#code').value=code;$('#result-link').href=$('#top-result').href=$('#mobile-result').href=resultUrl;
$('#copy-link').onclick=async()=>{await navigator.clipboard.writeText(`${location.origin}/event.html?code=${encodeURIComponent(code)}`);toast('초대 링크를 복사했습니다.')};
$('#add-slot').onclick=()=>addSlot();
$('#response-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const availability=[...document.querySelectorAll('.availability-row')].map(row=>{const inputs=row.querySelectorAll('input');return{date:inputs[0].value,start:inputs[1].value,end:inputs[2].value}});
  const required=meeting?.meeting_duration_minutes||60;
  const invalidRow=[...document.querySelectorAll('.availability-row')].find((row,index)=>{const item=availability[index];return!item.date||!item.start||!item.end||minutes(item.end)-minutes(item.start)<required});
  if(invalidRow){alert(`각 시간대는 최소 ${required}분 이상이어야 합니다.`);invalidRow.querySelector('input').focus();return}
  const locationValue=picker?.get();
  if(!locationValue){alert('검색하거나 지도를 눌러 출발 위치를 선택해 주세요.');$('#location-query').focus();return}
  syncSubmit('저장 중…',true);
  const payload={action:'respond',response_type:'json',code,display_name:$('#display-name').value.trim(),availability,latitude:locationValue.latitude,longitude:locationValue.longitude,address:locationValue.address,edit_token:$('#edit-token').value};
  try{
    const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'SAVE_FAILED');
    const record={...payload,edit_token:result.data.edit_token};delete record.action;delete record.response_type;delete record.code;
    localStorage.setItem(storageKey,JSON.stringify(record));
    location.href=`summary.html?code=${encodeURIComponent(code)}&saved=1`;
  }catch(error){alert(error.message||'응답을 저장하지 못했습니다.');syncSubmit(saved?'응답 수정하기':'응답 제출하기')}
});
$('#delete-response').onclick=async()=>{if(!saved?.edit_token||!confirm('내 응답을 삭제할까요?'))return;const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete_response',code,edit_token:saved.edit_token})});if(response.ok){localStorage.removeItem(storageKey);location.reload()}else alert('응답을 삭제하지 못했습니다.')};
load();
