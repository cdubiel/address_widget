/**
 * Address Collection Widget
 * 
 * Features:
 * - Multi-stage form: ZIP code first, then address, then name and phone
 * - ZIP code lookup to autopopulate city and state
 * - Responsive design that works on all devices
 * - Easily embeddable on WordPress sites
 */

(function() {
    // Widget elements
    let zipcodeInput, addressInput, nameInput, phoneInput, submitBtn;
    let zipcodeGroup, cityStateDisplay, addressGroup, nameGroup, phoneGroup, widgetForm;
    let cityStateText;
    
    // Track form state
    let formState = 'zipcode'; // 'zipcode', 'address', 'details'
    
    // ZIP code database (simplified for common US cities)
    const zipCodeDatabase = {
        '78701': { city: 'Austin', state: 'TX' },
        '78702': { city: 'Austin', state: 'TX' },
        '78703': { city: 'Austin', state: 'TX' },
        '78704': { city: 'Austin', state: 'TX' },
        '78705': { city: 'Austin', state: 'TX' },
        '78758': { city: 'Austin', state: 'TX' },
        '78759': { city: 'Austin', state: 'TX' },
        '75001': { city: 'Dallas', state: 'TX' },
        '75202': { city: 'Dallas', state: 'TX' },
        '77001': { city: 'Houston', state: 'TX' },
        '77002': { city: 'Houston', state: 'TX' },
        '77003': { city: 'Houston', state: 'TX' },
        '77004': { city: 'Houston', state: 'TX' },
        '77005': { city: 'Houston', state: 'TX' },
        '73301': { city: 'Oklahoma City', state: 'OK' },
        '73102': { city: 'Oklahoma City', state: 'OK' },
        '73103': { city: 'Oklahoma City', state: 'OK' },
        '73104': { city: 'Oklahoma City', state: 'OK' },
        '73105': { city: 'Oklahoma City', state: 'OK' },
        '73106': { city: 'Oklahoma City', state: 'OK' },
        '73107': { city: 'Oklahoma City', state: 'OK' },
        '73108': { city: 'Oklahoma City', state: 'OK' },
        '73109': { city: 'Oklahoma City', state: 'OK' },
        '73110': { city: 'Oklahoma City', state: 'OK' },
        '73111': { city: 'Oklahoma City', state: 'OK' },
        '73112': { city: 'Oklahoma City', state: 'OK' },
        '73113': { city: 'Oklahoma City', state: 'OK' },
        '73114': { city: 'Oklahoma City', state: 'OK' },
        '73115': { city: 'Oklahoma City', state: 'OK' },
        '73116': { city: 'Oklahoma City', state: 'OK' },
        '73117': { city: 'Oklahoma City', state: 'OK' },
        '73118': { city: 'Oklahoma City', state: 'OK' },
        '73119': { city: 'Oklahoma City', state: 'OK' },
        '73120': { city: 'Oklahoma City', state: 'OK' },
        '73121': { city: 'Oklahoma City', state: 'OK' },
        '73122': { city: 'Oklahoma City', state: 'OK' },
        '73123': { city: 'Oklahoma City', state: 'OK' },
        '73124': { city: 'Oklahoma City', state: 'OK' },
        '73125': { city: 'Oklahoma City', state: 'OK' },
        '73126': { city: 'Oklahoma City', state: 'OK' },
        '73127': { city: 'Oklahoma City', state: 'OK' },
        '73128': { city: 'Oklahoma City', state: 'OK' },
        '73129': { city: 'Oklahoma City', state: 'OK' },
        '73130': { city: 'Oklahoma City', state: 'OK' },
        '73131': { city: 'Oklahoma City', state: 'OK' },
        '73132': { city: 'Oklahoma City', state: 'OK' },
        '73134': { city: 'Oklahoma City', state: 'OK' },
        '73135': { city: 'Oklahoma City', state: 'OK' },
        '73136': { city: 'Oklahoma City', state: 'OK' },
        '73137': { city: 'Oklahoma City', state: 'OK' },
        '73139': { city: 'Oklahoma City', state: 'OK' },
        '73140': { city: 'Oklahoma City', state: 'OK' },
        '73141': { city: 'Oklahoma City', state: 'OK' },
        '73142': { city: 'Oklahoma City', state: 'OK' },
        '73143': { city: 'Oklahoma City', state: 'OK' },
        '73144': { city: 'Oklahoma City', state: 'OK' },
        '73145': { city: 'Oklahoma City', state: 'OK' },
        '73146': { city: 'Oklahoma City', state: 'OK' },
        '73147': { city: 'Oklahoma City', state: 'OK' },
        '73148': { city: 'Oklahoma City', state: 'OK' },
        '73149': { city: 'Oklahoma City', state: 'OK' },
        '73150': { city: 'Oklahoma City', state: 'OK' },
        '73151': { city: 'Oklahoma City', state: 'OK' },
        '73152': { city: 'Oklahoma City', state: 'OK' },
        '73153': { city: 'Oklahoma City', state: 'OK' },
        '73154': { city: 'Oklahoma City', state: 'OK' },
        '73155': { city: 'Oklahoma City', state: 'OK' },
        '73156': { city: 'Oklahoma City', state: 'OK' },
        '73157': { city: 'Oklahoma City', state: 'OK' },
        '73159': { city: 'Oklahoma City', state: 'OK' },
        '73160': { city: 'Oklahoma City', state: 'OK' },
        '73162': { city: 'Oklahoma City', state: 'OK' },
        '73163': { city: 'Oklahoma City', state: 'OK' },
        '73164': { city: 'Oklahoma City', state: 'OK' },
        '73165': { city: 'Oklahoma City', state: 'OK' },
        '73167': { city: 'Oklahoma City', state: 'OK' },
        '73169': { city: 'Oklahoma City', state: 'OK' },
        '73170': { city: 'Oklahoma City', state: 'OK' },
        '73172': { city: 'Oklahoma City', state: 'OK' },
        '73173': { city: 'Oklahoma City', state: 'OK' },
        '73178': { city: 'Oklahoma City', state: 'OK' },
        '73179': { city: 'Oklahoma City', state: 'OK' },
        '73184': { city: 'Oklahoma City', state: 'OK' },
        '73185': { city: 'Oklahoma City', state: 'OK' },
        '73189': { city: 'Oklahoma City', state: 'OK' },
        '73190': { city: 'Oklahoma City', state: 'OK' },
        '73194': { city: 'Oklahoma City', state: 'OK' },
        '73195': { city: 'Oklahoma City', state: 'OK' },
        '73196': { city: 'Oklahoma City', state: 'OK' },
        '90001': { city: 'Los Angeles', state: 'CA' },
        '90002': { city: 'Los Angeles', state: 'CA' },
        '90003': { city: 'Los Angeles', state: 'CA' },
        '90004': { city: 'Los Angeles', state: 'CA' },
        '90005': { city: 'Los Angeles', state: 'CA' },
        '94102': { city: 'San Francisco', state: 'CA' },
        '94103': { city: 'San Francisco', state: 'CA' },
        '94104': { city: 'San Francisco', state: 'CA' },
        '94105': { city: 'San Francisco', state: 'CA' },
        '94107': { city: 'San Francisco', state: 'CA' },
        '10001': { city: 'New York', state: 'NY' },
        '10002': { city: 'New York', state: 'NY' },
        '10003': { city: 'New York', state: 'NY' },
        '10004': { city: 'New York', state: 'NY' },
        '10005': { city: 'New York', state: 'NY' },
        '60601': { city: 'Chicago', state: 'IL' },
        '60602': { city: 'Chicago', state: 'IL' },
        '60603': { city: 'Chicago', state: 'IL' },
        '60604': { city: 'Chicago', state: 'IL' },
        '60605': { city: 'Chicago', state: 'IL' },
        '33101': { city: 'Miami', state: 'FL' },
        '33102': { city: 'Miami', state: 'FL' },
        '33106': { city: 'Miami', state: 'FL' },
        '33109': { city: 'Miami', state: 'FL' },
        '33111': { city: 'Miami', state: 'FL' },
        '02108': { city: 'Boston', state: 'MA' },
        '02109': { city: 'Boston', state: 'MA' },
        '02110': { city: 'Boston', state: 'MA' },
        '02111': { city: 'Boston', state: 'MA' },
        '02112': { city: 'Boston', state: 'MA' },
        '98101': { city: 'Seattle', state: 'WA' },
        '98102': { city: 'Seattle', state: 'WA' },
        '98103': { city: 'Seattle', state: 'WA' },
        '98104': { city: 'Seattle', state: 'WA' },
        '98105': { city: 'Seattle', state: 'WA' },
        '80201': { city: 'Denver', state: 'CO' },
        '80202': { city: 'Denver', state: 'CO' },
        '80203': { city: 'Denver', state: 'CO' },
        '80204': { city: 'Denver', state: 'CO' },
        '80205': { city: 'Denver', state: 'CO' },
        '20001': { city: 'Washington', state: 'DC' },
        '20002': { city: 'Washington', state: 'DC' },
        '20003': { city: 'Washington', state: 'DC' },
        '20004': { city: 'Washington', state: 'DC' },
        '20005': { city: 'Washington', state: 'DC' },
        '30301': { city: 'Atlanta', state: 'GA' },
        '30302': { city: 'Atlanta', state: 'GA' },
        '30303': { city: 'Atlanta', state: 'GA' },
        '30304': { city: 'Atlanta', state: 'GA' },
        '30305': { city: 'Atlanta', state: 'GA' },
        '19019': { city: 'Philadelphia', state: 'PA' },
        '19101': { city: 'Philadelphia', state: 'PA' },
        '19102': { city: 'Philadelphia', state: 'PA' },
        '19103': { city: 'Philadelphia', state: 'PA' },
        '19104': { city: 'Philadelphia', state: 'PA' },
        '85001': { city: 'Phoenix', state: 'AZ' },
        '85002': { city: 'Phoenix', state: 'AZ' },
        '85003': { city: 'Phoenix', state: 'AZ' },
        '85004': { city: 'Phoenix', state: 'AZ' },
        '85005': { city: 'Phoenix', state: 'AZ' }
    };

    // Initialize widget
    function initWidget() {
        // Get DOM elements
        zipcodeInput = document.getElementById('zipcode-input');
        addressInput = document.getElementById('address-input');
        nameInput = document.getElementById('name-input');
        phoneInput = document.getElementById('phone-input');
        submitBtn = document.getElementById('submit-btn');
        zipcodeGroup = document.querySelector('.zipcode-input');
        cityStateDisplay = document.querySelector('.city-state-display');
        cityStateText = document.getElementById('city-state-display');
        addressGroup = document.querySelector('.address-input');
        nameGroup = document.querySelector('.name-input');
        phoneGroup = document.querySelector('.phone-input');
        widgetForm = document.querySelector('.widget-form');
        
        if (!zipcodeInput) {
            console.error('ZIP code input not found');
            return;
        }
        
        // Set up event listeners
        submitBtn.addEventListener('click', handleSubmit);
        zipcodeInput.addEventListener('focus', handleZipFocus);
        
        // Add pin icon to zipcode input
        const pinIcon = document.createElement('span');
        pinIcon.className = 'pin-icon';
        pinIcon.innerHTML = '📍';
        zipcodeGroup.insertBefore(pinIcon, zipcodeInput);
        
        // Add close icon to zipcode input
        const closeIcon = document.createElement('span');
        closeIcon.className = 'close-icon';
        closeIcon.innerHTML = '✕';
        closeIcon.addEventListener('click', clearZipcode);
        zipcodeGroup.appendChild(closeIcon);
        
        // Listen for zipcode input changes
        zipcodeInput.addEventListener('input', function(e) {
            const zipcode = e.target.value.trim();
            
            // Show/hide close icon
            if (zipcode !== '') {
                zipcodeGroup.classList.add('has-value');
            } else {
                zipcodeGroup.classList.remove('has-value');
            }
            
            // Auto-check zipcode when 5 digits are entered
            if (zipcode.length === 5 && /^\d{5}$/.test(zipcode)) {
                lookupZipCode(zipcode);
            }
        });
        
        // Format phone number as user types
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
        
        console.log('Widget initialized');
    }

    // Handle ZIP code field focus
    function handleZipFocus() {
        zipcodeInput.select();
    }
    
    // Clear ZIP code and reset form
    function clearZipcode() {
        zipcodeInput.value = '';
        zipcodeGroup.classList.remove('has-value');
        
        // Reset form to initial state
        resetForm();
        
        // Focus the zipcode input
        zipcodeInput.focus();
    }
    
    // Reset form to initial state
    function resetForm() {
        formState = 'zipcode';
        
        // Hide city/state display
        cityStateDisplay.classList.remove('visible');
        setTimeout(() => {
            cityStateDisplay.classList.add('hidden');
        }, 300);
        
        // Hide address field
        addressGroup.classList.remove('visible');
        setTimeout(() => {
            addressGroup.classList.add('hidden');
        }, 300);
        
        // Hide name and phone fields
        nameGroup.classList.remove('visible');
        phoneGroup.classList.remove('visible');
        setTimeout(() => {
            nameGroup.classList.add('hidden');
            phoneGroup.classList.add('hidden');
        }, 300);
        
        // Reset address field
        addressInput.value = '';
        addressGroup.classList.remove('has-value');
        
        // Reset button text
        submitBtn.textContent = 'SEE MY PRICE';
    }
    
    // Look up ZIP code and show city/state
    function lookupZipCode(zipcode) {
        // Check if zipcode exists in our database
        if (zipCodeDatabase[zipcode]) {
            const { city, state } = zipCodeDatabase[zipcode];
            
            // Show city and state
            cityStateText.textContent = `${city}, ${state}`;
            cityStateDisplay.classList.remove('hidden');
            setTimeout(() => {
                cityStateDisplay.classList.add('visible');
            }, 10);
            
            // Show address field
            addressGroup.classList.remove('hidden');
            setTimeout(() => {
                addressGroup.classList.add('visible');
                
                // Focus the address input
                addressInput.focus();
            }, 10);
            
            // Update form state
            formState = 'address';
            
            // Update button text
            submitBtn.textContent = 'NEXT';
        } else {
            // Show error for invalid ZIP code
            zipcodeInput.style.borderBottom = '2px solid var(--orange)';
            setTimeout(() => {
                zipcodeInput.style.borderBottom = '';
            }, 2000);
        }
    }
    
    // Format phone number as user types (US format: XXX-XXX-XXXX)
    function formatPhoneNumber(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `${value}`;
            } else if (value.length <= 6) {
                value = `${value.slice(0, 3)}-${value.slice(3)}`;
            } else {
                value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        input.value = value;
    }

    // Handle form submission based on current state
    function handleSubmit() {
        // Different behavior based on form state
        if (formState === 'zipcode') {
            const zipcode = zipcodeInput.value.trim();
            
            if (zipcode.length === 5 && /^\d{5}$/.test(zipcode)) {
                lookupZipCode(zipcode);
            } else {
                // Show error for invalid ZIP code
                zipcodeInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    zipcodeInput.style.borderBottom = '';
                }, 2000);
            }
        } 
        else if (formState === 'address') {
            const address = addressInput.value.trim();
            
            if (address) {
                // Switch to final view with all fields visible side by side
                showFinalView();
                
                // Update form state
                formState = 'details';
                
                // Update button text
                submitBtn.textContent = 'SEE MY PRICE';
                
                // Focus the name input
                nameInput.focus();
            } else {
                // Show error if address is empty
                addressInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    addressInput.style.borderBottom = '';
                }, 2000);
            }
        } 
        else if (formState === 'details') {
            // Validate all fields and submit
            const zipcode = zipcodeInput.value.trim();
            const address = addressInput.value.trim();
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            
            // Simple validation
            let isValid = true;
            
            if (!zipcode || zipcode.length !== 5 || !/^\d{5}$/.test(zipcode)) {
                zipcodeInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    zipcodeInput.style.borderBottom = '';
                }, 2000);
                isValid = false;
            }
            
            if (!address) {
                addressInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    addressInput.style.borderBottom = '';
                }, 2000);
                isValid = false;
            }
            
            if (!name) {
                nameInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    nameInput.style.borderBottom = '';
                }, 2000);
                isValid = false;
            }
            
            if (!phone) {
                phoneInput.style.borderBottom = '2px solid var(--orange)';
                setTimeout(() => {
                    phoneInput.style.borderBottom = '';
                }, 2000);
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Get city and state from zipcode
            const { city, state } = zipCodeDatabase[zipcode] || { city: '', state: '' };
            
            // Collect form data
            const formData = {
                zipcode,
                city,
                state,
                address,
                name,
                phone
            };
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Send data to webhook
            sendToWebhook(formData)
                .then(response => {
                    console.log('Form submitted successfully:', response);
                    
                    // Show success message
                    const widget = document.getElementById('address-widget');
                    widget.innerHTML = `
                        <div class="success-message">
                            <h2>Thank you!</h2>
                            <p>Your information has been submitted successfully.</p>
                            <p>We'll contact you shortly about service at:</p>
                            <p class="success-address">${address}</p>
                            <p class="success-address">${city}, ${state} ${zipcode}</p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SEE MY PRICE';
                    
                    // Show error message
                    alert('There was an error submitting your information. Please try again.');
                });
        }
    }
    
    // Show the final view with all fields side by side
    function showFinalView() {
        // Hide the city/state display
        cityStateDisplay.style.display = 'none';
        
        // Reset the form layout
        widgetForm.className = 'widget-form final-view';
        
        // Show all fields
        zipcodeGroup.style.display = 'none'; // Hide ZIP code field
        addressGroup.classList.remove('hidden');
        addressGroup.style.display = 'block';
        addressGroup.style.flex = '2';
        
        nameGroup.classList.remove('hidden');
        nameGroup.style.display = 'block';
        nameGroup.style.flex = '1';
        
        phoneGroup.classList.remove('hidden');
        phoneGroup.style.display = 'block';
        phoneGroup.style.flex = '1';
        
        // Add pin icon to address field if not already there
        if (!addressGroup.querySelector('.pin-icon')) {
            const pinIcon = document.createElement('span');
            pinIcon.className = 'pin-icon';
            pinIcon.innerHTML = '📍';
            addressGroup.insertBefore(pinIcon, addressInput);
        }
    }

    // Send form data to webhook
    async function sendToWebhook(formData) {
        try {
            // Load config to get webhook URL
            const config = await window.loadConfig();
            const webhookUrl = config.webhookUrl;
            
            if (!webhookUrl) {
                throw new Error('Webhook URL not found in configuration');
            }
            
            // Send data to webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error sending data to webhook:', error);
            throw error;
        }
    }

    // Create embeddable version of the widget
    function createEmbeddableWidget() {
        // This function would be called when the script is loaded on an external site
        const container = document.getElementById('address-widget-container');
        if (container) {
            // Clone the widget HTML structure
            const widgetHTML = `
                <div class="widget-header">
                    <h2>Get a quick and easy price:</h2>
                </div>
                <div id="address-widget" class="widget-embedded">
                    <div class="widget-form">
                        <div class="input-group zipcode-input">
                            <label for="zipcode-input">Enter your ZIP code</label>
                            <input type="text" id="zipcode-input" placeholder="Enter ZIP code..." maxlength="5" autocomplete="off">
                        </div>
                        <div class="input-group city-state-display hidden">
                            <div class="city-state-text">
                                <span id="city-state-display"></span>
                            </div>
                        </div>
                        <div class="input-group address-input hidden">
                            <label for="address-input">Enter your street address</label>
                            <input type="text" id="address-input" placeholder="1234 Main Street..." autocomplete="off">
                        </div>
                        <div class="input-group name-input hidden">
                            <label for="name-input">Name</label>
                            <input type="text" id="name-input" placeholder="Jane Smith">
                        </div>
                        <div class="input-group phone-input hidden">
                            <label for="phone-input">Phone*</label>
                            <input type="tel" id="phone-input" placeholder="555-555-5555">
                        </div>
                        <button id="submit-btn" class="submit-btn">SEE MY PRICE</button>
                    </div>
                    <div class="info-text">
                        <span>🔒 Your information is secure.</span>
                    </div>
                </div>
            `;
            
            container.innerHTML = widgetHTML;
            
            // Re-initialize the widget
            initWidget();
        }
    }

    // Initialize the widget when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Check if this is being loaded as an embedded widget
        if (document.getElementById('address-widget-container')) {
            createEmbeddableWidget();
        } else {
            // Initialize the widget on the demo page
            initWidget();
        }
    });
})();
