# Embeddable Address Collection Widget

A beautiful, reactive address collection widget that can be embedded on WordPress sites. The widget features a pill-shaped design with a two-stage form: first showing just the address field, then expanding to show all fields after an address is entered.

## Features

- Two-stage form process:
  1. First stage: Just address field with autocomplete
  2. Second stage: Expanded form with address, name, and phone fields
- Google Maps Places API integration for address autocomplete
- Responsive design that works on all devices
- Orange "SEE MY PRICE" call-to-action button
- Easy to embed on WordPress or any website
- Phone number formatting as the user types

## How to Use

### Local Testing

1. Clone this repository
2. Replace `YOUR_API_KEY` in the index.html file with your Google Maps API key
3. Open `index.html` in your browser to see the widget in action

### Embedding on WordPress

To embed this widget on your WordPress site, add the following code to your page or post:

```html
<div id="address-widget-container"></div>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
<script src="https://your-domain.com/widget.js"></script>
<link rel="stylesheet" href="https://your-domain.com/styles.css">
```

Replace `YOUR_API_KEY` with your actual Google Maps API key and `https://your-domain.com/` with the actual URL where you host these files.

## Google Maps API Integration

The widget uses the Google Maps Places API for address autocomplete. To use this feature:

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API in your Google Cloud Console
3. Replace `YOUR_API_KEY` in the HTML files with your actual API key

The widget includes a fallback autocomplete system that will be used if the Google Maps API fails to load.

## Customization

You can customize the widget by modifying the CSS in `styles.css`. The primary color is currently set to orange (#FF8C38), but you can change this to match your brand.

## Files

- `index.html` - Demo page with the widget
- `styles.css` - Styling for the widget
- `widget.js` - JavaScript functionality for the widget

## License

MIT 
# address_widget

 
