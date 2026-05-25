const form = document.getElementById("productForm");
const pageTitle = document.getElementById("pageTitle");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

const fields = {
    name: document.getElementById("name"),
    category: document.getElementById("category"),
    price: document.getElementById("price"),
    quantity: document.getElementById("quantity"),
    supplier: document.getElementById("supplier")
};

const errors = {
    name: document.getElementById("nameError"),
    category: document.getElementById("categoryError"),
    price: document.getElementById("priceError"),
    quantity: document.getElementById("quantityError"),
    supplier: document.getElementById("supplierError")
};

const queryParams = new URLSearchParams(window.location.search);
const productId = queryParams.get("id");
const isEditMode = Boolean(productId);

async function initialiseForm() {
    if (!isEditMode) {
        return;
    }

    pageTitle.textContent = "Edit Product";
    submitButton.textContent = "Update Product";

    try {
        const product = await requestJson(`${API_BASE_URL}/${productId}`);
        fields.name.value = product.name;
        fields.category.value = product.category;
        fields.price.value = product.price;
        fields.quantity.value = product.quantity;
        fields.supplier.value = product.supplier || "";
    } catch (error) {
        showMessage(message, error.message, "error");
    }
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const name = fields.name.value.trim();
    const category = fields.category.value.trim();
    const price = Number(fields.price.value);
    const quantity = Number(fields.quantity.value);
    const supplier = fields.supplier.value.trim();

    if (!name) {
        errors.name.textContent = "Product name is required.";
        isValid = false;
    } else if (name.length > 100) {
        errors.name.textContent = "Product name cannot exceed 100 characters.";
        isValid = false;
    }

    if (!category) {
        errors.category.textContent = "Category is required.";
        isValid = false;
    } else if (category.length > 60) {
        errors.category.textContent = "Category cannot exceed 60 characters.";
        isValid = false;
    }

    if (!fields.price.value || Number.isNaN(price) || price <= 0) {
        errors.price.textContent = "Price must be greater than zero.";
        isValid = false;
    }

    if (fields.quantity.value === "" || Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
        errors.quantity.textContent = "Quantity must be a whole number and cannot be negative.";
        isValid = false;
    }

    if (supplier.length > 100) {
        errors.supplier.textContent = "Supplier cannot exceed 100 characters.";
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    Object.values(errors).forEach(error => error.textContent = "");
    hideMessage(message);
}

function buildPayload() {
    return {
        name: fields.name.value.trim(),
        category: fields.category.value.trim(),
        price: Number(fields.price.value),
        quantity: Number(fields.quantity.value),
        supplier: fields.supplier.value.trim() || null
    };
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!validateForm()) {
        showMessage(message, "Please fix the highlighted validation errors.", "warning");
        return;
    }

    const payload = buildPayload();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `${API_BASE_URL}/${productId}` : API_BASE_URL;

    try {
        submitButton.disabled = true;
        await requestJson(url, {
            method,
            body: JSON.stringify(payload)
        });
        window.location.href = "index.html";
    } catch (error) {
        showMessage(message, error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", initialiseForm);
