import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

async function rpc(name, body) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_PUBLISHABLE_KEY
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.hint || `HTTP ${response.status}`);
  if (payload === null || payload === undefined) throw new Error('응답 데이터가 없습니다.');
  return payload;
}

export function createEvent(payload) {
  return rpc('timefit_create_event', {
    p_title: payload.title,
    p_description: payload.description || '',
    p_organizer_name: payload.organizerName,
    p_deadline: payload.deadline || null,
    p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul'
  });
}

export function getEvent(code) {
  return rpc('timefit_get_event', { p_share_code: code });
}

export function submitResponse(payload) {
  return rpc('timefit_submit_response', {
    p_share_code: payload.code,
    p_display_name: payload.displayName,
    p_availability: payload.availability,
    p_latitude: payload.latitude,
    p_longitude: payload.longitude,
    p_address: payload.address || '',
    p_edit_token: payload.editToken || null
  });
}

export function updateEvent(payload) {
  return rpc('timefit_update_event', {
    p_share_code: payload.code,
    p_organizer_token: payload.organizerToken,
    p_title: payload.title,
    p_description: payload.description || '',
    p_deadline: payload.deadline || null,
    p_status: payload.status
  });
}

export function deleteResponse(code, editToken) {
  return rpc('timefit_delete_response', {
    p_share_code: code,
    p_edit_token: editToken
  });
}
