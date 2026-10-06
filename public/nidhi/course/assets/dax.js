/* A small DAX evaluator over the practice tables.
   It exists so that filter context can be demonstrated rather than asserted: the
   slicers set an outer filter, measures react to it, and CALCULATE and ALL visibly
   override it. Supports the subset a recruiting report actually needs. */
(function (global) {
  "use strict";

  function err(msg) { return { e: msg }; }
  function isErr(v) { return !!v && typeof v === "object" && typeof v.e === "string"; }
  function blank(v) { return v === null || v === undefined || v === ""; }

  /* ---------- tokenizer ---------- */
  function tokenize(src) {
    var out = [], i = 0, n = src.length;
    while (i < n) {
      var c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '"') {
        var j = i + 1, s = "";
        while (j < n && src[j] !== '"') { s += src[j++]; }
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
      if (c === "[") {
        var e = src.indexOf("]", i);
        if (e < 0) return null;
        out.push({ t: "col", v: src.slice(i + 1, e) });
        i = e + 1;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        var p = i;
        while (p < n && /[A-Za-z0-9_.]/.test(src[p])) p++;
        var word = src.slice(i, p);
        if (src[p] === "[") {
          var e2 = src.indexOf("]", p);
          if (e2 < 0) return null;
          out.push({ t: "colref", table: word, col: src.slice(p + 1, e2) });
          i = e2 + 1;
          continue;
        }
        if (src[p] === "(") { out.push({ t: "fn", v: word.toUpperCase() }); i = p; continue; }
        out.push({ t: "name", v: word });
        i = p;
        continue;
      }
      var two = src.substr(i, 2);
      if (two === "&&" || two === "||" || two === "<=" || two === ">=" || two === "<>") {
        out.push({ t: "op", v: two });
        i += 2;
        continue;
      }
      if ("+-*/^&=<>(),".indexOf(c) >= 0) { out.push({ t: "op", v: c }); i++; continue; }
      return null;
    }
    return out;
  }

  /* ---------- parser ---------- */
  function parse(tokens) {
    var pos = 0;
    function peek() { return tokens[pos]; }
    function isOp(v) { var t = peek(); return t && t.t === "op" && t.v === v; }
    function eat(v) { if (isOp(v)) { pos++; return true; } return false; }

    function primary() {
      var t = peek();
      if (!t) throw new Error("unexpected end");
      if (t.t === "num") { pos++; return { k: "num", v: t.v }; }
      if (t.t === "str") { pos++; return { k: "str", v: t.v }; }
      if (t.t === "col") { pos++; return { k: "col", col: t.v }; }
      if (t.t === "colref") { pos++; return { k: "col", table: t.table, col: t.col }; }
      if (t.t === "fn") {
        pos++;
        eat("(");
        var args = [];
        if (!isOp(")")) {
          args.push(expr());
          while (eat(",")) args.push(expr());
        }
        if (!eat(")")) throw new Error("missing )");
        return { k: "call", name: t.v, args: args };
      }
      if (t.t === "name") {
        pos++;
        var up = t.v.toUpperCase();
        if (up === "TRUE") return { k: "bool", v: true };
        if (up === "FALSE") return { k: "bool", v: false };
        return { k: "table", v: t.v };
      }
      if (isOp("(")) {
        pos++;
        var e = expr();
        if (!eat(")")) throw new Error("missing )");
        return e;
      }
      if (isOp("-")) { pos++; return { k: "neg", a: primary() }; }
      throw new Error("unexpected token");
    }
    function mul() {
      var a = primary();
      while (isOp("*") || isOp("/")) {
        var op = peek().v;
        pos++;
        a = { k: "bin", op: op, a: a, b: primary() };
      }
      return a;
    }
    function add() {
      var a = mul();
      while (isOp("+") || isOp("-") || isOp("&")) {
        var op = peek().v;
        pos++;
        a = { k: "bin", op: op, a: a, b: mul() };
      }
      return a;
    }
    function cmp() {
      var a = add();
      while (isOp("=") || isOp("<") || isOp(">") || isOp("<=") || isOp(">=") || isOp("<>")) {
        var op = peek().v;
        pos++;
        a = { k: "bin", op: op, a: a, b: add() };
      }
      return a;
    }
    function expr() {
      var a = cmp();
      while (isOp("&&") || isOp("||")) {
        var op = peek().v;
        pos++;
        a = { k: "bin", op: op, a: a, b: cmp() };
      }
      return a;
    }
    var out = expr();
    if (pos < tokens.length) throw new Error("trailing input");
    return out;
  }

  /* ---------- evaluator ---------- */
  /* ctx = { rows: [...], all: [...], row: <object or null> } */
  function evaluate(node, ctx) {
    switch (node.k) {
      case "num": return node.v;
      case "str": return node.v;
      case "bool": return node.v;
      case "table": return { table: node.v, rows: ctx.rows };
      case "neg": {
        var v = evaluate(node.a, ctx);
        return typeof v === "number" ? -v : err("#VALUE");
      }
      case "col": {
        /* A bare column reference only means something inside a row context. */
        if (ctx.row) {
          var val = ctx.row[node.col];
          return val === undefined ? err("#COL " + node.col) : val;
        }
        return { column: node.col, rows: ctx.rows };
      }
      case "bin": return binop(node.op, node, ctx);
      case "call": return call(node, ctx);
    }
    return err("#NODE");
  }

  function binop(op, node, ctx) {
    var a = evaluate(node.a, ctx), b = evaluate(node.b, ctx);
    if (isErr(a)) return a;
    if (isErr(b)) return b;
    if (a && a.column) a = colValues(a).length === 1 ? colValues(a)[0] : err("#MANY");
    if (b && b.column) b = colValues(b).length === 1 ? colValues(b)[0] : err("#MANY");
    if (isErr(a)) return a;
    if (isErr(b)) return b;
    switch (op) {
      case "+": return Number(a) + Number(b);
      case "-": return Number(a) - Number(b);
      case "*": return Number(a) * Number(b);
      case "/": return Number(b) === 0 ? err("#DIV/0") : Number(a) / Number(b);
      case "&": return String(a) + String(b);
      case "=": return same(a, b);
      case "<>": return !same(a, b);
      case ">": return cmpVal(a, b) > 0;
      case "<": return cmpVal(a, b) < 0;
      case ">=": return cmpVal(a, b) >= 0;
      case "<=": return cmpVal(a, b) <= 0;
      case "&&": return !!a && !!b;
      case "||": return !!a || !!b;
    }
    return err("#OP");
  }
  function same(a, b) {
    if (typeof a === "string" || typeof b === "string") {
      return String(a).toLowerCase() === String(b).toLowerCase();
    }
    return a === b;
  }
  function cmpVal(a, b) {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a) < String(b) ? -1 : (String(a) > String(b) ? 1 : 0);
  }
  function colValues(ref) {
    return ref.rows.map(function (r) { return r[ref.column]; });
  }
  function nums(ref) {
    return colValues(ref).filter(function (v) { return typeof v === "number"; });
  }

  function rowsOf(v, ctx) {
    if (v && v.rows && (v.table || v.filtered)) return v.rows;
    if (v && v.rows) return v.rows;
    return ctx.rows;
  }

  var TABLE_FNS = ["ALL", "ALLSELECTED", "FILTER", "VALUES", "DISTINCT"];

  /* Which columns does this predicate touch? CALCULATE drops the outer filter on them. */
  function colsUsed(node, into) {
    if (!node || typeof node !== "object") return into;
    if (node.k === "col" && into.indexOf(node.col) < 0) into.push(node.col);
    ["a", "b"].forEach(function (k) { if (node[k]) colsUsed(node[k], into); });
    if (node.args) node.args.forEach(function (x) { colsUsed(x, into); });
    return into;
  }

  function call(node, ctx) {
    var name = node.name;
    var A = node.args;

    switch (name) {
      case "COUNTROWS": {
        var t = A.length ? evaluate(A[0], ctx) : { rows: ctx.rows };
        if (isErr(t)) return t;
        return rowsOf(t, ctx).length;
      }
      case "FILTER": {
        var src = evaluate(A[0], ctx);
        if (isErr(src)) return src;
        var frows = rowsOf(src, ctx);
        var kept = [];
        for (var i = 0; i < frows.length; i++) {
          var sub = { rows: frows, all: ctx.all, row: frows[i], filters: ctx.filters };
          var ok = evaluate(A[1], sub);
          if (isErr(ok)) return ok;
          if (ok) kept.push(frows[i]);
        }
        return { filtered: true, rows: kept };
      }
      case "ALL": {
        if (!A.length) return { filtered: true, rows: ctx.all };
        var arg = A[0];
        /* ALL(Candidates) removes every filter; ALL(Candidates[Col]) removes that one. */
        if (arg.k === "table") return { filtered: true, rows: ctx.all };
        if (arg.k === "col") return { clearCol: arg.col };
        return { filtered: true, rows: ctx.all };
      }
      case "VALUES":
      case "DISTINCT": {
        var r = evaluate(A[0], ctx);
        if (isErr(r)) return r;
        if (!r.column) return err("#VALUES");
        var seen = [], out = [];
        colValues(r).forEach(function (v) {
          var k = String(v);
          if (seen.indexOf(k) < 0) { seen.push(k); out.push(v); }
        });
        return { list: out };
      }
      case "CALCULATE": {
        /* CALCULATE does three distinct things, and they have to be done in the right
           order: work out which outer filters are being dropped, rebuild the row set
           from scratch without them, then apply this call's own filters. That is what
           makes a measure's filter *replace* a slicer on the same column. */
        var dropped = [], tables = [], preds = [], clearAll = false;
        for (var j = 1; j < A.length; j++) {
          var f = A[j];
          if (f.k === "call" && TABLE_FNS.indexOf(f.name) >= 0) {
            var pre = evaluate(f, { rows: ctx.rows, all: ctx.all, row: null, filters: ctx.filters });
            if (isErr(pre)) return pre;
            if (pre && pre.clearCol) { dropped.push(pre.clearCol); continue; }
            if (pre && pre.rows) {
              if (f.name === "ALL") clearAll = true;
              else tables.push(pre.rows);
              continue;
            }
            continue;
          }
          preds.push(f);
          colsUsed(f, dropped);
        }

        var outer = ctx.filters || {};
        var rows;
        if (clearAll) {
          rows = ctx.all.slice();
        } else {
          rows = ctx.all.filter(function (r) {
            return Object.keys(outer).every(function (k) {
              if (!outer[k]) return true;
              if (dropped.indexOf(k) >= 0) return true;
              return r[k] === outer[k];
            });
          });
        }
        tables.forEach(function (t) {
          rows = rows.filter(function (r) { return t.indexOf(r) >= 0; });
        });
        for (var p = 0; p < preds.length; p++) {
          rows = applyBoolFilter(preds[p], rows, ctx);
          if (isErr(rows)) return rows;
        }
        return evaluate(A[0], { rows: rows, all: ctx.all, row: null, filters: outer });
      }
      case "DIVIDE": {
        var x = numArg(A[0], ctx), y = numArg(A[1], ctx);
        if (isErr(x)) return x;
        if (isErr(y)) return y;
        if (y === 0) return A.length > 2 ? evaluate(A[2], ctx) : "";
        return x / y;
      }
      case "SUM": return agg(A[0], ctx, "sum");
      case "AVERAGE": return agg(A[0], ctx, "avg");
      case "MIN": return agg(A[0], ctx, "min");
      case "MAX": return agg(A[0], ctx, "max");
      case "COUNT": return agg(A[0], ctx, "count");
      case "COUNTA": return agg(A[0], ctx, "counta");
      case "COUNTBLANK": return agg(A[0], ctx, "countblank");
      case "DISTINCTCOUNT": return agg(A[0], ctx, "distinct");
      case "SUMX": case "AVERAGEX": case "MAXX": case "MINX": case "COUNTX": {
        var tbl = evaluate(A[0], ctx);
        if (isErr(tbl)) return tbl;
        var list = rowsOf(tbl, ctx);
        var vals = [];
        for (var m = 0; m < list.length; m++) {
          var v2 = evaluate(A[1], { rows: list, all: ctx.all, row: list[m] });
          if (isErr(v2)) return v2;
          if (typeof v2 === "number") vals.push(v2);
        }
        if (name === "SUMX") return vals.reduce(function (s, v) { return s + v; }, 0);
        if (name === "COUNTX") return vals.length;
        if (!vals.length) return "";
        if (name === "AVERAGEX") return vals.reduce(function (s, v) { return s + v; }, 0) / vals.length;
        if (name === "MAXX") return Math.max.apply(null, vals);
        return Math.min.apply(null, vals);
      }
      case "CONCATENATEX": {
        var tb = evaluate(A[0], ctx);
        if (isErr(tb)) return tb;
        var ls = rowsOf(tb, ctx);
        var sep = A.length > 2 ? evaluate(A[2], ctx) : ", ";
        var parts = [];
        ls.forEach(function (r) {
          var v = evaluate(A[1], { rows: ls, all: ctx.all, row: r });
          if (!blank(v) && !isErr(v)) parts.push(String(v));
        });
        return parts.join(String(sep));
      }
      case "SELECTEDVALUE": {
        var sv = evaluate(A[0], ctx);
        if (isErr(sv) || !sv.column) return err("#SELECTEDVALUE");
        var uniq = [];
        colValues(sv).forEach(function (v) { if (uniq.indexOf(v) < 0) uniq.push(v); });
        if (uniq.length === 1) return uniq[0];
        return A.length > 1 ? evaluate(A[1], ctx) : "";
      }
      case "IF": {
        var t2 = evaluate(A[0], ctx);
        if (isErr(t2)) return t2;
        return t2 ? evaluate(A[1], ctx) : (A.length > 2 ? evaluate(A[2], ctx) : "");
      }
      case "ISBLANK": {
        var b2 = evaluate(A[0], ctx);
        if (b2 && b2.column) {
          var vals2 = colValues(b2);
          return vals2.length === 1 ? blank(vals2[0]) : err("#MANY");
        }
        return blank(b2);
      }
      case "NOT": {
        var nv = evaluate(A[0], ctx);
        return isErr(nv) ? nv : !nv;
      }
      case "BLANK": return "";
      case "ROUND": {
        var rv = numArg(A[0], ctx), rd = A.length > 1 ? numArg(A[1], ctx) : 0;
        if (isErr(rv)) return rv;
        var p = Math.pow(10, rd);
        return Math.round(rv * p) / p;
      }
      case "ABS": {
        var av = numArg(A[0], ctx);
        return isErr(av) ? av : Math.abs(av);
      }
      case "FORMAT": {
        var fv = evaluate(A[0], ctx);
        var pat = String(evaluate(A[1], ctx));
        if (typeof fv !== "number") return String(fv);
        if (/%/.test(pat)) {
          var dp = (/\.(0+)/.exec(pat) || [, ""])[1].length;
          return (fv * 100).toFixed(dp) + "%";
        }
        var dp2 = (/\.(0+)/.exec(pat) || [, ""])[1].length;
        return fv.toLocaleString("en-IE", { minimumFractionDigits: dp2, maximumFractionDigits: dp2 });
      }
    }
    return err("#NAME " + name);
  }

  function applyBoolFilter(node, rows, ctx) {
    var kept = [];
    for (var i = 0; i < rows.length; i++) {
      var ok = evaluate(node, { rows: rows, all: ctx.all, row: rows[i], filters: ctx.filters });
      if (isErr(ok)) return ok;
      if (ok) kept.push(rows[i]);
    }
    return kept;
  }

  function numArg(node, ctx) {
    var v = evaluate(node, ctx);
    if (isErr(v)) return v;
    if (v && v.column) {
      var list = nums(v);
      return list.length === 1 ? list[0] : err("#MANY");
    }
    if (v === "" || v === null || v === undefined) return 0;
    var n = Number(v);
    return isNaN(n) ? err("#VALUE") : n;
  }

  function agg(node, ctx, how) {
    var ref = evaluate(node, ctx);
    if (isErr(ref)) return ref;
    if (!ref.column) return err("#NEEDCOLUMN");
    var vals = colValues(ref);
    var numList = vals.filter(function (v) { return typeof v === "number"; });
    switch (how) {
      case "sum": return numList.reduce(function (s, v) { return s + v; }, 0);
      case "avg": return numList.length ? numList.reduce(function (s, v) { return s + v; }, 0) / numList.length : "";
      case "min": return numList.length ? Math.min.apply(null, numList) : "";
      case "max": return numList.length ? Math.max.apply(null, numList) : "";
      case "count": return vals.filter(function (v) { return !blank(v); }).length;
      case "counta": return vals.filter(function (v) { return !blank(v); }).length;
      case "countblank": return vals.filter(blank).length;
      case "distinct": {
        var seen = [];
        vals.forEach(function (v) { if (!blank(v) && seen.indexOf(String(v)) < 0) seen.push(String(v)); });
        return seen.length;
      }
    }
    return err("#AGG");
  }

  /* filters is the outer filter context as a plain { column: value } map, so CALCULATE
     knows which slicer selections it is allowed to override. */
  function run(src, rows, allRows, filters) {
    var toks = tokenize(String(src || ""));
    if (!toks || !toks.length) return { ok: false, text: "" };
    var tree;
    try { tree = parse(toks); } catch (e) { return { ok: false, text: "Could not read that \u2014 check the brackets." }; }
    var v;
    try { v = evaluate(tree, { rows: rows, all: allRows || rows, row: null, filters: filters || {} }); }
    catch (e2) { return { ok: false, text: "Could not evaluate that." }; }
    if (isErr(v)) return { ok: false, text: explain(v.e) };
    if (v && v.rows) return { ok: true, text: v.rows.length + " rows", value: v.rows.length };
    if (v && v.list) return { ok: true, text: v.list.join(" \u00b7 "), value: v.list };
    if (v && v.column) {
      var vals = colValues(v);
      return { ok: true, text: "a column of " + vals.length + " values \u2014 wrap it in SUM, AVERAGE or DISTINCTCOUNT", value: null };
    }
    if (v === "" || v === null || v === undefined) return { ok: true, text: "(blank)", value: "" };
    if (typeof v === "boolean") return { ok: true, text: v ? "TRUE" : "FALSE", value: v };
    if (typeof v === "number") return { ok: true, text: fmt(v), value: v };
    return { ok: true, text: String(v), value: v };
  }
  function fmt(n) {
    var r = Math.round(n * 1000) / 1000;
    return Number.isInteger(r) ? String(r) : String(r);
  }
  function explain(code) {
    if (code === "#DIV/0") return "Divided by zero. In DAX the fix is DIVIDE(a, b), which returns blank instead of an error.";
    if (code === "#NEEDCOLUMN") return "That function needs a column, like Candidates[FeeEUR], not a table.";
    if (code === "#MANY") return "That refers to many rows at once. Aggregate it \u2014 SUM, AVERAGE, COUNTROWS \u2014 or put it inside FILTER.";
    if (code.indexOf("#NAME") === 0) return "Unknown function: " + code.slice(6) + ". This sandbox supports the measure functions taught in this chapter.";
    if (code.indexOf("#COL") === 0) return "No such column: " + code.slice(5) + ".";
    return code;
  }

  global.Dax = { run: run, tokenize: tokenize, parse: parse };
})(window);
