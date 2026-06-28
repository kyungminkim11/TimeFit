document.addEventListener('DOMContentLoaded', () => {
    renderTimes();
    renderPlace();
    document.getElementById('shareButton')?.addEventListener('click', shareResult);
    document.getElementById('editButton')?.addEventListener('click', () => { window.location.href = 'time-input.html'; });
});

function renderTimes() {
    const people = storage.load('timeData') || [];
    const slotsContainer = document.querySelector('.time-slots');
    const participantContainer = document.querySelector('.participant-list');
    if (!people.length) {
        slotsContainer.innerHTML = '<p>저장된 시간 정보가 없습니다.</p>';
        return;
    }

    const counts = new Map();
    people.forEach(person => person.timeSlots.forEach(slot => {
        const key = `${slot.date}|${slot.startTime}|${slot.endTime}`;
        if (!counts.has(key)) counts.set(key, []);
        counts.get(key).push(person.name);
    }));

    slotsContainer.innerHTML = [...counts.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 5)
        .map(([key, names]) => {
            const [date, start, end] = key.split('|');
            return `<article class="time-slot"><div class="time-slot-date">${date}</div><div class="time-slot-time"><span class="time">${start}–${end}</span><span class="participants">${names.length}명 가능</span></div><div class="participant-names">${names.join(', ')}</div></article>`;
        }).join('');

    participantContainer.innerHTML = people.map(person => `<article class="participant-item"><div class="participant-info"><div class="participant-name">${person.name}</div></div><div class="participant-time-slots">${person.timeSlots.map(slot => `<div class="participant-time-slot"><span class="time-slot-date">${slot.date}</span><span class="time-slot-time">${slot.startTime}–${slot.endTime}</span></div>`).join('')}</div></article>`).join('');
}

function renderPlace() {
    const places = storage.load('placeData') || [];
    const list = Array.isArray(places) ? places : [places];
    document.getElementById('participantCount').textContent = String(list.filter(Boolean).length);
    if (!list.length || !list[0] || typeof kakao === 'undefined') return;

    const latitude = list.reduce((sum, item) => sum + item.latitude, 0) / list.length;
    const longitude = list.reduce((sum, item) => sum + item.longitude, 0) / list.length;
    const center = new kakao.maps.LatLng(latitude, longitude);
    const map = new kakao.maps.Map(document.getElementById('map'), { center, level: 6 });
    list.forEach(item => new kakao.maps.Marker({ map, position: new kakao.maps.LatLng(item.latitude, item.longitude), title: item.address }));
    new kakao.maps.Marker({ map, position: center, title: '추천 중간 지점' });
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(longitude, latitude, (results, status) => {
        document.getElementById('middlePoint').textContent = status === kakao.maps.services.Status.OK ? results[0].address.address_name : '계산된 중간 지점';
    });
}

async function shareResult() {
    const data = { title: 'TimeFit 약속 결과', text: 'TimeFit에서 정리한 약속 결과를 확인해 보세요.', url: window.location.href };
    if (navigator.share) return navigator.share(data).catch(() => {});
    await navigator.clipboard.writeText(window.location.href);
    alert('결과 링크를 복사했습니다.');
}
