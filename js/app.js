document.addEventListener('DOMContentLoaded', () => {

    // 1. Логика Аккордеона (FAQ) - Улучшена доступность и управление состоянием
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Инициализация ARIA
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0'; // Гарантируем закрытое состояние

        question.addEventListener('click', () => {
            const isExpanded = item.classList.contains('active');

            // --- Закрытие всех остальных элементов ---
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    
                    if (otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherAnswer.style.maxHeight = '0';
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        // Убираем анимационный класс, если он есть (для сброса)
                        otherQuestion.querySelector('i').classList.remove('fa-rotate-180'); 
                    }
                }
            });

            // --- Переключение текущего элемента ---
            item.classList.toggle('active');

            if (!isExpanded) {
                // Открыть
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute('aria-expanded', 'true');
                question.querySelector('i').classList.add('fa-rotate-180');
            } else {
                // Закрыть
                answer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
                question.querySelector('i').classList.remove('fa-rotate-180');
            }
        });
    });

    // 2. Логика Scroll Spy (Активный пункт меню) - Оптимизирован Intersection Observer
    // Используем меньший порог (threshold) и rootMargin, чтобы активным был тот элемент,
    // который находится ближе к вершине видимой области.
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Определяем активный элемент, когда он достигает верхней части (rootMargin: -100px)
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -75% 0px', // Верхний отступ -100px (активная зона начинается ниже), Нижний отступ -75% (активная зона заканчивается выше)
        threshold: 0 // Порог 0, так как мы используем rootMargin
    };

    // Функция сброса активного класса
    const removeActiveClass = () => {
        navLinks.forEach(link => link.classList.remove('active-nav'));
    };

    const observer = new IntersectionObserver((entries) => {
        // Находим текущий элемент, который пересекает активную зону
        const intersectingEntry = entries.find(entry => entry.isIntersecting);

        // Если активный элемент найден
        if (intersectingEntry) {
            removeActiveClass();

            const targetId = intersectingEntry.target.getAttribute('id');
            
            // Проверяем наличие targetId, чтобы избежать ошибок с неименованными секциями
            if (targetId) {
                const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-nav');
                }
            }
        }
        
        // Дополнительная проверка: если мы в самом верху (первая секция)
        // Если никакая секция не пересекает, но мы в самом верху, активируем первую ссылку (Hero/Платформы)
        const isNearTop = window.scrollY < (sections[0].offsetHeight * 0.5);
        if (!intersectingEntry && isNearTop) {
            removeActiveClass();
            const firstLink = navLinks[0];
            if (firstLink) {
                firstLink.classList.add('active-nav');
            }
        }
        
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 3. Анимация Диаграммы (Mockup) - Оптимизируем запуск анимации
    // Используем Intersection Observer для запуска анимации, когда секция попадает в поле зрения (более эффективно, чем немедленный запуск).
    const analyticsSection = document.querySelector('.analytics-section');
    const chartMockup = document.querySelector('.chart-mockup');

    if (analyticsSection && chartMockup) {
        // Функция, запускающая анимацию
        const startChartAnimation = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chartMockup.classList.add('animated');
                    // Останавливаем наблюдение после запуска
                    observer.unobserve(entry.target); 
                }
            });
        };

        const chartObserver = new IntersectionObserver(startChartAnimation, {
            threshold: 0.1 // Запуск, когда 10% секции видно
        });
        
        chartObserver.observe(analyticsSection);
    }
});
