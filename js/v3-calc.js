export function createLocationPicker({mapId,queryId,searchId,currentId,statusId,onChange}){
  if(!window.kakao)return null;
  const mapNode=document.getElementById(mapId);
  const query=document.getElementById(queryId);
  const status=document.getElementById(statusId);
  const map=new kakao.maps.Map(mapNode,{center:new kakao.maps.LatLng(37.5665,126.978),level:8});
  const marker=new kakao.maps.Marker({map});
  const geocoder=new kakao.maps.services.Geocoder();
  const places=new kakao.maps.services.Places();
  let selected=null;
  const show=()=>{if(!selected)return;marker.setPosition(new kakao.maps.LatLng(selected.latitude,selected.longitude));map.setCenter(new kakao.maps.LatLng(selected.latitude,selected.longitude));status.textContent=selected.address;onChange(selected)};
  const choose=(latitude,longitude,address)=>{selected={latitude,longitude,address:address||'선택한 위치'};show()};
  kakao.maps.event.addListener(map,'click',event=>{const latitude=event.latLng.getLat(),longitude=event.latLng.getLng();geocoder.coord2Address(longitude,latitude,(rows,state)=>{const address=state===kakao.maps.services.Status.OK?(rows[0].road_address?.address_name||rows[0].address.address_name):'선택한 위치';choose(latitude,longitude,address)})});
  document.getElementById(searchId).addEventListener('click',()=>{const keyword=query.value.trim();if(!keyword)return;places.keywordSearch(keyword,(rows,state)=>{if(state!==kakao.maps.services.Status.OK||!rows.length){status.textContent='장소를 찾지 못했습니다.';return}const item=rows[0];choose(Number(item.y),Number(item.x),item.place_name)})});
  document.getElementById(currentId).addEventListener('click',()=>navigator.geolocation?.getCurrentPosition(position=>choose(position.coords.latitude,position.coords.longitude,'현재 위치'),()=>{status.textContent='현재 위치를 가져오지 못했습니다.'}));
  return{set:value=>{if(value?.latitude&&value?.longitude)choose(Number(value.latitude),Number(value.longitude),value.address)},get:()=>selected};
}
