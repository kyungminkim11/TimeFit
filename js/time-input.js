document.addEventListener('DOMContentLoaded', () => {
    const participantsList = document.getElementById('participantsList');
    const participantTemplate = document.getElementById('participantFormTemplate');
    const timeTemplate = document.getElementById('timeSlotTemplate');
    const addParticipantButton = document.getElementById('addParticipant');
    const findTimeButton = document.getElementById('findTime');

    function renumber() {
        participantsList.querySelectorAll('.participant-form').forEach((participant, participantIndex) => {
            participant.querySelector('.participant-number').textContent = participantIndex + 1;
            participant.querySelectorAll('.time-slot-item').forEach((slot, slotIndex) => {
                slot.querySelector('.time-slot-number').textContent = slotIndex + 1;
            });
        });
    }

    function addTimeSlot(participant) {
        const slot = timeTemplate.content.firstElementChild.cloneNode(true);
        slot.querySelector('.remove-time-slot').addEventListener('click', () => {
            const slots = participant.querySelectorAll('.time-slot-item');
            if (slots.length <= 1) return alert('시간대는 한 개 이상 필요합니다.');
            slot.remove();
            renumber();
        });
        participant.querySelector('.time-slot-list').appendChild(slot);
        renumber();
    }

    function addParticipant() {
        const participant = participantTemplate.content.firstElementChild.cloneNode(true);
        participant.querySelector('.remove-participant').addEventListener('click', () => {
            if (participantsList.querySelectorAll('.participant-form').length <= 2) {
                return alert('참여자는 최소 2명이 필요합니다.');
            }
            participant.remove();
            renumber();
        });
        participant.querySelector('.add-time-slot').addEventListener('click', () => addTimeSlot(participant));
        participantsList.appendChild(participant);
        addTimeSlot(participant);
        renumber();
    }

    function collectData() {
        return [...participantsList.querySelectorAll('.participant-form')].map((participant, index) => ({
            name: participant.querySelector('[name="name"]').value.trim() || `참여자 ${index + 1}`,
            timeSlots: [...participant.querySelectorAll('.time-slot-item')].map(slot => ({
                date: slot.querySelector('[name="date"]').value,
                startTime: slot.querySelector('[name="startTime"]').value,
                endTime: slot.querySelector('[name="endTime"]').value
            }))
        }));
    }

    addParticipantButton.addEventListener('click', addParticipant);
    findTimeButton.addEventListener('click', () => {
        const data = collectData();
        const invalid = data.some(person => person.timeSlots.some(slot => !slot.date || !slot.startTime || !slot.endTime));
        if (invalid) return alert('모든 날짜와 시간을 입력해 주세요.');
        storage.save('timeData', data);
        window.location.href = 'place-input.html';
    });

    addParticipant();
    addParticipant();
});
