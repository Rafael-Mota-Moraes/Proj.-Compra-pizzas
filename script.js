let cart = []
let modalQt = 1
let modalKey = 0

const s = (el) => document.querySelector(el)
const cs = (el) => document.querySelectorAll(el)

//Listagem das pizzas
pizzaJson.map((item, index) =>{
	let pizzaItem = s('.models .pizza-item').cloneNode(true)
	
	pizzaItem.setAttribute('data-key', index)
	pizzaItem.querySelector('.pizza-item--img img').src = item.img
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
	pizzaItem.querySelector('a').addEventListener('click', (e) =>{
		e.preventDefault()
		let key = e.target.closest('.pizza-item').getAttribute('data-key')
		modalQt = 1
		modalKey = key
		
		s('.pizzaBig img').src = pizzaJson[key].img
		s('.pizzaInfo h1').innerHTML = pizzaJson[key].name
		s('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
		s('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
		s('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
		s('.pizzaInfo--size.selected').classList.remove('selected')
		cs('.pizzaInfo--size').forEach((size, sizeIndex) =>{
			if(sizeIndex == 2) {
				size.classList.add('selected')
			}
			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
		})

		s('.pizzaInfo--qt').innerHTML = modalQt

		s('.pizzaWindowArea').style.opacity = 0
		s('.pizzaWindowArea').style.display = 'flex'
		setTimeout(() => {
			s('.pizzaWindowArea').style.opacity = 1
		}, 200)
	})
	
	s('.pizza-area').append(pizzaItem)
})

//Eventos do modal!

function closeModal() {
	s('.pizzaWindowArea').style.opacity = 0
	setTimeout(() => {
		s('.pizzaWindowArea').style.display = 'none'

	}, 500)
} 

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
	item.addEventListener('click', closeModal)
})

s('.pizzaInfo--qtmenos').addEventListener('click', () => {
	if(modalQt > 1){
		modalQt--
		s('.pizzaInfo--qt').innerHTML = modalQt
	}
})

s('.pizzaInfo--qtmais').addEventListener('click', () => {
	modalQt++
	s('.pizzaInfo--qt').innerHTML = modalQt
})

cs('.pizzaInfo--size').forEach((size, sizeIndex) =>{
	size.addEventListener('click', (e) => {
		s('.pizzaInfo--size.selected').classList.remove('selected')
		size.classList.add('selected')
	})
})

s('.pizzaInfo--addButton').addEventListener('click', () => {
	let size = parseInt(s('.pizzaInfo--size.selected').getAttribute('data-key'))
	let identifier = pizzaJson[modalKey].id+'@'+size
	let key = cart.findIndex((item) => item.identifier == identifier)
	if(key > -1){
		cart[key].qt += modalQt
	} else {
		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qt: modalQt
		})
	}
	updateCart()
	closeModal()
})

s('.menu-openner').addEventListener('click', () => {
	if(cart.length > 0){
		s('aside').style.left = '0'
	}
})

s('.menu-closer').addEventListener('click', () => {
	s('aside').style.left = '100vw'
})

function updateCart() {
	s('.menu-openner span').innerHTML = cart.length


	if(cart.length > 0){
		s('aside').classList.add('show')
		s('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total = 0

		for(let i in cart) {
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
			subtotal += pizzaItem.price * cart[i].qt

			let cartItem = s('.models .cart--item').cloneNode(true)

			let pizzaSizeName
			switch(cart[i].size){
				case 0:
					pizzaSizeName = 'P'
					break;
				case 1:
					pizzaSizeName = 'M'
					break;
				case 2:
					pizzaSizeName = 'G'
					break;
			}

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

			cartItem.querySelector('img').src = pizzaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
				if(cart[i].qt > 1){
					cart[i].qt--
				} else {
					cart.splice(i, 1)
				}
				updateCart()
			})
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
				cart[i].qt++;
				updateCart()
			})
			s('.cart').append(cartItem)
		}

		desconto = subtotal * 0.1
		total = subtotal - desconto

		s('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
		s('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
		s('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


	} else {
		s('aside').classList.remove('show')
		s('aside').style.left = '100vw'
	}
}