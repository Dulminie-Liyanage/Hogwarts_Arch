// Initial total price display from localStorage
const totalElement = document.getElementById('checkout-total');
let initialCart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;

initialCart.forEach(item => {
  total += item.price * item.quantity;
});
totalElement.textContent = `LKR ${total.toFixed(2)}`;

// Form and modal elements
const form = document.getElementById('checkout-form');
const confirmationMessage = document.getElementById('confirmation-message');
const modal = document.getElementById("popup-modal");
const closeBtn = document.querySelector(".close-btn");

// Submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // ✅ Re-check cart from localStorage
  const checkout = JSON.parse(localStorage.getItem('cart')) || [];

  if (checkout.length === 0) {
    alert("🚫 Your cart is empty! Please add items before confirming your order.");
    return;
  }

  // Recalculate total price just in case
  let total = 0;
  checkout.forEach(item => {
    total += item.price * item.quantity;
  });
  totalElement.textContent = `LKR ${total.toFixed(2)}`;

  // ✅ Show modal popup
  modal.style.display = "block";

  // ✅ Delivery date (3 days later)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = deliveryDate.toLocaleDateString(undefined, options);

  // ✅ Update confirmation message with date
  confirmationMessage.innerHTML = `🎉 <strong>Thank you for your purchase!</strong><br>Your order will be delivered by <strong>${formattedDate}</strong>.`;
  confirmationMessage.style.display = 'block';

  // ✅ Clear cart and reset form
  localStorage.removeItem('cart');
  form.reset();
});

// ✅ Close popup when clicking "×"
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// ✅ Expiry date MM/YY validation with attempt limit
const expiryInput = document.getElementById("expiry");
let attemptsLeft = 3;

expiryInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

  if (value.length >= 2) {
    let mm = parseInt(value.slice(0, 2));
    if (mm < 1 || mm > 12) {
      attemptsLeft--;
      alert(`Invalid month! Please enter valid MM. Attempts left: ${attemptsLeft}`);
      expiryInput.value = "";
      if (attemptsLeft <= 0) {
        expiryInput.disabled = true;
        expiryInput.placeholder = "Too many attempts";
      }
      return;
    }

    // Format MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    } else {
      value = value.slice(0, 2);
    }
  }

  expiryInput.value = value;
});

// ✅ Prevent letters in number-only fields
const numberOnlyFields = ['contact', 'card-number', 'cvv'];
numberOnlyFields.forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }
});
