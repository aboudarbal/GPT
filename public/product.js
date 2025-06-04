const params = new URLSearchParams(window.location.search);
const id = params.get('id');
fetch(`/api/products/${id}`)
  .then(res => res.json())
  .then(product => {
    const detail = document.getElementById('product-detail');
    detail.innerHTML = `<h2>${product.name}</h2><p>$${product.price}</p><p>${product.description}</p>`;
  });
