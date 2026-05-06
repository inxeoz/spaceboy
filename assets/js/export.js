(function() {
  var S = window.__SPACEBOY__;
  if (!S) return;

  var closest = window._closest_;

  var collectTokens = function(el, color, lines) {
    if (el.nodeType === 3) {
      var text = el.textContent;
      if (text && lines.length) {
        var last = lines[lines.length - 1];
        last.text += text;
        last.tokens.push({ text: text, color: color || getComputedStyle(el.parentNode).color || '#ccc' });
      }
      return;
    }
    if (el.nodeType !== 1) return;
    var tokenColor = getComputedStyle(el).color;
    if (el.classList && el.classList.contains('line')) {
      lines.push({ text: '', tokens: [] });
    }
    for (var i = 0; i < el.childNodes.length; i++) {
      collectTokens(el.childNodes[i], tokenColor || color, lines);
    }
  };

  var codeBlockToSVG = function(codeEl) {
    var style = getComputedStyle(codeEl);
    var fontFamily = style.fontFamily.replace(/"/g, "'") || 'monospace';
    var fontSize = parseInt(style.fontSize) || 14;
    var lineHeight = fontSize * 1.6;
    var bg = getComputedStyle(document.querySelector('.post-content pre') || codeEl).backgroundColor || '#1e1e1e';
    var padding = 20;
    var lines = [];

    collectTokens(codeEl, '', lines);

    var maxLineLen = 0;
    lines.forEach(function(line) { maxLineLen = Math.max(maxLineLen, line.text.length); });

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = fontSize + 'px ' + fontFamily;
    var charWidth = ctx.measureText('x').width;
    var width = Math.max(400, charWidth * maxLineLen + padding * 2);
    var height = lines.length * lineHeight + padding * 2;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
      '<rect width="100%" height="100%" fill="' + bg + '"/>';

    lines.forEach(function(line, lineIdx) {
      var x = padding;
      var y = padding + lineIdx * lineHeight + fontSize;
      line.tokens.forEach(function(token) {
        var escaped = token.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        svg += '<text x="' + x + '" y="' + y + '" font-family="' + fontFamily + '" font-size="' + fontSize + '" fill="' + token.color + '">' + escaped + '</text>';
        x += ctx.measureText(token.text).width;
      });
    });

    return svg + '</svg>';
  };

  var openExport = function(svgContent) {
    var win = window.open('', '_blank');
    var doc = win.document;
    doc.write('<!doctype html><meta charset=utf-8><title>Export</title><style>' +
      '*{margin:0}body{background:#111;display:flex;flex-direction:column;min-height:100vh}' +
      '.toolbar{display:flex;gap:6px;padding:8px 12px;background:#1a1a1a;position:sticky;top:0}' +
      '.toolbar button{padding:6px 12px;border:1px solid #333;border-radius:4px;background:#222;color:#ddd;font:12px system-ui;cursor:pointer}' +
      '.toolbar button:hover{background:#333}' +
      '.preview{flex:1;display:flex;align-items:center;justify-content:center;padding:20px}' +
      '.preview svg{max-width:100%;height:auto;display:block}' +
      '</style><div class=toolbar>' +
      '<button id=downloadSvg>Download SVG</button>' +
      '<button id=downloadPng>Download PNG</button>' +
      '</div><div class=preview>' + svgContent + '</div>');
    doc.close();

    doc.getElementById('downloadSvg').onclick = function() {
      var anchor = doc.createElement('a');
      anchor.href = URL.createObjectURL(new Blob([svgContent], { type: 'image/svg+xml' }));
      anchor.download = 'export.svg';
      doc.body.appendChild(anchor);
      anchor.click();
      doc.body.removeChild(anchor);
    };

    doc.getElementById('downloadPng').onclick = function() {
      var svgEl = doc.querySelector('.preview svg');
      if (!svgEl) return;
      var img = new win.Image();
      img.onload = function() {
        var scale = Math.max(2, Math.ceil(1920 / img.width));
        var canvas = doc.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        var ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
          var anchor = doc.createElement('a');
          anchor.href = URL.createObjectURL(blob);
          anchor.download = 'export.png';
          doc.body.appendChild(anchor);
          anchor.click();
          doc.body.removeChild(anchor);
        }, 'image/png', 1.0);
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svgEl));
    };
  };

  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
      var btn = closest(e.target, '.export-code-btn');
      if (!btn) return;
      e.stopPropagation();

      var wrapper = closest(btn, '.code-block-wrapper');
      if (!wrapper) return;

      var mermaid = wrapper.querySelector('.mermaid');
      if (mermaid) {
        var svgEl = mermaid.querySelector('svg');
        if (svgEl) { openExport(new XMLSerializer().serializeToString(svgEl)); return; }
      }

      var code = wrapper.querySelector('code, pre');
      if (code) openExport(codeBlockToSVG(code));
    });
  });
})();
