async function loadComponent(elementId, componentPath) {
    const target = document.getElementById(elementId);
    if (!target) return;
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        target.innerHTML = await response.text();
    } catch (error) {
        console.error(`${componentPath} 로드 실패:`, error);
    }
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (!menuToggle || !mainNav) return;
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('header', 'components/header.html'),
        loadComponent('footer', 'components/footer.html')
    ]);
    initializeMobileMenu();
});
