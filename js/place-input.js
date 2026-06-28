let map;
let geocoder;
let markers = [];
let locations = [];
let selectedRegion = null;

const regions = {
    '서울': [37.5665, 126.9780, 8],
    '경기': [37.4138, 127.5183, 10],
    '인천': [37.4563, 126.7052, 9],
    '강원': [37.8228, 128.1555, 10],
    '충청': [36.8, 127.7, 11],
    '전라': [35.3, 126.9, 11],
    '경상': [35.5, 128.6, 11],
    '제주': [33.4996, 126.5312, 10]
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof kakao === 'undefined') {
        alert('지도 API를 불러오지 못했습니다. Kakao Developers에서 서비스 도메인을 등록해 주세요.');
        return;
    }
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 8
    });
    geocoder = new kakao.maps.services.Geocoder();
    kakao.maps.event.addListener(map, 'click', event => addLocation(event.latLng));
    renderRegions();

    document.getElementById('addressAddBtn')?.addEventListener('click', addAddress);
    document.getElementById('addressInput')?.addEventListener('keydown', event => {
        if (event.key === 'Enter') { event.preventDefault(); addAddress(); }
    });
    document.getElementById('currentLocationBtn')?.addEventListener('click', addCurrentLocation);
    document.getElementById('recommendBtn')?.addEventListener('click', recommendPlace);
    document.getElementById('confirmLocation')?.addEventListener('click', confirmLocations);
    document.getElementById('viewSelectedRegion')?.addEventListener('click', viewSelectedRegion);
});

function renderRegions() {
    const container = document.getElementById('region-step1');
    Object.entries(regions).forEach(([name, [lat, lng, level]]) => {
        const button = document.createElement('button');
        button.className = 'region-step1-btn';
        button.textContent = name;
        button.addEventListener('click', () => {
            selectedRegion = { name, lat, lng, level };
            document.getElementById('viewSelectedRegion').style.display = 'inline-flex';
            viewSelectedRegion();
        });
        container.appendChild(button);
    });
}

function viewSelectedRegion() {
    if (!selectedRegion) return;
    map.setCenter(new kakao.maps.LatLng(selectedRegion.lat, selectedRegion.lng));
    map.setLevel(selectedRegion.level);
}

function addAddress() {
    const input = document.getElementById('addressInput');
    const query = input.value.trim();
    if (!query) return alert('주소를 입력해 주세요.');
    geocoder.addressSearch(query, (results, status) => {
        if (status !== kakao.maps.services.Status.OK || !results.length) return alert('주소를 찾지 못했습니다.');
        const position = new kakao.maps.LatLng(Number(results[0].y), Number(results[0].x));
        addLocation(position, results[0].address_name);
        map.setCenter(position);
        input.value = '';
    });
}

function addCurrentLocation() {
    if (!navigator.geolocation) return alert('현재 위치 기능을 지원하지 않는 브라우저입니다.');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
        const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
        addLocation(position, '현재 위치');
        map.setCenter(position);
    }, () => alert('현재 위치를 가져오지 못했습니다.'));
}

function addLocation(position, suppliedAddress = '') {
    geocoder.coord2Address(position.getLng(), position.getLat(), (results, status) => {
        const address = suppliedAddress || (status === kakao.maps.services.Status.OK ? results[0].address.address_name : '선택한 위치');
        const item = { latitude: position.getLat(), longitude: position.getLng(), address };
        locations.push(item);
        markers.push(new kakao.maps.Marker({ map, position, title: address }));
        renderLocations();
    });
}

function renderLocations() {
    const list = document.getElementById('locationList');
    list.innerHTML = '';
    locations.forEach((location, index) => {
        const row = document.createElement('li');
        row.innerHTML = `<span>${location.address}</span><button type="button">삭제</button>`;
        row.querySelector('button').addEventListener('click', () => {
            markers[index].setMap(null);
            markers.splice(index, 1);
            locations.splice(index, 1);
            renderLocations();
        });
        list.appendChild(row);
    });
}

function recommendPlace() {
    if (!locations.length) return alert('위치를 한 개 이상 추가해 주세요.');
    const latitude = locations.reduce((sum, item) => sum + item.latitude, 0) / locations.length;
    const longitude = locations.reduce((sum, item) => sum + item.longitude, 0) / locations.length;
    const center = new kakao.maps.LatLng(latitude, longitude);
    map.setCenter(center);
    map.setLevel(6);
    geocoder.coord2Address(longitude, latitude, (results, status) => {
        const address = status === kakao.maps.services.Status.OK ? results[0].address.address_name : '계산된 중간 지점';
        document.getElementById('recommendResult').textContent = `추천 중간 지점: ${address}`;
    });
}

function confirmLocations() {
    if (!locations.length) return alert('위치를 한 개 이상 추가해 주세요.');
    storage.save('placeData', locations);
    window.location.href = 'map.html';
}
