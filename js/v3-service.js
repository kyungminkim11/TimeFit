import{getEvent,createEvent,submitResponse,deleteResponse,getManage,updateEvent,deleteEvent}from'./v3-api.js';
export const api={
 getEvent,
 createEvent:p=>createEvent({title:p.title,organizerName:p.organizer_name,description:p.description,dateStart:p.date_start,dateEnd:p.date_end,duration:p.meeting_duration_minutes,participantLimit:p.participant_limit,deadline:p.deadline,requireLocation:p.require_location,website:p.website}),
 submitResponse:p=>submitResponse({code:p.code,displayName:p.display_name,availability:p.availability,latitude:p.latitude,longitude:p.longitude,address:p.address,editToken:p.edit_token,website:p.website}),
 deleteResponse:p=>deleteResponse(p.code,p.edit_token),
 getManage:p=>getManage(p.code,p.organizer_token),
 updateEvent:p=>updateEvent({code:p.code,organizerToken:p.organizer_token,title:p.title,description:p.description,deadline:p.deadline,status:p.status,dateStart:p.date_start,dateEnd:p.date_end,duration:p.meeting_duration_minutes,participantLimit:p.participant_limit,requireLocation:p.require_location}),
 deleteEvent:p=>deleteEvent(p.code,p.organizer_token)
};
