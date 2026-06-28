let map;
let markers = [];
let polylines = [];
let middleMarker;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof kakao === 'undefined' || !document.getElementById('map')) return;
    initMap();
    document.getElementById('viewResult')?.addEventListener('click', () => {
        window.location.href = 'result.html?type=full';
    });
});

function initMap() {
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
    });
    loadLocations();
}

function loadLocations() {
    const placeData = storage.load('placeData');
    if (!placeData) return;
    const list = Array.isArray(placeData) ? placeData : [placeData];
    const bounds = new kakao.maps.LatLngBounds();
    list.forEach(data => {
        const position = new kakao.maps.LatLng(data.latitude, data.longitude);
        markers.push(new kakao.maps.Marker({ position, map, title: data.address || '선택 위치' }));
        bounds.extend(position);
    });
    if (list.length > 1) {
        const middle = calculateMiddlePoint(list);
        middleMarker = new kakao.maps.Marker({ position: middle, map, title: '중간 지점' });
    }
    map.setBounds(bounds);
    document.getElementById('participantCount').textContent = String(list.length);
}

function calculateMiddlePoint(list) {
    const latitude = list.reduce((sum, item) => sum + item.latitude, 0) / list.length;
    const longitude = list.reduce((sum, item) => sum + item.longitude, 0) / list.length;
    return new kakao.maps.LatLng(latitude, longitude);
}
