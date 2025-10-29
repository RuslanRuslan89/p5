document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Анимация Диаграммы (при появлении на экране)
    const chartMockup = document.querySelector('.chart-mockup');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс, чтобы запустить CSS-анимацию
                chartMockup.classList.add('animated');
                // Отключаем наблюдатель после первого срабатывания
                observer.unobserve(chartMockup);
            }
        });
    }, {
        threshold: 0.5 // Срабатывает, когда 50% элемента в области видимости
    });

    if (chartMockup) {
        observer.observe(chartMockup);
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
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-answer').style.padding = '0 25px';
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
        let current = '';

        sections.forEach(section => {
            // Учитываем прокрутку и высоту навигации
            const sectionTop = section.offsetTop; 
            const sectionHeight = section.clientHeight;
            // Активируем, когда секция находится в верхней трети экрана
            if (scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active-nav');
            // Проверяем, что href ссылки содержит id текущей секции
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active-nav');
            }
        });
    };

    // Запускаем при прокрутке и при загрузке
    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); 

});
