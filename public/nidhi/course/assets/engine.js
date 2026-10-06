/* Formula engine. Tokenizer, parser, evaluator and function library.
   Supports the subset of Excel this course teaches, including structured
   table references (Candidates[Source], [@Applied]) and dynamic arrays. */
(function (global) {
  "use strict";

  /* ---------- dates ---------- */
  var EPOCH = Date.UTC(1899, 11, 30);
  var DAYMS = 86400000;

  function dateSerial(y, m, d) {
    return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / DAYMS);
  }
  function serialDate(s) {
    return new Date(EPOCH + Math.round(s) * DAYMS);
  }
  /* TODAY() is pinned so every exercise answer stays stable. */
  var TODAY = dateSerial(2026, 5, 1);

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONL = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ---------- values ---------- */
  function err(code) { return { e: code }; }
  function isErr(v) { return !!v && typeof v === "object" && typeof v.e === "string"; }
  function isMat(v) { return !!v && typeof v === "object" && Array.isArray(v.m); }
  function mat(rows) {
    return { m: rows, r: rows.length, c: rows.length ? rows[0].length : 0 };
  }
  function firstErr(list) {
    for (var i = 0; i < list.length; i++) {
      if (isErr(list[i])) return list[i];
      if (isMat(list[i])) {
        var f = flat(list[i]);
        for (var j = 0; j < f.length; j++) if (isErr(f[j])) return f[j];
      }
    }
    return null;
  }
  function flat(v) {
    if (isMat(v)) {
      var out = [];
      for (var i = 0; i < v.m.length; i++)
        for (var j = 0; j < v.m[i].length; j++) out.push(v.m[i][j]);
      return out;
    }
    return [v];
  }
  function scalar(v) {
    if (isMat(v)) return v.r && v.c ? v.m[0][0] : err("#VALUE!");
    return v;
  }
  function num(v) {
    v = scalar(v);
    if (isErr(v)) return v;
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "boolean") return v ? 1 : 0;
    if (typeof v === "number") return v;
    var s = String(v).trim();
    if (s === "") return 0;
    if (!isNaN(Number(s))) return Number(s);
    var d = parseDateString(s);
    if (d !== null) return d;
    return err("#VALUE!");
  }
  function str(v) {
    v = scalar(v);
    if (isErr(v)) return v;
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    return String(v);
  }
  function bool(v) {
    v = scalar(v);
    if (isErr(v)) return v;
    if (typeof v === "boolean") return v;
    if (v === null || v === "") return false;
    if (typeof v === "number") return v !== 0;
    var s = String(v).trim().toUpperCase();
    if (s === "TRUE") return true;
    if (s === "FALSE") return false;
    var n = Number(s);
    if (!isNaN(n)) return n !== 0;
    return err("#VALUE!");
  }
  function blank(v) { return v === null || v === undefined || v === ""; }

  /* ---------- date text ---------- */
  function parseDateString(s) {
    s = String(s).trim();
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
    if (m) return dateSerial(+m[1], +m[2], +m[3]);
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (m) return dateSerial(+m[3], +m[2], +m[1]);
    m = /^(\d{1,2})[ -]([A-Za-z]{3,9})[ -](\d{4})$/.exec(s);
    if (m) {
      var mi = monthIndex(m[2]);
      if (mi) return dateSerial(+m[3], mi, +m[1]);
    }
    m = /^([A-Za-z]{3,9})[ -](\d{1,2}),?[ -](\d{4})$/.exec(s);
    if (m) {
      var mj = monthIndex(m[1]);
      if (mj) return dateSerial(+m[3], mj, +m[2]);
    }
    return null;
  }
  function monthIndex(name) {
    var n = String(name).slice(0, 3).toLowerCase();
    for (var i = 0; i < MON.length; i++) if (MON[i].toLowerCase() === n) return i + 1;
    return 0;
  }

  /* ---------- references ---------- */
  function colToNum(letters) {
    var n = 0;
    letters = letters.toUpperCase();
    for (var i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  function numToCol(n) {
    var s = "";
    while (n > 0) {
      var r = (n - 1) % 26;
      s = String.fromCharCode(65 + r) + s;
      n = (n - 1 - r) / 26;
    }
    return s;
  }
  var REF_RE = /^(\$?)([A-Za-z]{1,3})(\$?)(\d{1,7})$/;
  function parseRef(txt) {
    var m = REF_RE.exec(txt);
    if (!m) return null;
    return { col: colToNum(m[2]), row: +m[4], ac: m[1] === "$", ar: m[3] === "$" };
  }
  function refName(col, row, ac, ar) {
    return (ac ? "$" : "") + numToCol(col) + (ar ? "$" : "") + row;
  }
  function a1(col, row) { return numToCol(col) + row; }

  /* ---------- tokenizer ---------- */
  function tokenize(src) {
    var out = [];
    var i = 0, n = src.length;
    while (i < n) {
      var c = src[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") { i++; continue; }
      if (c === '"') {
        var j = i + 1, s = "";
        while (j < n) {
          if (src[j] === '"') {
            if (src[j + 1] === '"') { s += '"'; j += 2; continue; }
            break;
          }
          s += src[j++];
        }
        out.push({ t: "str", v: s });
        i = j + 1;
        continue;
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var k = i;
        while (k < n && /[0-9.]/.test(src[k])) k++;
        out.push({ t: "num", v: parseFloat(src.slice(i, k)) });
        i = k;
        continue;
      }
      if (c === "#") {
        var e = /^#(NULL!|DIV\/0!|VALUE!|REF!|NAME\?|NUM!|N\/A|SPILL!|CALC!)/i.exec(src.slice(i));
        if (e) { out.push({ t: "err", v: "#" + e[1].toUpperCase() }); i += e[0].length; continue; }
        i++;
        continue;
      }
      if (c === "[") {
        var br = readBrackets(src, i);
        if (br) {
          out.push({ t: "thisrow", v: cleanColName(br.inner) });
          i = br.end;
          continue;
        }
        i++;
        continue;
      }
      if (/[A-Za-z_$]/.test(c)) {
        var p = i;
        while (p < n && /[A-Za-z0-9_$.]/.test(src[p])) p++;
        var word = src.slice(i, p);
        if (src[p] === "[") {
          var b2 = readBrackets(src, p);
          if (b2) {
            out.push({ t: "tableref", name: word, col: cleanColName(b2.inner) });
            i = b2.end;
            continue;
          }
        }
        if (src[p] === "(") { out.push({ t: "fn", v: word.toUpperCase() }); i = p; continue; }
        var up = word.toUpperCase();
        if (up === "TRUE") { out.push({ t: "bool", v: true }); i = p; continue; }
        if (up === "FALSE") { out.push({ t: "bool", v: false }); i = p; continue; }
        if (REF_RE.test(word)) {
          /* N2# is the spill operator: the whole block a dynamic array produced. */
          if (src[p] === "#") { out.push({ t: "spillref", v: word }); i = p + 1; continue; }
          out.push({ t: "ref", v: word });
          i = p;
          continue;
        }
        out.push({ t: "name", v: word });
        i = p;
        continue;
      }
      var two = src.substr(i, 2);
      if (two === "<=" || two === ">=" || two === "<>") { out.push({ t: "op", v: two }); i += 2; continue; }
      if ("+-*/^&=<>(),:%".indexOf(c) >= 0) { out.push({ t: "op", v: c }); i++; continue; }
      if (c === ";") { out.push({ t: "op", v: "," }); i++; continue; }
      i++;
    }
    return out;
  }
  function readBrackets(src, start) {
    var depth = 0, i = start;
    for (; i < src.length; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]") {
        depth--;
        if (depth === 0) return { inner: src.slice(start + 1, i), end: i + 1 };
      }
    }
    return null;
  }
  function cleanColName(inner) {
    return inner.replace(/[\[\]@]/g, "").trim();
  }

  /* ---------- parser ---------- */
  function parse(tokens) {
    var pos = 0;
    function peek() { return tokens[pos]; }
    function isOp(v) { var t = peek(); return t && t.t === "op" && t.v === v; }
    function eat(v) { if (isOp(v)) { pos++; return true; } return false; }

    function expr() { return compare(); }
    function compare() {
      var left = concat();
      while (true) {
        var t = peek();
        if (t && t.t === "op" && ["=", "<>", "<", ">", "<=", ">="].indexOf(t.v) >= 0) {
          pos++;
          left = { k: "bin", op: t.v, a: left, b: concat() };
        } else return left;
      }
    }
    function concat() {
      var left = additive();
      while (isOp("&")) { pos++; left = { k: "bin", op: "&", a: left, b: additive() }; }
      return left;
    }
    function additive() {
      var left = multiplicative();
      while (isOp("+") || isOp("-")) {
        var op = peek().v; pos++;
        left = { k: "bin", op: op, a: left, b: multiplicative() };
      }
      return left;
    }
    function multiplicative() {
      var left = unary();
      while (isOp("*") || isOp("/")) {
        var op = peek().v; pos++;
        left = { k: "bin", op: op, a: left, b: unary() };
      }
      return left;
    }
    function unary() {
      if (isOp("-")) { pos++; return { k: "neg", a: unary() }; }
      if (isOp("+")) { pos++; return unary(); }
      return power();
    }
    function power() {
      var left = postfix();
      if (isOp("^")) { pos++; return { k: "bin", op: "^", a: left, b: unary() }; }
      return left;
    }
    function postfix() {
      var node = primary();
      while (isOp("%")) { pos++; node = { k: "pct", a: node }; }
      return node;
    }
    function primary() {
      var t = peek();
      if (!t) return { k: "err", v: "#VALUE!" };
      if (t.t === "num") { pos++; return { k: "num", v: t.v }; }
      if (t.t === "str") { pos++; return { k: "str", v: t.v }; }
      if (t.t === "bool") { pos++; return { k: "bool", v: t.v }; }
      if (t.t === "err") { pos++; return { k: "err", v: t.v }; }
      if (t.t === "thisrow") { pos++; return { k: "thisrow", col: t.v }; }
      if (t.t === "tableref") { pos++; return { k: "tableref", name: t.name, col: t.col }; }
      if (t.t === "fn") {
        pos++;
        eat("(");
        var args = [];
        if (!isOp(")")) {
          args.push(expr());
          while (eat(",")) args.push(expr());
        }
        eat(")");
        return { k: "call", name: t.v, args: args };
      }
      if (t.t === "ref") {
        pos++;
        if (isOp(":") && tokens[pos + 1] && tokens[pos + 1].t === "ref") {
          var b = tokens[pos + 1].v;
          pos += 2;
          return { k: "range", a: t.v, b: b };
        }
        return { k: "ref", v: t.v };
      }
      if (t.t === "spillref") { pos++; return { k: "spill", v: t.v }; }
      if (t.t === "name") { pos++; return { k: "name", v: t.v }; }
      if (t.t === "op" && t.v === "(") {
        pos++;
        var e = expr();
        eat(")");
        return e;
      }
      pos++;
      return { k: "err", v: "#VALUE!" };
    }
    var node = expr();
    return node;
  }

  function compile(src) {
    return parse(tokenize(src));
  }

  /* ---------- evaluator ---------- */
  function evaluate(node, ctx) {
    switch (node.k) {
      case "num": return node.v;
      case "str": return node.v;
      case "bool": return node.v;
      case "err": return err(node.v);
      case "neg": {
        var v = num(evaluate(node.a, ctx));
        return isErr(v) ? v : -v;
      }
      case "pct": {
        var p = num(evaluate(node.a, ctx));
        return isErr(p) ? p : p / 100;
      }
      case "bin": return binop(node.op, evaluate(node.a, ctx), evaluate(node.b, ctx));
      case "ref": {
        var r = parseRef(node.v);
        if (!r) return err("#NAME?");
        return ctx.cell(r.col, r.row);
      }
      case "range": return rangeMatrix(node.a, node.b, ctx);
      case "spill": {
        var sr = parseRef(node.v);
        if (!sr) return err("#NAME?");
        if (!ctx.spillBlock) return ctx.cell(sr.col, sr.row);
        var blk = ctx.spillBlock(sr.col, sr.row);
        return blk === null ? err("#REF!") : blk;
      }
      case "thisrow": {
        var tb = ctx.tableAt ? ctx.tableAt(ctx.col, ctx.row) : null;
        if (!tb) return err("#NAME?");
        var colIx = tb.cols[node.col.toLowerCase()];
        if (!colIx) return err("#NAME?");
        return ctx.cell(colIx, ctx.row);
      }
      case "tableref": {
        var t = ctx.table ? ctx.table(node.name) : null;
        if (!t) return err("#NAME?");
        var ci = t.cols[node.col.toLowerCase()];
        if (!ci) return err("#NAME?");
        var rows = [];
        for (var rr = t.first; rr <= t.last; rr++) rows.push([ctx.cell(ci, rr)]);
        return mat(rows);
      }
      case "name": {
        var nv = ctx.name ? ctx.name(node.v) : null;
        if (nv === null || nv === undefined) return err("#NAME?");
        return nv;
      }
      case "call": return callFn(node, ctx);
    }
    return err("#VALUE!");
  }

  function rangeMatrix(aTxt, bTxt, ctx) {
    var A = parseRef(aTxt), B = parseRef(bTxt);
    if (!A || !B) return err("#REF!");
    var c1 = Math.min(A.col, B.col), c2 = Math.max(A.col, B.col);
    var r1 = Math.min(A.row, B.row), r2 = Math.max(A.row, B.row);
    var rows = [];
    for (var r = r1; r <= r2; r++) {
      var row = [];
      for (var c = c1; c <= c2; c++) row.push(ctx.cell(c, r));
      rows.push(row);
    }
    var m = mat(rows);
    m.a = { col: c1, row: r1 };
    return m;
  }

  function binop(op, a, b) {
    if (isErr(a)) return a;
    if (isErr(b)) return b;
    if (isMat(a) || isMat(b)) {
      var am = isMat(a) ? a : null, bm = isMat(b) ? b : null;
      var r = Math.max(am ? am.r : 1, bm ? bm.r : 1);
      var c = Math.max(am ? am.c : 1, bm ? bm.c : 1);
      var rows = [];
      for (var i = 0; i < r; i++) {
        var row = [];
        for (var j = 0; j < c; j++) {
          var av = am ? pick(am, i, j) : a;
          var bv = bm ? pick(bm, i, j) : b;
          row.push(binop(op, av, bv));
        }
        rows.push(row);
      }
      return mat(rows);
    }
    if (op === "&") {
      var sa = str(a), sb = str(b);
      if (isErr(sa)) return sa;
      if (isErr(sb)) return sb;
      return sa + sb;
    }
    if (["=", "<>", "<", ">", "<=", ">="].indexOf(op) >= 0) return compareVals(op, a, b);
    var x = num(a), y = num(b);
    if (isErr(x)) return x;
    if (isErr(y)) return y;
    switch (op) {
      case "+": return x + y;
      case "-": return x - y;
      case "*": return x * y;
      case "/": return y === 0 ? err("#DIV/0!") : x / y;
      case "^": return Math.pow(x, y);
    }
    return err("#VALUE!");
  }
  function pick(m, i, j) {
    var row = m.m[Math.min(i, m.r - 1)] || [];
    return row[Math.min(j, m.c - 1)];
  }
  function compareVals(op, a, b) {
    var cmp;
    var aBlank = blank(a), bBlank = blank(b);
    if (aBlank && bBlank) cmp = 0;
    else if (typeof a === "number" || typeof b === "number" || aBlank || bBlank) {
      var x = aBlank ? 0 : a, y = bBlank ? 0 : b;
      if (typeof x === "string" || typeof y === "string") {
        var nx = num(x), ny = num(y);
        if (!isErr(nx) && !isErr(ny)) cmp = nx === ny ? 0 : nx < ny ? -1 : 1;
        else {
          var sx = String(x).toLowerCase(), sy = String(y).toLowerCase();
          cmp = sx === sy ? 0 : sx < sy ? -1 : 1;
        }
      } else {
        var vx = num(x), vy = num(y);
        cmp = vx === vy ? 0 : vx < vy ? -1 : 1;
      }
    } else if (typeof a === "boolean" || typeof b === "boolean") {
      var ba = bool(a) ? 1 : 0, bb = bool(b) ? 1 : 0;
      cmp = ba === bb ? 0 : ba < bb ? -1 : 1;
    } else {
      var la = String(a).toLowerCase(), lb = String(b).toLowerCase();
      cmp = la === lb ? 0 : la < lb ? -1 : 1;
    }
    switch (op) {
      case "=": return cmp === 0;
      case "<>": return cmp !== 0;
      case "<": return cmp < 0;
      case ">": return cmp > 0;
      case "<=": return cmp <= 0;
      case ">=": return cmp >= 0;
    }
    return err("#VALUE!");
  }

  /* ---------- criteria ---------- */
  function wildcard(pattern) {
    var re = "";
    for (var i = 0; i < pattern.length; i++) {
      var ch = pattern[i];
      if (ch === "~") { re += escapeRe(pattern[++i] || ""); continue; }
      if (ch === "*") { re += "[\\s\\S]*"; continue; }
      if (ch === "?") { re += "[\\s\\S]"; continue; }
      re += escapeRe(ch);
    }
    return new RegExp("^" + re + "$", "i");
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function makeCriteria(raw) {
    var c = scalar(raw);
    var op = "=", val = c;
    if (typeof c === "string") {
      var m = /^(<=|>=|<>|=|<|>)([\s\S]*)$/.exec(c);
      if (m) { op = m[1]; val = m[2]; }
      if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) val = Number(val);
      else if (typeof val === "string") {
        var d = parseDateString(val);
        if (d !== null) val = d;
      }
    }
    var rx = null;
    if ((op === "=" || op === "<>") && typeof val === "string" && /[*?]/.test(val)) rx = wildcard(val);
    return function (x) {
      if (isErr(x)) return false;
      if (rx) {
        var hit = rx.test(String(blank(x) ? "" : x));
        return op === "=" ? hit : !hit;
      }
      if (op === "=" && val === "") return blank(x);
      if (op === "<>" && val === "") return !blank(x);
      if (blank(x) && typeof val === "number") return false;
      var res = compareVals(op, x, val);
      return res === true;
    };
  }

  /* ---------- function library ---------- */
  var FN = {};
  function def(names, fn) {
    names.split(" ").forEach(function (n) { FN[n] = fn; });
  }
  /* Numbers only. Text that looks like a number is ignored, which is what Excel
     does inside a range and is the whole point of the data-types lesson. */
  function nums(args) {
    var out = [];
    args.forEach(function (a) {
      flat(a).forEach(function (v) { if (typeof v === "number") out.push(v); });
    });
    return out;
  }
  function allVals(args) {
    var out = [];
    args.forEach(function (a) { flat(a).forEach(function (v) { out.push(v); }); });
    return out;
  }

  /* maths */
  def("SUM", function (a) { var e = firstErr(a); if (e) return e; return nums(a).reduce(function (s, v) { return s + v; }, 0); });
  def("PRODUCT", function (a) { var n = nums(a); return n.length ? n.reduce(function (s, v) { return s * v; }, 1) : 0; });
  def("ABS", function (a) { var v = num(a[0]); return isErr(v) ? v : Math.abs(v); });
  def("INT", function (a) { var v = num(a[0]); return isErr(v) ? v : Math.floor(v); });
  def("MOD", function (a) { var x = num(a[0]), y = num(a[1]); if (isErr(x)) return x; if (isErr(y)) return y; return y === 0 ? err("#DIV/0!") : x - y * Math.floor(x / y); });
  def("SQRT", function (a) { var v = num(a[0]); if (isErr(v)) return v; return v < 0 ? err("#NUM!") : Math.sqrt(v); });
  def("POWER", function (a) { return binop("^", a[0], a[1]); });
  def("ROUND", function (a) {
    var v = num(a[0]), d = a.length > 1 ? num(a[1]) : 0;
    if (isErr(v)) return v; if (isErr(d)) return d;
    var f = Math.pow(10, d);
    return Math.round((v * f + (v >= 0 ? 1e-9 : -1e-9))) / f;
  });
  def("ROUNDUP", function (a) {
    var v = num(a[0]), d = a.length > 1 ? num(a[1]) : 0, f = Math.pow(10, d);
    return (v < 0 ? -1 : 1) * Math.ceil(Math.abs(v) * f) / f;
  });
  def("ROUNDDOWN", function (a) {
    var v = num(a[0]), d = a.length > 1 ? num(a[1]) : 0, f = Math.pow(10, d);
    return (v < 0 ? -1 : 1) * Math.floor(Math.abs(v) * f) / f;
  });
  def("SUMIF", function (a, ctx) {
    var range = a[0], crit = makeCriteria(a[1]), sumR = a.length > 2 ? a[2] : a[0];
    var rv = flat(range), sv = flat(sumR), t = 0;
    for (var i = 0; i < rv.length; i++) if (crit(rv[i])) {
      var n = num(sv[i]);
      if (!isErr(n)) t += n;
    }
    return t;
  });
  def("SUMIFS", function (a) {
    var sv = flat(a[0]), pairs = [];
    for (var i = 1; i + 1 < a.length + 1 && i + 1 <= a.length; i += 2) pairs.push([flat(a[i]), makeCriteria(a[i + 1])]);
    var t = 0;
    for (var r = 0; r < sv.length; r++) {
      var ok = pairs.every(function (p) { return p[1](p[0][r]); });
      if (ok) { var n = num(sv[r]); if (!isErr(n)) t += n; }
    }
    return t;
  });
  def("COUNT", function (a) { return nums(a).length; });
  def("COUNTA", function (a) {
    return allVals(a).filter(function (v) { return !blank(v); }).length;
  });
  def("COUNTBLANK", function (a) {
    return allVals(a).filter(function (v) { return blank(v); }).length;
  });
  def("COUNTIF", function (a) {
    var crit = makeCriteria(a[1]);
    return flat(a[0]).filter(crit).length;
  });
  def("COUNTIFS", function (a) {
    var pairs = [];
    for (var i = 0; i + 1 < a.length + 1 && i + 1 <= a.length; i += 2) pairs.push([flat(a[i]), makeCriteria(a[i + 1])]);
    if (!pairs.length) return 0;
    var n = pairs[0][0].length, t = 0;
    for (var r = 0; r < n; r++) {
      if (pairs.every(function (p) { return p[1](p[0][r]); })) t++;
    }
    return t;
  });
  /* SUBTOTAL's first argument picks the function. 1-11 includes manually hidden rows,
     101-111 excludes them; both skip rows hidden by a filter. Nothing is hidden in this
     grid, so here it simply behaves as the chosen function. */
  var SUBT = {
    1: "AVERAGE", 2: "COUNT", 3: "COUNTA", 4: "MAX", 5: "MIN",
    6: "PRODUCT", 7: "STDEV", 8: "STDEVP", 9: "SUM", 10: "VAR", 11: "VARP"
  };
  def("SUBTOTAL", function (a, ctx) {
    var code = num(a[0]);
    if (isErr(code)) return code;
    var name = SUBT[code > 100 ? code - 100 : code];
    if (!name || !FN[name]) return err("#VALUE!");
    return FN[name](a.slice(1), ctx);
  });
  def("AVERAGE", function (a) {
    var n = nums(a);
    return n.length ? n.reduce(function (s, v) { return s + v; }, 0) / n.length : err("#DIV/0!");
  });
  def("AVERAGEIF", function (a) {
    var rv = flat(a[0]), crit = makeCriteria(a[1]), av = flat(a.length > 2 ? a[2] : a[0]);
    var t = 0, k = 0;
    for (var i = 0; i < rv.length; i++) if (crit(rv[i])) {
      var v = av[i];
      if (typeof v === "number") { t += v; k++; }
    }
    return k ? t / k : err("#DIV/0!");
  });
  def("AVERAGEIFS", function (a) {
    var av = flat(a[0]), pairs = [];
    for (var i = 1; i + 1 <= a.length; i += 2) pairs.push([flat(a[i]), makeCriteria(a[i + 1])]);
    var t = 0, k = 0;
    for (var r = 0; r < av.length; r++) {
      if (pairs.every(function (p) { return p[1](p[0][r]); })) {
        var v = av[r];
        if (typeof v === "number") { t += v; k++; }
      }
    }
    return k ? t / k : err("#DIV/0!");
  });
  def("MAX", function (a) { var n = nums(a); return n.length ? Math.max.apply(null, n) : 0; });
  def("MIN", function (a) { var n = nums(a); return n.length ? Math.min.apply(null, n) : 0; });
  def("MEDIAN", function (a) {
    var n = nums(a).sort(function (x, y) { return x - y; });
    if (!n.length) return err("#NUM!");
    var h = Math.floor(n.length / 2);
    return n.length % 2 ? n[h] : (n[h - 1] + n[h]) / 2;
  });
  def("MODE MODE.SNGL", function (a) {
    var n = nums(a), best = null, bestN = 1, seen = {};
    n.forEach(function (v) { seen[v] = (seen[v] || 0) + 1; });
    n.forEach(function (v) { if (seen[v] > bestN) { bestN = seen[v]; best = v; } });
    return best === null ? err("#N/A") : best;
  });
  def("LARGE", function (a) {
    var n = nums([a[0]]).sort(function (x, y) { return y - x; }), k = num(a[1]);
    return n[k - 1] === undefined ? err("#NUM!") : n[k - 1];
  });
  def("SMALL", function (a) {
    var n = nums([a[0]]).sort(function (x, y) { return x - y; }), k = num(a[1]);
    return n[k - 1] === undefined ? err("#NUM!") : n[k - 1];
  });
  def("RANK RANK.EQ", function (a) {
    var v = num(a[0]), n = nums([a[1]]), desc = a.length < 3 || !bool(a[2]);
    n.sort(function (x, y) { return desc ? y - x : x - y; });
    var ix = n.indexOf(v);
    return ix < 0 ? err("#N/A") : ix + 1;
  });
  def("STDEV.P STDEVP", function (a) {
    var n = nums(a);
    if (!n.length) return err("#DIV/0!");
    var mu = n.reduce(function (s, v) { return s + v; }, 0) / n.length;
    return Math.sqrt(n.reduce(function (s, v) { return s + (v - mu) * (v - mu); }, 0) / n.length);
  });
  def("STDEV.S STDEV STDEVS", function (a) {
    var n = nums(a);
    if (n.length < 2) return err("#DIV/0!");
    var mu = n.reduce(function (s, v) { return s + v; }, 0) / n.length;
    return Math.sqrt(n.reduce(function (s, v) { return s + (v - mu) * (v - mu); }, 0) / (n.length - 1));
  });
  def("VAR.P VARP", function (a) {
    var n = nums(a);
    if (!n.length) return err("#DIV/0!");
    var mu = n.reduce(function (s, v) { return s + v; }, 0) / n.length;
    return n.reduce(function (s, v) { return s + (v - mu) * (v - mu); }, 0) / n.length;
  });
  def("VAR.S VAR VARS", function (a) {
    var n = nums(a);
    if (n.length < 2) return err("#DIV/0!");
    var mu = n.reduce(function (s, v) { return s + v; }, 0) / n.length;
    return n.reduce(function (s, v) { return s + (v - mu) * (v - mu); }, 0) / (n.length - 1);
  });
  /* Percentiles are how pay bands are described, so they matter more in HR than most
     statistics. Linear interpolation, matching PERCENTILE.INC. */
  function percentile(list, p) {
    var n = list.slice().sort(function (x, y) { return x - y; });
    if (!n.length) return err("#NUM!");
    if (p < 0 || p > 1) return err("#NUM!");
    var pos = (n.length - 1) * p;
    var lo = Math.floor(pos), hi = Math.ceil(pos);
    if (lo === hi) return n[lo];
    return n[lo] + (n[hi] - n[lo]) * (pos - lo);
  }
  def("PERCENTILE PERCENTILE.INC", function (a) {
    var p = num(a[1]);
    return isErr(p) ? p : percentile(nums([a[0]]), p);
  });
  def("QUARTILE QUARTILE.INC", function (a) {
    var q = num(a[1]);
    if (isErr(q)) return q;
    if (q < 0 || q > 4) return err("#NUM!");
    return percentile(nums([a[0]]), q / 4);
  });
  def("PERCENTRANK PERCENTRANK.INC", function (a) {
    var list = nums([a[0]]).sort(function (x, y) { return x - y; });
    var v = num(a[1]);
    if (isErr(v)) return v;
    if (!list.length) return err("#NUM!");
    var below = list.filter(function (x) { return x < v; }).length;
    var equal = list.filter(function (x) { return x === v; }).length;
    if (!equal) return err("#N/A");
    return (below + (equal - 1) / 2) / (list.length - 1 || 1);
  });
  def("MAXIFS", function (a) {
    var vals = flat(a[0]), pairs = [];
    for (var i = 1; i + 1 <= a.length; i += 2) pairs.push([flat(a[i]), makeCriteria(a[i + 1])]);
    var keep = [];
    for (var r = 0; r < vals.length; r++) {
      if (pairs.every(function (p) { return p[1](p[0][r]); }) && typeof vals[r] === "number") keep.push(vals[r]);
    }
    return keep.length ? Math.max.apply(null, keep) : 0;
  });
  def("MINIFS", function (a) {
    var vals = flat(a[0]), pairs = [];
    for (var i = 1; i + 1 <= a.length; i += 2) pairs.push([flat(a[i]), makeCriteria(a[i + 1])]);
    var keep = [];
    for (var r = 0; r < vals.length; r++) {
      if (pairs.every(function (p) { return p[1](p[0][r]); }) && typeof vals[r] === "number") keep.push(vals[r]);
    }
    return keep.length ? Math.min.apply(null, keep) : 0;
  });
  def("AVERAGEA", function (a) {
    var vals = allVals(a).filter(function (v) { return !blank(v); });
    if (!vals.length) return err("#DIV/0!");
    var t = 0;
    vals.forEach(function (v) { t += typeof v === "number" ? v : (v === true ? 1 : 0); });
    return t / vals.length;
  });
  def("TRUNC", function (a) {
    var v = num(a[0]), d = a.length > 1 ? num(a[1]) : 0, f = Math.pow(10, d);
    return isErr(v) ? v : (v < 0 ? -1 : 1) * Math.floor(Math.abs(v) * f) / f;
  });
  def("CEILING CEILING.MATH", function (a) {
    var v = num(a[0]), s = a.length > 1 ? num(a[1]) : 1;
    if (isErr(v) || isErr(s)) return err("#VALUE!");
    if (!s) return 0;
    return Math.ceil(v / s) * s;
  });
  def("FLOOR FLOOR.MATH", function (a) {
    var v = num(a[0]), s = a.length > 1 ? num(a[1]) : 1;
    if (isErr(v) || isErr(s)) return err("#VALUE!");
    if (!s) return err("#DIV/0!");
    return Math.floor(v / s) * s;
  });
  def("WEEKNUM", function (a) {
    var s = num(a[0]);
    if (isErr(s)) return s;
    var d = serialDate(s);
    var jan1 = Date.UTC(d.getUTCFullYear(), 0, 1);
    var days = Math.floor((d.getTime() - jan1) / 86400000);
    return Math.floor((days + new Date(jan1).getUTCDay()) / 7) + 1;
  });
  def("YEARFRAC", function (a) {
    var s = num(a[0]), e = num(a[1]);
    if (isErr(s) || isErr(e)) return err("#VALUE!");
    return (e - s) / 365;
  });
  def("TEXTSPLIT", function (a) {
    var s = str(a[0]), sep = str(a[1]) || " ";
    return mat([s.split(sep)]);
  });
  def("VSTACK", function (a) {
    var rows = [];
    a.forEach(function (x) {
      if (isMat(x)) x.m.forEach(function (r) { rows.push(r.slice()); });
      else rows.push([x]);
    });
    var w = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
    rows.forEach(function (r) { while (r.length < w) r.push(""); });
    return mat(rows);
  });
  def("HSTACK", function (a) {
    var cols = a.map(function (x) { return isMat(x) ? x.m : [[x]]; });
    var h = cols.reduce(function (m, c) { return Math.max(m, c.length); }, 0);
    var rows = [];
    for (var i = 0; i < h; i++) {
      var row = [];
      cols.forEach(function (c) {
        var src = c[i] || [];
        var w = c[0] ? c[0].length : 1;
        for (var j = 0; j < w; j++) row.push(src[j] === undefined ? "" : src[j]);
      });
      rows.push(row);
    }
    return mat(rows);
  });
  def("TOCOL", function (a) {
    var out = flat(a[0]).filter(function (v) { return !blank(v); });
    return mat(out.map(function (v) { return [v]; }));
  });
  def("SUMPRODUCT", function (a) {
    var cols = a.map(function (x) { return flat(x); });
    var n = cols[0].length, t = 0;
    for (var i = 0; i < n; i++) {
      var p = 1;
      for (var j = 0; j < cols.length; j++) {
        var v = cols[j][i];
        p *= typeof v === "boolean" ? (v ? 1 : 0) : (typeof v === "number" ? v : 0);
      }
      t += p;
    }
    return t;
  });

  /* logic */
  def("IF", function (a) {
    var c = bool(a[0]);
    if (isErr(c)) return c;
    if (c) return a.length > 1 ? a[1] : true;
    return a.length > 2 ? a[2] : false;
  });
  def("IFS", function (a) {
    for (var i = 0; i + 1 < a.length; i += 2) {
      var c = bool(a[i]);
      if (isErr(c)) return c;
      if (c) return a[i + 1];
    }
    return err("#N/A");
  });
  def("SWITCH", function (a) {
    var v = scalar(a[0]);
    for (var i = 1; i + 1 < a.length; i += 2) {
      if (compareVals("=", v, scalar(a[i])) === true) return a[i + 1];
    }
    return a.length % 2 === 0 ? a[a.length - 1] : err("#N/A");
  });
  def("AND", function (a) {
    var vals = allVals(a).filter(function (v) { return !blank(v); });
    for (var i = 0; i < vals.length; i++) {
      var b = bool(vals[i]);
      if (isErr(b)) return b;
      if (!b) return false;
    }
    return true;
  });
  def("OR", function (a) {
    var vals = allVals(a).filter(function (v) { return !blank(v); });
    for (var i = 0; i < vals.length; i++) {
      var b = bool(vals[i]);
      if (isErr(b)) return b;
      if (b) return true;
    }
    return false;
  });
  def("NOT", function (a) { var b = bool(a[0]); return isErr(b) ? b : !b; });
  def("XOR", function (a) {
    var k = allVals(a).filter(function (v) { return !blank(v) && bool(v) === true; }).length;
    return k % 2 === 1;
  });
  def("TRUE", function () { return true; });
  def("FALSE", function () { return false; });
  def("IFERROR", function (a) { return isErr(scalar(a[0])) ? a[1] : a[0]; });
  def("IFNA", function (a) {
    var v = scalar(a[0]);
    return isErr(v) && v.e === "#N/A" ? a[1] : a[0];
  });
  def("ISBLANK", function (a) { return blank(scalar(a[0])); });
  def("ISERROR", function (a) { return isErr(scalar(a[0])); });
  def("ISNA", function (a) { var v = scalar(a[0]); return isErr(v) && v.e === "#N/A"; });
  def("ISNUMBER", function (a) { return typeof scalar(a[0]) === "number"; });
  def("ISTEXT", function (a) { return typeof scalar(a[0]) === "string" && scalar(a[0]) !== ""; });
  /* Excel's N turns text into 0 even when the text looks numeric — which is the whole
     point of it as a diagnostic for numbers stored as text. */
  def("N", function (a) {
    var v = scalar(a[0]);
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    return 0;
  });

  /* text */
  def("TRIM", function (a) { var s = str(a[0]); return isErr(s) ? s : s.replace(/\s+/g, " ").trim(); });
  def("CLEAN", function (a) { var s = str(a[0]); return isErr(s) ? s : s.replace(/[\x00-\x1f\x7f]/g, ""); });
  def("UPPER", function (a) { var s = str(a[0]); return isErr(s) ? s : s.toUpperCase(); });
  def("LOWER", function (a) { var s = str(a[0]); return isErr(s) ? s : s.toLowerCase(); });
  def("PROPER", function (a) {
    var s = str(a[0]);
    if (isErr(s)) return s;
    return s.toLowerCase().replace(/(^|[^A-Za-z'])([a-z])/g, function (m, p, ch) { return p + ch.toUpperCase(); });
  });
  def("LEN", function (a) { var s = str(a[0]); return isErr(s) ? s : s.length; });
  def("LEFT", function (a) { var s = str(a[0]); var k = a.length > 1 ? num(a[1]) : 1; return isErr(s) ? s : s.slice(0, k); });
  def("RIGHT", function (a) { var s = str(a[0]); var k = a.length > 1 ? num(a[1]) : 1; return isErr(s) ? s : (k <= 0 ? "" : s.slice(-k)); });
  def("MID", function (a) {
    var s = str(a[0]), st = num(a[1]), k = num(a[2]);
    if (isErr(s)) return s;
    return st < 1 ? err("#VALUE!") : s.substr(st - 1, k);
  });
  def("FIND", function (a) {
    var f = str(a[0]), s = str(a[1]), st = a.length > 2 ? num(a[2]) : 1;
    var i = s.indexOf(f, st - 1);
    return i < 0 ? err("#VALUE!") : i + 1;
  });
  def("SEARCH", function (a) {
    var f = str(a[0]).toLowerCase(), s = str(a[1]).toLowerCase(), st = a.length > 2 ? num(a[2]) : 1;
    if (/[*?]/.test(f)) {
      var rx = wildcard("*" + f + "*");
      if (!rx.test(s)) return err("#VALUE!");
    }
    var i = s.indexOf(f, st - 1);
    return i < 0 ? err("#VALUE!") : i + 1;
  });
  def("SUBSTITUTE", function (a) {
    var s = str(a[0]), oldT = str(a[1]), newT = str(a[2]);
    if (oldT === "") return s;
    if (a.length > 3) {
      var k = num(a[3]), i = -1, c = 0;
      while (c < k) {
        i = s.indexOf(oldT, i + 1);
        if (i < 0) return s;
        c++;
      }
      return s.slice(0, i) + newT + s.slice(i + oldT.length);
    }
    return s.split(oldT).join(newT);
  });
  def("REPLACE", function (a) {
    var s = str(a[0]), st = num(a[1]), k = num(a[2]), nt = str(a[3]);
    return s.slice(0, st - 1) + nt + s.slice(st - 1 + k);
  });
  def("REPT", function (a) { var s = str(a[0]), k = num(a[1]); return k <= 0 ? "" : new Array(Math.floor(k) + 1).join(s); });
  def("EXACT", function (a) { return str(a[0]) === str(a[1]); });
  def("CONCAT CONCATENATE", function (a) {
    var out = "";
    allVals(a).forEach(function (v) { if (!blank(v)) out += str(v); });
    return out;
  });
  def("TEXTJOIN", function (a) {
    var sep = str(a[0]), skip = bool(a[1]);
    var parts = [];
    allVals(a.slice(2)).forEach(function (v) {
      if (blank(v) && skip) return;
      parts.push(str(v));
    });
    return parts.join(sep);
  });
  def("TEXTBEFORE", function (a) {
    var s = str(a[0]), d = str(a[1]), i = s.indexOf(d);
    return i < 0 ? err("#N/A") : s.slice(0, i);
  });
  def("TEXTAFTER", function (a) {
    var s = str(a[0]), d = str(a[1]), i = s.indexOf(d);
    return i < 0 ? err("#N/A") : s.slice(i + d.length);
  });
  def("VALUE", function (a) {
    var s = str(a[0]).trim().replace(/[,%€£$]/g, "");
    if (s === "") return 0;
    var d = parseDateString(str(a[0]).trim());
    if (d !== null) return d;
    return isNaN(Number(s)) ? err("#VALUE!") : Number(s);
  });
  def("TEXT", function (a) {
    var v = scalar(a[0]), f = str(a[1]);
    return formatValue(v, f);
  });

  /* dates */
  def("TODAY", function () { return TODAY; });
  def("NOW", function () { return TODAY + 0.5; });
  def("DATE", function (a) {
    var y = num(a[0]), m = num(a[1]), d = num(a[2]);
    if (isErr(y)) return y;
    return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / DAYMS);
  });
  def("DAY", function (a) { var v = num(a[0]); return isErr(v) ? v : serialDate(v).getUTCDate(); });
  def("MONTH", function (a) { var v = num(a[0]); return isErr(v) ? v : serialDate(v).getUTCMonth() + 1; });
  def("YEAR", function (a) { var v = num(a[0]); return isErr(v) ? v : serialDate(v).getUTCFullYear(); });
  def("WEEKDAY", function (a) {
    var v = num(a[0]), type = a.length > 1 ? num(a[1]) : 1;
    var d = serialDate(v).getUTCDay();
    if (type === 2) return d === 0 ? 7 : d;
    if (type === 3) return d === 0 ? 6 : d - 1;
    return d + 1;
  });
  def("DAYS", function (a) { var x = num(a[0]), y = num(a[1]); return x - y; });
  def("DATEDIF", function (a) {
    var s = num(a[0]), e = num(a[1]), unit = str(a[2]).toUpperCase();
    if (isErr(s)) return s;
    if (isErr(e)) return e;
    if (e < s) return err("#NUM!");
    var ds = serialDate(s), de = serialDate(e);
    if (unit === "D") return e - s;
    var months = (de.getUTCFullYear() - ds.getUTCFullYear()) * 12 + (de.getUTCMonth() - ds.getUTCMonth());
    if (de.getUTCDate() < ds.getUTCDate()) months--;
    if (unit === "M") return months;
    if (unit === "Y") return Math.floor(months / 12);
    if (unit === "MD") {
      var tmp = new Date(Date.UTC(de.getUTCFullYear(), de.getUTCMonth() - (de.getUTCDate() < ds.getUTCDate() ? 1 : 0), ds.getUTCDate()));
      return Math.round((de - tmp) / DAYMS);
    }
    if (unit === "YM") return months % 12;
    return err("#NUM!");
  });
  def("EDATE", function (a) {
    var s = num(a[0]), k = num(a[1]), d = serialDate(s);
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + k, day = d.getUTCDate();
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return Math.round((Date.UTC(y, m, Math.min(day, last)) - EPOCH) / DAYMS);
  });
  def("EOMONTH", function (a) {
    var s = num(a[0]), k = num(a[1]), d = serialDate(s);
    return Math.round((Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + k + 1, 0) - EPOCH) / DAYMS);
  });
  def("NETWORKDAYS", function (a) {
    var s = num(a[0]), e = num(a[1]);
    if (isErr(s)) return s;
    if (isErr(e)) return e;
    var sign = 1;
    if (e < s) { var t = s; s = e; e = t; sign = -1; }
    var holidays = {};
    if (a.length > 2) flat(a[2]).forEach(function (h) { var n = num(h); if (!isErr(n)) holidays[Math.round(n)] = 1; });
    var count = 0;
    for (var d = Math.round(s); d <= Math.round(e); d++) {
      var dow = serialDate(d).getUTCDay();
      if (dow === 0 || dow === 6) continue;
      if (holidays[d]) continue;
      count++;
    }
    return count * sign;
  });
  def("WORKDAY", function (a) {
    var s = Math.round(num(a[0])), k = Math.round(num(a[1])), step = k < 0 ? -1 : 1, left = Math.abs(k), d = s;
    while (left > 0) {
      d += step;
      var dow = serialDate(d).getUTCDay();
      if (dow !== 0 && dow !== 6) left--;
    }
    return d;
  });

  /* lookup */
  def("ROWS", function (a) { return isMat(a[0]) ? a[0].r : 1; });
  def("COLUMNS", function (a) { return isMat(a[0]) ? a[0].c : 1; });
  def("CHOOSE", function (a) {
    var k = num(a[0]);
    return a[k] === undefined ? err("#VALUE!") : a[k];
  });
  def("MATCH XMATCH", function (a) {
    var needle = scalar(a[0]), hay = flat(a[1]);
    var mode = a.length > 2 ? num(a[2]) : (FN.__xmatch ? 0 : 1);
    for (var i = 0; i < hay.length; i++) {
      if (compareVals("=", hay[i], needle) === true) return i + 1;
    }
    if (mode === 1) {
      var best = -1;
      for (var j = 0; j < hay.length; j++) if (compareVals("<=", hay[j], needle) === true) best = j;
      if (best >= 0) return best + 1;
    }
    if (mode === -1) {
      for (var k2 = 0; k2 < hay.length; k2++) if (compareVals(">=", hay[k2], needle) === true) return k2 + 1;
    }
    return err("#N/A");
  });
  def("INDEX", function (a) {
    var m = a[0];
    if (!isMat(m)) {
      var r0 = num(a[1]);
      return r0 === 1 || a.length < 2 ? m : err("#REF!");
    }
    var r = a.length > 1 ? num(a[1]) : 0;
    var c = a.length > 2 ? num(a[2]) : 0;
    if (m.r === 1 && a.length === 2) { c = r; r = 1; }
    if (m.c === 1 && a.length === 2) c = 1;
    if (r === 0 && c > 0) {
      var col = [];
      for (var i = 0; i < m.r; i++) col.push([m.m[i][c - 1]]);
      return mat(col);
    }
    if (c === 0 && r > 0) return mat([m.m[r - 1].slice()]);
    if (r < 1 || r > m.r || c < 1 || c > m.c) return err("#REF!");
    return m.m[r - 1][c - 1];
  });
  def("VLOOKUP", function (a) {
    var needle = scalar(a[0]), tbl = a[1], ci = num(a[2]);
    var approx = a.length > 3 ? bool(a[3]) : true;
    if (!isMat(tbl)) return err("#VALUE!");
    var bestRow = -1;
    for (var i = 0; i < tbl.r; i++) {
      var v = tbl.m[i][0];
      if (compareVals("=", v, needle) === true) { bestRow = i; break; }
      if (approx && compareVals("<=", v, needle) === true) bestRow = i;
    }
    if (bestRow < 0) return err("#N/A");
    if (ci < 1 || ci > tbl.c) return err("#REF!");
    return tbl.m[bestRow][ci - 1];
  });
  def("HLOOKUP", function (a) {
    var needle = scalar(a[0]), tbl = a[1], ri = num(a[2]);
    if (!isMat(tbl)) return err("#VALUE!");
    for (var j = 0; j < tbl.c; j++) {
      if (compareVals("=", tbl.m[0][j], needle) === true) {
        if (ri < 1 || ri > tbl.r) return err("#REF!");
        return tbl.m[ri - 1][j];
      }
    }
    return err("#N/A");
  });
  def("XLOOKUP", function (a) {
    var needle = scalar(a[0]), look = a[1], ret = a[2];
    var notFound = a.length > 3 ? a[3] : err("#N/A");
    var mode = a.length > 4 ? num(a[4]) : 0;
    var lv = flat(look);
    var found = -1;
    if (mode === 0) {
      for (var i = 0; i < lv.length; i++) if (compareVals("=", lv[i], needle) === true) { found = i; break; }
    } else if (mode === -1) {
      for (var j = 0; j < lv.length; j++) if (compareVals("<=", lv[j], needle) === true) found = j;
    } else if (mode === 1) {
      for (var k = 0; k < lv.length; k++) if (compareVals(">=", lv[k], needle) === true) { found = k; break; }
    } else if (mode === 2) {
      var rx = wildcard(String(needle));
      for (var w = 0; w < lv.length; w++) if (rx.test(String(blank(lv[w]) ? "" : lv[w]))) { found = w; break; }
    }
    if (found < 0) return notFound;
    if (!isMat(ret)) return ret;
    if (ret.c === 1 || ret.r === lv.length) {
      if (ret.c === 1) return ret.m[found] ? ret.m[found][0] : err("#REF!");
      return mat([ret.m[found].slice()]);
    }
    if (ret.r === 1) return ret.m[0][found] === undefined ? err("#REF!") : ret.m[0][found];
    return err("#VALUE!");
  });
  def("FILTER", function (a) {
    var src = a[0], keep = flat(a[1]);
    var empty = a.length > 2 ? a[2] : err("#CALC!");
    if (!isMat(src)) return bool(keep[0]) ? src : empty;
    var rows = [];
    for (var i = 0; i < src.r; i++) if (bool(keep[i]) === true) rows.push(src.m[i].slice());
    if (!rows.length) return empty;
    return mat(rows);
  });
  def("UNIQUE", function (a) {
    var src = a[0];
    if (!isMat(src)) return src;
    var seen = {}, rows = [];
    for (var i = 0; i < src.r; i++) {
      var key = src.m[i].map(function (v) { return String(blank(v) ? "" : v).toLowerCase(); }).join("\u0001");
      if (seen[key]) continue;
      seen[key] = 1;
      rows.push(src.m[i].slice());
    }
    return mat(rows);
  });
  def("SORT", function (a) {
    var src = a[0];
    if (!isMat(src)) return src;
    var ix = a.length > 1 ? num(a[1]) : 1;
    var dir = a.length > 2 ? num(a[2]) : 1;
    var rows = src.m.map(function (r) { return r.slice(); });
    rows.sort(function (x, y) {
      var av = x[ix - 1], bv = y[ix - 1];
      var c = compareVals("<", av, bv) === true ? -1 : (compareVals("=", av, bv) === true ? 0 : 1);
      return dir < 0 ? -c : c;
    });
    return mat(rows);
  });
  def("SORTBY", function (a) {
    var src = a[0], by = flat(a[1]);
    if (!isMat(src)) return src;
    var pairs = src.m.map(function (r, i) { return { r: r.slice(), k: by[i] }; });
    pairs.sort(function (x, y) { return compareVals("<", x.k, y.k) === true ? -1 : (compareVals("=", x.k, y.k) === true ? 0 : 1); });
    return mat(pairs.map(function (p) { return p.r; }));
  });
  def("SEQUENCE", function (a) {
    var r = num(a[0]), c = a.length > 1 ? num(a[1]) : 1;
    var start = a.length > 2 ? num(a[2]) : 1, step = a.length > 3 ? num(a[3]) : 1;
    var rows = [], v = start;
    for (var i = 0; i < r; i++) {
      var row = [];
      for (var j = 0; j < c; j++) { row.push(v); v += step; }
      rows.push(row);
    }
    return mat(rows);
  });
  def("TRANSPOSE", function (a) {
    var m = a[0];
    if (!isMat(m)) return m;
    var rows = [];
    for (var j = 0; j < m.c; j++) {
      var row = [];
      for (var i = 0; i < m.r; i++) row.push(m.m[i][j]);
      rows.push(row);
    }
    return mat(rows);
  });

  /* DAX-flavoured helpers, used by the Power BI sandbox */
  def("DIVIDE", function (a) {
    var x = num(a[0]), y = num(a[1]);
    if (isErr(x)) return x;
    if (isErr(y)) return y;
    if (y === 0) return a.length > 2 ? a[2] : "";
    return x / y;
  });
  def("COUNTROWS", function (a) { return isMat(a[0]) ? a[0].r : (blank(scalar(a[0])) ? 0 : 1); });
  def("DISTINCTCOUNT", function (a) {
    var seen = {};
    flat(a[0]).forEach(function (v) { if (!blank(v)) seen[String(v).toLowerCase()] = 1; });
    return Object.keys(seen).length;
  });

  /* In Excel 365, handing one of these a whole array of criteria returns one answer
     per criterion and spills. That is what makes UNIQUE down the side plus COUNTIFS
     across a self-maintaining summary, so the engine has to do it too. */
  var CRIT_ARGS = {
    COUNTIF: [1], COUNTIFS: [1, 3, 5, 7],
    SUMIF: [1], SUMIFS: [2, 4, 6, 8],
    AVERAGEIF: [1], AVERAGEIFS: [2, 4, 6, 8]
  };
  Object.keys(CRIT_ARGS).forEach(function (name) {
    var base = FN[name];
    if (!base) return;
    var slots = CRIT_ARGS[name];
    FN[name] = function (a, ctx) {
      var spot = -1;
      for (var i = 0; i < slots.length; i++) {
        var ix = slots[i];
        if (ix < a.length && isMat(a[ix]) && a[ix].r * a[ix].c > 1) { spot = ix; break; }
      }
      if (spot < 0) return base(a, ctx);
      var m = a[spot], rows = [];
      for (var r = 0; r < m.r; r++) {
        var out = [];
        for (var c = 0; c < m.c; c++) {
          var copy = a.slice();
          copy[spot] = m.m[r][c];
          out.push(base(copy, ctx));
        }
        rows.push(out);
      }
      return mat(rows);
    };
  });

  function callFn(node, ctx) {
    var name = node.name;
    var fn = FN[name];
    if (!fn) return err("#NAME?");
    var args = [];
    for (var i = 0; i < node.args.length; i++) args.push(evaluate(node.args[i], ctx));
    if (name !== "IFERROR" && name !== "IFNA" && name !== "ISERROR" && name !== "ISNA" && name !== "IF" && name !== "IFS") {
      var e = firstErr(args);
      if (e) return e;
    }
    try {
      return fn(args, ctx);
    } catch (ex) {
      return err("#VALUE!");
    }
  }

  /* ---------- display formatting ---------- */
  function pad(n, k) { var s = String(n); while (s.length < k) s = "0" + s; return s; }

  function formatValue(v, fmt) {
    if (isErr(v)) return v.e;
    if (v === null || v === undefined || v === "") return "";
    if (isMat(v)) v = scalar(v);
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    if (!fmt || fmt === "general") {
      if (typeof v === "number") return trimNum(v);
      return String(v);
    }
    if (typeof v === "string" && !/^[\d.]+$/.test(v)) {
      var maybe = parseDateString(v);
      if (maybe === null) return v;
      v = maybe;
    }
    var n = typeof v === "number" ? v : Number(v);
    if (isNaN(n)) return String(v);
    switch (fmt) {
      case "text": return String(v);
      case "int": return String(Math.round(n));
      case "n1": return n.toFixed(1);
      case "n2": return n.toFixed(2);
      case "pct": return (n * 100).toFixed(0) + "%";
      case "pct1": return (n * 100).toFixed(1) + "%";
      case "eur": return "\u20ac" + Math.round(n).toLocaleString("en-IE");
      case "eur2": return "\u20ac" + n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "comma": return Math.round(n).toLocaleString("en-IE");
      case "date": return fmtDate(n, "d mmm yyyy");
      case "dshort": return fmtDate(n, "d mmm");
      case "mmmyyyy": return fmtDate(n, "mmm yyyy");
      case "days": return trimNum(n) + (Math.abs(n) === 1 ? " day" : " days");
      default:
        /* A pattern with 0 or # is a number format; anything else is a date format. */
        return /[0#]/.test(fmt) ? fmtNumPattern(n, fmt) : fmtDate(n, fmt);
    }
  }
  /* Excel number patterns: 0%, 0.0%, #,##0, €#,##0.00 and friends. */
  function fmtNumPattern(n, pattern) {
    var pct = pattern.indexOf("%") >= 0;
    if (pct) n = n * 100;
    var core = pattern.replace(/%/g, "");
    var m = /[0#][0#,.]*/.exec(core);
    if (!m) return trimNum(n) + (pct ? "%" : "");
    var digits = m[0];
    var prefix = core.slice(0, m.index).replace(/"/g, "");
    var suffix = core.slice(m.index + digits.length).replace(/"/g, "");
    var dot = digits.indexOf(".");
    var decimals = dot >= 0 ? digits.length - dot - 1 : 0;
    var grouped = digits.indexOf(",") >= 0;
    var abs = Math.abs(n);
    var body = grouped
      ? abs.toLocaleString("en-IE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : abs.toFixed(decimals);
    return (n < 0 ? "-" : "") + prefix + body + suffix + (pct ? "%" : "");
  }
  function trimNum(n) {
    if (!isFinite(n)) return String(n);
    var r = Math.round(n * 1e10) / 1e10;
    if (Number.isInteger(r)) return String(r);
    return String(parseFloat(r.toFixed(10)));
  }
  function fmtDate(serial, pattern) {
    var d = serialDate(serial);
    var yyyy = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
    return pattern
      .replace(/yyyy/g, yyyy)
      .replace(/yy/g, pad(yyyy % 100, 2))
      .replace(/mmmm/g, MONL[m])
      .replace(/mmm/g, MON[m])
      .replace(/mm/g, pad(m + 1, 2))
      .replace(/ddd/g, DOW[d.getUTCDay()])
      .replace(/dd/g, pad(day, 2))
      .replace(/\bd\b/g, day)
      .replace(/d/g, day)
      .replace(/\bm\b/g, m + 1);
  }

  /* ---------- workbook model ---------- */
  function Workbook(opts) {
    opts = opts || {};
    this.cells = {};            /* "C4" -> { raw, fmt } */
    this.formats = opts.formats || {};  /* column letter -> fmt */
    this.cellFormats = opts.cellFormats || {};
    this.tables = {};
    this.names = opts.names || {};
    this.cache = {};
    this.busy = {};
    this.spill = {};
    if (opts.tables) {
      var self = this;
      Object.keys(opts.tables).forEach(function (k) { self.addTable(k, opts.tables[k]); });
    }
  }

  Workbook.prototype.addTable = function (name, spec) {
    /* spec: { range:'A1:L7', header:true } — header row supplies column names */
    var m = /^([A-Za-z]+)(\d+):([A-Za-z]+)(\d+)$/.exec(spec.range);
    if (!m) return;
    var c1 = colToNum(m[1]), r1 = +m[2], c2 = colToNum(m[3]), r2 = +m[4];
    var header = spec.header !== false;
    this.tables[name.toLowerCase()] = {
      name: name, c1: c1, c2: c2, r1: r1, r2: r2,
      headerRow: header ? r1 : null,
      first: header ? r1 + 1 : r1,
      last: r2,
      cols: null
    };
    this.refreshTableCols(name);
  };
  Workbook.prototype.refreshTableCols = function (name) {
    var t = this.tables[name.toLowerCase()];
    if (!t) return;
    var cols = {};
    if (t.headerRow !== null) {
      for (var c = t.c1; c <= t.c2; c++) {
        var h = this.raw(c, t.headerRow);
        if (h) cols[String(h).trim().toLowerCase()] = c;
      }
    }
    t.cols = cols;
  };
  Workbook.prototype.raw = function (col, row) {
    var k = a1(col, row);
    var c = this.cells[k];
    return c ? c.raw : "";
  };
  Workbook.prototype.setRaw = function (ref, raw) {
    var r = typeof ref === "string" ? parseRef(ref) : ref;
    if (!r) return;
    var k = a1(r.col, r.row);
    if (raw === "" || raw === null || raw === undefined) delete this.cells[k];
    else this.cells[k] = { raw: String(raw) };
    this.recalc();
  };
  Workbook.prototype.load = function (rows, startRef) {
    var base = parseRef(startRef || "A1");
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i] || [];
      for (var j = 0; j < row.length; j++) {
        var v = row[j];
        if (v === null || v === undefined || v === "") continue;
        this.cells[a1(base.col + j, base.row + i)] = { raw: String(v) };
      }
    }
    var self = this;
    Object.keys(this.tables).forEach(function (k) { self.refreshTableCols(self.tables[k].name); });
    this.recalc();
  };
  Workbook.prototype.recalc = function () {
    this.cache = {};
    this.busy = {};
    this.spill = {};
    /* Resolve every formula once so spill ranges are known before painting. */
    var keys = Object.keys(this.cells);
    for (var i = 0; i < keys.length; i++) {
      var raw = this.cells[keys[i]].raw;
      if (typeof raw === "string" && raw.charAt(0) === "=") this.valueAt(keys[i]);
    }
  };
  Workbook.prototype.ctxFor = function (col, row) {
    var wb = this;
    return {
      row: row,
      col: col,
      cell: function (c, r) { return wb.cellValue(c, r); },
      table: function (n) { return wb.tables[String(n).toLowerCase()] || null; },
      tableAt: function (c, r) {
        var keys = Object.keys(wb.tables);
        for (var i = 0; i < keys.length; i++) {
          var t = wb.tables[keys[i]];
          if (c >= t.c1 - 40 && c <= t.c2 + 40 && r >= t.first && r <= t.last) return t;
        }
        return null;
      },
      spillBlock: function (c, r) { return wb.spillMatrix(c, r); },
      name: function (n) {
        var v = wb.names[n] || wb.names[n.toUpperCase()];
        if (v === undefined) return null;
        if (typeof v === "string" && /^[A-Za-z]+\d+:[A-Za-z]+\d+$/.test(v)) {
          var parts = v.split(":");
          return rangeMatrix(parts[0], parts[1], wb.ctxFor(col, row));
        }
        return v;
      }
    };
  };
  Workbook.prototype.cellValue = function (col, row) {
    var key = a1(col, row);
    if (Object.prototype.hasOwnProperty.call(this.cache, key)) return this.cache[key];
    var cell = this.cells[key];
    if (!cell) {
      var sp = this.spill[key];
      return sp !== undefined ? sp : null;
    }
    if (this.busy[key]) return err("#REF!");
    var raw = cell.raw;
    var out;
    if (typeof raw === "string" && raw.charAt(0) === "=") {
      this.busy[key] = true;
      try {
        var node = cell.node || (cell.node = compile(raw.slice(1)));
        out = evaluate(node, this.ctxFor(col, row));
      } catch (e) {
        out = err("#VALUE!");
      }
      delete this.busy[key];
      if (isMat(out)) {
        this.registerSpill(col, row, out);
        out = out.r && out.c ? out.m[0][0] : err("#CALC!");
      }
    } else {
      out = literal(raw);
    }
    this.cache[key] = out;
    return out;
  };
  /* The block behind N2#: the full matrix the formula in N2 produces. */
  Workbook.prototype.spillMatrix = function (col, row) {
    var key = a1(col, row);
    var cell = this.cells[key];
    if (!cell) return null;
    var raw = cell.raw;
    if (typeof raw !== "string" || raw.charAt(0) !== "=") return mat([[this.cellValue(col, row)]]);
    if (this.busy[key]) return err("#REF!");
    this.busy[key] = true;
    var out;
    try {
      var node = cell.node || (cell.node = compile(raw.slice(1)));
      out = evaluate(node, this.ctxFor(col, row));
    } catch (e) {
      out = err("#VALUE!");
    }
    delete this.busy[key];
    if (isErr(out)) return out;
    return isMat(out) ? out : mat([[out]]);
  };
  Workbook.prototype.registerSpill = function (col, row, m) {
    for (var i = 0; i < m.r; i++) {
      for (var j = 0; j < m.c; j++) {
        if (i === 0 && j === 0) continue;
        var key = a1(col + j, row + i);
        if (this.cells[key]) continue;
        this.spill[key] = m.m[i][j];
      }
    }
  };
  Workbook.prototype.valueAt = function (ref) {
    var r = typeof ref === "string" ? parseRef(ref) : ref;
    if (!r) return err("#REF!");
    return this.cellValue(r.col, r.row);
  };
  Workbook.prototype.matrixAt = function (rangeTxt) {
    var p = rangeTxt.split(":");
    return rangeMatrix(p[0], p[1] || p[0], this.ctxFor(1, 1));
  };
  Workbook.prototype.evalFormula = function (src, col, row) {
    var text = String(src || "").trim();
    if (text.charAt(0) === "=") text = text.slice(1);
    if (text === "") return null;
    try {
      return evaluate(compile(text), this.ctxFor(col || 1, row || 1));
    } catch (e) {
      return err("#VALUE!");
    }
  };
  Workbook.prototype.formatOf = function (col, row) {
    var key = a1(col, row);
    if (this.cellFormats[key]) return this.cellFormats[key];
    return this.formats[numToCol(col)] || "general";
  };
  Workbook.prototype.display = function (col, row) {
    var key = a1(col, row);
    var cell = this.cells[key];
    var v = this.cellValue(col, row);
    if (v === null || v === undefined) return "";
    if (cell && typeof cell.raw === "string" && cell.raw.charAt(0) !== "=" && typeof v === "string") return v;
    return formatValue(v, this.formatOf(col, row));
  };

  function literal(raw) {
    if (raw === null || raw === undefined || raw === "") return null;
    if (typeof raw === "number") return raw;
    var s = String(raw);
    if (s.charAt(0) === "'") return s.slice(1);
    var up = s.trim().toUpperCase();
    if (up === "TRUE") return true;
    if (up === "FALSE") return false;
    /* A stray space makes it text, exactly as in Excel. This is the single most
       common reason a real HR export refuses to add up. */
    if (s === s.trim() && s !== "" && !isNaN(Number(s))) return Number(s);
    var d = parseDateString(s);
    if (d !== null) return d;
    return s;
  }

  /* ---------- public ---------- */
  global.Fx = {
    Workbook: Workbook,
    compile: compile,
    tokenize: tokenize,
    evaluate: evaluate,
    formatValue: formatValue,
    dateSerial: dateSerial,
    serialDate: serialDate,
    parseDateString: parseDateString,
    TODAY: TODAY,
    TODAY_TEXT: fmtDate(TODAY, "d mmm yyyy"),
    colToNum: colToNum,
    numToCol: numToCol,
    parseRef: parseRef,
    a1: a1,
    isErr: isErr,
    isMat: isMat,
    mat: mat,
    flat: flat,
    scalar: scalar,
    num: num,
    str: str,
    literal: literal,
    FN: FN
  };
})(window);
