fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products');
    products.forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `<h3><a href="/product.html?id=${p.id}">${p.name}</a></h3><p>$${p.price}</p>`;
      container.appendChild(div);
    });
  });
