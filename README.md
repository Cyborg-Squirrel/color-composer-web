# Color Composer Web 

## Description 

Color Composer Web is a front‑end for [Color Composer](https://github.com/Cyborg-Squirrel/color-composer). Built with React using the react‑router library, it provides a web interface to configure light effects on WS2812/NeoPixel LED strips.

## Requirements 

    Node.js 20 or newer
    
## Installation 

1. Install dependencies

`npm install`

2. Configure the backend URL

Create a .env file in the project root and add the backend url.

`VITE_API_URL=http://localhost:8080`

3. Start the development server
`npm run dev`

Optional: `npm run dev:host` to expose the Node instance to the network.
Or build for production `npm run build`
 
The dev server runs on http://localhost:5173 (default Vite port). Open that URL in a browser to start using the app.

## Contributing 

* Create a pull request
* Explain your changes
* The GitHub workflow must pass
 
