const { MongoClient } = require('mongodb');
const { DEFAULT_MONGO_URL } = require('../config/app');
const client   = new MongoClient("mongodb://mongo:qTFAe6u4B86U9MXa5KSy@containers-us-west-198.railway.app:5563");

const randFloat = (min, max) => Math.random() * (max - min) + min
const randInt   = (min, max) => Math.floor(randFloat(min, max));
const randDate  = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const timeDiff = today.getTime() - sixMonthsAgo.getTime();
    const randomTime = Math.random() * timeDiff;
    const randomDate = new Date(sixMonthsAgo.getTime() + randomTime);
    return randomDate;
  }

const getRandomIdPicker = (usedProductsIDs) => () => {
    while (true) {
        let rIdx = 'Product-'+randInt(1, 5);
        if (usedProductsIDs.includes(rIdx)) {
            // - Probar con otro.
            continue;
        }
        return rIdx;
    }
}

(async() => {

    try {
        await client.connect();
        await client.db('SAM').createCollection('Products');
        await client.db('SAM').createCollection('Transactions');
    } catch(err) {
        console.log('error al conectar');
        throw err;
    }

    const transactions = client.db('SAM').collection('Transactions');
    const products = client.db('SAM').collection('Products');

    // - Generar Productos
    const productsList = [];
    for (let i = 1; i <= 5; i++) {
        const product = {
            id: `Product-${i}`,
            name: `Product-${i}`,
            sellValue: Math.random() * (150.0 - 1.0) + 1.0
        }
        productsList.push(product);
    }
    await products.insertMany(productsList);

    // - Generar transacciones
    // - Cada transacción tiene entre uno y cinco productos, ninguno se repite.
    const transactionsList = [];
    for (let i = 1; i <= 50; i++) {
        // - Seleccionar los productos involucrados en la transacción.
        // - Cantidad de productos a seleccionar:
        const amountOfProductsInvolved = Math.floor(Math.random() * (5 - 1) + 1);
        const usedIdsForThisTransaction = [];
        const involvedProductsList = [];
        const randomIdPicker = getRandomIdPicker(usedIdsForThisTransaction);
        for (let j = 1; j <= amountOfProductsInvolved; j++) {
            // - Selecciono un ID
            const id = randomIdPicker(usedIdsForThisTransaction);
            usedIdsForThisTransaction.push(id);
            const productDetails = {
                productId: id,
                productName: id, // Para los casos de ejemplo es el mismo
                sellValue: productsList.find(p => p.id == id).sellValue,
                unitsSold: randInt(1, 10),
            };
            involvedProductsList.push(productDetails);
        }
        transactionsList.push({
            date: randDate(),
            products: involvedProductsList
        });
    }
    await transactions.insertMany(transactionsList);

    process.exit();

})()
