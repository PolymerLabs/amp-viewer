/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(win) {
  'use strict';

  document.registerElement('amp-viewer', {
    prototype: {
      __proto__: HTMLElement.prototype,

      createdCallback: function() {
        this._amp = null;
        this._src = '';
        this._host = null;

        win.AMP_SHADOW = true;
        this._installScript('https://cdn.ampproject.org/shadow-v0.js');
        this._ampReadyPromise = new Promise(function(resolve) {
          (win.AMP = win.AMP || []).push(resolve);
        });

        if (this.hasAttribute('src')) {
          this.src = this.getAttribute('src');
        }
      },

      set src(src) {
        if (this._src === src) {
          return;
        }

        this._src = src;
        this._clear();
        if (!src) {
          this.removeAttribute('src');
        } else {
          this.setAttribute('src', src);
          this._loadDocument(src);
        }
      },

      get src() {
        return this._src;
      },

      attributeChangedCallback: function(name, old, value) {
        var desc = Object.getOwnPropertyDescriptor(this.__proto__, name);
        if (desc && desc.set != null) {
          this[name] = value;
        }
      },

      setVisibilityState: function(state) {
        if (this._amp) {
          this._amp.setVisibilityState(state);
        }
      },

      _clear: function() {
        if (this._amp) {
          this._amp.close();
          this._amp = null;
        }
        if (this._host) {
          this.removeChild(this._host);
          this._host = null;
        }
      },

      _loadDocument: function(src) {
        this._fetchDocument(src).then(function(doc) {
          this._ampReadyPromise.then(function(AMP) {
            this._host = win.document.createElement('div');
            this._host.classList.add('amp-doc-host');
            this.appendChild(this._host);
            this._amp = AMP.attachShadowDoc(this._host, doc, src);
          }.bind(this));
        }.bind(this));
      },

      _installScript: function(src) {
        var ownerDoc = this.ownerDocument;
        var el = ownerDoc.createElement('script');
        el.setAttribute('src', src);
        ownerDoc.head.appendChild(el);
      },

      _fetchDocument: function(src) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', src, true);
          xhr.responseType = 'document';
          xhr.setRequestHeader('Accept', 'text/html');
          xhr.onreadystatechange = function() {
            if (xhr.readyState < /* STATUS_RECEIVED */ 2) {
              return;
            }
            if (xhr.status < 100 || xhr.status > 599) {
              xhr.onreadystatechange = null;
              reject(new Error('Unknown HTTP status ${xhr.status}'));
              return;
            }
            if (xhr.readyState == /* COMPvarE */ 4) {
              if (xhr.responseXML) {
                resolve(xhr.responseXML);
              } else {
                reject(new Error('No xhr.responseXML'));
              }
            }
          };
          xhr.onerror = function() { reject(new Error('Network failure')) };
          xhr.onabort = function() { reject(new Error('Request aborted')) };
          xhr.send();
        });
      }
    }
  });

})(window);
