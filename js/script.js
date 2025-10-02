document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const totalIngresos = document.getElementById("totalIngresos");
  const totalGastos = document.getElementById("totalGastos");
  const balanceFinal = document.getElementById("balanceFinal");
  const iniciarBtn = document.getElementById("iniciarSimulador");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  // 🔹 Si no hay datos guardados en localStorage, cargamos desde JSON
  if (products.length === 0) {
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        products = data;
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
      })
      .catch(err => console.error("Error al cargar data.json:", err));
  }

  function renderProducts() {
    productList.innerHTML = "";
    let ingresos = 0;
    let gastos = 0;

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.classList.add("item", product.type);
      div.textContent = `${product.name} - $${product.price}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Eliminar";
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", () => {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
      });

      div.appendChild(removeBtn);
      productList.appendChild(div);

      if (product.type === "ingreso") {
        ingresos += product.price;
      } else {
        gastos += product.price;
      }
    });

    let balance = ingresos - gastos;

    totalIngresos.textContent = `💵 Total Ingresos: $${ingresos}`;
    totalGastos.textContent = `💸 Total Gastos: $${gastos}`;
    balanceFinal.textContent = `⚖️ Balance Final: $${balance}`;
    balanceFinal.style.color = balance >= 0 ? "green" : "red";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const type = document.getElementById("productType").value;

    if (name && price > 0) {
      products.push({ name, price, type });
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      form.reset();
    }
  });

  iniciarBtn.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres reiniciar el simulador?")) {
      products = [];
      localStorage.removeItem("products");
      renderProducts();
    }
  });

  renderProducts();
});
