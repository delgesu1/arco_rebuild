// PDF Viewer module using PDF.js
(function(global) {
  // Configure PDF.js worker
  if (global.pdfjsLib) {
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.min.js";
  }

  // private state
  let pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 1.25,
      keyboardHandlerBound = null;

  function init(url) {
    pageNum = 1;
    scale = 1.25;

    // detach potential leftover handler first
    cleanup();

    global.pdfjsLib.getDocument(url).promise.then(function(pdf) {
      pdfDoc = pdf;
      const pageCountEl = document.getElementById('page-count');
      if (pageCountEl) pageCountEl.textContent = pdf.numPages;

      renderPage(pageNum);

      // controls
      const prev = document.getElementById('prev-page');
      const next = document.getElementById('next-page');
      const zoomIn = document.getElementById('zoom-in');
      const zoomOut = document.getElementById('zoom-out');

      if (prev) prev.addEventListener('click', onPrevPage);
      if (next) next.addEventListener('click', onNextPage);
      if (zoomIn) zoomIn.addEventListener('click', () => { scale += 0.25; renderPage(pageNum); });
      if (zoomOut) zoomOut.addEventListener('click', () => { if (scale > 0.5) { scale -= 0.25; renderPage(pageNum); } });

      keyboardHandlerBound = e => pdfKeyboardHandler(e);
      document.addEventListener('keydown', keyboardHandlerBound);
    }).catch(err => {
      console.error('Error loading PDF:', err);
      const pdfContainer = document.getElementById('pdf-container');
      if (pdfContainer) {
        pdfContainer.innerHTML = `<div style="padding:2rem;text-align:center;">Unable to load PDF. <a href="${url}" target="_blank">Download</a></div>`;
      }
    });
  }

  function cleanup() {
    if (keyboardHandlerBound) {
      document.removeEventListener('keydown', keyboardHandlerBound);
      keyboardHandlerBound = null;
    }
  }

  function renderPage(num) {
    if (!pdfDoc) return;
    pageRendering = true;

    const pdfContainer = document.getElementById('pdf-container');
    const canvas = document.getElementById('pdf-canvas');
    if (!canvas || !pdfContainer) return;
    pdfContainer.style.position = 'relative';

    let loading = document.getElementById('pdf-loading');
    if (!loading) {
      loading = document.createElement('div');
      loading.id = 'pdf-loading';
      loading.textContent = 'Loading page...';
      Object.assign(loading.style, {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'rgba(0,0,0,0.7)', color:'#fff', padding:'10px 20px', borderRadius:'4px', zIndex:'1000'
      });
      pdfContainer.appendChild(loading);
    } else {
      loading.style.display = 'block';
    }

    pdfDoc.getPage(num).then(page => {
      const pdfContainerWidth = pdfContainer.clientWidth - 40;
      const rawViewport = page.getViewport({ scale: 1 });
      const widthScale = pdfContainerWidth / rawViewport.width;
      const viewport = page.getViewport({ scale: scale * widthScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderCtx = { canvasContext: canvas.getContext('2d'), viewport };
      return page.render(renderCtx).promise;
    }).then(() => {
      pageRendering = false;
      const loading = document.getElementById('pdf-loading');
      if (loading) loading.style.display = 'none';
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    }).catch(err => {
      console.error('Render error', err);
      const loading = document.getElementById('pdf-loading');
      if (loading) loading.style.display = 'none';
      pageRendering = false;
    });

    const numEl = document.getElementById('page-num');
    if (numEl) numEl.textContent = num;
  }

  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }
  function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  }
  function onNextPage() {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  }

  function pdfKeyboardHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      onNextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      onPrevPage();
    } else if (e.key === '+') {
      if (scale < 3) { scale += 0.25; renderPage(pageNum);} }
    else if (e.key === '-') {
      if (scale > 0.5) { scale -= 0.25; renderPage(pageNum);} }
    else if (e.key === 'h' || e.key === '?') {
      const help = document.getElementById('pdf-shortcuts-help');
      if (help) help.style.display = help.style.display === 'none' ? 'flex' : 'none';
      else createHelp();
    }
  }

  function createHelp() {
    const pdfContainer = document.getElementById('pdf-container');
    if (!pdfContainer) return;
    const helpDiv = document.createElement('div');
    helpDiv.id = 'pdf-shortcuts-help';
    helpDiv.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-on-surface);padding:20px;border-radius:8px;z-index:2000;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;flex-direction:column;gap:10px;max-width:400px;';
    helpDiv.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><h3 style="margin:0;">Keyboard Shortcuts</h3><button id="pdf-help-close" style="background:none;border:none;cursor:pointer;color:var(--md-sys-color-on-surface);"><i class="fas fa-times"></i></button></div><hr style="border-color:var(--md-sys-color-outline-variant);margin:0;"><div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;"><span><kbd>←</kbd> or <kbd>PageUp</kbd></span><span>Previous page</span><span><kbd>→</kbd> or <kbd>PageDown</kbd></span><span>Next page</span><span><kbd>+</kbd></span><span>Zoom in</span><span><kbd>-</kbd></span><span>Zoom out</span><span><kbd>h</kbd> or <kbd>?</kbd></span><span>Show/hide this help</span></div>`;
    pdfContainer.appendChild(helpDiv);
    const closeBtn = helpDiv.querySelector('#pdf-help-close');
    if (closeBtn) closeBtn.addEventListener('click', () => { helpDiv.style.display = 'none'; });
  }

  global.PDFViewer = { init, cleanup };
})(window);
