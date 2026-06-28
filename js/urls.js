export const eventUrl=code=>`${location.origin}/event.html?code=${encodeURIComponent(code)}`;
export const resultUrl=code=>`${location.origin}/result.html?code=${encodeURIComponent(code)}`;
export const manageUrl=(code,token)=>`${location.origin}/manage.html?code=${encodeURIComponent(code)}#token=${encodeURIComponent(token)}`;
export const participantKey=code=>`timefit:participant:${code}`;
export const organizerKey=code=>`timefit:organizer:${code}`;
