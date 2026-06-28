document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form') || document.getElementById('contactForm');
    const message = document.getElementById('form-message');
    if (!form) return;
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (message) message.textContent = '현재 프로토타입에서는 실제 전송 대신 입력 내용만 확인합니다.';
        alert('문의 내용이 확인되었습니다. 실제 전송 기능은 정식 버전에서 제공됩니다.');
    });
});
