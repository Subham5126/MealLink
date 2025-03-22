function fetchDonations() {
    fetch('/api/nearby_donations')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('donationBody');
            tbody.innerHTML = '';
            data.forEach(donation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donation.donor_name}</td>
                    <td>${donation.location}</td>
                    <td>${donation.food_details}</td>
                    <td>${donation.donor_phone}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching donations:', error));
}

function searchDonations() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#donationTable tbody tr');
    rows.forEach(row => {
        const location = row.cells[1].textContent.toLowerCase();
        if (location.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

window.onload = fetchDonations;
