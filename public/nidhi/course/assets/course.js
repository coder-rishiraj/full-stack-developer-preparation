/* Course shell: navigation, progress, and the interactive widgets that are not
   spreadsheets — quizzes, drills, calculators, the pivot builder, the Boolean
   builder, the mock Power BI canvas. */
(function (global) {
  "use strict";

  var KEY = "nidhi-course-v1";
  var state = load();

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "{}");
      s.done = s.done || {};
      s.totals = s.totals || {};
      s.notes = s.notes || {};
      return s;
    } catch (e) { return { done: {}, totals: {}, notes: {} }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function chapterOf(id) { return String(id).split(".")[0]; }

  var Course = {
    id: null,
    lessons: [],

    init: function (cfg) {
      cfg = cfg || {};
      this.id = cfg.id || "home";
      this.wireLessons();
      if (!cfg.sections) cfg.sections = this.autoSections();
      this.buildNav(cfg);
      this.wireCopy();
      this.updateChrome();
      this.spy();
      return this;
    },

    buildNav: function (cfg) {
      var nav = document.getElementById("sideNav");
      if (!nav) return;
      var here = this.id;
      var map = global.CourseMap || [];
      var sections = cfg.sections || [];
      nav.innerHTML = "";
      var brand = el("a", "side-home");
      brand.href = "index.html";
      brand.textContent = "Course home";
      nav.appendChild(brand);

      var frag = document.createDocumentFragment();
      var block = null;
      map.forEach(function (item) {
        if (item.group) {
          block = el("div", "side-block");
          block.appendChild(el("div", "group", item.group));
          frag.appendChild(block);
          return;
        }
        if (!block) {
          block = el("div", "side-block");
          frag.appendChild(block);
        }
        var wrap = el("div", "nav-item-wrap" + (item.id === here ? " open" : ""));
        var a = el("a", "nav-link");
        a.href = item.file;
        if (item.num) a.appendChild(el("span", "nav-num", item.num));
        a.appendChild(el("span", "nav-title", item.title));
        if (item.id === here) a.classList.add("here");
        var pct = Course.chapterPct(item.id);
        if (pct === 100) a.appendChild(el("span", "tick", "\u2713"));
        else if (pct) a.appendChild(el("span", "nav-pct", pct + "%"));
        wrap.appendChild(a);
        if (item.id === here && sections.length) {
          var toc = el("div", "page-toc");
          toc.appendChild(el("div", "toc-label", "On this page"));
          sections.forEach(function (s) {
            var sa = el("a", "toc-link");
            sa.href = "#" + s.id;
            if (s.n) sa.appendChild(el("span", "toc-n", s.n));
            sa.appendChild(el("span", "toc-title", s.title));
            sa.dataset.spy = s.id;
            toc.appendChild(sa);
          });
          wrap.appendChild(toc);
        }
        block.appendChild(wrap);
      });
      nav.appendChild(frag);
    },

    autoSections: function () {
      return Array.prototype.map.call(document.querySelectorAll("[data-lesson]"), function (node) {
        var h = node.querySelector("h3");
        var title = node.dataset.lesson;
        if (h) {
          var clone = h.cloneNode(true);
          var ln = clone.querySelector(".ln");
          if (ln) ln.parentNode.removeChild(ln);
          title = clone.textContent.replace(/\s+/g, " ").trim();
        }
        return { id: node.id, title: title, n: node.dataset.n || "" };
      });
    },

    /* Each <section class="lesson" data-lesson="id"> gets a tick box. */
    wireLessons: function () {
      var nodes = document.querySelectorAll("[data-lesson]");
      var ids = [];
      var self = this;
      Array.prototype.forEach.call(nodes, function (node, i) {
        var id = node.dataset.lesson;
        ids.push(id);
        if (!node.id) node.id = id;
        var h = node.querySelector("h3");
        if (h && !h.querySelector(".ln")) {
          var tag = el("span", "ln", node.dataset.n || String(i + 1));
          h.insertBefore(tag, h.firstChild);
        }
        if (node.dataset.noCheck === "true") return;
        var box = el("div", "got");
        var input = el("input");
        input.type = "checkbox";
        input.id = "ck-" + id;
        var label = el("label", null, node.dataset.check || "I can do this without looking");
        label.setAttribute("for", input.id);
        box.appendChild(input);
        box.appendChild(label);
        node.appendChild(box);
        input.checked = !!state.done[id];
        node.classList.toggle("done", input.checked);
        input.addEventListener("change", function () {
          if (input.checked) state.done[id] = true;
          else delete state.done[id];
          node.classList.toggle("done", input.checked);
          save();
          self.updateChrome();
        });
      });
      this.lessons = ids;
      if (this.id !== "home") {
        state.totals[this.id] = ids.length;
        save();
      }
    },

    markDone: function (id) {
      if (!id || state.done[id]) return;
      state.done[id] = true;
      save();
      var box = document.getElementById("ck-" + id);
      if (box) {
        box.checked = true;
        var host = box.closest("[data-lesson]");
        if (host) host.classList.add("done");
      }
      this.updateChrome();
    },

    doneCount: function (chapterId) {
      var n = 0;
      Object.keys(state.done).forEach(function (k) {
        if (chapterOf(k) === chapterId) n++;
      });
      return n;
    },
    chapterTotal: function (chapterId) { return state.totals[chapterId] || 0; },
    chapterPct: function (chapterId) {
      var t = this.chapterTotal(chapterId);
      if (!t) return null;
      return Math.round((this.doneCount(chapterId) / t) * 100);
    },
    overall: function () {
      var done = 0, total = 0;
      Object.keys(state.totals).forEach(function (k) {
        total += state.totals[k];
        done += Course.doneCount(k);
      });
      return { done: done, total: total };
    },

    updateChrome: function () {
      var o = this.id === "home" ? this.overall() : { done: this.doneCount(this.id), total: this.lessons.length };
      var bar = document.querySelector(".pbar i");
      var num = document.querySelector(".pnum");
      var pct = o.total ? Math.round((o.done / o.total) * 100) : 0;
      if (bar) bar.style.width = pct + "%";
      if (num) num.textContent = o.done + " / " + o.total + (this.id === "home" ? " lessons" : " in this chapter");
      if (global.renderChapterCards) global.renderChapterCards();
    },

    spy: function () {
      var links = Array.prototype.slice.call(document.querySelectorAll("#sideNav a[data-spy]"));
      if (!links.length) return;
      var targets = links.map(function (a) { return document.getElementById(a.dataset.spy); }).filter(Boolean);
      function run() {
        var best = null, bestTop = -1e9;
        targets.forEach(function (t) {
          var top = t.getBoundingClientRect().top - 90;
          if (top <= 0 && top > bestTop) { bestTop = top; best = t; }
        });
        links.forEach(function (a) { a.classList.toggle("on", best && a.dataset.spy === best.id); });
      }
      document.addEventListener("scroll", run, { passive: true });
      run();
    },

    wireCopy: function () {
      Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
        btn.addEventListener("click", function () {
          var src = document.getElementById(btn.dataset.copy);
          if (!src) return;
          var text = src.innerText || src.textContent;
          if (navigator.clipboard) navigator.clipboard.writeText(text);
          var was = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = was; }, 1400);
        });
      });
    },

    note: function (id, val) {
      if (val === undefined) return state.notes[id] || "";
      state.notes[id] = val;
      save();
    },

    reset: function () {
      state = { done: {}, totals: {}, notes: {} };
      save();
      if (global.Sheet) global.Sheet.clearAll();
      location.reload();
    }
  };

  /* ---------- quiz ---------- */
  var Quiz = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      var items = cfg.items || [];
      host.classList.add("quiz");
      host.innerHTML = "";
      host.appendChild(el("div", "quiz-h", cfg.title || "Check yourself"));
      var right = 0;
      var answered = 0;
      var tally = el("div", "quiz-nav", "");
      items.forEach(function (q, qi) {
        var wrap = el("div", "quiz-item");
        wrap.style.marginBottom = qi === items.length - 1 ? "0" : "16px";
        var qp = el("p", "quiz-q");
        qp.innerHTML = (qi + 1) + ". " + q.q;
        wrap.appendChild(qp);
        var opts = el("div", "quiz-opts");
        var why = el("div", "quiz-why");
        why.innerHTML = q.why || "";
        var locked = false;
        q.opts.forEach(function (text, oi) {
          var b = el("button", "quiz-opt");
          b.innerHTML = text;
          b.type = "button";
          b.addEventListener("click", function () {
            if (locked) return;
            locked = true;
            answered++;
            var ok = oi === q.a;
            if (ok) right++;
            b.classList.add(ok ? "right" : "wrong");
            if (!ok) {
              var correct = opts.children[q.a];
              if (correct) correct.classList.add("right");
            }
            why.classList.add("show");
            tally.textContent = right + " of " + answered + " answered correctly.";
            if (answered === items.length && right === items.length && cfg.lessonId) {
              Course.markDone(cfg.lessonId);
            }
          });
          opts.appendChild(b);
        });
        wrap.appendChild(opts);
        wrap.appendChild(why);
        host.appendChild(wrap);
      });
      host.appendChild(tally);
    }
  };

  /* ---------- written drill with a model answer ---------- */
  var Drill = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      host.classList.add("drill");
      host.innerHTML = "";
      host.appendChild(el("div", "drill-h", cfg.title || "Say it out loud, then write it"));
      if (cfg.prompt) {
        var p = el("p");
        p.innerHTML = cfg.prompt;
        host.appendChild(p);
      }
      var ta = el("textarea");
      ta.placeholder = cfg.placeholder || "Your answer, in your own words.";
      ta.value = Course.note(cfg.id || "drill");
      host.appendChild(ta);
      var row = el("div", "drill-row");
      var show = el("button", "btn", "Compare with a model answer");
      show.type = "button";
      row.appendChild(show);
      var timeBtn = null;
      if (cfg.seconds) {
        timeBtn = el("button", "btn", "Start " + cfg.seconds + "s timer");
        timeBtn.type = "button";
        row.appendChild(timeBtn);
      }
      var count = el("span", "timer", "");
      row.appendChild(count);
      host.appendChild(row);
      var model = el("div", "drill-model");
      var inner = el("div", "note");
      inner.innerHTML = "<p class=\"kicker\">A model answer</p>" + (cfg.model || "");
      model.appendChild(inner);
      host.appendChild(model);

      var id = cfg.id || "drill";
      ta.addEventListener("input", function () {
        Course.note(id, ta.value);
        count.textContent = ta.value.trim() ? ta.value.trim().split(/\s+/).length + " words" : "";
      });
      show.addEventListener("click", function () {
        model.classList.toggle("show");
        show.textContent = model.classList.contains("show") ? "Hide the model answer" : "Compare with a model answer";
        if (cfg.lessonId && ta.value.trim().split(/\s+/).length > 25) Course.markDone(cfg.lessonId);
      });
      if (timeBtn) {
        timeBtn.addEventListener("click", function () {
          var left = cfg.seconds;
          timeBtn.disabled = true;
          count.textContent = left + "s";
          var t = setInterval(function () {
            left--;
            count.textContent = left + "s";
            if (left <= 0) {
              clearInterval(t);
              count.textContent = "Time. Read it back.";
              timeBtn.disabled = false;
            }
          }, 1000);
        });
      }
    }
  };

  /* ---------- flip cards ---------- */
  var Flips = {
    mount: function (hostOrId, items) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      host.classList.add("flips");
      host.innerHTML = "";
      items.forEach(function (it) {
        var c = el("div", "flip");
        c.appendChild(el("b", null, it.t));
        c.appendChild(el("div", "front", it.hint || "Tap to see what it is"));
        var back = el("div", "back");
        back.innerHTML = it.b;
        c.appendChild(back);
        c.addEventListener("click", function () { c.classList.toggle("open"); });
        host.appendChild(c);
      });
    }
  };

  /* ---------- match drill: pick the right label ---------- */
  var Match = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      host.innerHTML = "";
      var box = el("div", "match");
      cfg.items.forEach(function (it, i) {
        var row = el("div", "match-row");
        var q = el("div");
        q.innerHTML = it.q;
        row.appendChild(q);
        var sel = el("select");
        sel.appendChild(el("option", null, "Choose\u2026"));
        cfg.options.forEach(function (o) {
          var op = el("option", null, o);
          op.value = o;
          sel.appendChild(op);
        });
        row.appendChild(sel);
        sel.addEventListener("change", function () {
          var ok = sel.value === it.a;
          row.classList.toggle("ok", ok);
          row.classList.toggle("no", !ok && sel.value !== "Choose\u2026");
          check();
        });
        box.appendChild(row);
      });
      host.appendChild(box);
      var fb = el("p", "tiny", "");
      host.appendChild(fb);
      function check() {
        var rows = box.querySelectorAll(".match-row");
        var ok = box.querySelectorAll(".match-row.ok").length;
        fb.textContent = ok + " of " + rows.length + " right.";
        if (ok === rows.length && cfg.lessonId) Course.markDone(cfg.lessonId);
      }
    }
  };

  /* ---------- metric calculator ---------- */
  var Calc = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      host.classList.add("calc");
      host.innerHTML = "";
      if (cfg.title) host.appendChild(el("div", "quiz-h", cfg.title));
      var grid = el("div", "calc-grid");
      var inputs = {};
      cfg.fields.forEach(function (f) {
        var w = el("label", "calc-f", f.label);
        var i = el("input");
        i.type = "number";
        i.value = f.value;
        i.min = f.min === undefined ? 0 : f.min;
        if (f.step) i.step = f.step;
        w.appendChild(i);
        inputs[f.key] = i;
        grid.appendChild(w);
      });
      host.appendChild(grid);
      var out = el("div", "calc-out");
      host.appendChild(out);
      var tail = el("p", "tiny");
      host.appendChild(tail);
      function run() {
        var vals = {};
        Object.keys(inputs).forEach(function (k) { vals[k] = parseFloat(inputs[k].value || "0"); });
        out.innerHTML = "";
        cfg.outputs.forEach(function (o) {
          var box = el("div", "calc-o");
          var b = el("b", null, o.calc(vals));
          box.appendChild(b);
          box.appendChild(el("span", null, o.label));
          out.appendChild(box);
        });
        tail.innerHTML = cfg.commentary ? cfg.commentary(vals) : "";
      }
      Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener("input", run); });
      run();
    }
  };

  /* ---------- pivot builder over the practice data ---------- */
  var Pivot = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      var rows = cfg.rows;
      var fields = cfg.fields;
      host.classList.add("pv");
      host.innerHTML = "";
      var ctl = el("div", "pv-ctl");
      function sel(label, options, def) {
        var w = el("label", null, label);
        var s = el("select");
        options.forEach(function (o) {
          var op = el("option", null, o);
          op.value = o;
          s.appendChild(op);
        });
        s.value = def;
        w.appendChild(s);
        ctl.appendChild(w);
        return s;
      }
      var rowSel = sel("Rows", cfg.rowFields, cfg.rowFields[0]);
      var valSel = sel("Values", cfg.valueFields, cfg.valueFields[0]);
      var aggSel = sel("Summarise by", ["Count", "Sum", "Average", "Max", "Min"], cfg.agg || "Count");
      var showSel = sel("Show values as", ["No calculation", "% of grand total"], "No calculation");
      host.appendChild(ctl);
      var out = el("div", "pv-out");
      host.appendChild(out);
      var caption = el("p", "tiny", "");
      host.appendChild(caption);

      function run() {
        var rf = rowSel.value, vf = valSel.value, agg = aggSel.value, show = showSel.value;
        var groups = {};
        var order = [];
        rows.forEach(function (r) {
          var k = r[rf] === "" || r[rf] === null || r[rf] === undefined ? "(blank)" : String(r[rf]);
          if (!groups[k]) { groups[k] = []; order.push(k); }
          groups[k].push(r);
        });
        function aggregate(list) {
          var vals = list.map(function (r) { return r[vf]; });
          var nums = vals.filter(function (v) { return typeof v === "number"; });
          var filled = vals.filter(function (v) { return v !== "" && v !== null && v !== undefined; });
          switch (agg) {
            case "Count": return filled.length;
            case "Sum": return nums.reduce(function (s, v) { return s + v; }, 0);
            case "Average": return nums.length ? Math.round((nums.reduce(function (s, v) { return s + v; }, 0) / nums.length) * 10) / 10 : 0;
            case "Max": return nums.length ? Math.max.apply(null, nums) : 0;
            case "Min": return nums.length ? Math.min.apply(null, nums) : 0;
          }
          return 0;
        }
        var total = aggregate(rows);
        var t = el("table");
        var thead = el("thead");
        var hr = el("tr");
        hr.appendChild(el("th", null, rf));
        hr.appendChild(el("th", null, agg + " of " + vf));
        thead.appendChild(hr);
        t.appendChild(thead);
        var tb = el("tbody");
        order.sort();
        order.forEach(function (k) {
          var tr = el("tr");
          tr.appendChild(el("td", null, k));
          var v = aggregate(groups[k]);
          var txt = show === "% of grand total" && total ? Math.round((v / total) * 100) + "%" : String(v);
          tr.appendChild(el("td", null, txt));
          tb.appendChild(tr);
        });
        var tr2 = el("tr", "tot");
        tr2.appendChild(el("td", null, "Grand Total"));
        tr2.appendChild(el("td", null, show === "% of grand total" ? "100%" : String(total)));
        tb.appendChild(tr2);
        t.appendChild(tb);
        out.innerHTML = "";
        out.appendChild(t);
        caption.innerHTML = cfg.comment ? cfg.comment(rf, vf, agg) : "";
      }
      [rowSel, valSel, aggSel, showSel].forEach(function (s) { s.addEventListener("change", run); });
      run();
    }
  };

  /* ---------- Boolean search simulator ---------- */
  var Boolean2 = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      host.innerHTML = "";
      var picked = {};
      var facets = el("div", "bb-facets");
      cfg.facets.forEach(function (f) {
        picked[f.key] = [];
        var row = el("div", "bb-facet");
        row.appendChild(el("span", null, f.label));
        var opts = el("div", "bb-opts");
        f.options.forEach(function (o) {
          var b = el("button", "bb-opt", o);
          b.type = "button";
          b.addEventListener("click", function () {
            var ix = picked[f.key].indexOf(o);
            if (ix >= 0) picked[f.key].splice(ix, 1);
            else picked[f.key].push(o);
            b.classList.toggle("on", ix < 0);
            run();
          });
          opts.appendChild(b);
        });
        row.appendChild(opts);
        facets.appendChild(row);
      });
      host.appendChild(facets);
      var outBox = el("div", "bb-out", "Pick some terms above.");
      host.appendChild(outBox);
      var hits = el("div", "bb-hits");
      host.appendChild(hits);
      var sum = el("p", "tiny", "");
      host.appendChild(sum);

      function groupString(f) {
        var vals = picked[f.key];
        if (!vals.length) return null;
        var quoted = vals.map(function (v) { return /\s/.test(v) ? '"' + v + '"' : v; });
        if (f.mode === "NOT") return "NOT (" + quoted.join(" OR ") + ")";
        return vals.length > 1 ? "(" + quoted.join(" OR ") + ")" : quoted[0];
      }
      function run() {
        var parts = cfg.facets.map(groupString).filter(Boolean);
        outBox.textContent = parts.length ? parts.join(" AND ") : "Pick some terms above.";
        hits.innerHTML = "";
        var kept = 0;
        cfg.profiles.forEach(function (p) {
          var ok = cfg.facets.every(function (f) {
            var vals = picked[f.key];
            if (!vals.length) return true;
            var hay = (p.text || "").toLowerCase();
            var any = vals.some(function (v) { return hay.indexOf(v.toLowerCase()) >= 0; });
            return f.mode === "NOT" ? !any : any;
          });
          if (ok) kept++;
          var row = el("div", "bb-hit " + (ok ? "in" : "out"));
          row.appendChild(el("i", null, ok ? "\u2713" : "\u00b7"));
          var body = el("div");
          body.innerHTML = "<strong>" + p.name + "</strong> \u2014 <em>" + p.text + "</em>" +
            (ok && p.flag ? ' <span class="chip no">' + p.flag + "</span>" : "");
          row.appendChild(body);
          hits.appendChild(row);
        });
        var good = cfg.profiles.filter(function (p) { return p.good; }).length;
        var goodKept = 0;
        cfg.profiles.forEach(function (p) {
          if (!p.good) return;
          var ok = cfg.facets.every(function (f) {
            var vals = picked[f.key];
            if (!vals.length) return true;
            var hay = (p.text || "").toLowerCase();
            var any = vals.some(function (v) { return hay.indexOf(v.toLowerCase()) >= 0; });
            return f.mode === "NOT" ? !any : any;
          });
          if (ok) goodKept++;
        });
        sum.innerHTML = kept + " of " + cfg.profiles.length + " profiles returned, and <strong>" +
          goodKept + " of the " + good + "</strong> people actually worth calling. " +
          (kept === cfg.profiles.length ? "Too wide — this is just a job-title search." :
            (goodKept < good ? "Too narrow: a real candidate is being excluded." :
              (kept === goodKept ? "That is a clean string." : "Workable. The extra results are cheap to skim.")));
        if (kept === goodKept && goodKept === good && cfg.lessonId) Course.markDone(cfg.lessonId);
      }
      run();
    }
  };

  /* ---------- mock Power BI report ---------- */
  var PBI = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host) return;
      var rows = cfg.rows;
      host.classList.add("pbi");
      host.innerHTML = "";
      var top = el("div", "pbi-top");
      top.appendChild(el("div", "pbi-title", cfg.title || "Hiring"));
      var sl = el("div", "pbi-slicer");
      top.appendChild(sl);
      host.appendChild(top);

      var active = { Source: null, RoleID: null };
      function slicer(field, values) {
        values.forEach(function (v) {
          var b = el("button", null, v);
          b.type = "button";
          b.addEventListener("click", function () {
            active[field] = active[field] === v ? null : v;
            Array.prototype.forEach.call(sl.children, function (c) {
              c.classList.toggle("on", active[c.dataset.f] === c.textContent);
            });
            draw();
          });
          b.dataset.f = field;
          sl.appendChild(b);
        });
      }
      slicer("Source", ["LinkedIn", "Referral", "Agency"]);
      slicer("RoleID", ["BE-1", "FE-1"]);

      var cards = el("div", "pbi-cards");
      host.appendChild(cards);
      var row1 = el("div", "pbi-row");
      var visA = el("div", "pbi-vis");
      var visB = el("div", "pbi-vis");
      row1.appendChild(visA);
      row1.appendChild(visB);
      host.appendChild(row1);
      var tell = el("p", "tiny", "");
      host.appendChild(tell);

      function filtered() {
        return rows.filter(function (r) {
          if (active.Source && r.Source !== active.Source) return false;
          if (active.RoleID && r.RoleID !== active.RoleID) return false;
          return true;
        });
      }
      function count(list, field) {
        return list.filter(function (r) { return r[field] !== "" && r[field] !== null; }).length;
      }
      function draw() {
        var f = filtered();
        var stages = [
          ["Applicants", count(f, "Applied")],
          ["Screened", count(f, "Screened")],
          ["Interviews", count(f, "Interview")],
          ["Offers", count(f, "Offer")],
          ["Accepts", count(f, "Accepted")],
          ["Joiners", count(f, "Joined")]
        ];
        cards.innerHTML = "";
        stages.forEach(function (s) {
          var c = el("div", "pbi-card");
          c.appendChild(el("b", null, String(s[1])));
          c.appendChild(el("span", null, s[0]));
          cards.appendChild(c);
        });
        var offers = stages[3][1], accepts = stages[4][1], joiners = stages[5][1];
        var extra = el("div", "pbi-cards");
        extra.style.marginTop = "8px";
        [["Offer acceptance", offers ? Math.round((accepts / offers) * 100) + "%" : "—"],
         ["Joining rate", accepts ? Math.round((joiners / accepts) * 100) + "%" : "—"],
         ["Agency fees", "\u20ac" + f.reduce(function (s, r) { return s + (r.FeeEUR || 0); }, 0).toLocaleString("en-IE")]
        ].forEach(function (p) {
          var c = el("div", "pbi-card");
          c.appendChild(el("b", null, p[1]));
          c.appendChild(el("span", null, p[0]));
          extra.appendChild(c);
        });
        cards.appendChild(extra);

        /* bar chart: applicants vs joiners by source */
        visA.innerHTML = "<h5>Applicants and joiners by source</h5>";
        var bySrc = {};
        f.forEach(function (r) {
          bySrc[r.Source] = bySrc[r.Source] || { a: 0, j: 0 };
          bySrc[r.Source].a++;
          if (r.Joined) bySrc[r.Source].j++;
        });
        var maxA = Math.max.apply(null, [1].concat(Object.keys(bySrc).map(function (k) { return bySrc[k].a; })));
        Object.keys(bySrc).sort().forEach(function (k) {
          ["a", "j"].forEach(function (which) {
            var r = el("div", "bar-row");
            r.appendChild(el("span", null, which === "a" ? k : ""));
            var track = el("div", "bar-track");
            var fill = el("div", "bar-fill" + (which === "j" ? " b2" : ""));
            fill.style.width = Math.round((bySrc[k][which] / maxA) * 100) + "%";
            track.appendChild(fill);
            r.appendChild(track);
            r.appendChild(el("span", "bar-val", String(bySrc[k][which])));
            visA.appendChild(r);
          });
        });
        visA.appendChild(el("p", "tiny", "Dark = applicants, pale = joiners."));

        /* matrix by role */
        var byRole = {};
        f.forEach(function (r) {
          byRole[r.RoleID] = byRole[r.RoleID] || { app: 0, off: 0, join: 0, days: [] };
          byRole[r.RoleID].app++;
          if (r.Offer) byRole[r.RoleID].off++;
          if (r.Joined) byRole[r.RoleID].join++;
          if (r.HireDays) byRole[r.RoleID].days.push(r.HireDays);
        });
        var html = "<h5>By role</h5><table><thead><tr><th>Role</th><th>Applicants</th><th>Offers</th><th>Joiners</th><th>Avg days</th></tr></thead><tbody>";
        Object.keys(byRole).sort().forEach(function (k) {
          var b = byRole[k];
          var avg = b.days.length ? (b.days.reduce(function (s, v) { return s + v; }, 0) / b.days.length).toFixed(1) : "—";
          html += "<tr><td>" + k + "</td><td>" + b.app + "</td><td>" + b.off + "</td><td>" + b.join + "</td><td>" + avg + "</td></tr>";
        });
        html += "</tbody></table>";
        visB.innerHTML = html;

        var bits = [];
        if (active.Source) bits.push("Source = " + active.Source);
        if (active.RoleID) bits.push("Role = " + active.RoleID);
        tell.innerHTML = bits.length
          ? "<strong>Filter context:</strong> " + bits.join(" and ") + ". Every number above was recalculated — that is CALCULATE doing its job without being written."
          : "<strong>No filter.</strong> Click a source or a role to watch every card change. That is filter context.";
      }
      draw();
    }
  };

  /* ---------- DAX sandbox with clickable filter context ---------- */
  var DaxBox = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host || !global.Dax) return;
      var all = cfg.rows;
      host.classList.add("dax");
      host.innerHTML = "";
      if (cfg.title) host.appendChild(el("div", "quiz-h", cfg.title));
      if (cfg.note) host.appendChild(el("p", "tiny", cfg.note));

      var active = {};
      var bar = el("div", "dax-slicers");
      (cfg.slicers || []).forEach(function (s) {
        var row = el("div", "dax-sl");
        row.appendChild(el("span", null, s.field));
        s.values.forEach(function (v) {
          var b = el("button", "bb-opt", String(v));
          b.type = "button";
          b.addEventListener("click", function () {
            active[s.field] = active[s.field] === v ? null : v;
            Array.prototype.forEach.call(bar.querySelectorAll("button"), function (x) {
              x.classList.toggle("on", active[x.dataset.f] === x.textContent);
            });
            run();
          });
          b.dataset.f = s.field;
          row.appendChild(b);
        });
        bar.appendChild(row);
      });
      if ((cfg.slicers || []).length) host.appendChild(bar);

      var ctxLine = el("p", "dax-ctx");
      host.appendChild(ctxLine);

      var inp = el("input", "pg-in");
      inp.spellcheck = false;
      inp.placeholder = cfg.placeholder || "COUNTROWS(Candidates)";
      host.appendChild(inp);
      var out = el("div", "pg-out");
      host.appendChild(out);

      if (cfg.examples) {
        var ex = el("div", "pg-ex");
        cfg.examples.forEach(function (e) {
          var b = el("button", null, e);
          b.type = "button";
          b.addEventListener("click", function () { inp.value = e; run(); });
          ex.appendChild(b);
        });
        host.appendChild(ex);
      }

      function filtered() {
        return all.filter(function (r) {
          return Object.keys(active).every(function (f) {
            return !active[f] || r[f] === active[f];
          });
        });
      }
      function run() {
        var rows = filtered();
        var bits = Object.keys(active).filter(function (f) { return active[f]; })
          .map(function (f) { return f + " = " + active[f]; });
        ctxLine.innerHTML = bits.length
          ? "<strong>Filter context:</strong> " + bits.join(" and ") + " \u2014 " + rows.length + " of " + all.length + " rows visible."
          : "<strong>No filter context.</strong> All " + all.length + " rows visible. Click a slicer above and run the same measure again.";
        if (!inp.value.trim()) { out.textContent = ""; out.className = "pg-out"; return; }
        var r = global.Dax.run(inp.value, rows, all, active);
        out.textContent = r.text;
        out.className = "pg-out " + (r.ok ? "ok" : "bad");
      }
      inp.addEventListener("input", run);
      if (cfg.value) inp.value = cfg.value;
      run();
    }
  };

  /* ---------- graded DAX exercises ---------- */
  var DaxTask = {
    mount: function (hostOrId, cfg) {
      var host = typeof hostOrId === "string" ? document.getElementById(hostOrId) : hostOrId;
      if (!host || !global.Dax) return;
      host.classList.add("daxt");
      host.innerHTML = "";
      host.appendChild(el("div", "quiz-h", cfg.title || "Write the measure"));
      var rows = cfg.rows;
      var list = el("ol", "daxt-list");
      var states = [];
      cfg.items.forEach(function (it, ix) {
        var li = el("li");
        li.dataset.ix = String(ix);
        var ask = el("div", "daxt-ask");
        ask.innerHTML = "<b>" + it.name + "</b> &mdash; " + it.ask;
        li.appendChild(ask);
        var inp = el("textarea", "pg-in");
        inp.spellcheck = false;
        inp.rows = 3;
        inp.placeholder = "Type the DAX here";
        li.appendChild(inp);
        var st = el("div", "xl-task-st");
        li.appendChild(st);
        states.push({ li: li, inp: inp, st: st, it: it, ok: false });
        inp.addEventListener("input", function () { grade(ix); });
        list.appendChild(li);
      });
      host.appendChild(list);
      var row = el("div", "xl-bar2");
      var check = el("button", "btn", "Check");
      check.type = "button";
      var show = el("button", "btn", "Show me");
      show.type = "button";
      row.appendChild(check);
      row.appendChild(show);
      host.appendChild(row);
      var tally = el("p", "tiny");
      host.appendChild(tally);

      function grade(ix) {
        var s = states[ix];
        var src = s.inp.value.trim();
        if (!src) { s.li.className = ""; s.st.textContent = ""; s.ok = false; return done(); }
        var needs = s.it.requires || [];
        var missing = needs.filter(function (f) { return src.toUpperCase().indexOf(f.toUpperCase()) < 0; });
        if (missing.length) {
          s.li.className = "no";
          s.st.innerHTML = "This one is meant to use <code>" + missing[0] + "</code>.";
          s.ok = false;
          return done();
        }
        var r = global.Dax.run(src, rows, rows);
        if (!r.ok) {
          s.li.className = "no";
          s.st.textContent = r.text;
          s.ok = false;
          return done();
        }
        var got = r.value;
        var want = s.it.want;
        var ok = typeof want === "number"
          ? (typeof got === "number" && Math.abs(got - want) <= (s.it.tol || 0.0001))
          : String(got).toLowerCase() === String(want).toLowerCase();
        s.ok = ok;
        s.li.className = ok ? "ok" : "no";
        s.st.innerHTML = ok ? (s.it.good || "Correct.") : "It returns <code>" + r.text + "</code>. Expected <code>" + want + "</code>.";
        done();
      }
      function done() {
        var n = states.filter(function (s) { return s.ok; }).length;
        tally.textContent = n + " of " + states.length + " right.";
        if (n === states.length && cfg.lessonId) Course.markDone(cfg.lessonId);
      }
      check.addEventListener("click", function () { states.forEach(function (_, i) { grade(i); }); });
      show.addEventListener("click", function () {
        states.forEach(function (s, i) { s.inp.value = s.it.answer; grade(i); });
      });
      done();
    }
  };

  global.Course = Course;
  global.DaxBox = DaxBox;
  global.DaxTask = DaxTask;
  global.Quiz = Quiz;
  global.Drill = Drill;
  global.Flips = Flips;
  global.MatchDrill = Match;
  global.Calc = Calc;
  global.Pivot = Pivot;
  global.BoolBuilder = Boolean2;
  global.PBIMock = PBI;
})(window);
