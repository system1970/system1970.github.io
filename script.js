AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-out-cubic',
});

// Form Validation
const form = document.getElementById('contact-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Name Validation
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    // Email Validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    // Message Validation
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Please enter a message.';
        isValid = false;
    } else {
        messageError.textContent = '';
    }

    if (isValid) {
        // Simulate a successful submission
        alert('Message sent! (Simulated)');

        // Optionally, clear the form fields
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const cryptoChartCanvas = document.getElementById('cryptoChart').getContext('2d');
    let cryptoLineChart; // Variable to hold the Chart.js chart instance

    function fetchCryptoData() {
        const coinId = 'bitcoin'; // Example: Bitcoin (BTC) - You can change this
        const currency = 'usd';   // Example: US Dollar
        const days = '30';        // Example: 30 days of historical data

        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
            .then(response => response.json())
            .then(data => {
                const prices = data.prices;
                const labels = prices.map(price => {
                    const date = new Date(price[0]);
                    return date.toLocaleDateString(); // Format date for labels
                });
                const priceData = prices.map(price => price[1]);

                if (cryptoLineChart) {
                    cryptoLineChart.destroy(); // Destroy existing chart if it exists
                }

                cryptoLineChart = new Chart(cryptoChartCanvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `Bitcoin Price (USD) - Last 30 Days`,
                            data: priceData,
                            borderColor: '#a29bfe', // Violet line color
                            backgroundColor: 'rgba(162, 155, 254, 0.2)', // Violet fill with transparency
                            borderWidth: 2,
                            pointRadius: 0, // Hide data points
                            tension: 0.1,   // Line smoothness
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false, // Allow chart to fill canvas size
                        scales: {
                            y: {
                                beginAtZero: false, // Don't start Y axis at zero
                                ticks: {
                                    color: '#adb5bd' // Y-axis tick color (secondary text)
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.05)' // Subtle grid lines
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#adb5bd' // X-axis tick color
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.05)' // Subtle grid lines
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#f8f8f8' // Legend label color (light text)
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching cryptocurrency data:', error);
                // Optionally display an error message in the project card
            });
    }

    fetchCryptoData(); // Initial data fetch and chart creation
    setInterval(fetchCryptoData, 60000); // Update chart every 60 seconds (1 minute)
});