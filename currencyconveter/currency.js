
    
    // Fetch exchange rates from a public API
    let rates = {
    }



async function loadRates() {
const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

const data = await res.json()
rates = data.rates;
console.log(rates)

const from =document.querySelector('#from_currency')
const to = document.querySelector('#to_currency')


Object.keys(rates).map(i => {

    from.innerHTML += `<option value="${i}">${i}</option>`
    to.innerHTML += `<option value="${i}">${i}</option>`
})
}

loadRates() //

function convert() {
const from = document.querySelector('#from_currency').value
const to = document.querySelector('#to_currency').value
const amt = document.querySelector('input').value-

new_value = parseFloat(amt) * rates[to] / rates[from]


const resultDiv = document.querySelector('.result')
resultDiv.innerHTML = `Converted Amount: ${new_value.toFixed(2)} ${to}`

// get the value of to dropdown
console.log("new_value", new_value)
}


