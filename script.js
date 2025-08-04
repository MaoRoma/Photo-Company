// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search Functionality
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resultsGrid = document.getElementById('resultsGrid');
const tabBtns = document.querySelectorAll('.tab-btn');

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Update placeholder based on selected tab
        const tabType = btn.getAttribute('data-tab');
        if (tabType === 'session') {
            searchInput.placeholder = 'Enter your Session ID';
        } else {
            searchInput.placeholder = 'Enter your Email';
        }
    });
});

// Mock photo data - in a real application, this would come from a database
const mockPhotos = [
    {
        id: 'SESS001',
        email: 'john@example.com',
        photos: [
            {
                id: 'PHOTO001',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 1',
                price: 9.99
            },
            {
                id: 'PHOTO002',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 2',
                price: 9.99
            },
            {
                id: 'PHOTO003',
                url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 3',
                price: 9.99
            },
            {
                id: 'PHOTO004',
                url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 4',
                price: 9.99
            },
            {
                id: 'PHOTO005',
                url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 5',
                price: 9.99
            },
            {
                id: 'PHOTO006',
                url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 6',
                price: 9.99
            }
        ]
    },
    {
        id: 'SESS002',
        email: 'jane@example.com',
        photos: [
            {
                id: 'PHOTO007',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 7',
                price: 9.99
            },
            {
                id: 'PHOTO008',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 8',
                price: 9.99
            },
            {
                id: 'PHOTO009',
                url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 9',
                price: 9.99
            },
            {
                id: 'PHOTO010',
                url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 10',
                price: 9.99
            }
        ]
    },
    {
        id: 'SESS003',
        email: 'mike@example.com',
        photos: [
            {
                id: 'PHOTO011',
                url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 11',
                price: 9.99
            },
            {
                id: 'PHOTO012',
                url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 12',
                price: 9.99
            }
        ]
    },
    {
        id: 'SESS004',
        email: 'sarah@example.com',
        photos: [
            {
                id: 'PHOTO013',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 13',
                price: 9.99
            },
            {
                id: 'PHOTO014',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 14',
                price: 9.99
            }
        ]
    },
    {
        id: 'SESS005',
        email: 'emma@example.com',
        photos: [
            {
                id: 'PHOTO015',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 15',
                price: 9.99
            },
            {
                id: 'PHOTO016',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 16',
                price: 9.99
            }
        ]
    },
    {
        id: 'SESS006',
        email: 'david@example.com',
        photos: [
            {
                id: 'PHOTO017',
                url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 17',
                price: 9.99
            },
            {
                id: 'PHOTO018',
                url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                title: 'Professional Portrait 18',
                price: 9.99
            }
        ]
    }
];

// Search functionality
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    // Simulate search delay
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    setTimeout(() => {
        let foundPhotos = [];
        
        if (activeTab === 'session') {
            // Search by session ID
            const session = mockPhotos.find(s => s.id.toLowerCase() === searchTerm);
            if (session) {
                foundPhotos = session.photos;
            }
        } else {
            // Search by email
            const session = mockPhotos.find(s => s.email.toLowerCase() === searchTerm);
            if (session) {
                foundPhotos = session.photos;
            }
        }
        
        displaySearchResults(foundPhotos);
        
        // Reset button
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        searchBtn.disabled = false;
    }, 1000);
}

function displaySearchResults(photos) {
    if (photos.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No photos found</h3>
                <p>Please check your Session ID or Email and try again.</p>
            </div>
        `;
    } else {
        resultsGrid.innerHTML = photos.map(photo => `
            <div class="result-item" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <img src="${photo.url}" alt="${photo.title}" style="width: 100%; height: 200px; object-fit: cover;">
                <div style="padding: 1rem;">
                    <h4 style="margin-bottom: 0.5rem; color: #2c3e50;">${photo.title}</h4>
                    <p style="color: #666; margin-bottom: 1rem;">Photo ID: ${photo.id}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: #e74c3c;">$${photo.price}</span>
                        <button class="btn btn-primary purchase-photo-btn" data-photo-id="${photo.id}" data-photo-url="${photo.url}" data-photo-title="${photo.title}">
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to purchase buttons
        document.querySelectorAll('.purchase-photo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const photoId = btn.getAttribute('data-photo-id');
                const photoUrl = btn.getAttribute('data-photo-url');
                const photoTitle = btn.getAttribute('data-photo-title');
                openPurchaseModal(photoId, photoUrl, photoTitle);
            });
        });
    }
    
    searchResults.style.display = 'block';
}

// Modal functionality
const modal = document.getElementById('purchaseModal');
const modalPhoto = document.getElementById('modalPhoto');
const closeBtn = document.querySelector('.close');

function openPurchaseModal(photoId, photoUrl, photoTitle) {
    modalPhoto.src = photoUrl;
    modalPhoto.alt = photoTitle;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Purchase functionality
document.querySelectorAll('.purchase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const package = btn.getAttribute('data-package');
        const price = package === 'digital' ? 9.99 : 19.99;
        
        // Simulate purchase process
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert(`Thank you for your purchase! Your ${package === 'digital' ? 'digital download' : 'print + digital'} package will be available shortly.`);
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset button
            btn.innerHTML = package === 'digital' ? 'Purchase Digital' : 'Purchase Print + Digital';
            btn.disabled = false;
        }, 2000);
    });
});

// Gallery item click functionality
document.querySelectorAll('.gallery-item .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Scroll to search section
        document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
        contactForm.reset();
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
    }, 1500);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .gallery-item, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}); 