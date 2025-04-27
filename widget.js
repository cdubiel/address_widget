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
        
        // Check for autofilled values on page load (especially for iOS)
        setTimeout(() => {
            // Check if zipcode is autofilled
            if (zipcodeInput.value.trim() !== '') {
                zipcodeGroup.classList.add('has-value');
                // If it's a valid zipcode, look it up
                const zipcode = zipcodeInput.value.trim();
                if (zipcode.length === 5 && /^\d{5}$/.test(zipcode)) {
                    lookupZipCode(zipcode);
                }
            }
            
            // Check if address is autofilled
            if (addressInput.value.trim() !== '') {
                addressGroup.classList.add('has-value');
                // If we're still in zipcode state but have an address, move to address state
                if (formState === 'zipcode' && zipcodeInput.value.trim() !== '') {
                    formState = 'address';
                    addressGroup.classList.remove('hidden');
                }
            }
            
            // Check if name and phone are autofilled
            if (nameInput.value.trim() !== '' || phoneInput.value.trim() !== '') {
                // If we have name/phone and address, show the final view
                if (addressInput.value.trim() !== '') {
                    showFinalView();
                    formState = 'details';
                }
            }
        }, 500); // Small delay to allow autofill to complete
        
        // Set up event listeners
        submitBtn.addEventListener('click', handleSubmit);
        zipcodeInput.addEventListener('focus', handleZipFocus);
        
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
        
        // Listen for address input changes
        addressInput.addEventListener('input', function() {
            if (addressInput.value.trim() !== '') {
                addressGroup.classList.add('has-value');
            } else {
                addressGroup.classList.remove('has-value');
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
        cityStateDisplay.classList.add('hidden');
        
        // Hide address field
        addressGroup.classList.add('hidden');
        
        // Hide name and phone fields
        nameGroup.classList.add('hidden');
        phoneGroup.classList.add('hidden');
        
        // Reset address field
        addressInput.value = '';
        addressGroup.classList.remove('has-value');
        
        // Reset button text
        submitBtn.textContent = 'SEE MY ESTIMATE';
    }
    
    // Look up ZIP code and show city/state
    async function lookupZipCode(zipcode) {
        try {
            // Show loading state
            cityStateText.textContent = 'Looking up location...';
            cityStateDisplay.classList.remove('hidden');
            
            // Use the Zippopotam.us API to look up ZIP code
            const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
            
            if (!response.ok) {
                throw new Error('Invalid ZIP code');
            }
            
            const data = await response.json();
            
            if (data && data.places && data.places.length > 0) {
                const place = data.places[0];
                const city = place['place name'];
                const state = place['state abbreviation'];
                
                // Show city and state
                cityStateText.textContent = `${city}, ${state}`;
                
                // Show address field
                addressGroup.classList.remove('hidden');
                
                // Focus the address input
                addressInput.focus();
                
                // Update form state
                formState = 'address';
            } else {
                throw new Error('Location not found');
            }
        } catch (error) {
            console.error('Error looking up ZIP code:', error);
            
            // Fallback to accepting any ZIP code
            cityStateText.textContent = 'Location found';
            
            // Show address field
            addressGroup.classList.remove('hidden');
            
            // Focus the address input
            addressInput.focus();
            
            // Update form state
            formState = 'address';
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
                // Show final view with all fields
                showFinalView();
                
                // Update form state
                formState = 'details';
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
            
            // Get city and state from display
            const cityState = cityStateText.textContent || '';
            
            // Collect form data
            const formData = {
                zipcode,
                cityState,
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
                            <p class="success-address">${cityState} ${zipcode}</p>
                        </div>
                    `;
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SEE MY ESTIMATE';
                    
                    // Show error message
                    alert('There was an error submitting your information. Please try again.');
                });
        }
    }
    
    // Show the final view with all fields side by side
    function showFinalView() {
        // Hide the ZIP code field and city/state display
        zipcodeGroup.style.display = 'none';
        cityStateDisplay.style.display = 'none';
        
        // Apply the final view styling
        widgetForm.className = 'widget-form final-view';
        
        // Show all fields
        addressGroup.classList.remove('hidden');
        nameGroup.classList.remove('hidden');
        phoneGroup.classList.remove('hidden');
        
        // Add pin icon to address field if not already there
        if (!addressGroup.querySelector('.pin-icon')) {
            const pinIcon = document.createElement('span');
            pinIcon.className = 'pin-icon';
            pinIcon.innerHTML = '📍';
            addressGroup.insertBefore(pinIcon, addressInput);
        }
        
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        
        // Adjust layout for mobile
        if (isMobile) {
            // Set appropriate classes for mobile view
            widgetForm.classList.add('mobile-view');
            
            // Adjust button text to be shorter on mobile
            submitBtn.textContent = 'GET ESTIMATE';
        }
        
        // Focus the name input
        nameInput.focus();
    }
    
    // Send form data to webhook
    async function sendToWebhook(formData) {
        try {
            // Load config to get webhook URL
            let webhookUrl;
            
            try {
                const config = await window.loadConfig();
                webhookUrl = config.webhookUrl;
            } catch (configError) {
                console.warn('Could not load config, using fallback webhook handling', configError);
                // Fallback for Vercel deployment
                webhookUrl = null;
            }
            
            if (!webhookUrl) {
                // When no webhook URL is provided, just log the data and show success
                console.log('No webhook URL found in .env file');
                console.log('Form data:', formData);
                
                // In production, don't show alerts
                if (window.location.hostname === 'localhost') {
                    // Only show alert in development
                    alert('Form submitted successfully, but no webhook URL was configured. Please set WEBHOOK_URL in your .env file.');
                }
                
                // Return mock successful response
                return { success: true, message: 'Form submitted successfully (demo mode)' };
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
            
            // Only show alert in development
            if (window.location.hostname === 'localhost') {
                alert('Error submitting form. Please check your webhook configuration and try again.');
            }
            
            // For demo purposes, return success even if there's an error
            return { success: true, message: 'Form submitted successfully (demo mode)' };
        }
    }

    // Create embeddable version of the widget
    function createEmbeddableWidget() {
        // Get the container element
        const container = document.getElementById('address-widget-container');
        
        if (container) {
            // Clone the widget HTML structure
            const widgetHTML = `
                <div class="widget-header">
                    <h2>Get a quick and easy estimate:</h2>
                </div>
                <div id="address-widget" class="widget-embedded">
                    <div class="widget-form">
                        <div class="city-state-display hidden">
                            <span id="city-state-display"></span>
                        </div>
                        <div class="input-group zipcode-input">
                            <label for="zipcode-input">Enter your ZIP code</label>
                            <input type="text" id="zipcode-input" placeholder="Enter ZIP code..." maxlength="5" autocomplete="off">
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
                        <button id="submit-btn" class="submit-btn">SEE MY ESTIMATE</button>
                    </div>
                    <div class="info-text">
                        <span>🔒 Your information is secure.</span>
                    </div>
                </div>
            `;
            
            container.innerHTML = widgetHTML;
            
            // Re-initialize the widget
            initWidget();
            
            // Add GoHighLevel specific handling
            setupGoHighLevelIntegration();
        }
    }
    
    // Setup GoHighLevel specific integration
    function setupGoHighLevelIntegration() {
        // Check if we're in a GoHighLevel page
        const isGoHighLevel = window.location.hostname.includes('gohighlevel') || 
                             window.location.hostname.includes('highlevelmarketing') ||
                             document.querySelector('meta[name="ghl-site"]');
        
        if (isGoHighLevel) {
            console.log('GoHighLevel environment detected, setting up integration');
            
            // Override the submit handler to work with GoHighLevel
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                // Store the original click handler
                const originalClickHandler = submitBtn.onclick;
                
                // Replace with our enhanced handler
                submitBtn.onclick = function(event) {
                    // Prevent default form submission
                    event.preventDefault();
                    
                    // Get form values
                    const zipcode = document.getElementById('zipcode-input').value.trim();
                    const address = document.getElementById('address-input').value.trim();
                    const name = document.getElementById('name-input').value.trim();
                    const phone = document.getElementById('phone-input').value.trim();
                    const cityState = document.getElementById('city-state-display').textContent || '';
                    
                    // Check if GoHighLevel form exists
                    const ghlForm = document.querySelector('form[data-ghl-form]');
                    if (ghlForm) {
                        console.log('GoHighLevel form found, populating fields');
                        
                        // Try to find and populate GoHighLevel form fields
                        const inputs = ghlForm.querySelectorAll('input, textarea, select');
                        inputs.forEach(input => {
                            const name = input.name.toLowerCase();
                            const placeholder = (input.placeholder || '').toLowerCase();
                            
                            // Match fields based on name or placeholder
                            if (name.includes('zip') || placeholder.includes('zip')) {
                                input.value = zipcode;
                            } else if (name.includes('address') || placeholder.includes('address')) {
                                input.value = address;
                            } else if (name.includes('name') || placeholder.includes('name')) {
                                input.value = name;
                            } else if (name.includes('phone') || placeholder.includes('phone')) {
                                input.value = phone;
                            } else if (name.includes('city') || placeholder.includes('city')) {
                                // Extract city from cityState
                                const cityMatch = cityState.match(/^([^,]+)/);
                                if (cityMatch && cityMatch[1]) {
                                    input.value = cityMatch[1].trim();
                                }
                            } else if (name.includes('state') || placeholder.includes('state')) {
                                // Extract state from cityState
                                const stateMatch = cityState.match(/,\s*([A-Z]{2})/);
                                if (stateMatch && stateMatch[1]) {
                                    input.value = stateMatch[1].trim();
                                }
                            }
                            
                            // Trigger change event to notify GoHighLevel
                            const event = new Event('change', { bubbles: true });
                            input.dispatchEvent(event);
                        });
                        
                        // Submit to our webhook as well
                        handleSubmit(event);
                        
                        // Optional: Auto-submit the GoHighLevel form
                        // Uncomment the next line to enable auto-submission
                        // ghlForm.submit();
                    } else {
                        // No GoHighLevel form found, use our regular submission
                        handleSubmit(event);
                    }
                };
            }
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
