// myFunctions.js - نسخة مُحسنة للتتبع والإصلاح
// وضع تعليقات قصيرة بالعربية لطمأنة المراجع الجامعي
// ملف الدوال الخاصة بموقع تطبيقات الذكاء الاصطناعي

(function () {
  "use strict";

  function log() {
    if (window.console && console.log) console.log.apply(console, arguments);
  }

  function escapeHtml(text) {
    if (!text) return "";
    return String(text).replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m];
    });
  }

  function readApps() {
    try {
      return JSON.parse(localStorage.getItem("apps") || "[]");
    } catch (e) {
      log("readApps error", e);
      return [];
    }
  }

  function saveApp(app) {
    var list = readApps();
    list.push(app);
    localStorage.setItem("apps", JSON.stringify(list));
  }

  function clearApps() {
    localStorage.removeItem("apps");
    Array.from(document.querySelectorAll("#appsBody tr.user-app")).forEach(
      function (r) {
        r.remove();
      }
    );
    alert("تم حذف التطبيقات المضافة.");
  }

  function setupToggleHandlers() {
    Array.from(document.querySelectorAll(".toggle-cell")).forEach(function (
      cell
    ) {
      cell.onclick = function () {
        var next = cell.parentElement.nextElementSibling;
        if (!next) return;
        next.style.display =
          next.style.display === "table-row" ? "none" : "table-row";
      };
    });
  }

  function renderSavedApps() {
    try {
      var list = readApps();
      var tbody = document.getElementById("appsBody");
      if (!tbody) {
        log("renderSavedApps: no tbody #appsBody found");
        return;
      }

      // remove previously rendered user-app rows
      Array.from(tbody.querySelectorAll("tr.user-app")).forEach(function (r) {
        r.remove();
      });

      list.forEach(function (app) {
        var row = document.createElement("tr");
        row.className = "user-app";
        row.innerHTML =
          "<td>" +
          escapeHtml(app.name) +
          "</td>" +
          "<td>" +
          escapeHtml(app.company) +
          "</td>" +
          "<td>" +
          escapeHtml(app.field) +
          "</td>" +
          "<td>" +
          escapeHtml(app.free) +
          "</td>" +
          '<td class="toggle-cell">إظهار التفاصيل</td>';
        tbody.appendChild(row);

        var drow = document.createElement("tr");
        drow.className = "details-row user-app";
        drow.style.display = "none";
        drow.innerHTML =
          '<td colspan="5">' +
          "<p><strong>الوصف:</strong> " +
          escapeHtml(app.description) +
          "</p>" +
          (app.website
            ? '<p><strong>الموقع:</strong> <a href="' +
              escapeHtml(app.website) +
              '" target="_blank">' +
              escapeHtml(app.website) +
              "</a></p>"
            : "") +
          "</td>";
        tbody.appendChild(drow);
      });

      setupToggleHandlers();
      log("renderSavedApps: rendered", list.length, "apps");
    } catch (e) {
      console.error("renderSavedApps error", e);
    }
  }

  // attach handlers safely (لا نعتمد على data-page فقط)
  function init() {
    log("myFunctions.js init");

    // Fade-scroll initial reveal (كما كان سابقاً)
    Array.from(document.querySelectorAll(".fade-scroll")).forEach(function (
      el
    ) {
      try {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("visible");
      } catch (e) {}
    });

    // If apps page present -> render apps and wire clear button
    if (
      document.querySelector("body.apps-page") ||
      document.body.dataset.page === "apps"
    ) {
      log("detected apps page");
      renderSavedApps();
      var clearBtn = document.getElementById("clearBtn");
      if (clearBtn) {
        clearBtn.onclick = function () {
          if (confirm("هل تريد حذف جميع التطبيقات المضافة؟")) {
            clearApps();
          }
        };
      }
    }

    // If add page present -> wire form submit directly (لا نعتمد على dataset فقط)
    var form = document.getElementById("addAppForm");
    if (form) {
      log("detected add form, attaching submit handler");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        try {
          var nameEl = document.getElementById("appName");
          var companyEl = document.getElementById("appCompany");
          var websiteEl = document.getElementById("appWebsite");
          var freeEl = document.getElementById("appFree");
          var fieldEl = document.getElementById("appField");
          var descEl = document.getElementById("appDescription");

          var app = {
            name: nameEl ? nameEl.value.trim() : "",
            company: companyEl ? companyEl.value.trim() : "",
            website: websiteEl ? websiteEl.value.trim() : "",
            free: freeEl ? freeEl.value.trim() : "",
            field: fieldEl ? fieldEl.value.trim() : "",
            description: descEl ? descEl.value.trim() : "",
          };

          if (!app.name || !app.company || !app.field) {
            alert("الرجاء ملء الحقول الأساسية (الاسم، الشركة، المجال).");
            return;
          }

          saveApp(app);
          log("App saved:", app);
          alert("تم حفظ التطبيق بنجاح. سيتم الانتقال إلى صفحة التطبيقات.");
          form.reset();

          // Redirect to apps.html (إذا كنت تريد البقاء، غير هذا السطر)
          setTimeout(function () {
            window.location.href = "apps.html";
          }, 600);
        } catch (err) {
          console.error("submit handler error", err);
          alert("حدث خطأ أثناء حفظ التطبيق. افتح Console لمزيد من التفاصيل.");
        }
      });
    } else {
      log("no add form found on this page");
    }
  }

  // init after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
