document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Логика Аккордеона (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Закрываем все остальные, если они открыты
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = 0;
                }
            });

            // Переключаем текущий
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                // Устанавливаем максимальную высоту равной высоте контента
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // 2. Логика Scroll Spy (Активный пункт меню)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Активность, когда 40% секции видно
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Снимаем класс 'active-nav' со всех ссылок
                navLinks.forEach(link => link.classList.remove('active-nav'));

                // Находим соответствующую ссылку и добавляем 'active-nav'
                const targetId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-nav');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // 3. Анимация Диаграммы (Mockup)
    const chartMockup = document.querySelector('.chart-mockup');
    
    // Добавляем класс анимации сразу, чтобы бары выезжали при загрузке
    chartMockup.classList.add('animated'); 
});
