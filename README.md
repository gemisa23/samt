
# SETUP

Run the following commands in order:

* **Setup:**
    * `npm i`
    * `npm run build` to build the project.
    * [IMPORTANT] `npm run setup_db` to setup the database with mock data. It generates the required mock transactions documents (used to calculate best selling products)
    * `npm run start` to start the server

* **Server configuration:**
    * Server will run on port 127.0.0.1:500 by default.
    * Can be changed by modifying `/src/config/app.ts` -> `APP_PORT` and `APP_ADDR`.
    * Same goes for the MongoURL.

* **Postman collection:**
    * A postman collection can be found on `/utilities`.

# ABOUT THE CODE

I followed a standard HTTP API/REST Model-Controller-Service architecture.
* Model -> As the only data access layer
* Service -> Containing bussiness logic (interacts with models and perform non basic crud operations and validations)
* Controller -> interaction between client and service(bussiness) layer.
* For best selling products I opted for using aggregation pipelines as a non-blocking alternative to standard sync array operations.


# API

The following API endpoints are available for managing products:

* **Create product:** `POST /products`
    * Request body:
        * `productId`: The product ID (string)
        * `productName`: The product name (string)
        * `sellValue`: The product sell value (number)
* **Update product:** `PUT /products`
    * Request body:
        * `productId`: The product ID (string) (optional)
        * `productName`: The product name (string) (optional)
        * `sellValue`: The product sell value (number) (optional)
* **Delete a product:** `DELETE /products/:product_id`
    * Path parameter:
        * `product_id`: The product ID (string)
* **Find specific product:**
    * `GET /products?name=ProductName`
    * `GET /products?id=ProductId`
    * Returns the product or `null`.
* **Sorted list products:**
    * `GET /products/sorted?order=desc&field=name`
    * `GET /products/sorted?order=asc&field=name`
    * `GET /products/sorted?order=desc&field=id`
    * `GET /products/sorted?order=asc&field=id`
    * Returns an array of products sorted by the specified field in the specified order.
* **Full products list:**
    * `GET /products`
    * Returns an array of all products.
* **Best selling by units:**
    * `GET /products/best_selling/by_units`
    * `GET /products/best_selling/by_units?daysAgo=45`
    * Returns an array of the best selling products by units sold in the past `daysAgo` days. Defaults to 30 days.
* **Best selling by value ($):**
    * `GET /products/best_selling/by_value`
    * `GET /products/best_selling/by_value?daysAgo=35`
    * Returns an array of the best selling products by total sell value in the past `daysAgo` days. Defaults to 30 days.
