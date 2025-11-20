document.addEventListener('DOMContentLoaded', () => {

    // ====================================================
    // 4. Бургер-меню (ОСТАВЛЕНО БЕЗ ИЗМЕНЕНИЙ)
    // ====================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links'); // Контейнер ссылок
    const body = document.body;

    // Функция-переключатель для меню
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
            // Закрываем меню только при клике на внутренние якоря (#)
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', () => {
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
    if ('IntersectionObserver' in window && chartMockup) {
        const chartObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chartMockup.classList.add('animated');
                    // Останавливаем наблюдение после первой активации
                    chartObserver.unobserve(chartMockup);
                }
            });
        }, {
            // Активация, когда 50% элемента видно
            threshold: 0.5
        });
    
        chartObserver.observe(chartMockup);
    }


    // ----------------------------------------------------
    // 2. Интерактивный Аккордеон (FAQ) - Улучшена логика закрытия
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return; // Защита, если элементы не найдены

        const closeItem = (i) => {
            i.classList.remove('active');
            const a = i.querySelector('.faq-answer');
            if (a) {
                a.style.maxHeight = '0';
                a.style.padding = '0 25px';
            }
        };

        const openItem = (i, a) => {
            i.classList.add('active');
            // Устанавливаем max-height для анимации
            a.style.maxHeight = a.scrollHeight + 30 + 'px'; // +30 для внутреннего паддинга
            a.style.padding = '0 25px 25px 25px'; // Добавляем нижний паддинг при открытии
        };

        question.addEventListener('click', () => {
            // Проходим по всем элементам и закрываем те, которые не являются текущим
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    closeItem(otherItem);
                }
            });

            // Открываем или закрываем текущий ответ
            if (item.classList.contains('active')) {
                closeItem(item);
            } else {
                openItem(item, answer);
            }
        });
    });

    // ----------------------------------------------------
    // 3. Подсветка Активного Пункта Меню (Scroll Spy)
    //    ОБНОВЛЕНО: Используется IntersectionObserver для лучшей производительности
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Функция для установки активного класса
    const setActiveLink = (activeId) => {
        navLinks.forEach(a => {
            a.classList.remove('active-nav');
            // Проверяем, что href ссылки содержит id текущей секции
            if (activeId && a.getAttribute('href').includes(activeId)) {
                a.classList.add('active-nav');
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            // Устанавливаем rootMargin так, чтобы секция считалась активной,
            // когда она занимает верхние 40% экрана (проходит отметку 40% сверху)
            rootMargin: '0px 0px -60% 0px',
            threshold: 0 // Сработает сразу, как только элемент пересечет границу
        };

        const scrollSpyObserver = new IntersectionObserver((entries) => {
            // Используем reduceRight, чтобы найти самую нижнюю (последнюю) секцию,
            // которая в данный момент пересекает порог (т.е. находится выше 60% экрана)
            const activeEntry = entries.reduceRight((acc, entry) => {
                if (entry.isIntersecting && !acc) {
                    return entry;
                }
                return acc;
            }, null);

            if (activeEntry) {
                setActiveLink(activeEntry.target.id);
            }
            
        }, observerOptions);

        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    } else {
        // Fallback для старых браузеров (старый, менее производительный метод)
        console.warn('IntersectionObserver не поддерживается. Используется Scroll Spy на основе события scroll.');
        const fallbackSetActiveLink = () => {
            let current = '';
            const navbarHeight = 100;
            const triggerPoint = window.innerHeight * 0.4; // 40% от высоты экрана

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight;

                if (window.scrollY >= section.offsetTop - triggerPoint) {
                    current = section.getAttribute('id');
                }
            });
            setActiveLink(current);
        };

        window.addEventListener('scroll', fallbackSetActiveLink);
        setTimeout(fallbackSetActiveLink, 100);
    }
});
