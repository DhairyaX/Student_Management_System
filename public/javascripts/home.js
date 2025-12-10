// Home Page JavaScript

// Animate stats on page load
document.addEventListener('DOMContentLoaded', function() {
    animateStats();
    setupCardHover();
});

// Animate statistics counters
function animateStats() {
    const stats = [
        { id: 'attendancePercent', target: 85, suffix: '%' },
        { id: 'averageMarks', target: 78, suffix: '' },
        { id: 'pendingPayments', target: 2, suffix: '' },
        { id: 'coursesEnrolled', target: 6, suffix: '' }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateValue(element, 0, stat.target, 2000, stat.suffix);
        }
    });
}

// Animate a number from start to end
function animateValue(element, start, end, duration, suffix) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current + suffix;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Add hover effect to dashboard cards
function setupCardHover() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle CTA button click
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        window.location.href = '/profile';
    });
}

// Activity timeline auto-update (simulated)
function updateActivityTime() {
    const activityTimes = document.querySelectorAll('.activity-time');
    // In a real app, this would fetch real-time data
    console.log('Activity times updated');
}

// Update activity times every minute
setInterval(updateActivityTime, 60000);
