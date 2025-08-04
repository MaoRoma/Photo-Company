// Admin Panel JavaScript

// Mock data for sessions and customers
let sessionsData = [
    {
        id: 'SESS001',
        customerName: 'John Smith',
        email: 'john@example.com',
        photos: 12,
        date: '2024-12-15',
        status: 'active',
        photosList: [
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
        customerName: 'Jane Doe',
        email: 'jane@example.com',
        photos: 8,
        date: '2024-12-14',
        status: 'active',
        photosList: [
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
        customerName: 'Mike Johnson',
        email: 'mike@example.com',
        photos: 15,
        date: '2024-12-13',
        status: 'active',
        photosList: [
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
        customerName: 'Sarah Wilson',
        email: 'sarah@example.com',
        photos: 10,
        date: '2024-12-12',
        status: 'active',
        photosList: [
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
    }
];

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize admin panel
    initializeAdminPanel();
});

function initializeAdminPanel() {
    populateSessionsTable();
    populateCustomersGrid();
    setupUploadFunctionality();
}

// Populate sessions table
function populateSessionsTable() {
    const tableBody = document.getElementById('sessionsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = sessionsData.map(session => `
        <tr>
            <td><strong>${session.id}</strong></td>
            <td>${session.customerName}</td>
            <td>${session.email}</td>
            <td>${session.photos} photos</td>
            <td>${formatDate(session.date)}</td>
            <td><span class="status ${session.status}">${session.status}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewSession('${session.id}')">View</button>
                <button class="btn btn-secondary btn-sm" onclick="editSession('${session.id}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Populate customers grid
function populateCustomersGrid() {
    const customersGrid = document.getElementById('customersGrid');
    if (!customersGrid) return;

    customersGrid.innerHTML = sessionsData.map(session => `
        <div class="customer-card">
            <div class="customer-header">
                <div class="customer-avatar">
                    ${session.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="customer-info">
                    <h3>${session.customerName}</h3>
                    <p>${session.email}</p>
                </div>
            </div>
            <div class="customer-stats">
                <div class="stat-item">
                    <div class="number">${session.photos}</div>
                    <div class="label">Photos</div>
                </div>
                <div class="stat-item">
                    <div class="number">${session.id}</div>
                    <div class="label">Session ID</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary" onclick="viewCustomer('${session.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

// Setup upload functionality
function setupUploadFunctionality() {
    const fileInput = document.getElementById('photoUpload');
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleSessionUpload);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearUploadForm);
    }
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    const uploadedPhotos = document.getElementById('uploadedPhotos');
    
    uploadedPhotos.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.createElement('div');
                photoPreview.className = 'photo-preview';
                photoPreview.innerHTML = `
                    <img src="${e.target.result}" alt="Uploaded photo">
                    <button class="remove-btn" onclick="removePhoto(this)">×</button>
                `;
                uploadedPhotos.appendChild(photoPreview);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Remove photo from upload
function removePhoto(button) {
    button.parentElement.remove();
}

// Handle session upload
function handleSessionUpload() {
    const sessionId = document.getElementById('sessionId').value;
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const uploadedPhotos = document.getElementById('uploadedPhotos');

    if (!sessionId || !customerName || !customerEmail) {
        alert('Please fill in all required fields');
        return;
    }

    if (uploadedPhotos.children.length === 0) {
        alert('Please upload at least one photo');
        return;
    }

    // Simulate upload process
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    uploadBtn.disabled = true;

    setTimeout(() => {
        // Add new session to data
        const newSession = {
            id: sessionId,
            customerName: customerName,
            email: customerEmail,
            photos: uploadedPhotos.children.length,
            date: new Date().toISOString().split('T')[0],
            status: 'active',
            photosList: []
        };

        sessionsData.unshift(newSession);

        // Update displays
        populateSessionsTable();
        populateCustomersGrid();

        // Show success message
        alert(`Session ${sessionId} uploaded successfully with ${uploadedPhotos.children.length} photos!`);
        
        // Reset form
        clearUploadForm();
        
        // Reset button
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Session';
        uploadBtn.disabled = false;
    }, 2000);
}

// Clear upload form
function clearUploadForm() {
    document.getElementById('sessionId').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('photoUpload').value = '';
    document.getElementById('uploadedPhotos').innerHTML = '';
}

// View session details
function viewSession(sessionId) {
    const session = sessionsData.find(s => s.id === sessionId);
    if (session) {
        alert(`Session ${sessionId}\nCustomer: ${session.customerName}\nEmail: ${session.email}\nPhotos: ${session.photos}\nDate: ${formatDate(session.date)}`);
    }
}

// Edit session
function editSession(sessionId) {
    const session = sessionsData.find(s => s.id === sessionId);
    if (session) {
        alert(`Edit functionality for session ${sessionId} would be implemented here.`);
    }
}

// View customer details
function viewCustomer(sessionId) {
    const session = sessionsData.find(s => s.id === sessionId);
    if (session) {
        alert(`Customer Details:\nName: ${session.customerName}\nEmail: ${session.email}\nSession ID: ${session.id}\nTotal Photos: ${session.photos}`);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update main website script with new mock data
function updateMainWebsiteData() {
    // This function would update the main website's mock data
    // In a real application, this would sync with a database
    console.log('Updating main website data...');
}

// Export data for main website
function exportSessionsData() {
    return sessionsData;
}

// Add some additional mock data for testing
const additionalMockData = {
    'SESS005': {
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
    'SESS006': {
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
};

// Add the additional data to sessionsData
Object.values(additionalMockData).forEach(session => {
    sessionsData.push({
        id: session.id,
        customerName: session.email.split('@')[0].charAt(0).toUpperCase() + session.email.split('@')[0].slice(1),
        email: session.email,
        photos: session.photos.length,
        date: '2024-12-11',
        status: 'active',
        photosList: session.photos
    });
}); 