// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');

function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
setTheme(isDark);

themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-theme'));
});

// Profile Picture Upload
const profilePicture = document.getElementById('profilePicture');
const profilePreview = document.getElementById('profilePreview');
const coverPhoto = document.getElementById('coverPhoto');
const coverPreview = document.getElementById('coverPreview');

profilePicture.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePreview.src = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
});

coverPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            coverPreview.style.backgroundImage = `url(${e.target.result})`;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
});

// Skills Management
const skillInput = document.getElementById('skillInput');
const skillTags = document.getElementById('skillTags');
const addSkillBtn = document.getElementById('addSkill');
let skills = new Set();

function addSkill(skill) {
    if (skill && !skills.has(skill)) {
        skills.add(skill);
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            ${skill}
            <button onclick="removeSkill('${skill}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        skillTags.appendChild(tag);
        updatePreview();
    }
}

function removeSkill(skill) {
    skills.delete(skill);
    updateSkillTags();
    updatePreview();
}

function updateSkillTags() {
    skillTags.innerHTML = '';
    skills.forEach(skill => addSkill(skill));
}

addSkillBtn.addEventListener('click', () => {
    const skill = skillInput.value.trim();
    if (skill) {
        addSkill(skill);
        skillInput.value = '';
    }
});

skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const skill = skillInput.value.trim();
        if (skill) {
            addSkill(skill);
            skillInput.value = '';
        }
    }
});

// Experience Management
const experienceList = document.getElementById('experienceList');
const addExperienceBtn = document.getElementById('addExperience');
let experiences = [];

function addExperience() {
    const experienceId = Date.now();
    const experienceEl = document.createElement('div');
    experienceEl.className = 'experience-item';
    experienceEl.innerHTML = `
        <div class="input-group">
            <label>Title</label>
            <input type="text" class="exp-title" placeholder="Job Title" onchange="updateExperience(${experienceId})">
        </div>
        <div class="input-group">
            <label>Company</label>
            <input type="text" class="exp-company" placeholder="Company Name" onchange="updateExperience(${experienceId})">
        </div>
        <div class="input-group">
            <label>Location</label>
            <input type="text" class="exp-location" placeholder="City, Country" onchange="updateExperience(${experienceId})">
        </div>
        <div class="date-group">
            <div class="input-group">
                <label>Start Date</label>
                <input type="month" class="exp-start" onchange="updateExperience(${experienceId})">
            </div>
            <div class="input-group">
                <label>End Date</label>
                <input type="month" class="exp-end" onchange="updateExperience(${experienceId})">
            </div>
            <div class="input-group checkbox">
                <label>
                    <input type="checkbox" class="exp-current" onchange="updateExperience(${experienceId})">
                    Current Position
                </label>
            </div>
        </div>
        <div class="input-group">
            <label>Description</label>
            <textarea class="exp-description" rows="3" placeholder="Describe your role and achievements..." onchange="updateExperience(${experienceId})"></textarea>
        </div>
        <button class="remove-btn" onclick="removeExperience(${experienceId})">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;

    experienceList.appendChild(experienceEl);
    experiences.push({
        id: experienceId,
        element: experienceEl
    });
    updatePreview();
}

function updateExperience(id) {
    updatePreview();
}

function removeExperience(id) {
    const index = experiences.findIndex(exp => exp.id === id);
    if (index !== -1) {
        experiences[index].element.remove();
        experiences.splice(index, 1);
        updatePreview();
    }
}

// Preview Update
function updatePreview() {
    const fullName = document.getElementById('fullName').value;
    const headline = document.getElementById('headline').value;
    const location = document.getElementById('location').value;
    const industry = document.getElementById('industry').value;
    const about = document.getElementById('about').value;
    const openToJobs = document.getElementById('openToJobs').checked;
    const openToHiring = document.getElementById('openToHiring').checked;
    const openToServices = document.getElementById('openToServices').checked;

    const previewCard = document.getElementById('profilePreviewCard');
    previewCard.innerHTML = `
        <div class="profile-header">
            <div class="profile-cover" style="background-image: url('${coverPreview.style.backgroundImage ? coverPreview.style.backgroundImage.slice(4, -1) : ''}')"></div>
            <img class="profile-picture" src="${profilePreview.src}" alt="${fullName || 'Profile Picture'}">
        </div>
        <div class="profile-info">
            <h1 class="profile-name">${fullName || 'Your Name'}</h1>
            <div class="profile-headline">${headline || 'Professional Headline'}</div>
            <div class="profile-meta">
                ${location ? `
                    <div class="profile-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${location}
                    </div>
                ` : ''}
                ${industry ? `
                    <div class="profile-industry">
                        <i class="fas fa-building"></i>
                        ${industry}
                    </div>
                ` : ''}
            </div>
            ${(openToJobs || openToHiring || openToServices) ? `
                <div class="profile-open-to">
                    <h3>Open to</h3>
                    <div class="open-to-list">
                        ${openToJobs ? '<span><i class="fas fa-briefcase"></i> Finding a new job</span>' : ''}
                        ${openToHiring ? '<span><i class="fas fa-user-plus"></i> Hiring</span>' : ''}
                        ${openToServices ? '<span><i class="fas fa-handshake"></i> Providing services</span>' : ''}
                    </div>
                </div>
            ` : ''}
            ${about ? `
                <div class="profile-about">
                    <h3>About</h3>
                    <p>${about.replace(/\n/g, '<br>')}</p>
                </div>
            ` : ''}
            ${experiences.length > 0 ? `
                <div class="profile-experience">
                    <h3>Experience</h3>
                    <div class="experience-list">
                        ${experiences.map(exp => {
                            const el = exp.element;
                            const title = el.querySelector('.exp-title').value;
                            const company = el.querySelector('.exp-company').value;
                            const location = el.querySelector('.exp-location').value;
                            const startDate = el.querySelector('.exp-start').value;
                            const endDate = el.querySelector('.exp-end').value;
                            const current = el.querySelector('.exp-current').checked;
                            const description = el.querySelector('.exp-description').value;
                            
                            return `
                                <div class="experience-item">
                                    <h4>${title || 'Position'}</h4>
                                    <div class="company">${company || 'Company'}</div>
                                    ${location ? `<div class="location">${location}</div>` : ''}
                                    <div class="dates">
                                        ${startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Start Date'}
                                        ${current ? ' - Present' : endDate ? ` - ${new Date(endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
                                    </div>
                                    ${description ? `<p class="description">${description}</p>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            ${skills.size > 0 ? `
                <div class="profile-skills">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        ${Array.from(skills).map(skill => `<span class="skill">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Export Functions
function exportAsHTML() {
    const profileCard = document.getElementById('profilePreviewCard');
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>LinkedIn Profile</title>
            <style>
                ${document.querySelector('link[href*="linkedin-style.css"]').innerHTML}
            </style>
        </head>
        <body>
            ${profileCard.outerHTML}
        </body>
        </html>
    `;
    downloadFile(html, 'linkedin-profile.html', 'text/html');
}

function exportAsJSON() {
    const data = {
        fullName: document.getElementById('fullName').value,
        headline: document.getElementById('headline').value,
        location: document.getElementById('location').value,
        industry: document.getElementById('industry').value,
        about: document.getElementById('about').value,
        openTo: {
            jobs: document.getElementById('openToJobs').checked,
            hiring: document.getElementById('openToHiring').checked,
            services: document.getElementById('openToServices').checked
        },
        skills: Array.from(skills),
        experiences: experiences.map(exp => {
            const el = exp.element;
            return {
                title: el.querySelector('.exp-title').value,
                company: el.querySelector('.exp-company').value,
                location: el.querySelector('.exp-location').value,
                startDate: el.querySelector('.exp-start').value,
                endDate: el.querySelector('.exp-end').value,
                current: el.querySelector('.exp-current').checked,
                description: el.querySelector('.exp-description').value
            };
        })
    };
    downloadFile(JSON.stringify(data, null, 2), 'linkedin-profile.json', 'application/json');
}

function exportAsPDF() {
    showToast('PDF export coming soon! 📄', 3000);
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow and add visible class
    toast.offsetHeight;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Initialize all buttons and form elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form inputs
    const formInputs = document.querySelectorAll('input[type="text"], input[type="month"], textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initialize checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });

    // Initialize file upload buttons
    const uploadBtns = document.querySelectorAll('.upload-btn');
    uploadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileInput = e.target.closest('.profile-upload, .cover-upload').querySelector('input[type="file"]');
            fileInput.click();
        });
    });

    // Initialize rich text editor buttons
    const editorButtons = document.querySelectorAll('.editor-toolbar button');
    editorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const command = button.title.toLowerCase();
            const textarea = button.closest('.rich-text-editor').querySelector('textarea');
            
            if (command === 'bold' || command === 'italic') {
                wrapText(textarea, '**', '**');
            } else if (command === 'bullet list') {
                addList(textarea, '- ');
            } else if (command === 'numbered list') {
                addList(textarea, '1. ');
            }
            
            updatePreview();
        });
    });

    // Initialize experience button
    const addExperienceBtn = document.getElementById('addExperience');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperience);
    }

    // Initialize education button
    const addEducationBtn = document.getElementById('addEducation');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducation);
    }

    // Initialize language button
    const addLanguageBtn = document.getElementById('addLanguage');
    if (addLanguageBtn) {
        addLanguageBtn.addEventListener('click', addLanguage);
    }

    // Initialize certification button
    const addCertificationBtn = document.getElementById('addCertification');
    if (addCertificationBtn) {
        addCertificationBtn.addEventListener('click', addCertification);
    }

    // Initialize volunteer button
    const addVolunteerBtn = document.getElementById('addVolunteer');
    if (addVolunteerBtn) {
        addVolunteerBtn.addEventListener('click', addVolunteer);
    }

    // Initialize project button
    const addProjectBtn = document.getElementById('addProject');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProject);
    }

    // Initialize recommendation button
    const addRecommendationBtn = document.getElementById('addRecommendation');
    if (addRecommendationBtn) {
        addRecommendationBtn.addEventListener('click', addRecommendation);
    }

    // Initialize export buttons
    document.querySelectorAll('.export-options button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const action = button.getAttribute('onclick');
            if (action) {
                window[action.replace(/[()]/g, '')]();
            }
        });
    });

    // Initialize preview
    updatePreview();
});

// Rich text editor helper functions
function wrapText(textarea, before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    textarea.value = text.substring(0, start) + before + selection + after + text.substring(end);
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = end + before.length;
}

function addList(textarea, prefix) {
    const start = textarea.selectionStart;
    const text = textarea.value;
    const newLine = (start > 0 && text[start - 1] !== '\n') ? '\n' : '';
    
    textarea.value = text.substring(0, start) + newLine + prefix + text.substring(start);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + newLine.length + prefix.length;
}

// Section addition functions
function addEducation() {
    const educationList = document.getElementById('educationList');
    const educationId = Date.now();
    
    const educationEl = document.createElement('div');
    educationEl.className = 'education-item';
    educationEl.innerHTML = `
        <div class="input-group">
            <label>School</label>
            <input type="text" class="edu-school" placeholder="University/School Name" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Degree</label>
            <input type="text" class="edu-degree" placeholder="e.g., Bachelor's in Computer Science" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Field of Study</label>
            <input type="text" class="edu-field" placeholder="e.g., Computer Science" onchange="updatePreview()">
        </div>
        <div class="date-group">
            <div class="input-group">
                <label>Start Date</label>
                <input type="month" class="edu-start" onchange="updatePreview()">
            </div>
            <div class="input-group">
                <label>End Date</label>
                <input type="month" class="edu-end" onchange="updatePreview()">
            </div>
        </div>
        <button class="remove-btn" onclick="removeEducation(${educationId})">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    
    educationList.appendChild(educationEl);
    updatePreview();
}

function addLanguage() {
    const languageList = document.getElementById('languageList');
    const languageId = Date.now();
    
    const languageEl = document.createElement('div');
    languageEl.className = 'language-item';
    languageEl.innerHTML = `
        <div class="input-group">
            <label>Language</label>
            <input type="text" class="lang-name" placeholder="e.g., English" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Proficiency</label>
            <select class="lang-proficiency" onchange="updatePreview()">
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Elementary">Elementary</option>
            </select>
        </div>
        <button class="remove-btn" onclick="removeLanguage(${languageId})">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    
    languageList.appendChild(languageEl);
    updatePreview();
}

function addCertification() {
    const certificationList = document.getElementById('certificationList');
    const certId = Date.now();
    
    const certEl = document.createElement('div');
    certEl.className = 'certification-item';
    certEl.innerHTML = `
        <div class="input-group">
            <label>Name</label>
            <input type="text" class="cert-name" placeholder="e.g., AWS Certified Solutions Architect" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Issuing Organization</label>
            <input type="text" class="cert-org" placeholder="e.g., Amazon Web Services" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Issue Date</label>
            <input type="month" class="cert-date" onchange="updatePreview()">
        </div>
        <div class="input-group">
            <label>Credential ID</label>
            <input type="text" class="cert-id" placeholder="Optional credential ID" onchange="updatePreview()">
        </div>
        <button class="remove-btn" onclick="removeCertification(${certId})">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    
    certificationList.appendChild(certEl);
    updatePreview();
}

// Remove section functions
function removeEducation(id) {
    const element = document.querySelector(`.education-item button[onclick*="${id}"]`).closest('.education-item');
    element.remove();
    updatePreview();
}

function removeLanguage(id) {
    const element = document.querySelector(`.language-item button[onclick*="${id}"]`).closest('.language-item');
    element.remove();
    updatePreview();
}

function removeCertification(id) {
    const element = document.querySelector(`.certification-item button[onclick*="${id}"]`).closest('.certification-item');
    element.remove();
    updatePreview();
}

// Back button functionality
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});
