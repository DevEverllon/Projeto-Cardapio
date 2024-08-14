// DIV QUE TEM OS PRODUTOS
const menu = document.querySelector('#menu');

// BOTÃO NO FOOTER
const cartBtn = document.querySelector('#cart-btn');

// CAIXA DO MODAL
const cartModal = document.querySelector('#cart-modal');

// DIV VAZIA PARA COLOCAR OS ITENS DO CARRINHO
const cartItemsContainer = document.querySelector('#cart-items');

// TOTAL DE COMPRAS
const cartTotal = document.querySelector('#cart-total');

// BOTÃO DE FINALIZAR
const checkoutBtn = document.querySelector('#checkout-btn');

// BOTÃO 'FECHAR'
const closeModalBtn = document.querySelector('#close-modal-btn');

// CONTADOR DE ITEM NO FOOTER
const cartCouter = document.querySelector('#card_cout');

// IMPUT PARA DIGITAR O ENDEREÇO
const addressInput = document.querySelector('#address');

// PARAGRAFRO DE MENSAGEM DE ERRO
const addressWarn = document.querySelector('#msg_erro');

// ARRAY VAZIO PARA ADICIONAR OS ITENS CLICADOS
let cart = []



// ABRIR O MODAL
function openModal() {
    updateCartModal();
    cartModal.style.display = 'flex'
}
cartBtn.addEventListener('click', openModal);

// FECHAR O MODAL
function closeModal(event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
}
cartModal.addEventListener('click', closeModal);

// FECHAR PELO BOTÃO DE FECHAR
function closeModalBotton() {
    cartModal.style.display = 'none'
}
closeModalBtn.addEventListener('click', closeModalBotton);

// ADICIONAR AO CARRINHO
function addCarrinho(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = Number(parentButton.getAttribute("data-price"));

        // ADICIONAR NO CARRINHO
        addToCard(name, price)

    }
}
menu.addEventListener('click', addCarrinho)

function addToCard(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // SE O ITEM JA EXISTE, AUMENTA A QUANTIDADE
        existingItem.quantity += 1;
    }
    else {
        // SE NÃO ADICIONA APENAS UMA QUANTIDADE
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

// ATUALIZAR CARRINHO
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add('styleCart');

        cartItemElement.innerHTML = `
            <div class="itemsCart">
                <div>
                    <p class="itemName">${item.name}</p>
                    <p>QTD: ${item.quantity}</p>
                    <p class="itemPrice">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="buttonRemove" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        // COLOCAR O VALOR TOTAL DO CARRINHO
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // CONTADOR DE ITENS NO CARRINHO
    cartCouter.innerHTML = cart.length;
}

// FUNÇÃO PARA REMOVER ITEM DO CARRINHO
function removeItem(event) {
    if (event.target.classList.contains("buttonRemove")) {
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }
}
cartItemsContainer.addEventListener('click', removeItem);

// REMOVER ITEM DO CART
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1)
        updateCartModal();
    }
}

// PEGAR O ENDEREÇO
function addressValue(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("inputAddress_hidden");
        addressWarn.classList.add("hidden")
    }

}
addressInput.addEventListener('input', addressValue);



// MENSAGEM DE ERRO
function finalizarPedido() {

    const isOpen = restaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops! O restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#EF4444",
            },
        }).showToast();
    }


    if (cart.length === 0) return;

    if (addressInput.value === '') {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("inputAddress_hidden");
        return;
    }

    //ENVIAR O PEDIDO PARA API WHATS
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} \n`
        )
    }).join("")

    const menssagem = encodeURIComponent(cartItems)
    // NÚMERO DO TELEFONE QUE SERÁ REDIRECIONADO O PEDIDO
    const phone = "91982572088"

    window.open(`https://wa.me/${phone}?text=${menssagem} Endereço: ${addressInput.value}`, "_blanck")

    cart.length = 0;
    updateCartModal();
}
checkoutBtn.addEventListener('click', finalizarPedido)


// VERIFICAR SE O RESTAURANTE TA ABERTO
function restaurantOpen() {
    const data = new Date();
    const hora = data.getHours();

    return hora >= 18 && hora < 22;
    // TRUE = RESTAURANTE ABERTO
}

const spanItem = document.querySelector('#date-span');
const isOpen = restaurantOpen();

if (isOpen) {
    spanItem.style.background = '#22c55e';
}
else {
    spanItem.style.background = '#ef4444';
}
