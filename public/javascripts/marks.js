// Marks Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupSemesterFilter();
    setupExportButton();
    initializeCharts();
    setupTableInteractions();
});

// Setup Semester Filter
function setupSemesterFilter() {
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            loadSemesterData(this.value);
        });
    }
}

// Load Semester Data
function loadSemesterData(semester) {
    console.log('Loading data for semester:', semester);
    // In a real application, this would fetch data from the server
    // For now, we'll just show a loading message
    alert(`Loading marks for ${semester === 'current' ? 'Current Semester' : 'Semester ' + semester}`);
}

// Setup Export Button
function setupExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportMarksReport();
        });
    }
}

// Export Marks Report
function exportMarksReport() {
    // In a real application, this would generate a PDF or Excel file
    alert('Downloading marks report...\nIn a real application, a PDF report would be generated and downloaded.');
    console.log('Exporting marks report');
}

// Initialize Charts
function initializeCharts() {
    createSemesterChart();
    createGradeChart();
}

// Create Semester Performance Chart
function createSemesterChart() {
    const ctx = document.getElementById('semesterChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
                label: 'SGPA',
                data: [8.2, 8.4, 8.3, 8.6, 8.5, 8.7],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7,
                    max: 10
                }
            }
        }
    });
}

// Create Grade Distribution Chart
function createGradeChart() {
    const ctx = document.getElementById('gradeChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A+', 'A', 'B+', 'B', 'C'],
            datasets: [{
                data: [2, 2, 1, 1, 0],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    });
}

// Setup Table Interactions
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.marks-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Highlight selected row
            tableRows.forEach(r => r.style.background = '');
            this.style.background = '#f0f4ff';
            
            // Get subject details
            const subjectCode = this.cells[0].textContent;
            const subjectName = this.cells[1].textContent;
            
            console.log('Selected subject:', subjectCode, subjectName);
        });
    });
}

// Calculate CGPA
function calculateCGPA() {
    // Sample calculation - in a real app, this would use actual data
    const grades = {
        'A+': 10,
        'A': 9,
        'B+': 8,
        'B': 7,
        'C': 6
    };
    
    // This is a simplified calculation
    return 8.5;
}

// Update summary values
function updateSummary(cgpa, sgpa, percentage, rank) {
    document.getElementById('cgpaValue').textContent = cgpa;
    document.getElementById('sgpaValue').textContent = sgpa;
    document.getElementById('percentageValue').textContent = percentage + '%';
    document.getElementById('rankValue').textContent = rank;
}
