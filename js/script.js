document.addEventListener('DOMContentLoaded', function() {
    // Добавление класса slide-section к секциям и футеру
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('slide-section');
    });

    // Создание наблюдателя
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Добавление класса 'active', когда секция в видимой области
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    // Наблюдение за всеми секциями
    sections.forEach(section => {
        observer.observe(section);
    });
    
    
    
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Показать или скрыть кнопку при прокрутке
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = 'block'; // Показываем кнопку
        } else {
            scrollToTopBtn.style.display = 'none'; // Скрываем кнопку
        }
    };

    // Прокрутка к верху страницы
    scrollToTopBtn.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    
    
});

function scrollToHeader(headerId) {
    const header = document.getElementById(headerId);
    if (header) {
        const offset = 150; // Замените на нужное вам значение
        const elementPosition = header.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    // Сохранение выбора темы в localStorage
    if (body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // Восстановление темы при загрузке страницы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
  }
});

document.addEventListener('mousemove', (e) => {
  const eyesContainer = document.querySelector('.eyes');
  const eyes = document.querySelectorAll('.eyes > div');
  
  if(!eyesContainer || eyes.length !== 2) return;
  
  const containerRect = eyesContainer.getBoundingClientRect();
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;

  const angle = Math.atan2(e.clientY - containerCenterY, e.clientX - containerCenterX);
  const distance = Math.min(
    eyes[0].offsetWidth / 4,
    Math.sqrt(Math.pow(e.clientX - containerCenterX, 2) + Math.pow(e.clientY - containerCenterY, 2))
  );

  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;
  
  eyes.forEach(eye => {
    const eyeBall = eye.querySelector('i');
    eyeBall.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});





document.addEventListener("DOMContentLoaded", () => {
  // Если сайт лежит не в корне (например, GitHub Pages), добавьте префикс сюда, например: '/my-repo'
  const BASE_PATH = ''; 
  const DATA_URL = '/js/data.json';

  fetch(DATA_URL)
    .then(response => {
      if (!response.ok) throw new Error(`JSON не найден: ${response.status}`);
      return response.json();
    })
    .then(data => {
      // 1. Получаем "чистый" путь
      let path = window.location.pathname;
      
      // Убираем .html (если есть)
      path = path.replace(/\.html$/, '');
      
      // Убираем /index в конце (для главной)
      path = path.replace(/\/index$/, '');
      
      // Убираем слэш в конце (если путь не просто "/")
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      
      // Если путь пустой, значит это корень
      if (path === '') path = '/';

      console.log('🔍 Ищу страницу:', path); // СМОТРИТЕ В КОНСОЛЬ

      // 2. Ищем совпадение
      const pageData = data.find(item => {
        // Сравниваем тоже "чистые" пути из JSON на всякий случай
        let jsonPath = item.page.replace(/\/$/, '');
        if (jsonPath === '') jsonPath = '/';
        return jsonPath === path;
      });

      if (pageData) {
        console.log('✅ Найдено:', pageData.title);
        document.title = pageData.title;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", pageData.description);
      } else {
        console.warn('⚠️ Страница не найдена в JSON. Текущий путь:', path);
        console.log('Доступные пути в JSON:', data.map(d => d.page));
      }
    })
    .catch(err => {
      console.error('❌ Ошибка скрипта:', err);
      // Если вы видите эту ошибку и открываете файл локально — читайте пункт 2 ниже
    });
});






  
