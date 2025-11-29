// Tailwind config
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['Space Grotesk', 'monospace'],
            },
            colors: {
                brand: {
                    bg: '#050505',
                    accent: '#6366f1',
                    cyan: '#06b6d4',
                    alert: '#ef4444',
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }
        }
    }
}

// Initialize icons
lucide.createIcons();

// 3D Canvas initialization
const init3D = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0002);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.9, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(15, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 1 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const pGeo = new THREE.BufferGeometry();
    const pCount = 20000;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 70;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0x06b6d4, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    camera.position.z = 30;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.002;
        particles.rotation.y -= 0.0005;
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };

    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const cubesGroup = new THREE.Group();

    for (let i = 0; i < 30; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.x = (Math.random() - 0.5) * 80;
        cube.position.y = (Math.random() - 0.5) * 80;
        cube.position.z = (Math.random() - 0.5) * 60;
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.5 + 0.5;
        cube.scale.set(scale, scale, scale);

        cubesGroup.add(cube);
    }
    scene.add(cubesGroup);
};
init3D();

// Login modal functions
function toggleLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    } else {
        console.error("Ошибка: Модальное окно с ID 'login-modal' не найдено!");
    }
}

function handleLogin(e) {
    e.preventDefault();

    const btn = e.target.querySelector('button');
    const roleSelect = document.getElementById('role-select');
    const selectedRole = roleSelect ? roleSelect.value : 'admin';
    const originalContent = btn.innerHTML;

    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Обработка...`;
    lucide.createIcons(); 
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    setTimeout(() => {
        btn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i> Доступ разрешен`;
        btn.classList.remove('from-brand-accent', 'to-indigo-600');
        btn.classList.add('bg-green-500');
        lucide.createIcons();

        setTimeout(() => {
            if (selectedRole === 'chef') {
                const msg = currentLang === 'uz'
                    ? "👨‍🍳 Tizimga kirish bajarildi!"
                    : "👨‍🍳 Вход выполнен!";
                alert(msg);
            } else {
                alert("Welcome to Bog'cha.OS System!");
            }
            toggleLogin();
            btn.innerHTML = originalContent;
            btn.classList.remove('bg-green-500', 'opacity-75', 'cursor-not-allowed');
            btn.classList.add('from-brand-accent', 'to-indigo-600');
            lucide.createIcons();

        }, 800);
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtns = document.querySelectorAll('button');
    loginBtns.forEach(btn => {
        if (btn.innerText.includes('Войти') || btn.innerText.includes('Access')) {
            btn.onclick = toggleLogin;
        }
    });
});

// Language switching
let currentLang = 'ru';

const translations = {
    ru: {
        // NAV
        nav_eco: "Экосистема",
        nav_safety: "Safety",
        nav_finance: "Финансы",
        nav_price: "Цены",
        btn_login: "Войти в систему",

        // HERO
        hero_title_1: "Цифровой мозг",
        hero_title_2: "вашего бизнеса",
        hero_desc: "Больше, чем просто CRM. Единая экосистема для управления финансами, безопасностью (Smart Safety), питанием и HR. Полная прозрачность от склада продуктов до Face ID проходной.",
        btn_hero_price: "Выбрать тариф",
        btn_hero_safety: "Модуль безопасности",

        // MODULE 1: ADMIN & CORE
        sec_admin_title: "Администрирование и Учет",
        sec_admin_desc: "Автоматизация регистратуры, расписания и работы с клиентами на основе жесткой логики.",

        card_sched_title: "Умное расписание",
        card_sched_desc: "Система 'Set & Forget'. Записывайте ребенка на весь год вперед. Логика 'До отмены' избавляет от ручного дублирования.",

        card_roles_title: "Роли и Доступы",
        card_roles_desc: "Гибкая настройка прав. Администратор не видит прибыль, Врач не видит кассу. Каждый сотрудник имеет свой доступ.",

        card_kitchen_title: "Связь с Кухней",
        card_kitchen_desc: "Больше никаких лишних порций. Повар получает отчет: сколько детей пришло и сколько готовить завтраков.",

        card_allergy_title: "Стоп-лист Продуктов",
        card_allergy_desc: "Индивидуальный контроль. Если у ребенка аллергия (например, на цитрусовые), система выделит его красным цветом для повара.",

        // MODULE 2: SAFETY
        safety_badge: "Priority Module",
        safety_main_title: "Smart Safety & Monitoring",
        safety_main_desc: "Мы внедрили ИИ для защиты детей. Система не просто фиксирует вход, она анализирует аномалии и мгновенно оповещает персонал.",

        feat_face_title: "Face ID Проходная",
        feat_face_desc: "Пуш-уведомление родителю: 'Ваш ребенок вошел'. Автоматический табель для сотрудников.",

        feat_zone_title: "Зональный мониторинг",
        feat_zone_desc: "Если ребенок долго находится в 'Коридоре' или 'Туалете', система отправит сигнал воспитателю.",

        feat_panic_title: "Тревожная кнопка",
        feat_panic_desc: "В кабинете у каждого воспитателя. Мгновенный вызов охраны или администратора при ЧП.",

        alert_title: "Внимание: Зона 'Холл'",
        alert_desc: "Ребенок (ID #4023) находится вне группы более 15 минут. Требуется проверка.",
        alert_role: "Воспитатель",

        // MODULE 3: FINANCE
        fin_main_title: "Финансы без ошибок",

        fin_c1_title: "Депозиты и Долги",
        fin_c1_desc: "Детальный баланс каждого родителя. Видно, за какую именно услугу возник долг.",

        fin_c2_title: "Умный Возврат",
        fin_c2_desc: "При возврате денег на карту (Payme/Click) система сама вычитает % комиссии эквайринга.",

        fin_c3_title: "История Цен",
        fin_c3_desc: "Сменили цену услуги? Старые записи сохранят старую цену. Бухгалтерия сойдется до тийина.",

        fin_c4_title: "Z-Отчеты",
        fin_c4_desc: "Полноценное закрытие кассовой смены. Разделение на Наличные, Терминал, Онлайн.",

        // PRICING
        price_main_title: "Стоимость системы",
        price_sub: "Честные тарифы за полную автоматизацию.",

        // Start Tarif
        p_start_desc: "Для небольших частных садов (до 50 детей).",
        p_start_l1: "База клиентов (CRM)",
        p_start_l2: "Талоны и Регистратура",
        p_start_l3: "Складской учет",
        btn_select: "Выбрать",

        // Business Tarif
        p_biz_badge: "Рекомендуем",
        p_biz_l1: "Smart Safety (Безопасность)",
        p_biz_l2: "Face ID для сотрудников",
        p_biz_l3: "Финансовый модуль",
        p_biz_l4: "Приложение для родителей",
        p_biz_l5: "Расчет зарплат (KPI)",
        btn_connect: "Подключить",

        // Network Tarif
        p_net_sub: "Для сетей от 3-х филиалов",
        p_net_l1: "Единая база всех филиалов",
        p_net_l2: "White Label (Ваш бренд)",
        p_net_l3: "Доработка под ваши процессы",
        btn_discuss: "Обсудить",

        // FOOTER
        footer_text: "Разработано с учетом требований безопасности Узбекистана.",

        // MODAL
        modal_title: "Добро пожаловать",
        modal_sub: "Войдите в систему Bog'cha.OS",
        modal_label_role: "Роль доступа",
        modal_label_login: "Логин / ID",
        modal_label_pass: "Пароль",
        modal_btn_enter: "Войти в систему"
    },
    uz: {
        // NAV
        nav_eco: "Ekotizim",
        nav_safety: "Xavfsizlik",
        nav_finance: "Moliya",
        nav_price: "Tariflar",
        btn_login: "Tizimga kirish",

        // HERO
        hero_title_1: "Biznesingizning",
        hero_title_2: "raqamli aqli",
        hero_desc: "Shunchaki CRM emas. Moliya, xavfsizlik (Smart Safety), ovqatlanish va HR boshqaruvi uchun yagona ekotizim. Oziq-ovqat omboridan tortib Face ID nazoratigacha to'liq shaffoflik.",
        btn_hero_price: "Tarifni tanlash",
        btn_hero_safety: "Xavfsizlik moduli",

        // MODULE 1: ADMIN
        sec_admin_title: "Ma'muriyat va Hisob",
        sec_admin_desc: "Registratura, dars jadvallari va mijozlar bilan ishlashni qat'iy mantiq asosida avtomatlashtirish.",

        card_sched_title: "Aqlli Jadval",
        card_sched_desc: "'Set & Forget' tizimi. Bolani bir yil oldinga yozing. 'Bekor qilinguncha' mantiqi sizni qo'lda qayta yozishdan qutqaradi.",

        card_roles_title: "Rollar va Ruxsatlar",
        card_roles_desc: "Huquqlarni moslashuvchan sozlash. Administrator foydani ko'rmaydi, Shifokor kassani ko'rmaydi. Har bir xodim o'z ruxsatiga ega.",

        card_kitchen_title: "Oshxona bilan aloqa",
        card_kitchen_desc: "Ortiqcha ovqat isrofi yo'q. Oshpaz avtomatik hisobot oladi: nechta bola keldi va qancha nonushta tayyorlash kerak.",

        card_allergy_title: "Taqiqlangan Mahsulotlar",
        card_allergy_desc: "Individual nazorat. Agar bolada allergiya bo'lsa (masalan, sitrus mevalarga), tizim uni oshpaz uchun qizil rangda ajratib ko'rsatadi.",

        // MODULE 2: SAFETY
        safety_badge: "Asosiy Modul",
        safety_main_title: "Smart Safety & Monitoring",
        safety_main_desc: "Biz bolalarni himoya qilish uchun sun'iy intellektni joriy qildik. Tizim nafaqat kirishni qayd etadi, balki xavfni tahlil qiladi va xodimlarni ogohlantiradi.",

        feat_face_title: "Face ID Nazorati",
        feat_face_desc: "Ota-onaga push-xabar: 'Farzandingiz kirdi'. Xodimlar uchun avtomatik davomat tabeli.",

        feat_zone_title: "Hududiy Monitoring",
        feat_zone_desc: "Agar bola 'Yo'lak' yoki 'Hojatxona'da uzoq vaqt qolib ketsa, tizim tarbiyachiga signal yuboradi.",

        feat_panic_title: "Xavotir tugmasi (Trevoga)",
        feat_panic_desc: "Har bir tarbiyachi xonasida mavjud. Favqulodda vaziyatda soqchilar yoki administratorni chaqirish.",

        alert_title: "Diqqat: 'Xoll' hududi",
        alert_desc: "Bola (ID #4023) 15 daqiqadan beri guruhdan tashqarida. Tekshirish talab etiladi.",
        alert_role: "Tarbiyachi",

        // MODULE 3: FINANCE
        fin_main_title: "Xatosiz Moliya",

        fin_c1_title: "Depozit va Qarzlar",
        fin_c1_desc: "Har bir ota-onaning batafsil balansi. Qarz aynan qaysi xizmat uchun paydo bo'lgani aniq ko'rinadi.",

        fin_c2_title: "Aqlli Qaytarish (Vozvrat)",
        fin_c2_desc: "Pul kartaga (Payme/Click) qaytarilganda, tizim avtomatik ravishda ekvayring komissiyasini chegirib qoladi.",

        fin_c3_title: "Narxlar Tarixi",
        fin_c3_desc: "Xizmat narxi o'zgardimi? Eski yozuvlar eski narxni saqlab qoladi. Buxgalteriya tiyinigacha to'g'ri chiqadi.",

        fin_c4_title: "Z-Hisobotlar",
        fin_c4_desc: "Kassa smenasini to'liq yopish. Naqd, Terminal va Onlayn to'lovlarni alohida hisoblash.",

        // PRICING
        price_main_title: "Tizim narxi",
        price_sub: "To'liq avtomatlashtirish uchun halol tariflar.",

        // Start
        p_start_desc: "Kichik xususiy bog'chalar uchun (50 bolagacha).",
        p_start_l1: "Mijozlar bazasi (CRM)",
        p_start_l2: "Talonlar va Registratura",
        p_start_l3: "Ombor hisobi",
        btn_select: "Tanlash",

        // Business
        p_biz_badge: "Tavsiya etamiz",
        p_biz_l1: "Smart Safety (Xavfsizlik)",
        p_biz_l2: "Xodimlar uchun Face ID",
        p_biz_l3: "Moliya moduli",
        p_biz_l4: "Ota-onalar uchun ilova",
        p_biz_l5: "Oylik hisoblash (KPI)",
        btn_connect: "Ulash",

        // Network
        p_net_sub: "3 ta filialdan ortiq tarmoqlar uchun",
        p_net_l1: "Barcha filiallar uchun yagona baza",
        p_net_l2: "White Label (Sizning brendingiz)",
        p_net_l3: "Jarayonlaringizga moslashtirish",
        btn_discuss: "Muhokama qilish",

        // FOOTER
        footer_text: "O'zbekiston xavfsizlik talablarini hisobga olgan holda ishlab chiqilgan.",

        // MODAL
        modal_title: "Xush kelibsiz",
        modal_sub: "Bog'cha.OS tizimiga kiring",
        modal_label_role: "Kirish huquqi (Rol)",
        modal_label_login: "Login / ID",
        modal_label_pass: "Parol",
        modal_btn_enter: "Tizimga kirish"
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'uz' : 'ru';

    const langBtn = document.getElementById('current-lang-text');
    if (langBtn) langBtn.textContent = currentLang === 'ru' ? 'UZ' : 'RU';

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            el.style.opacity = '0';
            setTimeout(() => {
                el.innerText = translations[currentLang][key];
                el.style.opacity = '1';
            }, 150);
        }
    });
    const inputLogin = document.querySelector('input[type="text"]');
    const inputPass = document.querySelector('input[type="password"]');

    if (currentLang === 'uz') {
        if (inputLogin) inputLogin.placeholder = "Xodim ID raqami";
        if (inputPass) inputPass.placeholder = "Parol";
    } else {
        if (inputLogin) inputLogin.placeholder = "ID сотрудника";
        if (inputPass) inputPass.placeholder = "••••••••";
    }
}

