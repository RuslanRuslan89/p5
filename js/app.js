document.addEventListener('DOMContentLoaded', () => {

    // ====================================================
    // 4. Бургер-меню (ОБНОВЛЕНО: Новый функционал)
    // ====================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links'); // Переименовал для ясности
    const body = document.body;

    // Функция-переключатель
    const toggleMenu = () => {
        navLinksContainer.classList.toggle('open');
        menuToggle.classList.toggle('open');
        // Предотвращаем скролл страницы, пока меню открыто
        body.classList.toggle('no-scroll');
    };

    // 1. Обработка клика по бургеру
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // 2. Обработка клика по любой ссылке внутри меню (чтобы закрыть его после перехода)
    if (navLinksContainer) {
        navLinksContainer.querySelectorAll('a').forEach(link => {
            // Игнорируем внешние ссылки, если они есть
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', () => {
                    // Закрываем меню, только если оно открыто
                    if (navLinksContainer.classList.contains('open')) {
                        toggleMenu();
                    }
                });
            }
        });
    }

    // ====================================================
    // 1. Анимация Диаграммы (при появлении на экране)
    // ====================================================
    const chartMockup = document.querySelector('.chart-mockup');
    
    // Проверяем наличие IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chartMockup.classList.add('animated');
                    observer.unobserve(chartMockup);
                }
            });
        }, {
            threshold: 0.5
        });
    
        if (chartMockup) {
            observer.observe(chartMockup);
        }
    }


    // ----------------------------------------------------
    // 2. Интерактивный Аккордеон (FAQ)
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Закрываем все остальные открытые ответы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    // Добавляем проверку, чтобы избежать ошибок, если answer не найден
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if(otherAnswer) {
                         otherAnswer.style.maxHeight = '0';
                         otherAnswer.style.padding = '0 25px';
                    }
                }
            });

            // Открываем или закрываем текущий ответ
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                // Устанавливаем max-height для анимации
                answer.style.maxHeight = answer.scrollHeight + 30 + 'px'; // +30 для внутреннего паддинга
                answer.style.padding = '0 25px 25px 25px'; // Добавляем нижний паддинг при открытии
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0 25px';
            }
        });
    });

    // ----------------------------------------------------
    // 3. Подсветка Активного Пункта Меню (Scroll Spy)
    // ----------------------------------------------------
    // Все секции, которые должны быть в меню
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveLink = () => {
        // Проверяем, что меню не открыто, чтобы Scroll Spy не конфликтовал с мобильной навигацией
        if (navLinksContainer && navLinksContainer.classList.contains('open')) {
            return; 
        }

        let current = '';

        sections.forEach(section => {
            // Учитываем высоту фиксированного навбара (~80-100px)
            const navbarHeight = 100; 
            const sectionTop = section.offsetTop - navbarHeight;
            const triggerPoint = section.offsetTop - window.innerHeight / 2.5; // Активировать, когда секция в верхней трети/середине

            // Активируем, когда секция находится достаточно высоко на экране
            if (scrollY >= triggerPoint) {
                 current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active-nav');
            // Проверяем, что href ссылки содержит id текущей секции
            if (a.getAttribute('href').includes(current) && current !== '') {
                a.classList.add('active-nav');
            }
        });
    };

    // Запускаем при прокрутке и при загрузке
    window.addEventListener('scroll', setActiveLink);
    // Добавляем задержку, чтобы Scroll Spy правильно вычислил начальное положение
    setTimeout(setActiveLink, 100); 

});
