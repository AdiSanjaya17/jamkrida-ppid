import fs from 'node:fs';

async function main() {
  const res = await fetch('https://ppid.jamkridabali.co.id/');
  const html = await res.text();
  
  // Icon links
  const links = [...html.matchAll(/<link[^>]+>/gi)].map(m => m[0]);
  console.log("=== LINK TAGS WITH ICON ===");
  links.filter(l => /icon/i.test(l)).forEach(l => console.log(l));

  // Check header area
  const headerMatch = html.match(/<header[^>]*>[\s\S]*?<\/header>/i);
  if (headerMatch) {
    console.log("=== HEADER HTML ===");
    console.log(headerMatch[0]);
  } else {
    console.log("No <header> tag found directly");
  }

  // Check footer area
  const footerMatch = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    console.log("=== FOOTER HTML ===");
    console.log(footerMatch[0]);
  }
}

main().catch(console.error);
