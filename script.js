let myHeaders = new Headers();
myHeaders.append("apikey", 'tklU0FW2VSqP6gaCb8lJPVyWi2HAkpJS');

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

const baseCurrency = document.getElementById("base-currency");
const inputAmount = document.getElementById("amount");
const targetCurrency = document.getElementById("target-currency");
const convertedAmount = document.getElementById("converted-amount");

fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then(response => response.json())
  .then((data) => {
    let currencyList = document.getElementById("base-currency");
    let targetList = document.getElementById("target-currency");
    for (let symbol in data.symbols) {
      let option = document.createElement("option");
      option.value = symbol;
      option.text = symbol;
      currencyList.appendChild(option);

      const targetOption = option.cloneNode(true);
      targetList.appendChild(targetOption);
    }
  })
  .catch(error => console.log('error', error));

  [baseCurrency, inputAmount, targetCurrency].forEach(input=> {
    input.addEventListener('change', () => {
      const from = baseCurrency.value;
      const to = targetCurrency.value;
      const amount = inputAmount.value;
  
      fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        let result = data.result;
        convertedAmount.textContent = result.toFixed(2) + " " + targetCurrency.value;
        console.log(result);
      })
      .catch(error => console.log('error', error));
    })
  })

  const historicalRates = document.getElementById('historical-rates');
  const historicalResults = document.getElementById('historical-rates-container')
  
    historicalRates.addEventListener("click", () => {
        const baseCurrency = document.querySelector("#base-currency").value;
        const targetCurrency = document.querySelector("#target-currency").value;
        const date = "2023-05-05";

        fetch(`https://api.apilayer.com/exchangerates_data/${date}?symbols=${targetCurrency}&base=${baseCurrency}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const rates = data.rates;
          let rate = 0;
          for (let currency in rates) {
            if(currency === targetCurrency) {
              rate = rates[currency];
              break;
            }
          }
          historicalResults.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
        })
        .catch(error => console.log('error', error));
    });

    const saveFavorite = document.getElementById('save-favorite');
    
    saveFavorite.addEventListener('click', () => {

        const selectPair = `${baseCurrency.value}/${targetCurrency.value}`;
        const savePair = JSON.parse(localStorage.getItem('savePair')) || [];
        savePair.push(selectPair);
        localStorage.setItem('savePair', JSON.stringify(savePair));

    const fave = document.createElement('option');
    fave.value = selectPair;
    fave.text = selectPair;
    saveFavorite.appendChild(fave);
    });
