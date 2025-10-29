document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Логика Аккордеона FAQ ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            // Проверяем, открыт ли аккордеон
            const isActive = faqItem.classList.contains('active');

            // Закрываем все остальные открытые аккордеоны
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });

            // Переключаем текущий аккордеон
            if (isActive) {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                faqItem.classList.add('active');
                // Устанавливаем max-height равным высоте контента для анимации
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // --- 2. Логика Анимации Диаграммы при Прокрутке (Intersection Observer) ---

    const chartMockup = document.querySelector('.chart-mockup');
    const analyticsSection = document.querySelector('.analytics-section');

    if (analyticsSection && chartMockup) {
        // Создаем Observer для отслеживания видимости секции
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Если секция стала видимой, добавляем класс для запуска CSS-анимации
                    chartMockup.classList.add('animated');
                    // Отключаем Observer, чтобы анимация сработала только один раз
                    observer.unobserve(analyticsSection);
                }
            });
        }, {
            // Срабатывает, когда 20% секции Аналитики видно на экране
            threshold: 0.2 
        });

        // Начинаем наблюдение
        observer.observe(analyticsSection);
    }
    
    // --- 3. Логика Активной Ссылки в Навигации (Scroll Spy) ---

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Учитываем высоту навигации для лучшего определения активной секции
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) { 
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active-nav');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active-nav');
            }
        });
        
        // Отдельно обрабатываем кнопку "Начать сейчас"
        const ctaButton = document.querySelector('.navbar .btn-primary');
        if (ctaButton) {
            // Если мы в Hero секции, не подсвечиваем навигацию
            const heroSection = document.querySelector('.hero-section');
             if (pageYOffset < heroSection.offsetHeight / 2) {
                 navLinks.forEach(a => a.classList.remove('active-nav'));
             }
        }
    });
});
