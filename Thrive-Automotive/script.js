document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navbar = document.getElementById('navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 50;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.review-card, .service-card, .stat, .info-box');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    let currentDate = new Date();
    let selectedDate = null;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = day;

            const currentDay = new Date(year, month, day);
            currentDay.setHours(0, 0, 0, 0);

            if (currentDay.getTime() === today.getTime()) {
                dayDiv.classList.add('today');
            }

            if (currentDay.getDay() === 0) {
                dayDiv.classList.add('disabled');
            }

            if (currentDay < today) {
                dayDiv.classList.add('disabled');
            }

            if (selectedDate && currentDay.getTime() === selectedDate.getTime()) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', function() {
                if (!this.classList.contains('disabled') && !this.classList.contains('other-month')) {
                    selectedDate = new Date(year, month, day);
                    
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById('selectedDate').value = selectedDate.toLocaleDateString('en-US', options);
                    
                    renderCalendar();
                }
            });

            calendarDays.appendChild(dayDiv);
        }

        const remainingDays = 42 - (firstDay + daysInMonth);
        for (let i = 1; i <= remainingDays; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = i;
            calendarDays.appendChild(dayDiv);
        }
    }

    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    const appointmentForm = document.getElementById('appointmentForm');
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close');

    appointmentForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const dateText = document.getElementById('selectedDate').value;
        const time = document.getElementById('appointmentTime').value;
        const service = document.getElementById('serviceType').value;
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const email = document.getElementById('customerEmail').value;
        const vehicle = document.getElementById('vehicleInfo').value;

        if (!dateText) {
            alert('Please select a date from the calendar');
            return;
        }

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: formattedDate,
                    time: time,
                    service: service,
                    name: name,
                    phone: phone,
                    email: email,
                    vehicle: vehicle
                })
            });

            const data = await response.json();

            if (data.success) {
                const confirmationDetails = `
                    <p><strong>Date:</strong> ${dateText}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${vehicle ? `<p><strong>Vehicle:</strong> ${vehicle}</p>` : ''}
                `;

                document.getElementById('confirmationDetails').innerHTML = confirmationDetails;
                modal.style.display = 'block';

                appointmentForm.reset();
                selectedDate = null;
                renderCalendar();
            } else {
                alert('Error booking appointment: ' + data.message);
            }
        } catch (error) {
            alert('Error booking appointment. Please try again.');
            console.error('Error:', error);
        }
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    renderCalendar();
});
