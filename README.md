
# SETUP

# IMPORTANT
The server will automatically connect to an online hosted instance of MongoDB at Railways.app
The DB is already setup. With this in mind, the `setup_db` script is no longer mandatory to execute.

Run the following commands in order:

* **Setup:**
    * `npm i`
    * `npm run build` to build the project.
    * [OPTIONAL] `npm run setup_db` to setup the database with mock data to ease the testing. Now with the /transactions endpoint this is not required, but may be useful as it loads five valid products and fifty valid transactions.
    * `npm run start` to start the server

* **Server configuration:**
    * Server will run on port 127.0.0.1:500 by default.
    * Can be changed by modifying `/src/config/app.ts` -> `APP_PORT` and `APP_ADDR`.
    * Same goes for the MongoURL.
    * If database requires username and password, set also `MONGO_REQUIRES_AUTH` to `true` and set `MONGO_USERNAME` and `MONGO_PASSWORD` to the corresponding values. 

* **Postman collection:**
    * A postman collection can be found on `/utilities`.

* **Important:**
    * The best selling endpoints requires some transactions to be registered in order to work, as the amount of units sold or total selling value for a timeframe are not considered to be a part of a Product itself (this information is not provided while registering a product), but rather a calculated value of hypothetical sales (transactions).
    If `db_setup` script is not executed, transactions and products are required to be manually registered using the API.

# ABOUT THE CODE

I followed a standard HTTP API/REST Model-Controller-Service architecture.
* Model/Data access layer-> As the only data access layer
* Service/Bussiness layer -> Containing bussiness logic, with no direct access to data layer.
* Controller layer -> interaction between client and service layer.

# API

The following API endpoints are available for managing products and transactions:

* **Create product:** `POST /products`
    * Request body:
        * `id`: The product ID (string)
        * `name`: The product name (string)
        * `sellValue`: The product sell value (number)
* **Update product:** `PUT /products`
    * Request body:
        * `id`: The product ID (string) (required)
        * `name`: The product name (string) (optional, but at least one field should be sent to be updated)
        * `sellValue`: The product sell value (number) (optional, but at least one field should be sent to be updated)
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
    * Returns an array of products sorted by the specified field in the desired order.
* **Full products list:**
    * `GET /products`
    * Returns an array of all products
* **Best selling by units:**
    * `GET /products/best_selling/by_units`
    * `GET /products/best_selling/by_units?daysAgo=45`
    * Returns an array of the best selling products by units sold in the past `daysAgo` days. Defaults to 30 days.
    * Returns null if no transactions registered.
* **Best selling by value ($):**
    * `GET /products/best_selling/by_value`
    * `GET /products/best_selling/by_value?daysAgo=35`
    * Returns an array of the best selling products by total sell value in the past `daysAgo` days. Defaults to 30 days.
    * Returns null if no transactions registered.
* **Register a transaction:** `POST /transactions`
    * Request body
        * `date`: A string with format YYYY-MM-DD or timestamp.
        * `products`: An array containing the details of the involved products. It should have at least one product details entry
            *`productId`: The product ID. Should be an previously registered product.
            *`sellValue`: A non negative number indicating the sell value.
            *`unitsSold`: A nong negative number indicating the amount of units sold of this product for this particular transaction.
