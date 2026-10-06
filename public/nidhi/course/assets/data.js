/* The one practice dataset the whole course runs on, plus the chapter map.
   Six invented candidates, two invented roles. Every answer is checkable by hand. */
(function (global) {
  "use strict";

  var COLS = {
    Name: { w: 74, fmt: "text", v: ["Asha", "Ben", "Cara", "Dev", "Eva", "Farah"] },
    RoleID: { w: 66, fmt: "text", v: ["BE-1", "BE-1", "BE-1", "FE-1", "FE-1", "BE-1"] },
    Source: { w: 84, fmt: "text", v: ["LinkedIn", "Referral", "LinkedIn", "LinkedIn", "Agency", "LinkedIn"] },
    Recruiter: { w: 78, fmt: "text", v: ["Nidhi", "Nidhi", "Nidhi", "Nidhi", "Nidhi", "Nidhi"] },
    Applied: { w: 88, fmt: "date", v: ["2026-03-02", "2026-03-02", "2026-03-08", "2026-02-01", "2026-02-01", "2026-03-20"] },
    Screened: { w: 88, fmt: "date", v: ["2026-03-04", "2026-03-05", "2026-03-10", "2026-02-03", "2026-02-06", ""] },
    Interview: { w: 88, fmt: "date", v: ["2026-03-12", "2026-03-14", "", "2026-02-15", "2026-02-20", ""] },
    Offer: { w: 88, fmt: "date", v: ["2026-03-20", "2026-03-22", "", "2026-03-01", "2026-03-10", ""] },
    Accepted: { w: 88, fmt: "date", v: ["2026-03-25", "", "", "2026-03-05", "2026-03-12", ""] },
    Joined: { w: 88, fmt: "date", v: ["2026-04-20", "", "", "2026-04-01", "", ""] },
    Outcome: { w: 84, fmt: "text", v: ["Joined", "Declined", "Rejected", "Joined", "Reneged", "Open"] },
    FeeEUR: { w: 80, fmt: "eur", v: [0, 0, 0, 0, 4000, 0] }
  };

  var ROLE_COLS = {
    RoleID: { w: 66, fmt: "text", v: ["BE-1", "FE-1"] },
    Title: { w: 136, fmt: "text", v: ["Backend Engineer", "Frontend Engineer"] },
    Department: { w: 100, fmt: "text", v: ["Engineering", "Engineering"] },
    HiringManager: { w: 106, fmt: "text", v: ["Maya Shah", "Leo Berger"] },
    Location: { w: 90, fmt: "text", v: ["Dublin", "Amsterdam"] },
    Opened: { w: 88, fmt: "date", v: ["2026-01-15", "2026-01-20"] },
    Status: { w: 74, fmt: "text", v: ["Open", "Open"] }
  };

  var MESSY = {
    Name: { w: 92, fmt: "text", v: ["  asha  ", "BEN", "Cara ", "dev", "EVA", " farah"] },
    RawSource: { w: 110, fmt: "text", v: ["LinkedIn", "referral ", "Linkdin", " LINKEDIN", "Agency", "linkedin"] },
    RawRole: { w: 190, fmt: "text", v: ["Backend Engineer - Dublin", "Backend Engineer - Dublin", "Backend Engineer - Dublin", "Frontend Engineer - Amsterdam", "Frontend Engineer - Amsterdam", "Backend Engineer - Dublin"] }
  };

  function numToCol(n) {
    var s = "";
    while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - 1 - r) / 26; }
    return s;
  }

  /* Build a Sheet config from a list of column names. */
  function build(spec, picked, opts) {
    opts = opts || {};
    var n = picked.length;
    var data = [picked.slice()];
    var count = spec[picked[0]].v.length;
    for (var i = 0; i < count; i++) {
      var row = [];
      for (var j = 0; j < n; j++) row.push(spec[picked[j]].v[i]);
      data.push(row);
    }
    var formats = {}, widths = {};
    for (var k = 0; k < n; k++) {
      var L = numToCol(k + 1);
      formats[L] = spec[picked[k]].fmt;
      widths[L] = spec[picked[k]].w;
    }
    var lastCol = numToCol(n);
    var cfg = {
      data: data,
      formats: formats,
      widths: widths,
      headerRows: 1,
      rows: opts.rows || count + 4,
      cols: opts.cols || n + 4,
      lock: opts.lock || ["A1:" + lastCol + (count + 1)],
      start: opts.start || numToCol(n + 2) + "2",
      fillTo: opts.fillTo || count + 1,
      height: opts.height || null,
      title: opts.title || null,
      note: opts.note || null,
      id: opts.id || null,
      tasks: opts.tasks || [],
      tasksTitle: opts.tasksTitle,
      live: opts.live !== false,
      persist: opts.persist,
      lessonId: opts.lessonId,
      readonly: opts.readonly,
      open: opts.open,
      preset: opts.cells || null,
      onPass: opts.onPass
    };
    cfg.tables = {};
    if (opts.table !== false) {
      cfg.tables[opts.tableName || "Candidates"] = { range: "A1:" + lastCol + (count + 1), header: true };
    }
    if (opts.extraTables) {
      Object.keys(opts.extraTables).forEach(function (t) { cfg.tables[t] = opts.extraTables[t]; });
    }
    if (opts.extraFormats) Object.keys(opts.extraFormats).forEach(function (k2) { cfg.formats[k2] = opts.extraFormats[k2]; });
    if (opts.cellFormats) cfg.cellFormats = opts.cellFormats;
    if (opts.widths) Object.keys(opts.widths).forEach(function (k3) { cfg.widths[k3] = opts.widths[k3]; });
    if (opts.extraData) {
      opts.extraData.forEach(function (block) {
        /* block: { at:'N1', rows:[[...]] } merged after load by the caller */
      });
    }
    return cfg;
  }

  var ALL = ["Name", "RoleID", "Source", "Recruiter", "Applied", "Screened", "Interview", "Offer", "Accepted", "Joined", "Outcome", "FeeEUR"];

  global.CourseData = {
    COLS: COLS,
    ROLE_COLS: ROLE_COLS,
    MESSY: MESSY,
    ALL: ALL,
    /* candidates(['Name','Source'], opts) */
    candidates: function (picked, opts) { return build(COLS, picked || ALL, opts); },
    roles: function (picked, opts) {
      var o = opts || {};
      o.tableName = o.tableName || "Roles";
      return build(ROLE_COLS, picked || ["RoleID", "Title", "Department", "HiringManager", "Location", "Opened", "Status"], o);
    },
    messy: function (picked, opts) {
      var o = opts || {};
      o.tableName = o.tableName || "Raw";
      return build(MESSY, picked || ["Name", "RawSource", "RawRole"], o);
    },
    /* The same six candidates as row objects, for the PivotTable and report widgets.
       Dates become plain ISO strings; HireDays and City are the derived columns
       chapter 1.3 builds by hand, so the widgets show the finished table. */
    records: function () {
      var byId = {};
      ROLE_COLS.RoleID.v.forEach(function (id, i) {
        byId[id] = { city: ROLE_COLS.Location.v[i], manager: ROLE_COLS.HiringManager.v[i], title: ROLE_COLS.Title.v[i] };
      });
      return COLS.Name.v.map(function (_, i) {
        var r = {};
        ALL.forEach(function (k) { r[k] = COLS[k].v[i]; });
        var role = byId[r.RoleID] || {};
        r.City = role.city || "?";
        r.Manager = role.manager || "No role";
        r.Title = role.title || "No role";
        if (r.Accepted && r.Applied) {
          r.HireDays = Math.round((new Date(r.Accepted) - new Date(r.Applied)) / 86400000);
        } else {
          r.HireDays = "";
        }
        return r;
      });
    },
    /* Facts every chapter can quote. */
    facts: {
      applicants: 6, screened: 5, interviews: 4, offers: 4, accepts: 3, joiners: 2,
      acceptance: 0.75, joinRate: 2 / 3, avgHireDays: 31.3, fees: 4000
    }
  };

  global.CourseMap = [
    { group: "Start" },
    { id: "home", file: "index.html", title: "How this course works" },
    { id: "syllabus", file: "syllabus.html", title: "One-page syllabus" },
    { id: "data", file: "index.html#data", title: "The practice data" },
    { id: "sandbox", file: "sandbox.html", title: "Excel sandbox" },
    { group: "Excel" },
    { id: "excel-1", file: "excel-1.html", num: "1.1", title: "Foundations" },
    { id: "excel-2", file: "excel-2.html", num: "1.2", title: "Logic and counting" },
    { id: "excel-3", file: "excel-3.html", num: "1.3", title: "Lookups and text" },
    { id: "excel-4", file: "excel-4.html", num: "1.4", title: "Analysis" },
    { id: "labs-excel", file: "labs-excel.html", num: "1.4b", title: "Excel labs" },
    { id: "project", file: "project.html", num: "1.5", title: "The Ferra dashboard" },
    { id: "reference", file: "reference.html", num: "1.6", title: "Function reference" },
    { group: "Power BI" },
    { id: "powerbi", file: "powerbi.html", num: "2", title: "Model, DAX, Service" },
    { group: "The craft" },
    { id: "labs-more", file: "labs-more.html", num: "2b", title: "Craft labs" },
    { id: "metrics", file: "metrics.html", num: "3", title: "Recruiting metrics" },
    { id: "ats", file: "ats.html", num: "4", title: "ATS and Workday" },
    { id: "sourcing", file: "sourcing.html", num: "5", title: "Sourcing and Boolean" },
    { group: "The job" },
    { id: "roles", file: "roles.html", num: "6", title: "Roles to recognise" },
    { id: "europe", file: "europe.html", num: "7", title: "Europe, GDPR, employment" },
    { id: "strategy", file: "strategy.html", num: "8", title: "Strategic TA" },
    { id: "ai", file: "ai.html", num: "9", title: "AI, used carefully" },
    { group: "Interview" },
    { id: "interview", file: "interview.html", num: "10", title: "Interview rehearsal" }
  ];
})(window);
