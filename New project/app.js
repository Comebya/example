const categories = {
  expense: ["餐饮", "交通", "购物", "娱乐", "住房", "学习", "其他"],
  income: ["工资", "奖金", "兼职", "红包", "理财", "其他"]
};

const icons = {
  "餐饮": "食",
  "交通": "行",
  "购物": "购",
  "娱乐": "乐",
  "住房": "住",
  "学习": "学",
  "工资": "薪",
  "奖金": "奖",
  "兼职": "兼",
  "红包": "包",
  "理财": "财",
  "其他": "其"
};

const storageKey = "mini-ledger-records";
let currentType = "expense";
let records = loadRecords();

const pages = document.querySelectorAll(".page");
const tabs = document.querySelectorAll(".tab");
const segmentButtons = document.querySelectorAll(".segment");
const categoryInput = document.querySelector("#categoryInput");
const amountInput = document.querySelector("#amountInput");
const noteInput = document.querySelector("#noteInput");
const dateInput = document.querySelector("#dateInput");
const entryForm = document.querySelector("#entryForm");
const recordList = document.querySelector("#recordList");
const recordFilter = document.querySelector("#recordFilter");
const statsList = document.querySelector("#statsList");
const recordTemplate = document.querySelector("#recordTemplate");

dateInput.valueAsDate = new Date();
fillCategoryOptions();
render();

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showPage(tab.dataset.target);
  });
});

segmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setType(button.dataset.type);
  });
});

document.querySelectorAll("[data-quick]").forEach((button) => {
  button.addEventListener("click", () => {
    setType(button.dataset.type);
    categoryInput.value = button.dataset.quick;
    amountInput.focus();
    showPage("add");
  });
});

recordFilter.addEventListener("change", renderRecords);

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  if (!amount || amount <= 0) return;

  records.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    type: currentType,
    amount,
    category: categoryInput.value,
    note: noteInput.value.trim(),
    date: dateInput.value
  });

  saveRecords();
  entryForm.reset();
  dateInput.valueAsDate = new Date();
  setType("expense");
  render();
  showPage("home");
});

function showPage(name) {
  pages.forEach((page) => {
    page.classList.toggle("page-active", page.dataset.page === name);
  });
  tabs.forEach((tab) => {
    tab.classList.toggle("tab-active", tab.dataset.target === name);
  });
}

function setType(type) {
  currentType = type;
  segmentButtons.forEach((button) => {
    button.classList.toggle("segment-active", button.dataset.type === type);
  });
  fillCategoryOptions();
}

function fillCategoryOptions() {
  categoryInput.innerHTML = categories[currentType]
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function render() {
  renderSummary();
  renderRecords();
  renderStats();
}

function renderSummary() {
  const monthKey = new Date().toISOString().slice(0, 7);
  const monthRecords = records.filter((record) => record.date.startsWith(monthKey));
  const income = sumByType(monthRecords, "income");
  const expense = sumByType(monthRecords, "expense");

  document.querySelector("#balanceAmount").textContent = formatMoney(income - expense);
  document.querySelector("#incomeAmount").textContent = formatMoney(income);
  document.querySelector("#expenseAmount").textContent = formatMoney(expense);
}

function renderRecords() {
  const filter = recordFilter.value;
  const visibleRecords = filter === "all"
    ? records
    : records.filter((record) => record.type === filter);

  recordList.innerHTML = "";

  if (visibleRecords.length === 0) {
    recordList.innerHTML = '<li class="empty">还没有记录，点“记一笔”开始吧</li>';
    return;
  }

  visibleRecords.forEach((record) => {
    const item = recordTemplate.content.firstElementChild.cloneNode(true);
    const icon = item.querySelector(".record-icon");
    const title = item.querySelector(".record-main strong");
    const meta = item.querySelector(".record-main span");
    const amount = item.querySelector(".record-side b");
    const removeButton = item.querySelector(".record-side button");

    icon.textContent = icons[record.category] || "记";
    title.textContent = record.note || record.category;
    meta.textContent = `${record.category} · ${record.date}`;
    amount.textContent = `${record.type === "income" ? "+" : "-"}${formatMoney(record.amount)}`;
    amount.style.color = record.type === "income" ? "var(--income)" : "var(--danger)";
    removeButton.addEventListener("click", () => deleteRecord(record.id));

    recordList.appendChild(item);
  });
}

function renderStats() {
  const expenseRecords = records.filter((record) => record.type === "expense");
  const totals = expenseRecords.reduce((result, record) => {
    result[record.category] = (result[record.category] || 0) + record.amount;
    return result;
  }, {});

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] || 0;

  statsList.innerHTML = "";
  if (rows.length === 0) {
    statsList.innerHTML = '<div class="empty">暂无支出统计</div>';
    return;
  }

  rows.forEach(([category, amount]) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <div class="stat-top">
        <strong>${category}</strong>
        <b>${formatMoney(amount)}</b>
      </div>
      <div class="stat-bar"><span style="width: ${(amount / max) * 100}%"></span></div>
    `;
    statsList.appendChild(row);
  });
}

function deleteRecord(id) {
  records = records.filter((record) => record.id !== id);
  saveRecords();
  render();
}

function sumByType(list, type) {
  return list
    .filter((record) => record.type === type)
    .reduce((sum, record) => sum + record.amount, 0);
}

function formatMoney(value) {
  return `¥${Number(value).toFixed(2)}`;
}

function loadRecords() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);

  const today = new Date().toISOString().slice(0, 10);
  return [
    { id: "demo-1", type: "expense", amount: 26, category: "餐饮", note: "午餐", date: today },
    { id: "demo-2", type: "expense", amount: 8, category: "交通", note: "地铁", date: today },
    { id: "demo-3", type: "income", amount: 120, category: "兼职", note: "设计稿", date: today }
  ];
}

function saveRecords() {
  localStorage.setItem(storageKey, JSON.stringify(records));
}
