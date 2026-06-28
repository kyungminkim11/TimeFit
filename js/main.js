const state = { timeData: [], placeData: [], currentUser: null };

const storage = {
    save(key, data) {
        try { localStorage.setItem(key, JSON.stringify(data)); return true; }
        catch (error) { console.error('저장 실패:', error); return false; }
    },
    load(key) {
        try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; }
        catch (error) { console.error('로드 실패:', error); return null; }
    },
    clear(key) {
        try { localStorage.removeItem(key); return true; }
        catch (error) { console.error('삭제 실패:', error); return false; }
    }
};

const session = {
    save(key, data) {
        try { sessionStorage.setItem(key, JSON.stringify(data)); return true; }
        catch (error) { return false; }
    },
    load(key) {
        try { const data = sessionStorage.getItem(key); return data ? JSON.parse(data) : null; }
        catch (error) { return null; }
    },
    clear(key) {
        try { sessionStorage.removeItem(key); return true; }
        catch (error) { return false; }
    }
};

const urlParams = {
    get(param) { return new URLSearchParams(window.location.search).get(param); },
    set(param, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    state.timeData = storage.load('timeData') || [];
    state.placeData = storage.load('placeData') || [];
});
