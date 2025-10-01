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
            // Store the initial DOM structure after a short delay to allow Next.js hydration
            setTimeout(() => {
              const originalHTML = captureProtectedHTML();
              
              // Check every 2 seconds for unauthorized changes
              setInterval(() => {
                const currentHTML = captureProtectedHTML();
                if (currentHTML !== originalHTML) {
                  console.warn('Unauthorized DOM modification detected. Reverting...');
                  location.reload();
                }
              }, 2000);
            }, 1000);
          }
          
          function captureProtectedHTML() {
            const clone = document.documentElement.cloneNode(true);
            
            // Remove elements that should be ignored (dynamic content, user input, etc.)
            const elementsToIgnore = [
              'input[type="text"]',
              'input[type="password"]',
              'input[type="email"]',
              'textarea',
              'select',
              '[contenteditable="true"]',
              '[data-dynamic]',
              '[data-user-content]',
              'script',
              'style'
            ];
            
            elementsToIgnore.forEach(selector => {
              clone.querySelectorAll(selector).forEach(el => {
                // Remove dynamic elements from the snapshot
                if (selector === 'script' || selector === 'style') {
                  el.remove();
                } else {
                  // For input elements, normalize their values
                  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                    el.removeAttribute('value');
                    el.value = '';
                  }
                }
              });
            });
            
            // Remove dynamic attributes that change during user interaction
            const dynamicAttributes = [
              'data-state',
              'data-focused',
              'data-hover',
              'data-active',
              'aria-expanded',
              'aria-hidden',
              'aria-selected',
              'class' // Classes can change for animations, hover states, etc.
            ];
            
            clone.querySelectorAll('*').forEach(el => {
              dynamicAttributes.forEach(attr => {
                el.removeAttribute(attr);
              });
              
              // Remove inline styles that might change
              el.removeAttribute('style');
            });
            
            return clone.innerHTML;
          }
        })();
      `}
    </Script>
  );
}
