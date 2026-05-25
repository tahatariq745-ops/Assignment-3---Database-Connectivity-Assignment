const tableBody = document.getElementById("productsTableBody");
const recordCount = document.getElementById("recordCount");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");

let products = [];

async function loadProducts() {
    try {
        hideMessage(message);
        products = await requestJson(API_BASE_URL);
        renderProducts();
    } catch (error) {
        showMessage(message, error.message, "error");
        tableBody.innerHTML = "";
        recordCount.textContent = "0 records";
    }
}

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm)
            || product.category.toLowerCase().includes(searchTerm)
            || (product.supplier || "").toLowerCase().includes(searchTerm);
    });

    recordCount.textContent = `${filteredProducts.length} record${filteredProducts.length === 1 ? "" : "s"}`;

    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">No product records found. Click Add Product to create one.</td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><strong>${escapeHtml(product.name)}</strong></td>
            <td>${escapeHtml(product.category)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>${escapeHtml(product.supplier || "-")}</td>
            <td>
                <div class="action-group">
                    <a class="secondary-button" href="product-form.html?id=${product.id}">Edit</a>
                    <button class="danger-button" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

async function deleteProduct(id) {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
        return;
    }

    try {
        await requestJson(`${API_BASE_URL}/${id}`, { method: "DELETE" });
        showMessage(message, "Product deleted successfully.", "success");
        await loadProducts();
    } catch (error) {
        showMessage(message, error.message, "error");
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", renderProducts);
refreshButton.addEventListener("click", loadProducts);

document.addEventListener("DOMContentLoaded", loadProducts);
