/* Interactive spreadsheet UI on top of Fx. Editable cells, a formula bar,
   fill-down, spilled arrays, and exercises that grade themselves. */
(function (global) {
  "use strict";

  var Fx = global.Fx;
  var STORE = "nidhi-course-sheets-v1";

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function expandRange(txt) {
    var p = txt.split(":");
    var a = Fx.parseRef(p[0]);
    var b = Fx.parseRef(p[1] || p[0]);
    if (!a || !b) return [];
    var out = [];
    for (var r = Math.min(a.row, b.row); r <= Math.max(a.row, b.row); r++)
      for (var c = Math.min(a.col, b.col); c <= Math.max(a.col, b.col); c++)
        out.push(Fx.a1(c, r));
    return out;
  }

  function shiftFormula(src, dc, dr) {
    var out = "", i = 0;
    while (i < src.length) {
      var c = src[i];
      if (c === '"') {
        out += c; i++;
        while (i < src.length) {
          out += src[i];
          if (src[i] === '"') {
            if (src[i + 1] === '"') { out += src[i + 1]; i += 2; continue; }
            i++; break;
          }
          i++;
        }
        continue;
      }
      if (c === "[") {
        var depth = 0, j = i;
        for (; j < src.length; j++) {
          if (src[j] === "[") depth++;
          else if (src[j] === "]") { depth--; if (!depth) { j++; break; } }
        }
        out += src.slice(i, j); i = j; continue;
      }
      var m = /^(\$?)([A-Za-z]{1,3})(\$?)(\d{1,7})/.exec(src.slice(i));
      var prev = i > 0 ? src[i - 1] : "";
      if (m && !/[A-Za-z0-9_$.\]]/.test(prev)) {
        var after = src[i + m[0].length] || "";
        if (!/[A-Za-z0-9_([]/.test(after)) {
          var col = Fx.colToNum(m[2]) + (m[1] ? 0 : dc);
          var row = +m[4] + (m[3] ? 0 : dr);
          out += (m[1] ? "$" : "") + Fx.numToCol(Math.max(1, col)) + (m[3] ? "$" : "") + Math.max(1, row);
          i += m[0].length;
          continue;
        }
      }
      out += c; i++;
    }
    return out;
  }

  function Sheet(host, cfg) {
    this.host = host;
    this.cfg = cfg = cfg || {};
    this.id = cfg.id || host.id || ("s" + Math.random().toString(36).slice(2));
    this.rows = cfg.rows || 10;
    this.cols = cfg.cols || 8;
    this.widths = cfg.widths || {};
    this.readonly = !!cfg.readonly;
    this.locked = {};
    (cfg.lock || []).forEach(function (r) {
      expandRange(r).forEach(function (k) { this.locked[k] = true; }, this);
    }, this);
    this.open = null;
    if (cfg.open) {
      this.open = {};
      (cfg.open || []).forEach(function (r) {
        expandRange(r).forEach(function (k) { this.open[k] = true; }, this);
      }, this);
    }
    this.tasks = cfg.tasks || [];
    this.wb = new Fx.Workbook({
      formats: cfg.formats || {},
      cellFormats: cfg.cellFormats || {},
      tables: cfg.tables || null,
      names: cfg.names || null
    });
    this.base = cfg.data ? (cfg.at || "A1") : null;
    if (cfg.data) this.wb.load(cfg.data, this.base);
    this.applyPreset();
    this.restore();
    this.sel = cfg.start ? Fx.parseRef(cfg.start) : null;
    this.editing = false;
    this.render();
  }

  Sheet.prototype.storeKey = function () { return this.id; };

  /* Cells the lesson ships with — labels, worked formulas, headings. */
  Sheet.prototype.applyPreset = function () {
    var p = this.cfg.preset || this.cfg.cells;
    if (!p) return;
    var self = this;
    Object.keys(p).forEach(function (k) { self.wb.cells[k] = { raw: String(p[k]) }; });
    Object.keys(this.wb.tables).forEach(function (k) { self.wb.refreshTableCols(self.wb.tables[k].name); });
    this.wb.recalc();
  };

  Sheet.prototype.restore = function () {
    if (this.cfg.persist === false) return;
    var all = loadStore();
    var mine = all[this.storeKey()];
    if (!mine) return;
    var self = this;
    Object.keys(mine).forEach(function (k) {
      if (self.isLocked(k)) return;
      self.wb.cells[k] = { raw: mine[k] };
    });
    this.wb.recalc();
  };
  Sheet.prototype.persist = function () {
    if (this.cfg.persist === false) return;
    var all = loadStore();
    var mine = {};
    var self = this;
    Object.keys(this.wb.cells).forEach(function (k) {
      if (self.isLocked(k)) return;
      mine[k] = self.wb.cells[k].raw;
    });
    all[this.storeKey()] = mine;
    saveStore(all);
  };

  Sheet.prototype.isLocked = function (key) {
    if (this.readonly) return true;
    if (this.open) return !this.open[key];
    return !!this.locked[key];
  };

  Sheet.prototype.render = function () {
    var host = this.host;
    host.innerHTML = "";
    host.classList.add("xl");

    if (this.cfg.title) {
      var cap = el("div", "xl-cap");
      cap.appendChild(el("span", "xl-cap-t", this.cfg.title));
      if (this.cfg.note) cap.appendChild(el("span", "xl-cap-n", this.cfg.note));
      host.appendChild(cap);
    }

    if (!this.readonly) {
      var bar = el("div", "xl-bar");
      var nameBox = el("div", "xl-name", this.sel ? Fx.a1(this.sel.col, this.sel.row) : "");
      this.nameBox = nameBox;
      bar.appendChild(nameBox);
      bar.appendChild(el("div", "xl-fx", "fx"));
      var input = el("input", "xl-input");
      input.type = "text";
      input.spellcheck = false;
      input.setAttribute("aria-label", "Formula bar");
      this.fxInput = input;
      bar.appendChild(input);
      host.appendChild(bar);
      var self = this;
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (self.sel) self.commit(Fx.a1(self.sel.col, self.sel.row), input.value);
          self.moveSel(1, 0);
        } else if (e.key === "Escape") {
          self.syncBar();
          self.focusGrid();
        }
      });
    }

    var wrap = el("div", "xl-wrap");
    if (this.cfg.height) wrap.style.maxHeight = this.cfg.height + "px";
    var table = el("table", "xl-grid");
    var thead = el("thead");
    var hr = el("tr");
    hr.appendChild(el("th", "xl-corner"));
    for (var c = 1; c <= this.cols; c++) {
      var th = el("th", "xl-ch", Fx.numToCol(c));
      var w = this.widths[Fx.numToCol(c)];
      if (w) th.style.minWidth = w + "px";
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tb = el("tbody");
    for (var r = 1; r <= this.rows; r++) {
      var tr = el("tr");
      tr.appendChild(el("th", "xl-rh", String(r)));
      for (var cc = 1; cc <= this.cols; cc++) {
        var key = Fx.a1(cc, r);
        var td = el("td", "xl-c");
        td.dataset.ref = key;
        var cell = this.wb.cells[key];
        var isSpill = !cell && this.wb.spill[key] !== undefined;
        var val = this.wb.cellValue(cc, r);
        td.textContent = this.wb.display(cc, r);
        if (Fx.isErr(val)) td.classList.add("xl-err");
        if (typeof val === "number" && !(this.wb.formatOf(cc, r) === "text")) td.classList.add("xl-num");
        if (typeof val === "boolean") td.classList.add("xl-bool");
        if (isSpill) td.classList.add("xl-spill");
        if (cell && String(cell.raw).charAt(0) === "=") td.classList.add("xl-fcell");
        if (this.isLocked(key)) td.classList.add("xl-locked");
        else td.classList.add("xl-open");
        if (this.cfg.headerRows && r <= this.cfg.headerRows) td.classList.add("xl-head");
        if (this.taskFor(key)) td.classList.add("xl-task");
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    table.appendChild(tb);
    wrap.appendChild(table);
    host.appendChild(wrap);
    this.table = table;
    this.wrap = wrap;

    if (!this.readonly) {
      this.bindGrid();
      var tools = el("div", "xl-tools");
      var fill = el("button", "xl-btn", "Fill down");
      fill.type = "button";
      fill.title = "Copy the selected formula to the rows below, shifting the references";
      tools.appendChild(fill);
      var self2 = this;
      fill.addEventListener("click", function () { self2.fillDown(); });

      var clear = el("button", "xl-btn", "Clear cell");
      clear.type = "button";
      clear.addEventListener("click", function () {
        if (self2.sel) self2.commit(Fx.a1(self2.sel.col, self2.sel.row), "");
      });
      tools.appendChild(clear);

      var showF = el("button", "xl-btn", "Show formulas");
      showF.type = "button";
      showF.addEventListener("click", function () {
        self2.showFormulas = !self2.showFormulas;
        host.classList.toggle("xl-showf", self2.showFormulas);
        showF.textContent = self2.showFormulas ? "Show values" : "Show formulas";
        self2.paint();
      });
      tools.appendChild(showF);

      var reset = el("button", "xl-btn", "Reset sheet");
      reset.type = "button";
      reset.addEventListener("click", function () { self2.reset(); });
      tools.appendChild(reset);

      tools.appendChild(el("span", "xl-hint", "TODAY() = " + Fx.TODAY_TEXT));
      host.appendChild(tools);
    }

    if (this.tasks.length) this.renderTasks();
    this.selectRef(this.sel ? Fx.a1(this.sel.col, this.sel.row) : null, true);
  };

  Sheet.prototype.taskFor = function (key) {
    for (var i = 0; i < this.tasks.length; i++) if (this.tasks[i].cell === key) return this.tasks[i];
    return null;
  };

  Sheet.prototype.renderTasks = function () {
    var box = el("div", "xl-tasks");
    var head = el("div", "xl-tasks-h");
    head.appendChild(el("span", "xl-tasks-t", this.cfg.tasksTitle || "Your turn"));
    var check = el("button", "xl-btn xl-btn-go", "Check my answers");
    check.type = "button";
    head.appendChild(check);
    var reveal = el("button", "xl-btn", "Show me");
    reveal.type = "button";
    head.appendChild(reveal);
    box.appendChild(head);

    var list = el("ol", "xl-task-list");
    var self = this;
    this.tasks.forEach(function (t, i) {
      var li = el("li");
      li.dataset.ix = String(i);
      var top = el("div", "xl-task-top");
      top.appendChild(el("code", "xl-task-cell", t.cell));
      var ask = el("span", "xl-task-ask");
      ask.innerHTML = t.ask || "";
      top.appendChild(ask);
      li.appendChild(top);
      var st = el("div", "xl-task-st", "");
      li.appendChild(st);
      list.appendChild(li);
    });
    box.appendChild(list);
    this.host.appendChild(box);
    this.taskList = list;

    check.addEventListener("click", function () { self.check(); });
    reveal.addEventListener("click", function () { self.revealAll(); });
  };

  Sheet.prototype.bindGrid = function () {
    var self = this;
    this.table.setAttribute("tabindex", "0");
    this.table.addEventListener("mousedown", function (e) {
      var td = e.target.closest ? e.target.closest("td.xl-c") : null;
      if (!td) return;
      if (e.target.classList && e.target.classList.contains("xl-handle")) return;
      self.selectRef(td.dataset.ref);
      self.table.focus();
    });
    this.table.addEventListener("dblclick", function (e) {
      var td = e.target.closest ? e.target.closest("td.xl-c") : null;
      if (!td) return;
      self.beginEdit("");
    });
    this.table.addEventListener("keydown", function (e) { self.onKey(e); });
  };

  Sheet.prototype.focusGrid = function () { if (this.table) this.table.focus(); };

  Sheet.prototype.cellEl = function (key) {
    return this.table ? this.table.querySelector('td[data-ref="' + key + '"]') : null;
  };

  Sheet.prototype.selectRef = function (key, quiet) {
    if (this.editing) this.endEdit(true);
    var prev = this.table ? this.table.querySelector("td.xl-sel") : null;
    if (prev) {
      prev.classList.remove("xl-sel");
      var h = prev.querySelector(".xl-handle");
      if (h) h.remove();
    }
    if (!key) { this.sel = null; this.syncBar(); return; }
    var r = Fx.parseRef(key);
    if (!r) return;
    this.sel = r;
    var td = this.cellEl(key);
    if (td) {
      td.classList.add("xl-sel");
      if (!this.isLocked(key)) {
        var handle = el("span", "xl-handle");
        handle.title = "Drag down to fill";
        td.appendChild(handle);
        this.bindHandle(handle);
      }
      if (!quiet && td.scrollIntoView) {
        var wr = this.wrap;
        if (wr && (td.offsetTop < wr.scrollTop || td.offsetTop > wr.scrollTop + wr.clientHeight - 30)) {
          wr.scrollTop = Math.max(0, td.offsetTop - 60);
        }
      }
    }
    this.syncBar();
  };

  Sheet.prototype.bindHandle = function (handle) {
    var self = this;
    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var startRow = self.sel.row;
      var lastRow = startRow;
      function over(ev) {
        var t = document.elementFromPoint(ev.clientX, ev.clientY);
        var td = t && t.closest ? t.closest("td.xl-c") : null;
        if (!td) return;
        var r = Fx.parseRef(td.dataset.ref);
        if (!r || r.col !== self.sel.col) return;
        lastRow = r.row;
        self.table.querySelectorAll("td.xl-prefill").forEach(function (x) { x.classList.remove("xl-prefill"); });
        for (var rr = startRow + 1; rr <= lastRow; rr++) {
          var cEl = self.cellEl(Fx.a1(self.sel.col, rr));
          if (cEl) cEl.classList.add("xl-prefill");
        }
      }
      function up() {
        document.removeEventListener("mousemove", over);
        document.removeEventListener("mouseup", up);
        self.table.querySelectorAll("td.xl-prefill").forEach(function (x) { x.classList.remove("xl-prefill"); });
        if (lastRow > startRow) self.fillDown(lastRow);
      }
      document.addEventListener("mousemove", over);
      document.addEventListener("mouseup", up);
    });
  };

  Sheet.prototype.syncBar = function () {
    if (!this.fxInput) return;
    if (!this.sel) { this.fxInput.value = ""; this.nameBox.textContent = ""; return; }
    var key = Fx.a1(this.sel.col, this.sel.row);
    var cell = this.wb.cells[key];
    this.fxInput.value = cell ? cell.raw : "";
    this.fxInput.readOnly = this.isLocked(key);
    this.nameBox.textContent = key;
  };

  Sheet.prototype.onKey = function (e) {
    if (!this.sel) return;
    var key = Fx.a1(this.sel.col, this.sel.row);
    if (this.editing) return;
    if (e.key === "ArrowDown") { e.preventDefault(); this.moveSel(1, 0); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); this.moveSel(-1, 0); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); this.moveSel(0, -1); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); this.moveSel(0, 1); return; }
    if (e.key === "Tab") { e.preventDefault(); this.moveSel(0, e.shiftKey ? -1 : 1); return; }
    if (e.key === "Enter" || e.key === "F2") {
      e.preventDefault();
      if (this.isLocked(key)) { this.moveSel(1, 0); return; }
      this.beginEdit(e.key === "Enter" ? "" : null);
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      if (!this.isLocked(key)) this.commit(key, "");
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (this.isLocked(key)) return;
      e.preventDefault();
      this.beginEdit(e.key);
    }
  };

  Sheet.prototype.moveSel = function (dr, dc) {
    if (!this.sel) return;
    var r = Math.min(this.rows, Math.max(1, this.sel.row + dr));
    var c = Math.min(this.cols, Math.max(1, this.sel.col + dc));
    this.selectRef(Fx.a1(c, r));
  };

  Sheet.prototype.beginEdit = function (seed) {
    var key = Fx.a1(this.sel.col, this.sel.row);
    if (this.isLocked(key)) return;
    var td = this.cellEl(key);
    if (!td) return;
    var cell = this.wb.cells[key];
    var start = seed === null || seed === "" ? (cell ? cell.raw : "") : seed;
    if (seed && seed !== "") start = seed;
    td.innerHTML = "";
    var inp = el("input", "xl-edit");
    inp.type = "text";
    inp.spellcheck = false;
    inp.value = start;
    td.appendChild(inp);
    this.editing = true;
    inp.focus();
    if (seed && seed.length === 1) inp.setSelectionRange(1, 1);
    else inp.select();
    var self = this;
    inp.addEventListener("input", function () {
      if (self.fxInput) self.fxInput.value = inp.value;
    });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); self.endEdit(false); self.moveSel(1, 0); self.focusGrid(); }
      else if (e.key === "Tab") { e.preventDefault(); self.endEdit(false); self.moveSel(0, e.shiftKey ? -1 : 1); self.focusGrid(); }
      else if (e.key === "Escape") { e.preventDefault(); self.endEdit(true); self.focusGrid(); }
    });
    inp.addEventListener("blur", function () { if (self.editing) self.endEdit(false); });
  };

  Sheet.prototype.endEdit = function (cancel) {
    if (!this.editing) return;
    var td = this.table.querySelector("td.xl-sel");
    var inp = td ? td.querySelector("input.xl-edit") : null;
    var val = inp ? inp.value : null;
    this.editing = false;
    if (td) td.innerHTML = "";
    if (cancel || val === null) { this.paint(); return; }
    this.commit(td.dataset.ref, val);
  };

  Sheet.prototype.commit = function (key, raw) {
    if (this.isLocked(key)) return;
    var r = Fx.parseRef(key);
    this.wb.setRaw(r, String(raw).trim());
    var self = this;
    Object.keys(this.wb.tables).forEach(function (k) { self.wb.refreshTableCols(self.wb.tables[k].name); });
    this.wb.recalc();
    this.persist();
    this.paint();
    this.syncBar();
    if (this.onChange) this.onChange(this);
    if (this.cfg.live) this.check(true);
  };

  Sheet.prototype.paint = function () {
    for (var r = 1; r <= this.rows; r++) {
      for (var c = 1; c <= this.cols; c++) {
        var key = Fx.a1(c, r);
        var td = this.cellEl(key);
        if (!td) continue;
        if (td.querySelector("input.xl-edit")) continue;
        var cell = this.wb.cells[key];
        var v = this.wb.cellValue(c, r);
        var isSpill = !cell && this.wb.spill[key] !== undefined;
        var text;
        if (this.showFormulas && cell && String(cell.raw).charAt(0) === "=") text = cell.raw;
        else text = this.wb.display(c, r);
        var handle = td.querySelector(".xl-handle");
        td.textContent = text;
        if (handle) td.appendChild(handle);
        td.classList.toggle("xl-err", Fx.isErr(v));
        td.classList.toggle("xl-num", typeof v === "number" && this.wb.formatOf(c, r) !== "text" && !this.showFormulas);
        td.classList.toggle("xl-bool", typeof v === "boolean");
        td.classList.toggle("xl-spill", isSpill);
        td.classList.toggle("xl-fcell", !!(cell && String(cell.raw).charAt(0) === "="));
      }
    }
  };

  Sheet.prototype.fillDown = function (toRow) {
    if (!this.sel) return;
    var key = Fx.a1(this.sel.col, this.sel.row);
    var cell = this.wb.cells[key];
    if (!cell) return;
    var raw = cell.raw;
    var last = toRow;
    if (!last) {
      last = this.sel.row;
      var limit = this.cfg.fillTo || this.rows;
      for (var r = this.sel.row + 1; r <= limit; r++) {
        if (!this.isLocked(Fx.a1(this.sel.col, r))) last = r;
        else break;
      }
    }
    for (var rr = this.sel.row + 1; rr <= last; rr++) {
      var target = Fx.a1(this.sel.col, rr);
      if (this.isLocked(target)) continue;
      var next = String(raw).charAt(0) === "=" ? "=" + shiftFormula(raw.slice(1), 0, rr - this.sel.row) : raw;
      this.wb.cells[target] = { raw: next };
    }
    this.wb.recalc();
    this.persist();
    this.paint();
    if (this.cfg.live) this.check(true);
  };

  Sheet.prototype.reset = function () {
    var all = loadStore();
    delete all[this.storeKey()];
    saveStore(all);
    this.wb = new Fx.Workbook({
      formats: this.cfg.formats || {},
      cellFormats: this.cfg.cellFormats || {},
      tables: this.cfg.tables || null,
      names: this.cfg.names || null
    });
    if (this.cfg.data) this.wb.load(this.cfg.data, this.base);
    this.applyPreset();
    this.render();
  };

  Sheet.prototype.valueOf2 = function (ref) { return this.wb.valueAt(ref); };

  Sheet.prototype.check = function (quiet) {
    if (!this.taskList) return true;
    var allOk = true;
    var self = this;
    this.tasks.forEach(function (t, i) {
      var li = self.taskList.querySelector('li[data-ix="' + i + '"]');
      var st = li.querySelector(".xl-task-st");
      var cell = self.wb.cells[t.cell];
      var raw = cell ? String(cell.raw) : "";
      var val = self.wb.valueAt(t.cell);
      var ok = true;
      var msg = "";
      if (!raw) { ok = false; msg = "Empty. Click " + t.cell + " and type the formula."; }
      else if (t.formula !== false && raw.charAt(0) !== "=") {
        ok = false;
        msg = "That is a typed-in number. Excel has to calculate it, so it must start with =.";
      } else if (t.requires && t.requires.length) {
        var up = raw.toUpperCase();
        var missing = t.requires.filter(function (fn) { return up.indexOf(fn.toUpperCase()) < 0; });
        if (missing.length) { ok = false; msg = "Right idea, but use " + missing.join(" or ") + " here."; }
      }
      if (ok) {
        var wantsErr = typeof t.want === "string" && t.want.charAt(0) === "#";
        if (wantsErr) {
          if (!Fx.isErr(val) || val.e !== t.want) {
            ok = false;
            msg = "It gives " + showVal(val) + ". This one is meant to produce " + t.want + " on purpose.";
          }
        } else if (Fx.isErr(val)) {
          ok = false;
          msg = "The formula returns " + val.e + ". " + explainErr(val.e);
        } else if (t.want !== undefined && !sameVal(val, t.want, t.tol)) {
          ok = false;
          msg = "It calculates " + showVal(val) + ". Expected " + showVal(t.want) + ".";
        }
      }
      li.classList.toggle("ok", ok);
      li.classList.toggle("bad", !ok && !!raw);
      st.textContent = ok ? (t.good || "Correct.") : msg;
      if (!ok) allOk = false;
    });
    var done = el ? null : null;
    this.host.classList.toggle("xl-all-ok", allOk);
    if (allOk && !quiet && this.cfg.onPass) this.cfg.onPass();
    if (allOk && this.cfg.lessonId && global.Course) global.Course.markDone(this.cfg.lessonId);
    return allOk;
  };

  Sheet.prototype.revealAll = function () {
    var self = this;
    this.tasks.forEach(function (t) {
      if (t.answer) self.wb.cells[t.cell] = { raw: t.answer };
      if (t.alsoFill) {
        Object.keys(t.alsoFill).forEach(function (k) { self.wb.cells[k] = { raw: t.alsoFill[k] }; });
      }
    });
    this.wb.recalc();
    this.persist();
    this.paint();
    this.check(true);
  };

  function explainErr(code) {
    switch (code) {
      case "#NAME?": return "Excel does not recognise a name in it — usually a typo in the function name or a missing quote.";
      case "#VALUE!": return "An argument is the wrong type, often text where a number is needed.";
      case "#DIV/0!": return "Something is divided by zero. Wrap it so a zero denominator returns blank.";
      case "#N/A": return "A lookup found nothing. Check the key exists and is spelled the same way.";
      case "#REF!": return "A reference points at a cell that is not there.";
      case "#SPILL!": return "The result needs more cells than are free below or beside it.";
      default: return "";
    }
  }
  function sameVal(a, b, tol) {
    if (typeof b === "number") {
      var n = Fx.num(a);
      if (Fx.isErr(n)) return false;
      return Math.abs(n - b) <= (tol === undefined ? 0.051 : tol);
    }
    if (typeof b === "boolean") return Fx.scalar(a) === b;
    return String(Fx.str(a)).trim().toLowerCase() === String(b).trim().toLowerCase();
  }
  function showVal(v) {
    if (Fx.isErr(v)) return v.e;
    if (v === null || v === "") return "(blank)";
    if (typeof v === "number") return String(Math.round(v * 100) / 100);
    return '"' + String(v) + '"';
  }

  /* ---------- a one-line formula playground ---------- */
  function Playground(host, cfg) {
    cfg = cfg || {};
    var wb = new Fx.Workbook({
      formats: cfg.formats || {},
      tables: cfg.tables || null,
      names: cfg.names || null
    });
    if (cfg.data) wb.load(cfg.data, cfg.at || "A1");
    host.classList.add("pg");
    host.innerHTML = "";
    var head = el("div", "pg-h");
    head.appendChild(el("span", "pg-t", cfg.title || "Try a formula"));
    head.appendChild(el("span", "pg-n", cfg.note || "Types as you go. Nothing can break."));
    host.appendChild(head);
    var row = el("div", "pg-row");
    var input = el("input", "pg-in");
    input.type = "text";
    input.spellcheck = false;
    input.placeholder = cfg.placeholder || '=COUNTIF(Candidates[Source],"LinkedIn")';
    row.appendChild(input);
    var out = el("div", "pg-out", "");
    row.appendChild(out);
    host.appendChild(row);

    if (cfg.examples && cfg.examples.length) {
      var ex = el("div", "pg-ex");
      ex.appendChild(el("span", "pg-ex-l", "Try:"));
      cfg.examples.forEach(function (f) {
        var b = el("button", "pg-chip", f);
        b.type = "button";
        b.addEventListener("click", function () { input.value = f; run(); input.focus(); });
        ex.appendChild(b);
      });
      host.appendChild(ex);
    }

    function run() {
      var src = input.value.trim();
      if (!src) { out.textContent = ""; out.className = "pg-out"; return; }
      var v = wb.evalFormula(src, cfg.col || 20, cfg.row || 2);
      if (Fx.isErr(v)) {
        out.textContent = v.e;
        out.className = "pg-out bad";
        return;
      }
      if (Fx.isMat(v)) {
        var parts = Fx.flat(v).map(function (x) { return Fx.formatValue(x, cfg.resultFormat || "general"); });
        out.textContent = parts.join(" · ");
        out.className = "pg-out ok";
        return;
      }
      out.textContent = Fx.formatValue(v, cfg.resultFormat || "general");
      out.className = "pg-out ok";
    }
    input.addEventListener("input", run);
    if (cfg.value) { input.value = cfg.value; run(); }
    return { wb: wb, input: input, run: run };
  }

  global.Sheet = {
    all: [],
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return null;
      var s = new Sheet(host, cfg);
      global.Sheet.all.push(s);
      return s;
    },
    playground: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return null;
      return Playground(host, cfg);
    },
    shiftFormula: shiftFormula,
    clearAll: function () { saveStore({}); }
  };
})(window);
