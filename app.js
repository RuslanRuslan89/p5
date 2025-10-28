document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Плавный Скролл для Навигации (UX улучшение)
    // ----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Игнорируем ссылки, не ведущие на секции (например, Войти)
            if (this.classList.contains('btn-secondary')) return; 

            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ----------------------------------------------------
    // 2. Анимация Счетчик (Counter Animation)
    // ----------------------------------------------------
    const counters = document.querySelectorAll('.metric-value');
    let countersActivated = false;

    // Функция для запуска анимации счетчика
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0; 
        let count = 0;
        const duration = 2000; // 2 секунды
        const stepTime = 10; // 10 миллисекунд

        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        
        const timer = setInterval(() => {
            count += increment;
            
            if (count >= target) {
                clearInterval(timer);
                count = target; // Устанавливаем точное целевое значение
            }

            // Форматирование: целое число или один знак после запятой
            const formattedValue = isDecimal ? count.toFixed(1) : Math.floor(count);
            
            // Добавляем символ процента, если это "Рост охвата"
            counter.textContent = counter.id === 'reach-growth' ? `${formattedValue}%` : formattedValue;

        }, stepTime);
    };

    // ----------------------------------------------------
    // 3. Интерактивный Старт Диаграмм и Счетчиков (при попадании в область видимости)
    // ----------------------------------------------------
    const dashboardPreview = document.querySelector('.dashboard-preview');
    const chartMockup = document.querySelector('.chart-mockup');
    
    // Observer для отслеживания появления элементов в области видимости
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Активация счетчиков
                if (entry.target === dashboardPreview && !countersActivated) {
                    counters.forEach(animateCounter);
                    countersActivated = true;
                }
                
                // Активация анимации столбцов
                if (entry.target === dashboardPreview) {
                    // Добавляем класс, который запускает CSS-анимацию
                    chartMockup.classList.add('animated');
                }

                // Прекращаем наблюдение, чтобы не запускать повторно
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 }); // Запускаем, когда 20% элемента видно

    observer.observe(dashboardPreview);
    
    // ----------------------------------------------------
    // 4. Обработка Формы (для предотвращения перезагрузки страницы)
    // ----------------------------------------------------
    document.querySelector('.cta-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Спасибо за заявку! Мы свяжемся с вами по поводу бета-доступа.');
        // Здесь обычно отправка данных на сервер
        this.reset();
    });
});
