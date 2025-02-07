// scripts.js

// Fetch product data from JSON
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const featuredProductsContainer = document.getElementById('featured-products');

    // Limit the number of products displayed in the carousel
    const carouselProducts = products.slice(0, 10); // Display first 10 products in the carousel
    const totalProducts = carouselProducts.length;

    carouselProducts.forEach((product, index) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('featured-product');
      productDiv.setAttribute('data-index', index);
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
      `;
      featuredProductsContainer.appendChild(productDiv);
    });

    // Initialize the carousel functionality
    initializeCarousel(totalProducts);
  })
  .catch(error => console.error('Error fetching the products:', error));

// Interactive Navigation Menu
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('nav ul li a');
  menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.style.color = '#00ffcc';
    });
    item.addEventListener('mouseout', () => {
      item.style.color = '#fff';
    });
  });
});

// Image Carousel for Featured Products
function initializeCarousel(totalProducts) {
  let currentIndex = 0;
  const featuredProducts = document.querySelectorAll('.featured-product');
  const nextButton = document.getElementById('next');
  const prevButton = document.getElementById('prev');

  // Hide all products except the first one
  featuredProducts.forEach((product, index) => {
    product.style.display = index === 0 ? 'block' : 'none';
  });

  nextButton.addEventListener('click', () => {
    featuredProducts[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % totalProducts;
    featuredProducts[currentIndex].style.display = 'block';
  });

  prevButton.addEventListener('click', () => {
    featuredProducts[currentIndex].style.display = 'none';
    currentIndex = (currentIndex - 1 + totalProducts) % totalProducts;
    featuredProducts[currentIndex].style.display = 'block';
  });
}

// Smooth Scroll for Anchored Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetElement = document.querySelector(this.getAttribute('href'));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Product Categories Click Event
document.querySelectorAll('.category').forEach(category => {
  category.addEventListener('click', () => {
    const categoryName = category.textContent.trim();
    loadProductsByCategory(categoryName);
  });
});

// Function to Load Products by Category
function loadProductsByCategory(category) {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const productsContainer = document.getElementById('featured-products');

      // Clear existing products
      productsContainer.innerHTML = '';

      // Filter products by category
      const filteredProducts = products.filter(
        product => product.category && product.category === category
      );

      if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `<p>No products found in ${category} category.</p>`;
        return;
      }

      // Limit the number of products displayed per page
      const productsPerPage = 12;
      let currentPage = 1;
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

      // Display initial products
      displayProducts(filteredProducts, currentPage, productsPerPage);

      // Add pagination controls
      addPaginationControls(
        productsContainer,
        filteredProducts,
        productsPerPage,
        totalPages
      );
    })
    .catch(error => console.error('Error fetching the products:', error));
}

// Function to Display Products
function displayProducts(products, page, productsPerPage) {
  const productsContainer = document.getElementById('featured-products');
  productsContainer.innerHTML = ''; // Clear existing products

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  currentProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('featured-product');
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
    `;
    productsContainer.appendChild(productDiv);
  });
}

// Function to Add Pagination Controls
function addPaginationControls(
  container,
  products,
  productsPerPage,
  totalPages
) {
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('pagination-controls');

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      displayProducts(products, i, productsPerPage);
    });
    paginationDiv.appendChild(pageButton);
  }

  container.appendChild(paginationDiv);
}

// Function to handle errors
function handleError(error) {
  console.error('Error:', error);
}

// Function to handle loading state
function handleLoading(loading) {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loading) {
    loadingIndicator.style.display = 'block';
  } else {
    loadingIndicator.style.display = 'none';
  }
}

// Add event listener to window for load event
window.addEventListener('load', () => {
  handleLoading(false);
});

// Add event listener to window for error event
window.addEventListener('error', handleError);