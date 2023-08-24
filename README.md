
# API

The following API endpoints are available for managing products:

* **Setup:**
    * Run `npm i`
    * Setup db `npm run setup_db`
    * Run server + nodemon `npm run dev`

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
    * Returns an array of products that match the specified criteria.
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