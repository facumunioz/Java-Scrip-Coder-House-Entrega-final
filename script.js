/* Añadir al carrito */

const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
addToShoppingCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCartClicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

function addToCartClicked(event) {
  const button = event.target;
  const item = button.closest('.item');
  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
  const itemImage = item.querySelector('.item-image').src;

  addItemToShoppingCart(true, itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(isEvent, itemTitle, itemPrice, itemImage, itemQuantity) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
    'shoppingCartItemTitle'
  );

  /* No duplicar producto sino sumar al mismo item */

  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      let elementQuantity = elementsTitle[
        i
      ].parentElement.parentElement.parentElement.querySelector(
        '.shoppingCartItemQuantity'
      );
      elementQuantity.value++;
      $('.toast').toast('show');
      updateShoppingCartTotal();
      if (isEvent){
        guardarStorage(itemTitle, itemPrice, itemImage)
      }
      return;
    }
  }

  const shoppingCartRow = document.createElement('div');
  const shoppingCartContent = `
  <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="${itemQuantity ? itemQuantity : 1}">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);

  shoppingCartRow
    .querySelector('.buttonDelete')
    .addEventListener('click', removeShoppingCartItem);

  shoppingCartRow
    .querySelector('.shoppingCartItemQuantity')
    .addEventListener('change', quantityChanged);
    
    if (isEvent){
      guardarStorage(itemTitle, itemPrice, itemImage)
    }

  updateShoppingCartTotal();
}

/* Actualiza precio de carrito = Total */

function updateShoppingCartTotal() {
  let total = 0;
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );
    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('$', '')
    );
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.value
    );
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

/* Borrar producto del carrito */

function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  removerStorage(buttonClicked.closest('.shoppingCartItem').querySelector("h6").innerText);
  buttonClicked.closest('.shoppingCartItem').remove();
  updateShoppingCartTotal();
}

/* Aumentar cantidad de productos seleccionados en el carrito */

function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  guardarStorage(input.parentElement.parentElement.parentElement.querySelector("h6").innerText, null, null, input.value);
  updateShoppingCartTotal();
}

/* Gracias por su compra + reinicio de carrito de compras */

function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = '';
  updateShoppingCartTotal();
  localStorage.clear();
}

/* Local Storage */

function guardarStorage(title, price, image, quantity) {
  if (verificarStorage("shopingCart")) {
    const storage = JSON.parse(localStorage.getItem("shopingCart"));
    for (const i of storage) {
      console.log("a")
      if (i.productTitle == title) {
        i.productQuantity = quantity ? quantity : i.productQuantity +1;
        console.log(i.productQuantity)
        localStorage.setItem("shopingCart", JSON.stringify(storage));
        return
      }
    }
    const product = {
      productTitle: title,
      productPrice: price,
      productImage: image,
      productQuantity: quantity ? quantity : 1
    };
    storage.push(product);
    localStorage.setItem("shopingCart", JSON.stringify(storage));

  }else{
    const array = [];
    localStorage.setItem("shopingCart", JSON.stringify(array));
    guardarStorage(title, price, image);
  }

}

function verificarStorage(localItem) {
  return localStorage.getItem(localItem);
}

function removerStorage(title){
  if (verificarStorage("shopingCart")){
    const storage = JSON.parse(localStorage.getItem("shopingCart"));
    for (let i= 0; i< storage.length; i ++){
      if (storage[i].productTitle == title){
      storage.splice(i,1);
      }
    }
    localStorage.setItem("shopingCart", JSON.stringify(storage));
  }
} 

if (verificarStorage("shopingCart")){
  const products = JSON.parse(localStorage.getItem("shopingCart"));
  for (const i of products){
  addItemToShoppingCart (false, i.productTitle, i.productPrice, i.productImage, i.productQuantity);
  }

}


