const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let lines = html.split('\n');

// Extract lines 224 to 408
let stepsHtml = lines.slice(223, 408).join('\n');

// Convert HTML to JSX
stepsHtml = stepsHtml.replace(/class=/g, 'className=');
stepsHtml = stepsHtml.replace(/for=/g, 'htmlFor=');
stepsHtml = stepsHtml.replace(/<!--/g, '{/*');
stepsHtml = stepsHtml.replace(/-->/g, '*/}');

// Close self-closing tags
stepsHtml = stepsHtml.replace(/<input([^>]*?)>/g, (match, p1) => {
    if(p1.endsWith('/')) return match;
    return `<input${p1} />`;
});

// Convert style="prop: val; prop2: val" to style={{ prop: 'val', prop2: 'val' }}
stepsHtml = stepsHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
    if (!styleString.trim()) return `style={{}}`;
    const props = styleString.split(';').filter(s => s.trim() !== '');
    const styleObj = {};
    props.forEach(p => {
        let [key, ...valParts] = p.split(':');
        let val = valParts.join(':'); // Re-join in case of url()
        if (key && val) {
            // camelCase the key
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            styleObj[key] = val.trim();
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

fs.writeFileSync('converted_steps.jsx', stepsHtml);
console.log("Converted steps written to converted_steps.jsx");
