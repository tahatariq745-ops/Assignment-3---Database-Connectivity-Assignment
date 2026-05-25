const API_BASE_URL = "http://localhost:5000/api/products";

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const message = data?.message || data?.title || "Request failed. Please try again.";
        throw new Error(message);
    }

    return data;
}

function formatCurrency(value) {
    return Number(value).toLocaleString(undefined, {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2
    });
}

function showMessage(element, message, type = "success") {
    element.textContent = message;
    element.className = `message ${type}`;
}

function hideMessage(element) {
    element.textContent = "";
    element.className = "message hidden";
}
