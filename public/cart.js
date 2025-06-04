let cart = [];
function renderCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.name} x ${item.quantity}`;
    container.appendChild(div);
  });
}

document.getElementById('checkout').addEventListener('click', () => {
  fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cart }) })
    .then(res => res.json())
    .then(data => alert(data.message));
});

renderCart();
