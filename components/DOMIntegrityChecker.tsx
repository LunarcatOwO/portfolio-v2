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
            // Store the initial DOM structure after a longer delay to allow Next.js hydration and initial animations
            setTimeout(() => {
              const originalStructure = captureProtectedStructure();
              
              // Check every 3 seconds for unauthorized structural changes
              setInterval(() => {
                const currentStructure = captureProtectedStructure();
                if (currentStructure !== originalStructure) {
                  console.warn('Unauthorized DOM modification detected. Reverting...');
                  location.reload();
                }
              }, 3000);
            }, 2000);
          }
          
          function captureProtectedStructure() {
            const clone = document.documentElement.cloneNode(true);
            
            // Remove scripts and styles completely
            clone.querySelectorAll('script, style').forEach(el => el.remove());
            
            // Process all elements to normalize them
            clone.querySelectorAll('*').forEach(el => {
              // Remove ALL attributes except structural ones
              const keepAttributes = ['id', 'role', 'type', 'href', 'src', 'alt', 'name'];
              const attrs = Array.from(el.attributes);
              attrs.forEach(attr => {
                if (!keepAttributes.includes(attr.name) && !attr.name.startsWith('data-')) {
                  el.removeAttribute(attr.name);
                }
              });
              
              // Remove all inline styles
              el.removeAttribute('style');
              
              // Remove all classes (animations change these constantly)
              el.removeAttribute('class');
              
              // Remove all dynamic data attributes
              const dynamicDataAttrs = [
                'data-state',
                'data-focused',
                'data-hover',
                'data-active',
                'data-headlessui-state',
                'data-open',
                'data-closed',
                'data-enter',
                'data-leave'
              ];
              dynamicDataAttrs.forEach(attr => el.removeAttribute(attr));
              
              // Normalize form elements
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.removeAttribute('value');
                el.removeAttribute('checked');
                if (el.value !== undefined) el.value = '';
              }
            });
            
            // Only return the structure (tag hierarchy and text content)
            return getStructureSignature(clone);
          }
          
          function getStructureSignature(node) {
            // Create a simplified signature of the DOM structure
            let signature = '';
            
            function traverse(el, depth) {
              if (el.nodeType === 1) { // Element node
                const tag = el.tagName.toLowerCase();
                const id = el.getAttribute('id') || '';
                const role = el.getAttribute('role') || '';
                
                // Only track structural elements and their IDs/roles
                signature += depth + ':' + tag + (id ? '#' + id : '') + (role ? '[' + role + ']' : '') + '\\n';
                
                Array.from(el.children).forEach(child => {
                  traverse(child, depth + 1);
                });
              } else if (el.nodeType === 3) { // Text node
                const text = el.textContent?.trim();
                if (text && text.length > 0 && !text.match(/^\\s*$/)) {
                  signature += depth + ':TEXT:' + text.substring(0, 50) + '\\n';
                }
              }
            }
            
            traverse(node, 0);
            return signature;
          }
        })();
      `}
    </Script>
  );
}
