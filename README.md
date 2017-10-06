# amp-viewer

`<amp-viewer>` is a vanilla custom element that loads an AMP document into a shadow root on your page. Shadow DOM ensures styles of the AMP document are encapsulated, and it is lighter than embedding an iframe.

## Demo

```html
<amp-viewer src="demo/sample-content/experience-daydream-today.html"></amp-viewer>
```

## API

Property | Description
---------|------------
src | The URL of an AMP article. If it's on a different domain, it must be CORS enabled (as it will be fetched by XHR).
