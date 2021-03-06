let carts = document.querySelectorAll('.add-cart');

let products = [ 
    {
        name: 'Web Developer',
        tag: 'webdeveloper', //use to grab the image
        price: 26000,
        inCart: 0 //track how many items
    },
    {
        name: 'Frontend Developer',
        tag: 'frontenddeveloper', //use to grab the image
        price: 26000,
        inCart: 0 //track how many items
    },
    {
        name: 'Ui Ux Designer',
        tag: 'uiuxdesigner', //use to grab the image
        price: 26000,
        inCart: 0 //track how many items
    },
    {
        name: 'Java Spring Boot',
        tag: 'javaspringboot', //use to grab the image
        price: 26000,
        inCart: 0 //track how many items
    }
];

for(let i=0; i< carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if( productNumbers ) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action ) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
        console.log("action running");
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

function setItems(product) {
    // let productNumbers = localStorage.getItem('cartNumbers');
    // productNumbers = parseInt(productNumbers);
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        let currentProduct = product.tag;
    
        if( cartItems[currentProduct] == undefined ) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            }
        } 
        cartItems[currentProduct].inCart += 1;

    } else {
        product.inCart = 1;
        cartItems = { 
            [product.tag]: product
        };
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}


//Calculate Total Cost
function totalCost( product, action ) {
    let cart = localStorage.getItem("totalCost");

    if( action) {
        cart = parseInt(cart);

        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart != null) {
        
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

// Display Cart function
function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);

    let productContainer = document.querySelector('.products');
    
    if( cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map( (item, index) => {
            productContainer.innerHTML += 
            `<div class="product"><ion-icon name="close-outline" size="small"></ion-icon><img src="./images/${item.tag}.png" />
                <span class="sm-hide">${item.name}</span>
            </div>
            <div class="price sm-hide">R${item.price},00 Excl Vat</div>
            <div class="quantity">
                <ion-icon class="decrease" size="small" name="arrow-back-outline"></ion-icon>
                    <span>${item.inCart}</span> 
                <ion-icon class="increase" size="small" name="arrow-forward-outline"></ion-icon>  
            </div>
            <div class="total">R${item.inCart * item.price},00 Excl Vat</div>`;
        });

        productContainer.innerHTML += `
        <div class= "cartTotalContainer justify-content-end">     
            <table>
                <tr>

                    <td><h5 class = "cartTotalTitle">Subtotal</h6></td>
                    <td class="text-right"><h6>R${cart},00 <small>excl Vat</small></h5></td>
                </tr>
                <tr>

                    <td><h5 class = "cartTotalTitle">Vat<small>(15%)</small></h5></td>
                    <td><h6>R${cart * 0.15},00</h6></td>
                </tr>
                <tr>

                    <td><h5 class = "cartTotalTitle">Total</h5></td>
                    <td class="text-right"><h6>R${(cart * 1.15).toFixed(0)},00 <small>incl Vat</small></h6></td>
                </tr>
            </table>
        </div> 
            
            `

        deleteButtons();
        manageQuantity();
    }
}

//Increase & Decrease Function
function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });

        increaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}

//Delete Button Function
function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
           
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        })
    }
}

onLoadCartNumbers();
displayCart();
