import products from "./products.js";

const cart = () => {
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let checkOutButton = document.querySelector('.checkOut');
    let cart = [];

    // Open and close cart tab
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });

    // Set product in cart
    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        if (value <= 0) {
            cart.splice(positionThisProductInCart, 1); // Remove product if quantity is 0 or less
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: idProduct,
                quantity: 1
            }); // Add new product to cart
        } else {
            cart[positionThisProductInCart].quantity = value; // Update quantity of existing product
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
        addCartToHTML(); // Update cart display
    };

    // Add cart items to HTML
    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                totalPrice += info.price * item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                    ${info.name}
                    </div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus" data-id="${info.id}">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${info.id}">+</span>
                    </div>
                `;
            });
            // Add total items, total price, and empty cart button at the bottom
            let totalDiv = document.createElement('div');
            totalDiv.classList.add('total');
            totalDiv.innerHTML = `
                <div>Total Items: ${totalQuantity}</div>
                <div>Total Price: $${totalPrice}</div>
                <button class="emptyCart">Empty Cart</button>
            `;
            listCartHTML.appendChild(totalDiv);
        }
        iconCartSpan.innerText = totalQuantity; // Update cart icon quantity
    };

    // Handle button clicks
    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let quantity = null;
        let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        switch (true) {
            case (buttonClick.classList.contains('addCart')):
                quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('minus')):
                quantity = cart[positionProductInCart].quantity - 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('plus')):
                quantity = cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('emptyCart')):
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                addCartToHTML();
                break;
            default:
                break;
        }
    });

    // Show cart summary on checkout
    checkOutButton.addEventListener('click', () => {
        let summary = 'Cart Summary:\n\n';
        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);
            summary += `${product.name} - Quantity: ${item.quantity} - Total: $${product.price * item.quantity}\n`;
        });
        summary += `\nTotal Items: ${cart.reduce((acc, item) => acc + item.quantity, 0)}`;
        summary += `\nTotal Price: $${cart.reduce((acc, item) => acc + (products.find(p => p.id == item.product_id).price * item.quantity), 0)}`;
        alert(summary);
    });

    // Initialize app
    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    };
    initApp();
};

export default cart;