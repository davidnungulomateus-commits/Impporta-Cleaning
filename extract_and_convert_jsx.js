const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Extract the sections
const startRegex = /<!-- Hero -->/;
const endRegex = /<!-- Footer -->/;
const matchStart = html.match(startRegex);
const matchEnd = html.match(endRegex);

if (matchStart && matchEnd) {
    let bodyHtml = html.substring(matchStart.index, matchEnd.index);

    // Convert HTML to JSX
    bodyHtml = bodyHtml.replace(/class=/g, 'className=');
    bodyHtml = bodyHtml.replace(/for=/g, 'htmlFor=');
    bodyHtml = bodyHtml.replace(/<!--/g, '{/*');
    bodyHtml = bodyHtml.replace(/-->/g, '*/}');
    
    // Close self-closing tags (inputs, imgs, hr, br)
    bodyHtml = bodyHtml.replace(/<input([^>]+?)>/g, (match, p1) => {
        if(p1.endsWith('/')) return match;
        return `<input${p1} />`;
    });
    bodyHtml = bodyHtml.replace(/<img([^>]+?)>/g, (match, p1) => {
        if(p1.endsWith('/')) return match;
        return `<img${p1} />`;
    });
    
    // Convert style strings to objects is too hard via regex. I will just remove the style attributes or convert simple ones manually.
    // Instead of complex regex for styles, I'll write the boilerplate app/page.jsx and let the user see the visual structure.
    // Actually, there are a lot of inline styles. I will just write a simpler app/page.jsx that uses the old main HTML but without inline styles causing React errors.
    
    console.log("Extraction logic ready, but inline styles will break React. Let's do it manually instead to ensure quality.");
}
