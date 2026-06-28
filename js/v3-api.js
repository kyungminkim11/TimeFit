import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './config.js';

const db=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});

export class ApiError extends Error{constructor(message,code='REQUEST_FAILED'){super(message);this.code=code}}

export function clientKey(){const name='timefit:client';let value=localStorage.getItem(name);if(!value){value=crypto.randomUUID();localStorage.setItem(name,value)}return value}

function errorCode(error){const text=`${error?.message||''} ${error?.details||''}`;return text.match(/(?:EVENT|INVALID|RATE|LOCATION|BOT|DATE|CLIENT)[A-Z0-9_]*/)?.[0]||'REQUEST_FAILED'}

async function call(name,payload){const {data,error}=await db.rpc(name,payload);if(error)throw new ApiError(error.message,errorCode(error));return data}

export const getEvent=code=>call('timefit_public_get_event',{p_share_code:code,p_client_key:clientKey()});
export const createEvent=x=>call('timefit_public_create_event',{p_title:x.title,p_description:x.description||'',p_organizer_name:x.organizerName,p_deadline:x.deadline||null,p_timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Seoul',p_date_start:x.dateStart,p_date_end:x.dateEnd,p_meeting_duration_minutes:Number(x.duration),p_participant_limit:Number(x.participantLimit),p_require_location:Boolean(x.requireLocation),p_client_key:clientKey(),p_website:x.website||''});
export const submitResponse=x=>call('timefit_public_submit_response',{p_share_code:x.code,p_display_name:x.displayName,p_availability:x.availability,p_latitude:x.latitude??null,p_longitude:x.longitude??null,p_address:x.address||'',p_edit_token:x.editToken||null,p_client_key:clientKey(),p_website:x.website||''});
export const deleteResponse=(code,token)=>call('timefit_public_delete_response',{p_share_code:code,p_edit_token:token,p_client_key:clientKey()});
export const getManage=(code,token)=>call('timefit_public_get_manage',{p_share_code:code,p_organizer_token:token,p_client_key:clientKey()});
export const updateEvent=x=>call('timefit_public_update_event',{c:x.code,t:x.organizerToken,ti:x.title,de:x.description||'',dl:x.deadline||null,st:x.status,ds:x.dateStart,dx:x.dateEnd,du:Number(x.duration),pl:Number(x.participantLimit),rl:Boolean(x.requireLocation),ck:clientKey()});
export const deleteEvent=(code,token)=>call('timefit_public_delete_event',{c:code,t:token,ck:clientKey()});

export function friendlyError(error){const map={EVENT_NOT_FOUND:'모임을 찾을 수 없습니다.',EVENT_CLOSED:'응답이 마감된 모임입니다.',EVENT_DEADLINE_PASSED:'응답 기한이 지났습니다.',EVENT_FULL:'참여 인원이 가득 찼습니다.',INVALID_EDIT_TOKEN:'이 응답을 수정할 권한이 없습니다.',INVALID_ORGANIZER_TOKEN:'주최자 권한을 확인할 수 없습니다.',INVALID_AVAILABILITY:'가능한 시간을 다시 확인해 주세요.',LOCATION_REQUIRED:'출발 위치를 선택해 주세요.',RATE_LIMITED:'요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'};return map[error?.code]||error?.message||'요청 중 문제가 발생했습니다.'}
