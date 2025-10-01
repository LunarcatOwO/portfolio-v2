// Portfolio Of LunarcatOwO
// Copyright (C) 2025  LunarcatOwO

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Script from "next/script";

export default function DOMIntegrityChecker() {
  return (
    <Script id="dom-integrity-checker" strategy="afterInteractive">
      {`
        (function() {
          // Wait for DOM to be fully loaded
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOMProtection);
          } else {
            initDOMProtection();
          }
          
          function initDOMProtection() {
            // Store the initial DOM structure after a delay to allow Next.js hydration
            setTimeout(() => {
              const originalStructure = captureProtectedStructure();
              
              // Check every 2 seconds for unauthorized structural changes
              setInterval(() => {
                const currentStructure = captureProtectedStructure();
                if (currentStructure !== originalStructure) {
                  console.warn('Unauthorized DOM modification detected. Reverting...');
                  location.reload();
                }
              }, 2000);
            }, 3000);
          }
          
          function captureProtectedStructure() {
            const clone = document.body.cloneNode(true);
            
            // Remove elements that are explicitly marked as dynamic
            const dynamicSelectors = [
              '[data-dynamic]',
              '[data-allow-changes]',
              '[data-user-content]',
              'input',
              'textarea',
              'select',
              '[contenteditable="true"]',
              'script',
              'style'
            ];
            
            dynamicSelectors.forEach(selector => {
              clone.querySelectorAll(selector).forEach(el => el.remove());
            });
            
            // Get all text content and structure
            return getDetailedSignature(clone);
          }
          
          function getDetailedSignature(element) {
            let signature = '';
            
            function traverse(node, depth) {
              if (node.nodeType === 1) { // Element node
                const tag = node.tagName.toLowerCase();
                
                // Skip elements that change during animations
                const skipClasses = node.className && typeof node.className === 'string' ? 
                  node.className.includes('motion') || 
                  node.className.includes('animate') ||
                  node.className.includes('transition') : false;
                
                if (!skipClasses) {
                  // Track element type and ID
                  const id = node.id ? '#' + node.id : '';
                  signature += depth + ':' + tag + id + '\\n';
                }
                
                // Traverse children
                Array.from(node.childNodes).forEach(child => {
                  traverse(child, depth + 1);
                });
                
              } else if (node.nodeType === 3) { // Text node
                const text = node.textContent?.trim();
                // Only track non-empty text
                if (text && text.length > 0) {
                  signature += depth + ':TEXT:' + text + '\\n';
                }
              }
            }
            
            traverse(element, 0);
            return signature;
          }
        })();
      `}
    </Script>
  );
}
