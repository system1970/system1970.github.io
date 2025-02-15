/* Crypto-Dashboard/script.js */

document.addEventListener('DOMContentLoaded', function () {
    // Chart Canvases
    const bitcoinPriceChartCanvas = document.getElementById('bitcoinPriceChart').getContext('2d');
    const ethereumPriceChartCanvas = document.getElementById('ethereumPriceChart').getContext('2d');

    // Table Body
    const cryptoPriceTableBody = document.getElementById('crypto-price-table-body');

    let bitcoinLineChart, ethereumLineChart; // Chart.js chart instances

    const cryptoList = ['bitcoin', 'ethereum', 'litecoin', 'ripple']; // Example crypto list for table

    function fetchAndRenderData() {
        fetchChartData();
        fetchPriceTableData();
    }

    function fetchChartData() {
        fetchCryptoPriceChartData('bitcoin', bitcoinPriceChartCanvas, bitcoinLineChart, 'Bitcoin (BTC)');
        fetchCryptoPriceChartData('ethereum', ethereumPriceChartCanvas, ethereumLineChart, 'Ethereum (ETH)');
    }

    function fetchCryptoPriceChartData(coinId, canvasContext, chartInstance, chartLabel) {
        const currency = 'usd';
        const days = '30';

        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
            .then(response => response.json())
            .then(data => {
                const prices = data.prices;
                const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
                const priceData = prices.map(price => price[1]);

                if (chartInstance) {
                    chartInstance.destroy();
                }

                chartInstance = new Chart(canvasContext, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `${chartLabel} Price (USD) - Last 30 Days`,
                            data: priceData,
                            borderColor: '#a29bfe',
                            backgroundColor: 'rgba(162, 155, 254, 0.2)',
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.1,
                        }]
                    },
                    options: { 
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: { y: { beginAtZero: false, ticks: { color: '#adb5bd' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                            x: { ticks: { color: '#adb5bd' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                        },
                        plugins: { legend: { labels: { color: '#f8f8f8' } } }
                    }
                });
                if (coinId === 'bitcoin') bitcoinLineChart = chartInstance; // Update global chart instances
                if (coinId === 'ethereum') ethereumLineChart = chartInstance;

            })
            .catch(error => console.error(`Error fetching ${chartLabel} chart data:`, error));
    }


    function fetchPriceTableData() {
        const currency = 'usd';
        const coinIds = cryptoList.join(','); // Comma-separated list for API

        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`)
            .then(response => response.json())
            .then(cryptoData => {
                let tableRowsHTML = '';
                cryptoData.forEach(coin => {
                    tableRowsHTML += `
                        <tr>
                            <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
                            <td>$${coin.current_price.toLocaleString()}</td>
                            <td class="${coin.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}">
                                ${coin.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            <td>$${coin.market_cap.toLocaleString()}</td>
                            <td>$${coin.total_volume.toLocaleString()}</td>
                        </tr>
                    `;
                });
                cryptoPriceTableBody.innerHTML = tableRowsHTML;
            })
            .catch(error => console.error('Error fetching crypto table data:', error));
    }


    fetchAndRenderData(); // Initial data load
    setInterval(fetchAndRenderData, 60000); // Update data every 60 seconds (1 minute)

});