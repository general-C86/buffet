document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('authOverlay');
    const input = document.getElementById('authInput');
    const btn = document.getElementById('authBtn');
    const cartCount = document.getElementById('cartCount');
    const cart = new Map(); 


    // Временные данные меню
   
const dishes = [
    { id: 1, name: 'Пирожок', price: 50, image: '', category: 'Выпечка' },
    { id: 2, name: 'Сэндвич', price: 120, image: '', category: 'Заготовки' },
    { id: 3, name: 'Чай', price: 40, image: '', category: 'Напитки' },
    { id: 4, name: 'Булочка', price: 65, image: '', category: 'Десерты' },
    { id: 5, name: 'Сок', price: 80, image: '', category: 'Напитки' },
    { id: 6, name: 'Салат', price: 150, image: '', category: 'Заготовки' }
];

    // Адрес API меню. Добавим его, когда получим от разработчика 1С.
const API_MENU_URL = '';


async function getDishes() {
    // Пока API-адрес неизвестен, используем тестовые данные
    if (!API_MENU_URL) {
        return dishes;
    }

    // Отправляем запрос к API
    const response = await fetch(API_MENU_URL);

    // Проверяем HTTP-статус
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    // Преобразуем ответ из JSON в данные JavaScript
    const data = await response.json();

    // Проверяем, что API вернул массив блюд
    if (!Array.isArray(data)) {
        throw new Error('API вернуло данные в неожиданном формате');
    }

    return data;
}




async function testApiRequest() {
    try {
        const response = await fetch('АДРЕС_API');

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные от API:', data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}


    // Находим контейнер карточек в HTML
    
const menuCards = document.getElementById('menuCards');

// Функция отображения блюд
function renderMenu(dishes) {
    menuCards.innerHTML = '';

    dishes.forEach((dish) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('card-image');

        const image = document.createElement('img');
        image.src = dish.image;
        image.alt = dish.name;

        imageContainer.appendChild(image);

        const content = document.createElement('div');
        content.classList.add('card-conetent');

        const title = document.createElement('h3');
        title.classList.add('card-title');
        title.textContent = dish.name;

        const price = document.createElement('p');
        price.classList.add('card-price');
        price.textContent = `${dish.price} ₽`;

        const button = document.createElement('button');
        button.classList.add('card-btn');
        button.textContent = 'В корзину';

        button.addEventListener('click', () => {
    addToCart(dish);
});

        content.append(title, price, button);
        card.append(imageContainer, content);
        menuCards.appendChild(card);
    });
}



async function loadMenu() {
    try {
        const menu = await getDishes();
        renderMenu(menu);
    } catch (error) {
        console.error('Не удалось загрузить меню:', error);
        menuCards.textContent = 'Не удалось загрузить меню. Попробуйте обновить страницу.';
    }
}

loadMenu();

function updateCartCount(count) {
    cartCount.textContent = count;
    cartCount.classList.toggle('hidden', count === 0);
}

function addToCart(dish) {
    const currentQuantity = cart.get(dish.id) || 0;

    cart.set(dish.id, currentQuantity + 1);

    let totalQuantity = 0;

    cart.forEach((quantity) => {
        totalQuantity += quantity;
    });

    updateCartCount(totalQuantity);
}


const categoryLinks = document.querySelectorAll('[data-category]');

categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const selectedCategory = link.dataset.category;

        categoryLinks.forEach((item) => {
            item.classList.remove('active');
        });

        link.classList.add('active');

        const filteredDishes = selectedCategory === 'all'
            ? dishes
            : dishes.filter((dish) => dish.category === selectedCategory);

        renderMenu(filteredDishes);
    });
});





    // При загрузке страницы сразу блокируем скролл если модалка открыта
    if (overlay && !overlay.classList.contains('hidden')) {
        document.body.classList.add('no-scroll');
    }

    // Клик по кнопке Войти
    btn.addEventListener('click', () => {
        if (input.value.trim() !== '') {
            closeAuthModal();
        } else {
            alert('Введите ID!');
        }
    });

    // Нажатие Enter в поле ввода
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btn.click();
        }
    });

    function closeAuthModal() {
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }
});