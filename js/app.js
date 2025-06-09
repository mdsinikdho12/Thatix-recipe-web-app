const Input = document.getElementById('input-items');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');
const scrollBtn = document.getElementById('scrollToTopBtn');

const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Load default items
async function loaditems() {
    loader.style.display = 'flex';
    mainContent.style.display = 'none';

    try {
        const res = await fetch(url);
        const items = await res.json();
        Renderitems(items.meals);
    } catch (error) {
        console.log("Failed to load items...");
    } finally {
        loader.style.display = 'none';
        mainContent.style.display = 'block';
    }
}

// Render recipe cards
function Renderitems(meals) {
    const grid = document.getElementById("recipe-container");
    grid.innerHTML = '';

    if (!meals) {
        grid.innerHTML = "<p>No meals found.</p>";
        return;
    }

    meals.forEach(meal => {
        const title = meal.strMeal;
        const image = meal.strMealThumb;
        const description = meal.strInstructions.slice(0, 100);

        const card = document.createElement('div');
        card.className = "max-w-xs rounded-lg overflow-hidden shadow-lg bg-white";

        card.innerHTML = `
            <img class="w-full h-48 object-cover" src="${image}" alt="${title}" />
            <div class="p-4">
                <h2 class="text-lg font-semibold mb-2">${title}</h2>
                <p class="text-gray-700 text-sm mb-4">${description}...</p>
                <div class="flex justify-end">
                    <button class="view-btn bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded" data-id="${meal.idMeal}">
                        VIEW DETAILS
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    // Add event listeners to the VIEW DETAILS buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const mealId = btn.getAttribute('data-id');
            try {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                const data = await res.json();
                showMealDetails(data.meals[0]);
            } catch (error) {
                console.error("Failed to fetch meal details", error);
            }
        });
    });
}

// Input field search listener
Input.addEventListener('keyup', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        searchMeals(query);
    } else {
        loaditems();
    }
});

// Search function
async function searchMeals(query) {
    loader.style.display = 'flex';
    mainContent.style.display = 'none';

    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await res.json();
        Renderitems(data.meals);
    } catch (error) {
        console.log("Failed to search meals.");
    } finally {
        loader.style.display = 'none';
        mainContent.style.display = 'block';
    }
}

// Show meal details in modal
function showMealDetails(meal) {
    const detailContainer = document.getElementById('meal-details');
    detailContainer.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" class="w-full h-64 object-cover mb-4 rounded" />
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p class="mt-4">${meal.strInstructions}</p>
    `;

    // Show modal
    document.getElementById('mealModal').classList.remove('hidden');
    document.getElementById('mealModal').style.overflow = 'hidden'; // Disable scroll
}

// Close modal button
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('mealModal').classList.add('hidden');
    document.body.style.overflow = 'auto'; 
});

// Scroll to top button logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollBtn.classList.remove('hidden');
    } else {
        scrollBtn.classList.add('hidden');
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initial load
loaditems();
