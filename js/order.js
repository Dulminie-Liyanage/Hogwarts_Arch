// SLIDER FUNCTIONALITY
document.querySelectorAll('.slider-container').forEach(container => {
  const leftBtn = container.querySelector('.slider-btn.left');
  const rightBtn = container.querySelector('.slider-btn.right');
  const slider = container.querySelector('.product-slider');

  leftBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  });
});

// CART FUNCTIONALITY
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartIconCount = document.querySelector('.cart-icon-count');

let cart = [];

function updateCartDisplay() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>LKR ${item.price}</td>
      <td>${item.quantity}</td>
      <td>
        LKR ${(item.price * item.quantity).toFixed(2)} 
        <i class="ri-delete-bin-line remove-item" data-index="${index}" 
           style="cursor:pointer; color:red; margin-left:10px;"></i>
      </td>
    `;
    cartItemsContainer.appendChild(row);
    total += item.price * item.quantity;
  });
  totalPriceElement.textContent = "LKR " + total.toFixed(2);
  cartIconCount.textContent = cart.length;
}

function addToCart(name, price, quantity) {
  if (quantity <= 0) {
    alert("⚠️ Please select at least one item to add to cart!");
    return;
  }
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }
  updateCartDisplay();
}

// ADD TO CART BUTTON HANDLER
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const input = parent.querySelector('input');
    const name = input.getAttribute('data-name');
    const price = parseFloat(input.getAttribute('data-price'));
    const quantity = parseInt(input.value);
    addToCart(name, price, quantity);
    input.value = 0;
  });
});

// REMOVE ITEM HANDLER
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    cart.splice(index, 1);
    updateCartDisplay();
  }
});

// SAVE TO FAVOURITES
function saveToFavourites() {
  const items = [];
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (qty && qty > 0) {
      items.push({
        name: input.dataset.name,
        price: parseFloat(input.dataset.price),
        qty: qty
      });
    }
  });

  if (items.length === 0) {
    alert("⚠️ Cannot save an empty order as favourite. Please select items first.");
    return;
  }

  localStorage.setItem('favouriteOrder', JSON.stringify(items));
  alert("✅ Your order was saved as favourite!");
}

function applyFavourites() {
  const data = localStorage.getItem('favouriteOrder');

  if (!data) {
    alert("⚠️ No favourite order saved!");
    return;
  }

  // Check if cart is empty — show alert and stop
  if (cart.length === 0) {
    alert("🛒 Your cart is empty! Please add items or use 'Save to Favourites' first.");
    return;
  }

  const favourites = JSON.parse(data);
  const inputs = document.querySelectorAll('input[type="number"]');

  // Reset all input fields
  inputs.forEach(input => input.value = 0);
  cart = [];

  // Fill from favourite items
  favourites.forEach(fav => {
    inputs.forEach(input => {
      if (input.dataset.name === fav.name) {
        input.value = fav.qty;
      }
    });
    cart.push({
      name: fav.name,
      price: fav.price,
      quantity: fav.qty
    });
  });

  updateCartDisplay();
  alert("✅ Favourites applied!");
}

// BUY NOW BUTTON
document.getElementById('buy-now').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("🛒 Your cart is empty! Please add items before checking out.");
    return;
  }

  const confirmCheckout = confirm("Ready to checkout?");
  if (confirmCheckout) {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
  } else {
    alert("🛒 You can continue your shopping!");
  }
});
