// Attendance Page JavaScript

let currentMonth = new Date();

document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    setupCalendarControls();
    initializeAttendanceChart();
    setupSubjectDetailsButtons();
});

// Generate Calendar
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    // Clear existing calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        
        // Determine day status
        if (currentDate > today) {
            dayElement.classList.add('future');
        } else {
            // Random attendance status for demo (in real app, this would come from server)
            const random = Math.random();
            if (random > 0.85) {
                dayElement.classList.add('absent');
            } else if (random > 0.75) {
                dayElement.classList.add('holiday');
            } else {
                dayElement.classList.add('present');
            }
            
            dayElement.addEventListener('click', function() {
                showDayDetails(day, currentMonth.getMonth(), currentMonth.getFullYear());
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = 
        monthNames[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear();
}

// Setup Calendar Controls
function setupCalendarControls() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentMonth.setMonth(currentMonth.getMonth() - 1);
            generateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentMonth.setMonth(currentMonth.getMonth() + 1);
            generateCalendar();
        });
    }
}

// Show Day Details
function showDayDetails(day, month, year) {
    const date = new Date(year, month, day);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    alert('Attendance details for ' + dateStr + '\n\nIn a real application, this would show detailed attendance records for all subjects on this day.');
}

// View Subject Details
function viewSubjectDetails(subjectName) {
    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const detailsTable = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
    
    if (!modal || !modalTitle || !detailsTable) return;
    
    modalTitle.textContent = subjectName + ' - Attendance Details';
    
    // Clear existing rows
    detailsTable.innerHTML = '';
    
    // Generate sample data (in real app, this would come from server)
    const sampleData = generateSampleAttendanceData(subjectName);
    
    sampleData.forEach(record => {
        const row = detailsTable.insertRow();
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.day}</td>
            <td><span class="status ${record.status === 'Present' ? 'success' : 'fail'}">${record.status}</span></td>
            <td>${record.time}</td>
            <td>${record.remarks}</td>
        `;
    });
    
    modal.style.display = 'flex';
}

// Close Details Modal
function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Generate Sample Attendance Data
function generateSampleAttendanceData(subjectName) {
    const data = [];
    const statuses = ['Present', 'Present', 'Present', 'Present', 'Absent'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 10; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        data.push({
            date: `Dec ${10 - i}, 2024`,
            day: days[i % 5],
            status: status,
            time: '09:00 AM - 10:00 AM',
            remarks: status === 'Present' ? 'On time' : 'Not marked'
        });
    }
    
    return data;
}

// Setup Subject Details Buttons
function setupSubjectDetailsButtons() {
    // Already handled by inline onclick in HTML
}

// Initialize Attendance Chart
function initializeAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Data Structures', 'Database Mgmt', 'Operating Systems', 
                     'Computer Networks', 'Software Eng', 'Web Tech'],
            datasets: [{
                label: 'Attendance %',
                data: [92, 88, 80, 72, 90, 94],
                backgroundColor: [
                    'rgba(67, 233, 123, 0.8)',
                    'rgba(67, 233, 123, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(245, 87, 108, 0.8)',
                    'rgba(67, 233, 123, 0.8)',
                    'rgba(67, 233, 123, 0.8)'
                ],
                borderColor: [
                    'rgb(67, 233, 123)',
                    'rgb(67, 233, 123)',
                    'rgb(255, 193, 7)',
                    'rgb(245, 87, 108)',
                    'rgb(67, 233, 123)',
                    'rgb(67, 233, 123)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        closeDetailsModal();
    }
});

// Calculate overall attendance
function calculateOverallAttendance() {
    // In a real app, this would calculate from actual data
    const subjects = [92, 88, 80, 72, 90, 94];
    const average = subjects.reduce((a, b) => a + b, 0) / subjects.length;
    return Math.round(average);
}

// Update attendance warning
function updateAttendanceWarning() {
    const alertSection = document.getElementById('alertSection');
    const overallAttendance = calculateOverallAttendance();
    
    if (overallAttendance < 75) {
        alertSection.style.display = 'block';
    } else {
        const lowSubjects = document.querySelectorAll('.subject-card.poor');
        if (lowSubjects.length > 0) {
            alertSection.style.display = 'block';
        } else {
            alertSection.style.display = 'none';
        }
    }
}
