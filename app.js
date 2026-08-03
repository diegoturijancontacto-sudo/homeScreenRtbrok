// =====================================================
// CONFIGURACIÓN
// =====================================================
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxmPBIboe_Evn45ZHjtkjydbmlPRMuSax_sEiTc2iN8cqqi2i4-Pf_lOd6875cQXEd_yg/exec'; // <-- REEMPLAZA CON TU URL

// =====================================================
// ESTADO GLOBAL
// =====================================================
let state = {
    currentUser: null,
    systemTasks: [],
    personalTasks: [],
    obras: [],
    responsables: [],
    filterStatus: 'all',
    filterPriority: 'all',
    editingPersonalId: null,
    isLoading: false,
};

// =====================================================
// DOM REFS
// =====================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
    overlay: $('#userOverlay'),
    userList: $('#userList'),
    refreshUsersBtn: $('#refreshUsersBtn'),
    dashboard: $('#dashboard'),
    greetingName: $('#greetingName'),
    userBadge: $('#userBadge'),
    logoutBtn: $('#logoutBtn'),
    globalSearch: $('#globalSearch'),
    systemTaskList: $('#systemTaskList'),
    personalTaskList: $('#personalTaskList'),
    obrasList: $('#obrasList'),
    sysTaskCount: $('#sysTaskCount'),
    personalTaskCount: $('#personalTaskCount'),
    obrasCount: $('#obrasCount'),
    addPersonalBtn: $('#addPersonalBtn'),
    filterStatus: $('#filterStatus'),
    filterPriority: $('#filterPriority'),
    taskSpinner: $('#taskSpinner'),
    clockValue: $('#clockValue'),
    weatherValue: $('#weatherValue'),
    footerUserName: $('#footerUserName'),
    toastContainer: $('#toastContainer'),
};

const HEROICON_PATHS = {
    photo: 'M21 12.257v5.243A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9A2.5 2.5 0 0 1 5.5 6h3.379l1.5-2h3.242l1.5 2H18.5A2.5 2.5 0 0 1 21 8.5v3.757ZM5.5 8A.5.5 0 0 0 5 8.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-5.243l-2.47-2.47a1.5 1.5 0 0 0-2.12 0l-.94.94-2.47-2.47a1.5 1.5 0 0 0-2.12 0L5.5 13.757V8.5A.5.5 0 0 0 5.5 8Zm3 2.5A1.5 1.5 0 1 1 8.5 13a1.5 1.5 0 0 1 0-3Z',
    user: 'M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm-12 11.3A8.25 8.25 0 0 1 12 14.25a8.25 8.25 0 0 1 8.25 3.8.75.75 0 0 1-.63 1.15H4.38a.75.75 0 0 1-.63-1.15Z',
    magnifyingGlass: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-7.5 6a7.5 7.5 0 1 1 13.17 4.83l3.75 3.75a.75.75 0 1 1-1.06 1.06l-3.75-3.75A7.5 7.5 0 0 1 3 10.5Z',
    arrowPath: 'M16.862 4.487a.75.75 0 0 1 1.06.018l3.375 3.5a.75.75 0 0 1 0 1.04l-3.375 3.5a.75.75 0 1 1-1.078-1.042l2.12-2.2H7.5a4.5 4.5 0 0 0 0 9h6a.75.75 0 0 1 0 1.5h-6a6 6 0 1 1 0-12h10.39l-2.128-2.212a.75.75 0 0 1 .02-1.064Z',
    clipboard: 'M9.75 3.75A2.25 2.25 0 0 0 7.5 6v.75h-.75A2.25 2.25 0 0 0 4.5 9v9a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 16.5 18v-9a2.25 2.25 0 0 0-2.25-2.25h-.75V6A2.25 2.25 0 0 0 11.25 3.75h-1.5Zm0 1.5h1.5a.75.75 0 0 1 .75.75v.75h-3v-.75a.75.75 0 0 1 .75-.75ZM8.25 11.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z',
    pencil: 'M16.862 3.487a2.125 2.125 0 0 1 3 3L8.25 18.1a4.5 4.5 0 0 1-1.9 1.1l-3.1.94a.75.75 0 0 1-.93-.93l.94-3.1a4.5 4.5 0 0 1 1.1-1.9L16.862 3.487Zm-1.06 1.06L5.43 14.92a3 3 0 0 0-.73 1.26l-.55 1.8 1.8-.55a3 3 0 0 0 1.26-.73L17.58 6.35a.625.625 0 1 0-.878-.884Z',
    wrench: 'M17.657 3.172a5.25 5.25 0 0 0-7.42 6.19l-6.96 6.96a2.25 2.25 0 1 0 3.182 3.182l6.96-6.96a5.25 5.25 0 0 0 6.19-7.42l-2.31 2.31-1.59-.32-.32-1.59 2.31-2.31Zm-8.48 7.42a6.75 6.75 0 0 1-1.46-6.43L5.84 7.97 7.9 10.03l2.06 2.06 6.88 6.88a.75.75 0 0 1-1.06 1.06l-6.88-6.88-2.06-2.06Z',
    plus: 'M12 4.5a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12H6a.75.75 0 0 1 0-1.5h5.25V5.25A.75.75 0 0 1 12 4.5Z',
    check: 'M16.704 6.293a.75.75 0 0 1 1.061 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l3.22 3.22 6.97-6.97Z',
    xMark: 'M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z',
    lockClosed: 'M12 2.25a4.5 4.5 0 0 0-4.5 4.5v2.25H6.75A2.25 2.25 0 0 0 4.5 11.25v7.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25H16.5V6.75A4.5 4.5 0 0 0 12 2.25Zm-3 6.75V6.75a3 3 0 1 1 6 0V9h-6Z',
    lockOpen: 'M12 2.25a4.5 4.5 0 0 0-4.5 4.5.75.75 0 0 0 1.5 0 3 3 0 1 1 5.1 2.1A4.5 4.5 0 0 0 9 13.5v1.5H6.75A2.25 2.25 0 0 0 4.5 17.25v1.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25H13.5v-1.5a3 3 0 0 1 3-3h.75a.75.75 0 0 0 0-1.5H16.5A4.5 4.5 0 0 0 12 2.25Z',
    trash: 'M6.75 7.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .75.75V18a2.25 2.25 0 0 1-2.25 2.25h-6A2.25 2.25 0 0 1 6.75 18V7.5Zm3-3.75A1.5 1.5 0 0 1 11.25 2.25h1.5A1.5 1.5 0 0 1 14.25 3.75V4.5h3a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5h3v-.75Zm1.5 3a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 1.5 0v-9a.75.75 0 0 0-.75-.75Zm3 0a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 1.5 0v-9a.75.75 0 0 0-.75-.75Z',
    calendar: 'M6.75 3a.75.75 0 0 1 .75.75V5.25h9V3.75a.75.75 0 0 1 1.5 0V5.25h.75A2.25 2.25 0 0 1 21 7.5v10.5A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18V7.5A2.25 2.25 0 0 1 5.25 5.25H6V3.75A.75.75 0 0 1 6.75 3Zm11.25 6H5.25v9a.75.75 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75v-9Z',
    tag: 'M10.293 2.293A1 1 0 0 0 9.586 2H5.5A2.5 2.5 0 0 0 3 4.5v4.086a1 1 0 0 0 .293.707l8.914 8.914a2 2 0 0 0 2.828 0l5.086-5.086a2 2 0 0 0 0-2.828L10.293 2.293ZM7.75 6.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z',
    clock: 'M12 6.75a.75.75 0 0 1 .75.75v4.19l2.47 1.483a.75.75 0 1 1-.77 1.288l-2.83-1.699a.75.75 0 0 1-.37-.648V7.5A.75.75 0 0 1 12 6.75ZM12 2.25a9.75 9.75 0 1 0 9.75 9.75A9.762 9.762 0 0 0 12 2.25Zm0 18a8.25 8.25 0 1 1 8.25-8.25A8.259 8.259 0 0 1 12 20.25Z',
    spark: 'M9.813 5.904a.75.75 0 0 1 1.374 0l1.185 2.606 2.806.257a.75.75 0 0 1 .416 1.31l-2.12 1.86.627 2.744a.75.75 0 0 1-1.108.804L10.5 13.93l-2.493 1.555a.75.75 0 0 1-1.108-.804l.627-2.744-2.12-1.86a.75.75 0 0 1 .416-1.31l2.806-.257 1.185-2.606Z',
};

function heroIcon(name) {
    const path = HEROICON_PATHS[name];
    if (!path) return '';
    return `<span class="heroicon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="${path}"></path></svg></span>`;
}

function updateClock() {
    if (!dom.clockValue) return;
    const now = new Date();
    dom.clockValue.textContent = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function getWeatherLabel(code) {
    const map = {
        0: 'Despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina helada',
        51: 'Llovizna leve',
        53: 'Llovizna',
        55: 'Llovizna fuerte',
        61: 'Lluvia leve',
        63: 'Lluvia',
        65: 'Lluvia fuerte',
        71: 'Nieve leve',
        73: 'Nieve',
        75: 'Nieve fuerte',
        80: 'Chubascos',
        81: 'Chubascos fuertes',
        82: 'Tormenta',
        95: 'Tormenta eléctrica',
    };
    return map[code] || 'Clima variable';
}

async function updateWeather() {
    if (!dom.weatherValue || !navigator.geolocation) {
        if (dom.weatherValue) dom.weatherValue.textContent = 'Clima no disponible';
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();
            const current = data.current || {};
            const temp = Math.round(Number(current.temperature_2m));
            const label = getWeatherLabel(Number(current.weather_code));
            dom.weatherValue.textContent = Number.isFinite(temp) ? `${temp}° · ${label}` : label;
        } catch (_) {
            dom.weatherValue.textContent = 'Clima no disponible';
        }
    }, () => {
        dom.weatherValue.textContent = 'Clima no disponible';
    }, { enableHighAccuracy: false, timeout: 4000, maximumAge: 10 * 60 * 1000 });
}

function hydrateHeroIcons() {
    document.querySelectorAll('[data-heroicon]').forEach((node) => {
        const iconName = node.dataset.heroicon;
        node.outerHTML = heroIcon(iconName);
    });
}

function extractDriveFileId(url) {
    const value = (url || '').toString();
    const patterns = [
        /\/d\/([\w-]+)/,
        /[?&]id=([\w-]+)/,
        /^([\w-]{25,})$/,
    ];
    for (const pattern of patterns) {
        const match = value.match(pattern);
        if (match && match[1]) return match[1];
    }
    return '';
}

function getObraCoverUrl(obra) {
    const adjuntos = Array.isArray(obra?.adjuntos) ? obra.adjuntos : [];
    const imagen = adjuntos.find((adjunto) => {
        const mimeType = (adjunto?.mimeType || '').toLowerCase();
        const name = (adjunto?.name || '').toLowerCase();
        const url = (adjunto?.url || '').toLowerCase();
        return mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)$/i.test(name) || /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)(\?|#|$)/i.test(url);
    });

    if (!imagen) return '';
    const directUrl = imagen.url || '';
    if (directUrl.includes('drive.google.com')) {
        const fileId = imagen.id || extractDriveFileId(directUrl);
        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
        }
    }
    return directUrl;
}

// =====================================================
// TOAST
// =====================================================
function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    dom.toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// =====================================================
// LOCAL STORAGE
// =====================================================
function loadPersonalTasks() {
    try {
        const raw = localStorage.getItem('rtbrok_personal_tasks');
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function savePersonalTasks(tasks) {
    localStorage.setItem('rtbrok_personal_tasks', JSON.stringify(tasks));
}

function loadSavedUser() {
    try {
        const raw = localStorage.getItem('rtbrok_current_user');
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function saveUser(user) {
    localStorage.setItem('rtbrok_current_user', JSON.stringify(user));
}

// =====================================================
// API CALLS
// =====================================================
async function apiFetch(action, data = {}) {
    const payload = { action, data };
    const resp = await fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return resp;
}

async function apiGet() {
    const resp = await fetch(BACKEND_URL);
    return resp.json();
}

// =====================================================
// CARGAR USUARIOS DESDE BACKEND
// =====================================================
async function loadUsers() {
    try {
        dom.userList.innerHTML = `
            <div class="skeleton-user"></div>
            <div class="skeleton-user"></div>
            <div class="skeleton-user"></div>
        `;
        const data = await apiGet();
        if (data.error) throw new Error(data.error);
        state.responsables = data.responsables || [];
        return state.responsables;
    } catch (err) {
        toast('Error al cargar usuarios: ' + err.message, 'error');
        return [];
    }
}

function renderUserList(users) {
    dom.userList.innerHTML = '';
    if (!users.length) {
        dom.userList.innerHTML = '<p style="color:#94a3b8;">No hay usuarios disponibles</p>';
        return;
    }
    users.forEach(u => {
        const div = document.createElement('div');
        div.className = 'user-item';
        const iniciales = (u.nombre || 'U').substring(0, 2).toUpperCase();
        const rolClass = u.rol === 'supervisor' ? 'supervisor' : u.rol === 'director' ? 'director' : 'responsable';
        div.innerHTML = `
            <div class="avatar">${iniciales}</div>
            <div class="info">
                <div class="name">${u.nombre || 'Sin nombre'}</div>
                <div class="rol">${u.departamento || ''} · ${u.email || ''}</div>
            </div>
            <span class="badge-rol ${rolClass}">${u.rol || 'responsable'}</span>
        `;
        div.addEventListener('click', () => selectUser(u));
        dom.userList.appendChild(div);
    });
}

// =====================================================
// SELECCIÓN DE USUARIO
// =====================================================
function selectUser(user) {
    state.currentUser = user;
    saveUser(user);
    dom.overlay.style.display = 'none';
    dom.dashboard.style.display = 'block';
    dom.greetingName.textContent = user.nombre || 'Usuario';
    dom.userBadge.innerHTML = `${heroIcon('user')}<span>${(user.nombre || 'U').substring(0, 2).toUpperCase()}</span>`;
    if (dom.footerUserName) dom.footerUserName.textContent = user.nombre || 'Usuario';
    dom.globalSearch.disabled = false;
    updateSearchPlaceholder();
    dom.globalSearch.focus();
    toast(`Bienvenido ${user.nombre || ''}`, 'success');
    loadAllData();
}

function showSearchFirstView() {
    dom.overlay.style.display = 'none';
    dom.dashboard.style.display = 'block';
    dom.greetingName.textContent = 'Invitado';
    dom.userBadge.innerHTML = `${heroIcon('user')}<span>IN</span>`;
    if (dom.footerUserName) dom.footerUserName.textContent = 'Invitado';
    dom.globalSearch.disabled = false;
    updateSearchPlaceholder();
    dom.globalSearch.focus();
}

// =====================================================
// BÚSQUEDA INTELIGENTE (Google + Local)
// =====================================================
function setupSearch() {
    const searchInput = dom.globalSearch;
    
    // Búsqueda en tiempo real (filtra tareas locales si hay datos)
    searchInput.addEventListener('input', function() {
        if (state.systemTasks.length > 0 || state.obras.length > 0) {
            renderSystemTasks();
            renderObras();
        }
    });

    // Búsqueda con Enter → Google
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            
            if (query) {
                // Si hay tareas cargadas, mostrar resultados locales
                if (state.systemTasks.length > 0 || state.obras.length > 0) {
                    renderSystemTasks();
                    renderObras();
                }
                
                // Abrir búsqueda en Google (nueva pestaña)
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(googleUrl, '_blank');
                toast(`Buscando en Google: "${query}"`, 'info');
            }
        }
    });

    // Atajo Ctrl+K
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            if (!searchInput.disabled) {
                searchInput.focus();
                searchInput.select();
            } else {
                toast('Inicia sesión para usar el buscador', 'info');
            }
        }
    });

    updateSearchPlaceholder();
}

function updateSearchPlaceholder() {
    const searchInput = dom.globalSearch;
    if (searchInput.disabled) {
        searchInput.placeholder = 'Inicia sesión para buscar...';
    } else if (state.systemTasks.length > 0 || state.obras.length > 0) {
        searchInput.placeholder = 'Buscar en Google (Enter) o filtrar tareas y obras...  Ctrl + K';
    } else {
        searchInput.placeholder = 'Buscar en Google (Enter) o espera que carguen los datos...  Ctrl + K';
    }
}

// =====================================================
// CARGAR DATOS DEL SISTEMA
// =====================================================
async function loadSystemTasks() {
    try {
        dom.taskSpinner.style.display = 'inline-block';
        showSkeletons('system');
        showSkeletons('obras');
        const data = await apiGet();
        if (data.error) throw new Error(data.error);
        state.systemTasks = data.tareas || [];
        state.obras = data.registrosObra || [];
        state.responsables = data.responsables || [];
        renderSystemTasks();
        renderObras();
        updateSearchPlaceholder();
    } catch (err) {
        toast('Error al cargar datos: ' + err.message, 'error');
        state.systemTasks = [];
        state.obras = [];
        renderSystemTasks();
        renderObras();
    } finally {
        dom.taskSpinner.style.display = 'none';
    }
}

function showSkeletons(type) {
    if (type === 'system') {
        dom.systemTaskList.innerHTML = `
            <div class="skeleton-task"></div>
            <div class="skeleton-task"></div>
            <div class="skeleton-task"></div>
        `;
    }
    if (type === 'obras') {
        dom.obrasList.innerHTML = `
            <div class="skeleton-obra"></div>
            <div class="skeleton-obra"></div>
            <div class="skeleton-obra"></div>
            <div class="skeleton-obra"></div>
        `;
    }
}

// =====================================================
// RENDER SISTEMA TAREAS
// =====================================================
function renderSystemTasks() {
    const { filterStatus, filterPriority, systemTasks } = state;
    let filtered = [...systemTasks];

    // Aplicar filtros de estado y prioridad
    if (filterStatus !== 'all') {
        filtered = filtered.filter(t => t.estatus === filterStatus);
    }
    if (filterPriority !== 'all') {
        filtered = filtered.filter(t => t.prioridad === filterPriority);
    }

    // Si hay texto en el buscador, filtrar también
    const searchText = dom.globalSearch.value.toLowerCase().trim();
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(t =>
            (t.descripcion || '').toLowerCase().includes(searchText) ||
            (t.detalles || '').toLowerCase().includes(searchText) ||
            (t.asignacion || '').toLowerCase().includes(searchText) ||
            (t.id || '').toLowerCase().includes(searchText)
        );
    }

    dom.sysTaskCount.textContent = filtered.length;

    if (!filtered.length) {
        const hasSearch = dom.globalSearch.value.trim().length > 0;
        dom.systemTaskList.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:#94a3b8;font-size:14px;">
                ${hasSearch ? 'No hay tareas para "' + dom.globalSearch.value.trim() + '"' : 'No hay tareas que coincidan con los filtros'}
                <br>
                <span style="font-size:12px;">Presiona Enter para buscar en Google</span>
            </div>
        `;
        return;
    }

    const html = filtered.map(t => {
        const isMine = state.currentUser && t.id_responsable === state.currentUser.id;
        const isPrivileged = state.currentUser && ['supervisor','director'].includes(state.currentUser.rol);
        const isPending = t.estatus === 'pendiente' || t.estatus === 'en_curso';
        const isInReview = t.estatus === 'en_revision';

        let actions = '';
        if (isMine && isPending && !isInReview) {
            actions += `<button class="btn-done" data-action="done" data-id="${t.id}">${heroIcon('check')}Hecho</button>`;
        }
        if (isPrivileged && isInReview) {
            actions += `
                <button class="btn-approve" data-action="approve" data-id="${t.id}">${heroIcon('check')}Aprobar</button>
                <button class="btn-reject" data-action="reject" data-id="${t.id}">${heroIcon('xMark')}Rechazar</button>
            `;
        }
        if (isPrivileged && t.estatus === 'bloqueada') {
            actions += `<button class="btn-approve" data-action="unblock" data-id="${t.id}">${heroIcon('lockOpen')}Desbloquear</button>`;
        }
        if (isPrivileged && t.estatus !== 'completado' && t.estatus !== 'bloqueada') {
            actions += `<button class="btn-delete" data-action="block" data-id="${t.id}">${heroIcon('lockClosed')}Bloquear</button>`;
        }

        const statusLabel = t.estatus || 'pendiente';
        const responsableNombre = getResponsableName(t.id_responsable);

        return `
            <div class="task-card" data-id="${t.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${t.descripcion || 'Sin título'}</div>
                        <div class="task-desc">${t.detalles || ''}</div>
                    </div>
                    <span class="badge-status ${statusLabel}">${statusLabel.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div class="task-meta">
                    <span>${heroIcon('clipboard')}${t.asignacion || 'Sin código'}</span>
                    <span>${heroIcon('calendar')}${t.fecha_limite || 'Sin fecha'}</span>
                    <span>${heroIcon('spark')}${t.prioridad || 'media'}</span>
                    ${responsableNombre ? `<span>${heroIcon('user')}${responsableNombre}</span>` : ''}
                </div>
                ${actions ? `<div class="task-actions">${actions}</div>` : ''}
            </div>
        `;
    }).join('');

    dom.systemTaskList.innerHTML = html;

    dom.systemTaskList.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', handleSystemTaskAction);
    });
}

// =====================================================
// RENDER OBRAS (ÚLTIMAS 4)
// =====================================================
function renderObras() {
    const obras = state.obras || [];
    let filtered = [...obras];
    
    // Si hay texto en el buscador, filtrar también
    const searchText = dom.globalSearch.value.toLowerCase().trim();
    if (searchText && searchText.length >= 2) {
        filtered = filtered.filter(o =>
            (o.nombre_obra || '').toLowerCase().includes(searchText) ||
            (o.autor || '').toLowerCase().includes(searchText) ||
            (o.asignacion || '').toLowerCase().includes(searchText) ||
            (o.clave || '').toLowerCase().includes(searchText)
        );
    }
    
    // Ordenar por fecha (más reciente primero)
    const sorted = [...filtered].sort((a, b) => {
        const dateA = a.fecha_registro ? new Date(a.fecha_registro) : new Date(0);
        const dateB = b.fecha_registro ? new Date(b.fecha_registro) : new Date(0);
        return dateB - dateA;
    });
    
    const latest = sorted.slice(0, 4);
    dom.obrasCount.textContent = filtered.length;

    if (!latest.length) {
        const hasSearch = dom.globalSearch.value.trim().length > 0;
        dom.obrasList.innerHTML = `
            <div style="grid-column:span 2;text-align:center;padding:30px 0;color:#94a3b8;font-size:14px;">
                ${hasSearch ? 'No hay obras para "' + dom.globalSearch.value.trim() + '"' : 'No hay obras registradas'}
            </div>
        `;
        return;
    }

    const html = latest.map(o => {
        const coverUrl = getObraCoverUrl(o);
        return `
        <article class="obra-card">
            <div class="obra-cover${coverUrl ? ' has-image' : ' has-fallback'}"${coverUrl ? ` style="background-image:url('${coverUrl}')"` : ''}>
                <div class="obra-cover-overlay"></div>
            </div>
            <div class="obra-info">
                <div class="obra-cover-top">
                    <span class="obra-cover-chip">${heroIcon('photo')}Obra</span>
                    <span class="obra-cover-chip ghost">${o.estatus || 'Consolidación'}</span>
                </div>
                <div class="obra-cover-copy">
                    <div class="obra-nombre">${o.nombre_obra || 'Sin título'}</div>
                    <div class="obra-autor">${o.autor || 'Autor desconocido'}</div>
                </div>
                <div class="obra-meta">
                    <span>${heroIcon('clipboard')}${o.asignacion || 'Sin código'}</span>
                    <span>${o.tipo_obra || 'Sin tipo'}</span>
                    ${o.ancho ? `<span>${o.ancho}×${o.alto || 0} cm</span>` : ''}
                </div>
                <div class="obra-registro">${heroIcon('calendar')}${o.fecha_registro || 'Sin fecha'} · ${o.estatus || 'Consolidación'}</div>
            </div>
        </article>
    `;
    }).join('');

    dom.obrasList.innerHTML = html;
}

// =====================================================
// MANEJAR ACCIONES DE TAREAS DEL SISTEMA
// =====================================================
function getResponsableName(id) {
    if (!id) return '';
    const responsable = state.responsables.find(r => r.id === id);
    return responsable ? responsable.nombre : id;
}

async function handleSystemTaskAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const tareaId = btn.dataset.id;
    const actorId = state.currentUser?.id;

    if (!actorId) {
        toast('No hay usuario seleccionado', 'error');
        return;
    }

    btn.disabled = true;
    btn.classList.add('btn-disabled');

    try {
        let apiAction = '';
        let payload = { id_tarea: tareaId, id_actor: actorId };

        switch (action) {
            case 'done':
                apiAction = 'tarea_revisar';
                payload.observaciones = 'Enviado a revisión por responsable';
                toast('Enviando a revisión...', 'info');
                break;
            case 'approve':
                apiAction = 'tarea_aprobar';
                payload.observaciones = 'Aprobada por supervisor';
                toast('Aprobando tarea...', 'info');
                break;
            case 'reject':
                apiAction = 'tarea_rechazar';
                payload.observaciones = 'Rechazada, vuelve a en_curso';
                toast('Rechazando tarea...', 'info');
                break;
            case 'block':
                apiAction = 'tarea_bloquear';
                payload.observaciones = 'Bloqueada por supervisor';
                toast('Bloqueando tarea...', 'info');
                break;
            case 'unblock':
                apiAction = 'tarea_desbloquear';
                payload.observaciones = 'Desbloqueada por supervisor';
                toast('Desbloqueando tarea...', 'info');
                break;
            default:
                return;
        }

        await apiFetch(apiAction, payload);
        toast(`Acción "${action}" completada`, 'success');
        await loadSystemTasks();

    } catch (err) {
        toast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
    }
}

// =====================================================
// TAREAS PERSONALES (localStorage)
// =====================================================
function loadPersonal() {
    state.personalTasks = loadPersonalTasks();
    renderPersonalTasks();
}

function renderPersonalTasks() {
    const tasks = state.personalTasks;
    dom.personalTaskCount.textContent = tasks.length;

    if (!tasks.length) {
        dom.personalTaskList.innerHTML = `
            <div style="text-align:center;padding:30px 0;color:#94a3b8;font-size:14px;">
                No tienes pendientes personales<br>
                <span style="font-size:12px;">Agrega uno con el botón "+ Agregar"</span>
            </div>
        `;
        return;
    }

    const html = tasks.map((t, idx) => {
        const isEditing = state.editingPersonalId === t.id;
        return `
            <div class="task-card personal" data-id="${t.id}">
                <div class="task-header">
                    <div>
                        ${isEditing ? `
                            <input type="text" id="editPersonalInput" value="${t.text}" style="width:100%;padding:6px 10px;border:1.5px solid #3b82f6;border-radius:8px;font-size:14px;" />
                        ` : `
                            <div class="task-title">${t.text}</div>
                            <div class="task-desc">${t.detalle || ''}</div>
                        `}
                    </div>
                    <span class="badge-status ${t.completada ? 'completado' : 'pendiente'}">
                        ${t.completada ? '✓ HECHA' : 'PENDIENTE'}
                    </span>
                </div>
                <div class="task-meta">
                    <span>${heroIcon('calendar')}${t.fecha || 'Sin fecha'}</span>
                    ${t.completada ? `<span>${heroIcon('check')}Completada</span>` : ''}
                </div>
                <div class="task-actions">
                    ${isEditing ? `
                        <button class="btn-approve" id="savePersonalEdit" data-id="${t.id}">${heroIcon('check')}Guardar</button>
                        <button class="btn-delete" id="cancelPersonalEdit" data-id="${t.id}">${heroIcon('xMark')}Cancelar</button>
                    ` : `
                        ${!t.completada ? `<button class="btn-done" data-action="personal-done" data-id="${t.id}">${heroIcon('check')}Hecho</button>` : ''}
                        <button class="btn-review" data-action="personal-edit" data-id="${t.id}">${heroIcon('pencil')}Editar</button>
                        <button class="btn-delete" data-action="personal-delete" data-id="${t.id}">${heroIcon('trash')}Eliminar</button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    dom.personalTaskList.innerHTML = html;

    dom.personalTaskList.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', handlePersonalAction);
    });

    const saveBtn = document.getElementById('savePersonalEdit');
    const cancelBtn = document.getElementById('cancelPersonalEdit');
    if (saveBtn) saveBtn.addEventListener('click', savePersonalEdit);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelPersonalEdit);
}

function handlePersonalAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    switch (action) {
        case 'personal-done':
            togglePersonalDone(id);
            break;
        case 'personal-edit':
            state.editingPersonalId = id;
            renderPersonalTasks();
            break;
        case 'personal-delete':
            deletePersonalTask(id);
            break;
    }
}

function togglePersonalDone(id) {
    const tasks = state.personalTasks;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx].completada = !tasks[idx].completada;
    savePersonalTasks(tasks);
    state.personalTasks = tasks;
    renderPersonalTasks();
    toast(tasks[idx].completada ? 'Tarea personal completada' : 'Tarea personal reactivada', 'info');
}

function deletePersonalTask(id) {
    if (!confirm('¿Eliminar esta tarea personal?')) return;
    state.personalTasks = state.personalTasks.filter(t => t.id !== id);
    savePersonalTasks(state.personalTasks);
    renderPersonalTasks();
    toast('Tarea personal eliminada', 'info');
}

function savePersonalEdit(e) {
    const id = e.currentTarget.dataset.id;
    const input = document.getElementById('editPersonalInput');
    if (!input) return;
    const newText = input.value.trim();
    if (!newText) {
        toast('El texto no puede estar vacío', 'error');
        return;
    }
    const tasks = state.personalTasks;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx].text = newText;
    savePersonalTasks(tasks);
    state.personalTasks = tasks;
    state.editingPersonalId = null;
    renderPersonalTasks();
    toast('Tarea personal actualizada', 'success');
}

function cancelPersonalEdit() {
    state.editingPersonalId = null;
    renderPersonalTasks();
}

function addPersonalTask() {
    const text = prompt('Nueva tarea personal:');
    if (!text || !text.trim()) return;
    const task = {
        id: 'pers_' + Date.now().toString(),
        text: text.trim(),
        detalle: '',
        fecha: new Date().toISOString().split('T')[0],
        completada: false,
    };
    state.personalTasks.push(task);
    savePersonalTasks(state.personalTasks);
    renderPersonalTasks();
    toast('Tarea personal agregada', 'success');
}

// =====================================================
// CARGA INICIAL COMPLETA
// =====================================================
async function loadAllData() {
    showSkeletons('obras');
    showSkeletons('system');
    await loadSystemTasks();
    loadPersonal();
}

// =====================================================
// INICIALIZACIÓN
// =====================================================
async function init() {
    // Configurar búsqueda ANTES de todo
    setupSearch();
    hydrateHeroIcons();
    updateClock();
    setInterval(updateClock, 1000);
    updateWeather();

    // El buscador queda disponible desde el arranque aunque la sesión aún no exista
    dom.globalSearch.disabled = false;
    updateSearchPlaceholder();

    // Verificar si hay usuario guardado
    const saved = loadSavedUser();
    if (saved) {
        selectUser(saved);
        loadUsers().then(renderUserList).catch((e) => {
            console.warn('Error al cargar usuarios en segundo plano:', e);
        });
        return;
    }

    // Mantener visible el selector para usuarios nuevos y cargar la lista ahí mismo
    dom.overlay.style.display = 'flex';
    dom.dashboard.style.display = 'none';
    const users = await loadUsers();
    renderUserList(users);
}

// =====================================================
// EVENTOS
// =====================================================
dom.refreshUsersBtn.addEventListener('click', async () => {
    const users = await loadUsers();
    renderUserList(users);
    toast('Usuarios recargados', 'info');
});

dom.logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('rtbrok_current_user');
    state.currentUser = null;
    showSearchFirstView();
    loadUsers().then(renderUserList);
    toast('Sesión cerrada', 'info');
});

dom.addPersonalBtn.addEventListener('click', addPersonalTask);

dom.filterStatus.addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    renderSystemTasks();
});

dom.filterPriority.addEventListener('change', (e) => {
    state.filterPriority = e.target.value;
    renderSystemTasks();
});

// =====================================================
// ARRANCAR
// =====================================================
document.addEventListener('DOMContentLoaded', init);
