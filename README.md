# Product Inventory Manager

# By Muhammad Taha Tariq 
## [2502077] 

This is a simple **Product Inventory Manager** web application built for the Web Technologies Database Connectivity Assignment.

The project is divided into separate folders:

- `Backend` — ASP.NET Core REST API with SQL Server database connectivity
- `Frontend` — HTML, CSS, and JavaScript pages that call the backend REST API

## Assignment Requirements Covered

- HTML, CSS, and JavaScript frontend
- ASP.NET Core backend
- SQL Server database
- REST API connection between frontend and backend
- Fetch and display records using GET
- Add new record using POST
- Update existing record using PUT
- Delete record using DELETE
- Client-side form validation before submission
- Server-side validation in backend
- Minimum two pages:
  - `Frontend/index.html`
  - `Frontend/product-form.html`

## Project Structure

```text
ProductInventoryManager/
├── Backend/
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   └── Product.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── SQL/
│   │   └── CreateDatabase.sql
│   ├── Program.cs
│   ├── appsettings.json
│   └── ProductInventoryManager.Api.csproj
├── Frontend/
│   ├── css/
│   │   └── site.css
│   ├── js/
│   │   ├── api.js
│   │   ├── index.js
│   │   └── product-form.js
│   ├── screenshots/
│   │   └── home-screen.png
│   ├── index.html
│   └── product-form.html
├── README.md
└── .gitignore
```

## Screenshot

![Product Inventory Manager Screenshot](Frontend/screenshots/home-screen.png)

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get one product |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

## Product Fields

| Field | Validation |
|---|---|
| Product Name | Required, maximum 100 characters |
| Category | Required, maximum 60 characters |
| Price | Required, must be greater than 0 |
| Quantity | Required, whole number, cannot be negative |
| Supplier | Optional, maximum 100 characters |

