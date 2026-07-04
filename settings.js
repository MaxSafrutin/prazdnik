const pricingState = structuredClone(window.__PRICING__);
const form = document.querySelector("#settingsForm");

const sections = [
  {
    title: "База и служебные проценты",
    path: "meta",
    single: true,
    fields: [
      ["rateBaseDate", "Дата базы ставок", "text"],
      ["djDailyIncrease", "Ежедневный рост ставки DJ, ₽", "number"],
      ["hostDailyIncrease", "Ежедневный рост ставки ведущего, ₽", "number"],
      ["reservePercent", "Запас внутри итоговой суммы, %", "number"],
      ["legalEntityMultiplier", "Коэффициент юр. лица", "number"],
      ["vatRate", "НДС внутри суммы, %", "number"],
      ["roundDownTo", "Округлять вниз до, ₽", "number"]
    ]
  },
  { title: "Типы мероприятий", path: "eventTypes", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Длительность", path: "durationMultipliers", primitiveLabel: "Коэффициент" },
  { title: "Ставки по гостям", path: "guestRates", fields: [["min", "От гостей", "number"], ["max", "До гостей", "number"], ["dj", "DJ ₽/час", "number"], ["host", "Ведущий ₽/час", "number"]] },
  { title: "Места проведения", path: "places", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "День и время", path: "dayTime", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Близость даты", path: "dateCloseness", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Режимы DJ", path: "djModes", fields: [["label", "Название", "text"], ["hostPresenceMultiplier", "Коэффициент наличия ведущего", "number"]] },
  { title: "Роли DJ", path: "djRoles", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Оборудование влияет на DJ/ведущего", path: "djEquipmentModes", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Комплекты оборудования DJ", path: "djKits", fields: [["label", "Название", "text"], ["price", "Цена, ₽", "number"]] },
  { title: "Режимы ведущего", path: "hostModes", fields: [["label", "Название", "text"], ["djPresenceMultiplier", "Коэффициент наличия DJ", "number"]] },
  { title: "Роли ведущего", path: "hostRoles", fields: [["label", "Название", "text"], ["multiplier", "Коэффициент", "number"]] },
  { title: "Реквизит ведущего", path: "hostProps", fields: [["label", "Название", "text"], ["price", "Цена, ₽", "number"]] },
  { title: "Фиксированные доплаты", path: "fixed", primitiveLabel: "Цена, ₽" },
  { title: "Проезд", path: "travel", custom: renderTravel },
  { title: "Скидки", path: "discounts", fields: [["label", "Название", "text"], ["percent", "Скидка, %", "number"], ["group", "Группа", "text"]] }
];

render();
bindExport();

function render() {
  form.innerHTML = sections.map(renderSection).join("");
  form.addEventListener("input", handleInput);
}

function renderSection(section) {
  const data = getByPath(pricingState, section.path);
  if (section.custom) return section.custom(section, data);

  if (section.fields) {
    if (section.single) {
      return card(section.title, `
        <div class="admin-row">
          <div class="admin-key">${escapeHtml(section.path)}</div>
          <div class="admin-fields">
            ${section.fields.map(([field, label, type]) => input(`${section.path}.${field}`, label, data[field], type)).join("")}
          </div>
        </div>
      `);
    }

    const entries = Array.isArray(data) ? data.map((item, index) => [index, item]) : Object.entries(data);
    return card(section.title, entries.map(([key, item]) => `
      <div class="admin-row">
        <div class="admin-key">${escapeHtml(String(key))}</div>
        <div class="admin-fields">
          ${section.fields.map(([field, label, type]) => input(`${section.path}.${key}.${field}`, label, item[field], type)).join("")}
        </div>
      </div>
    `).join(""));
  }

  return card(section.title, Object.entries(data).map(([key, value]) => `
    <div class="admin-row">
      <div class="admin-key">${escapeHtml(key)}</div>
      <div class="admin-fields">
        ${input(`${section.path}.${key}`, section.primitiveLabel, value, "number")}
      </div>
    </div>
  `).join(""));
}

function renderTravel(section, data) {
  return card(section.title, `
    <div class="admin-row">
      <div class="admin-key">minimum</div>
      <div class="admin-fields">${input("travel.minimum", "Минимум, ₽", data.minimum, "number")}</div>
    </div>
    ${data.tiers.map((tier, index) => `
      <div class="admin-row">
        <div class="admin-key">tier ${index + 1}</div>
        <div class="admin-fields">
          ${input(`travel.tiers.${index}.max`, "До км", tier.max, "number")}
          ${input(`travel.tiers.${index}.rate`, "₽/км", tier.rate, "number")}
        </div>
      </div>
    `).join("")}
  `);
}

function card(title, body) {
  return `
    <section class="panel admin-card">
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function input(path, label, value, type) {
  const step = type === "number" ? 'step="0.01"' : "";
  return `
    <label class="admin-input">
      <span>${escapeHtml(label)}</span>
      <input data-path="${escapeHtml(path)}" type="${type}" ${step} value="${escapeHtml(String(value ?? ""))}">
    </label>
  `;
}

function handleInput(event) {
  const path = event.target.dataset.path;
  if (!path) return;
  const value = event.target.type === "number" ? Number(event.target.value) : event.target.value;
  setByPath(pricingState, path, value);
}

function bindExport() {
  document.querySelector("#downloadJson").addEventListener("click", () => download("pricing.json", JSON.stringify(pricingState, null, 2) + "\n", "application/json"));
  document.querySelector("#downloadJs").addEventListener("click", () => download("pricing.js", `window.__PRICING__ = ${JSON.stringify(pricingState, null, 2)};\n`, "text/javascript"));
  document.querySelector("#copyJson").addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(JSON.stringify(pricingState, null, 2));
    event.currentTarget.textContent = "JSON скопирован";
    setTimeout(() => {
      event.currentTarget.textContent = "Скопировать JSON";
    }, 1600);
  });
}

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function getByPath(object, path) {
  return path.split(".").reduce((value, key) => value[key], object);
}

function setByPath(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((current, key) => current[key], object);
  target[last] = value;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
