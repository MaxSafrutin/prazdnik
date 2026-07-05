const state = {
  pricing: null,
  content: null,
  lastResult: null,
  appliedDiscounts: [],
  serviceType: "",
  displayedTotal: null,
  priceAnimation: null,
  syncResultDock: null,
  buildMode: "",
  selectedPackage: "",
  kitMode: "packages",
  propsMode: "packages",
  selectedDjKits: [],
  selectedHostProps: [],
  selectedKitPackage: "",
  selectedPropsPackage: "none"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const serviceDetails = {
  dj: [
    { value: "djNoHost", label: "Без ведущего", djMode: "onlyDj", hostMode: "none" },
    { value: "djClientHost", label: "С нашим ведущим", djMode: "clientHost", hostMode: "none" },
    { value: "djProvidedHost", label: "С вашим ведущим", djMode: "providedHost", hostMode: "providedDj" }
  ],
  host: [
    { value: "hostNoDj", label: "Без диджея", djMode: "none", hostMode: "onlyHost" },
    { value: "hostClientDj", label: "С нашим диджеем", djMode: "none", hostMode: "clientDj" },
    { value: "hostProvidedDj", label: "С вашим диджеем", djMode: "providedHost", hostMode: "providedDj" }
  ],
  both: [
    { value: "bothDjAccent", label: "Универсал (акцент DJ)", djMode: "djHostSame", hostMode: "none" },
    { value: "bothLeaderAccent", label: "Универсал (акцент ведущий)", djMode: "none", hostMode: "hostDjSame" },
    { value: "bothProvidedDjClientLeader", label: "Ваш DJ + Наш ведущий", djMode: "clientHost", hostMode: "none" },
    { value: "bothProvidedBoth", label: "Ваш DJ + Ваш ведущий", djMode: "providedHost", hostMode: "providedDj" },
    { value: "bothClientDjProvidedLeader", label: "Наш DJ + Ваш ведущий", djMode: "none", hostMode: "clientDj" }
  ]
};

const minimumDisplayTotal = 1500;
const guestSteps = [2, ...Array.from({ length: 30 }, (_, index) => (index + 1) * 5)];
const readyPackages = [
  {
    key: "easy",
    title: "Минимальный",
    note: "Аккуратный базовый набор без лишнего",
    djRole: "basic",
    djEquipmentMode: "own",
    djKit: "jbl",
    hostRole: "host",
    hostProps: "none"
  },
  {
    key: "balanced",
    title: "Оптимальный",
    note: "Самый универсальный вариант для праздника",
    djRole: "contest",
    djEquipmentMode: "own",
    djKit: "standard",
    hostRole: "host",
    hostProps: "light"
  },
  {
    key: "premium",
    title: "Максимальный",
    note: "Больше света, реквизита и вовлечения",
    djRole: "clubMc",
    djEquipmentMode: "own",
    djKit: "pro",
    hostRole: "mc",
    hostProps: "standardLux"
  }
];

const manualDjEquipment = {
  speakerOne: { label: "Одна активная колонка", price: 1500 },
  speakersTwo: { label: "Две активные колонки", price: 3000 },
  speakerStands: { label: "Стойки под колонки", price: 800 },
  floorSubs: { label: "Напольные сабвуферы", price: 5000 },
  soundKw: { label: "Доп. мощность звука до 2 кВт", price: 4000 },
  wirelessMic: { label: "Беспроводной микрофон", price: 1000 },
  lightPair: { label: "Пара светоприборов", price: 2000 },
  movingHeads: { label: "Движущийся свет", price: 6000 },
  smokeMachine: { label: "Дым-машина", price: 3000 },
  projector: { label: "Проектор", price: 4000 },
  screen: { label: "Экран для проектора", price: 3000 },
  tvPanel: { label: "Телевизор / LED-панель", price: 6000 },
  foamMachine: {
    label: "Пенная машина",
    price: 18000,
    extraRows: [
      { title: "Оператор пенной машины", amount: 5000, details: ["обязателен для пенной вечеринки"] },
      { title: "Доставка газелью и техники", amount: 9000, details: ["крупногабаритное оборудование"] }
    ]
  },
  extraCar: { label: "Дополнительный автомобиль под оборудование", price: 5000 },
  techCrew: { label: "Техники на монтаж / демонтаж", price: 6000 }
};

const manualHostEquipment = {
  timing: { label: "Написать индивидуальный тайминг", price: 1500 },
  scenario: { label: "Написать сценарий под событие", price: 5000 },
  specialists: { label: "Подобрать артистов и специалистов", price: 1500 },
  contestPrizes: { label: "Призы для конкурсов", price: 3000 },
  mobileProps: { label: "Мобильный реквизит", price: 2000 },
  themedProps: { label: "Тематический реквизит", price: 7000 },
  projector: { label: "Экран с проектором", price: 7000 },
  tvPanel: { label: "Телевизор / LED-панель", price: 6000 },
  quizButton: { label: "Кнопочная система для квиза", price: 8000 },
  assistant: { label: "Помощник ведущего", price: 5000 },
  operator: { label: "Отдельный оператор на площадке", price: 7000 },
  animator: { label: "Аниматор / игротехник", price: 6000 },
  coverSinger: { label: "Кавер-исполнитель", price: 18000 },
  danceShow: { label: "Танцевальное шоу", price: 22000 },
  magician: { label: "Фокусник / иллюзионист", price: 20000 },
  photoZone: { label: "Фотозона", price: 15000 },
  artistSet: { label: "Набор артистов под программу", price: 45000 }
};

const kitPackages = [
  { key: "jbl", title: "Мобильный", items: ["jbl"] },
  { key: "standard", title: "Стандарт", items: ["standard"] },
  { key: "pro", title: "Профи", items: ["pro"] },
  { key: "light", title: "Лёгкий комплект", items: ["light"] },
  { key: "lightLux", title: "Лёгкий Люкс", items: ["lightLux"] },
  { key: "standardLux", title: "Стандарт Люкс", items: ["standardLux"] },
  { key: "proLux", title: "Профи Люкс", items: ["proLux"] }
];

const propsPackages = [
  { key: "none", title: "Минимум", items: [] },
  { key: "standard", title: "Стандарт", items: ["light"] },
  { key: "pro", title: "Профи", items: ["pro"] },
  { key: "timing", title: "Тайминг", items: ["timing"] },
  { key: "specialists", title: "Специалисты", items: ["specialists"] },
  { key: "mobile", title: "Мобильный реквизит", items: ["mobile"] },
  { key: "lightLux", title: "Лёгкий Люкс", items: ["lightLux"] },
  { key: "standardFull", title: "Стандарт с экраном", items: ["standard"] },
  { key: "standardLux", title: "Стандарт Люкс", items: ["standardLux"] },
  { key: "proLux", title: "Профи Люкс", items: ["proLux"] }
];

const fields = {
  eventType: $("#eventType"),
  hours: $("#hours"),
  useExactDate: $("#useExactDate"),
  eventDate: $("#eventDate"),
  useExactTime: $("#useExactTime"),
  startTime: $("#startTime"),
  guests: $("#guests"),
  serviceDetail: $("#serviceDetail"),
  djMode: $("#djMode"),
  djRole: $("#djRole"),
  djEquipmentMode: $("#djEquipmentMode"),
  djKit: $("#djKit"),
  noInternet: $("#noInternet"),
  needGenerator: $("#needGenerator"),
  hostMode: $("#hostMode"),
  hostRole: $("#hostRole"),
  hostProps: $("#hostProps"),
  noParking: $("#noParking"),
  placeType: $("#placeType"),
  outOfTown: $("#outOfTown"),
  distanceKm: $("#distanceKm"),
  cashless: $("#cashless")
};

const ui = {
  dateWrap: $("#dateWrap"),
  timeWrap: $("#timeWrap"),
  guestValue: $("#guestValue"),
  distanceValue: $("#distanceValue"),
  distanceWrap: $("#distanceWrap"),
  compositionSection: $("#compositionSection"),
  serviceDetailWrap: $("#serviceDetailWrap"),
  serviceDetailButtons: $("#serviceDetailButtons"),
  modeSection: $("#modeSection"),
  packageGrid: $("#packageGrid"),
  djKitChoices: $("#djKitChoices"),
  djKitPackages: $("#djKitPackages"),
  hostPropsChoices: $("#hostPropsChoices"),
  hostPropsPackages: $("#hostPropsPackages"),
  djSection: $("#djSection"),
  hostSection: $("#hostSection"),
  techSection: $("#techSection"),
  djKitWrap: $("#djKitWrap"),
  hostRoleWrap: $("#hostRoleWrap"),
  hostPropsWrap: $("#hostPropsWrap"),
  discountGrid: $("#discountGrid"),
  resultCard: $("#resultCard"),
  resultDockSentinel: $("#resultDockSentinel"),
  totalPrice: $("#totalPrice"),
  bookingButton: $("#bookingButton"),
  bookingCopy: $("#bookingCopy"),
  bookingText: $("#bookingText"),
  vatNote: $("#vatNote"),
  scenarioPill: $("#scenarioPill"),
  breakdown: $("#breakdown")
};

init();

async function init() {
  state.pricing = await loadJson("./data/pricing.json", window.__PRICING__);
  state.content = await loadJson("./data/content.json", window.__CONTENT__);

  applyContent();
  buildControls();
  bindEvents();
  setInitialValues();
  updateUiState();
  setupResultDocking();
  recalculate();
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Cannot load ${path}`);
    return await response.json();
  } catch (error) {
    if (fallback) return fallback;
    throw error;
  }
}

function applyContent() {
  $$("[data-content]").forEach((node) => {
    const key = node.dataset.content;
    if (state.content[key]) node.textContent = state.content[key];
  });
  $$('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:${state.content.bookingPhone}`;
  });
}

function buildControls() {
  fillSelect(fields.eventType, state.pricing.eventTypes, false, "Выберите тип мероприятия");
  fillSelect(fields.djMode, state.pricing.djModes);
  fillSelect(fields.djRole, state.pricing.djRoles);
  fillSelect(fields.djEquipmentMode, state.pricing.djEquipmentModes);
  fillSelect(fields.djKit, state.pricing.djKits, true);
  fillSelect(fields.hostMode, state.pricing.hostModes);
  fillSelect(fields.hostRole, state.pricing.hostRoles);
  fillSelect(fields.hostProps, state.pricing.hostProps, true);
  fillSelect(fields.placeType, state.pricing.places, false, "Место проведения");

  fields.hours.innerHTML = [
    '<option value="">Выберите кол-во часов</option>',
    ...Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}">${value} ${plural(value, "час", "часа", "часов")}</option>`;
    })
  ].join("");

  renderServiceDetails();
  renderPackages();
  renderEquipmentChoices();

  $("#timeOptions").innerHTML = timeOptions().map((time) => `<option value="${time}"></option>`).join("");

  ui.discountGrid.innerHTML = Object.entries(state.pricing.discounts).map(([key, item]) => `
    <label class="discount-choice">
      <input type="checkbox" name="discount" value="${key}">
      <span>${item.label}</span>
      <b>−${item.percent}%</b>
    </label>
  `).join("");
}

function fillSelect(select, options, showPrice = false, placeholder = "") {
  const items = Object.entries(options).map(([key, item]) => {
    const price = showPrice && item.price ? ` · ${formatMoney(item.price)}` : "";
    return `<option value="${key}">${item.label}${price}</option>`;
  });
  select.innerHTML = [
    placeholder ? `<option value="">${placeholder}</option>` : "",
    ...items
  ].join("");
}

function setInitialValues() {
  fields.eventType.value = "";
  fields.hours.value = "";
  fields.startTime.value = "";
  fields.guests.value = "0";
  fields.serviceDetail.value = "";
  fields.djMode.value = "none";
  fields.djRole.value = "basic";
  fields.djEquipmentMode.value = "own";
  fields.djKit.value = "none";
  fields.hostMode.value = "none";
  fields.hostRole.value = "host";
  fields.hostProps.value = "none";
  fields.placeType.value = "";
  fields.distanceKm.value = "10";

  fields.eventDate.value = "";
}

function bindEvents() {
  $("#calculator").addEventListener("input", () => {
    applyComposition();
    updateUiState();
    recalculate();
  });
  $("#calculator").addEventListener("change", () => {
    applyComposition();
    updateUiState();
    recalculate();
  });

  $("#datePickerButton").addEventListener("click", () => openPicker(fields.eventDate));
  $("#timePickerButton").addEventListener("click", () => openPicker(fields.startTime));
  $$("[data-open-control]").forEach((button) => {
    button.addEventListener("click", () => openPicker(document.getElementById(button.dataset.openControl)));
  });

  $$("[data-service-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.serviceType = button.dataset.serviceType;
      state.buildMode = "";
      state.selectedPackage = "";
      renderServiceDetails();
      renderPackages();
      applyComposition();
      updateUiState();
      recalculate();
    });
  });

  $$("[data-build-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.buildMode = button.dataset.buildMode;
      state.selectedPackage = "";
      renderPackages();
      updateUiState();
      recalculate();
    });
  });

  document.addEventListener("click", (event) => {
    const serviceButton = event.target.closest("[data-service-type]");
    if (serviceButton) {
      state.serviceType = serviceButton.dataset.serviceType;
      state.buildMode = "";
      state.selectedPackage = "";
      renderServiceDetails();
      renderPackages();
      applyComposition();
      updateUiState();
      recalculate();
      return;
    }

    const detailButton = event.target.closest("[data-service-detail]");
    if (detailButton) {
      fields.serviceDetail.value = detailButton.dataset.serviceDetail;
      state.buildMode = "";
      state.selectedPackage = "";
      applyComposition();
      renderPackages();
      updateUiState();
      recalculate();
      return;
    }

    const buildButton = event.target.closest("[data-build-mode]");
    if (buildButton) {
      state.buildMode = buildButton.dataset.buildMode;
      state.selectedPackage = "";
      renderPackages();
      updateUiState();
      recalculate();
    }
  });

  $$("[data-kit-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.kitMode = button.dataset.kitMode;
      state.selectedDjKits = [];
      state.selectedKitPackage = "";
      renderEquipmentChoices();
      updateUiState();
      recalculate();
    });
  });

  $$("[data-props-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.propsMode = button.dataset.propsMode;
      state.selectedHostProps = [];
      state.selectedPropsPackage = state.propsMode === "packages" ? "none" : "";
      renderEquipmentChoices();
      updateUiState();
      recalculate();
    });
  });

  ui.discountGrid.addEventListener("change", (event) => {
    if (event.target.name !== "discount") return;
    normalizeDiscounts(event.target);
  });

  $("#discountButton").addEventListener("click", () => {
    openDiscountModal();
  });
  $("#clearDiscounts").addEventListener("click", () => {
    $$('input[name="discount"]').forEach((input) => {
      input.checked = false;
    });
  });
  $("#applyDiscounts").addEventListener("click", () => {
    state.appliedDiscounts = $$('input[name="discount"]:checked').map((item) => item.value);
    closeDiscountModal();
    recalculate();
  });
  ui.bookingButton.addEventListener("click", openBookingModal);
  ui.bookingCopy.addEventListener("click", copyBookingSummary);
  $$("[data-close-modal]").forEach((node) => {
    node.addEventListener("click", closeDiscountModal);
  });
  $$("[data-close-booking]").forEach((node) => {
    node.addEventListener("click", closeBookingModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDiscountModal();
      closeBookingModal();
    }
  });

  fields.eventDate.addEventListener("input", syncDateTimeFlags);
  fields.startTime.addEventListener("input", syncDateTimeFlags);
}

function renderServiceDetails() {
  $$("[data-service-type]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.serviceType === state.serviceType);
  });

  const options = serviceDetails[state.serviceType] || [];
  fields.serviceDetail.innerHTML = [
    '<option value="">Выберите уточнение состава</option>',
    ...options.map((item) => `<option value="${item.value}">${item.label}</option>`)
  ].join("");
  fields.serviceDetail.value = "";
  ui.serviceDetailButtons.innerHTML = options.map((item) => `
    <button class="choice-pill detail-choice" type="button" data-service-detail="${item.value}">${item.label}</button>
  `).join("");
  bindServiceDetailButtons();
}

function renderPackages() {
  $$("[data-build-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.buildMode === state.buildMode);
  });

  if (!ui.packageGrid) return;
  if (state.buildMode !== "packages") {
    ui.packageGrid.innerHTML = "";
    return;
  }

  ui.packageGrid.innerHTML = readyPackages.map((pack) => {
    const result = previewPackage(pack);
    return `
      <article class="package-card ${state.selectedPackage === pack.key ? "is-active" : ""}">
        <div>
          <strong>${pack.title}</strong>
          <span>${pack.note}</span>
        </div>
        <b>${formatMoney(result.total)}</b>
        <button class="btn ${state.selectedPackage === pack.key ? "primary-btn" : "muted-btn"}" type="button" data-package="${pack.key}">
          ${state.selectedPackage === pack.key ? "Выбрано" : "См. детали"}
        </button>
      </article>
    `;
  }).join("");

  $$("[data-package]").forEach((button) => {
    button.addEventListener("click", () => applyPackage(button.dataset.package));
  });
}

function renderEquipmentChoices() {
  renderModeButtons("[data-kit-mode]", state.kitMode);
  renderModeButtons("[data-props-mode]", state.propsMode);
  renderOptionChecks(ui.djKitChoices, manualDjEquipment, state.selectedDjKits, "dj-kit", state.kitMode === "manual");
  renderOptionChecks(ui.hostPropsChoices, manualHostEquipment, state.selectedHostProps, "host-prop", state.propsMode === "manual");
  renderMiniPackages(ui.djKitPackages, kitPackages, state.selectedKitPackage, "kit-package", state.kitMode === "packages", state.pricing.djKits);
  renderMiniPackages(ui.hostPropsPackages, propsPackages, state.selectedPropsPackage, "props-package", state.propsMode === "packages", state.pricing.hostProps);
  bindEquipmentChoices();
  syncSelectFallbacks();
}

function renderModeButtons(selector, active) {
  $$(selector).forEach((button) => {
    const value = button.dataset.kitMode || button.dataset.propsMode;
    button.classList.toggle("is-active", value === active);
  });
}

function renderOptionChecks(container, options, selected, name, visible) {
  if (!container) return;
  container.classList.toggle("is-visible", visible);
  container.innerHTML = Object.entries(options)
    .filter(([key]) => key !== "none")
    .map(([key, item]) => `
      <label class="option-choice">
        <input type="checkbox" data-${name}="${key}" ${selected.includes(key) ? "checked" : ""}>
        <span>${item.label}</span>
        <b>${formatMoney(item.price)}</b>
      </label>
    `).join("");
}

function renderMiniPackages(container, packages, selectedKey, dataName, visible, options) {
  if (!container) return;
  container.classList.toggle("is-visible", visible);
  container.innerHTML = packages.map((pack) => {
    const total = pack.items.reduce((sum, key) => sum + (options[key]?.price || 0), 0);
    const details = pack.items.length ? pack.items.map((key) => options[key].label).join(", ") : "Без доп. позиций";
    return `
      <article class="package-card mini-card ${selectedKey === pack.key ? "is-active" : ""}">
        <div>
          <strong>${pack.title}</strong>
          <span>${details}</span>
        </div>
        <b>${formatMoney(total)}</b>
        <button class="btn ${selectedKey === pack.key ? "primary-btn" : "muted-btn"}" type="button" data-${dataName}="${pack.key}">
          ${selectedKey === pack.key ? "Выбрано" : "Выбрать"}
        </button>
      </article>
    `;
  }).join("");
}

function bindEquipmentChoices() {
  $$("[data-dj-kit]").forEach((input) => {
    input.addEventListener("change", () => {
      state.selectedDjKits = checkedValues("[data-dj-kit]");
      syncSelectFallbacks();
      recalculate();
    });
  });
  $$("[data-host-prop]").forEach((input) => {
    input.addEventListener("change", () => {
      state.selectedHostProps = checkedValues("[data-host-prop]");
      syncSelectFallbacks();
      recalculate();
    });
  });
  $$("[data-kit-package]").forEach((button) => {
    button.addEventListener("click", () => {
      const pack = kitPackages.find((item) => item.key === button.dataset.kitPackage);
      if (!pack) return;
      state.selectedKitPackage = pack.key;
      state.selectedDjKits = [...pack.items];
      renderEquipmentChoices();
      recalculate();
    });
  });
  $$("[data-props-package]").forEach((button) => {
    button.addEventListener("click", () => {
      const pack = propsPackages.find((item) => item.key === button.dataset.propsPackage);
      if (!pack) return;
      state.selectedPropsPackage = pack.key;
      state.selectedHostProps = [...pack.items];
      renderEquipmentChoices();
      recalculate();
    });
  });
}

function checkedValues(selector) {
  return $$(selector).filter((input) => input.checked).map((input) => input.dataset.djKit || input.dataset.hostProp);
}

function syncSelectFallbacks() {
  fields.djKit.value = state.selectedDjKits[0] || "none";
  fields.hostProps.value = state.selectedHostProps[0] || "none";
}

function previewPackage(pack) {
  const previous = snapshotPackageFields();
  setPackageFields(pack, false);
  const result = calculate(readValues());
  restorePackageFields(previous);
  return result;
}

function applyPackage(key) {
  const pack = readyPackages.find((item) => item.key === key);
  if (!pack) return;
  state.selectedPackage = key;
  setPackageFields(pack);
  renderPackages();
  updateUiState();
  recalculate();
}

function setPackageFields(pack, shouldRender = true) {
  fields.djRole.value = pack.djRole;
  fields.djEquipmentMode.value = pack.djEquipmentMode;
  state.selectedDjKits = pack.djKit === "none" ? [] : [pack.djKit];
  state.selectedKitPackage = kitPackages.find((item) => item.items.includes(pack.djKit))?.key || "";
  fields.hostRole.value = pack.hostRole;
  state.selectedHostProps = pack.hostProps === "none" ? [] : [pack.hostProps];
  state.selectedPropsPackage = propsPackages.find((item) => item.items.includes(pack.hostProps))?.key || "none";
  syncSelectFallbacks();
  if (shouldRender) renderEquipmentChoices();
}

function snapshotPackageFields() {
  return {
    djRole: fields.djRole.value,
    djEquipmentMode: fields.djEquipmentMode.value,
    djKit: fields.djKit.value,
    djKits: [...state.selectedDjKits],
    hostRole: fields.hostRole.value,
    hostProps: fields.hostProps.value,
    hostPropsSelected: [...state.selectedHostProps],
    selectedKitPackage: state.selectedKitPackage,
    selectedPropsPackage: state.selectedPropsPackage
  };
}

function restorePackageFields(previous) {
  fields.djRole.value = previous.djRole;
  fields.djEquipmentMode.value = previous.djEquipmentMode;
  fields.djKit.value = previous.djKit;
  state.selectedDjKits = [...previous.djKits];
  fields.hostRole.value = previous.hostRole;
  fields.hostProps.value = previous.hostProps;
  state.selectedHostProps = [...previous.hostPropsSelected];
  state.selectedKitPackage = previous.selectedKitPackage;
  state.selectedPropsPackage = previous.selectedPropsPackage;
  syncSelectFallbacks();
}

function getComposition() {
  const options = serviceDetails[state.serviceType] || [];
  return options.find((item) => item.value === fields.serviceDetail.value) || null;
}

function applyComposition() {
  const composition = getComposition();
  fields.djMode.value = composition ? composition.djMode : "none";
  fields.hostMode.value = composition ? composition.hostMode : "none";
  $$("[data-service-detail]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.serviceDetail === fields.serviceDetail.value);
  });
}

function syncDateTimeFlags() {
  fields.useExactDate.checked = Boolean(fields.eventDate.value);
  fields.useExactTime.checked = Boolean(fields.startTime.value);
  updateInputPlaceholders();
}

function updateInputPlaceholders() {
  $$("[data-for]").forEach((node) => {
    const control = document.getElementById(node.dataset.for);
    const hasValue = Boolean(control && control.value);
    node.classList.toggle("is-hidden", hasValue);
    if (control) control.classList.toggle("has-value", hasValue);
  });
}

function bindServiceDetailButtons() {
  $$("[data-service-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      fields.serviceDetail.value = button.dataset.serviceDetail;
      fields.serviceDetail.dispatchEvent(new Event("change", { bubbles: true }));
      state.buildMode = "";
      state.selectedPackage = "";
      applyComposition();
      renderPackages();
      updateUiState();
      recalculate();
      requestAnimationFrame(recalculate);
    });
  });
}

function setupResultDocking() {
  const syncDock = () => {
    const isMobile = window.matchMedia("(max-width: 680px)").matches;
    if (!isMobile) {
      ui.resultCard.classList.remove("is-docked");
      return;
    }
    const sentinelTop = ui.resultDockSentinel.getBoundingClientRect().top;
    ui.resultCard.classList.toggle("is-docked", sentinelTop > window.innerHeight - 64);
  };

  state.syncResultDock = syncDock;
  syncDock();
  window.addEventListener("scroll", syncDock, { passive: true });
  window.addEventListener("resize", syncDock);
}

function openPicker(control) {
  if (!control) return;
  control.focus();
  if (typeof control.showPicker === "function") {
    try {
      control.showPicker();
    } catch {
      control.click();
    }
  } else {
    control.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
    control.click();
  }
}

function normalizeDiscounts(changed) {
  const discount = state.pricing.discounts[changed.value];
  const checks = $$('input[name="discount"]');
  if (!discount) return;

  if (discount.group === "exclusive" && changed.checked) {
    checks.forEach((input) => {
      if (input !== changed) input.checked = false;
    });
    return;
  }

  if (discount.group === "stackable" && changed.checked) {
    checks.forEach((input) => {
      const item = state.pricing.discounts[input.value];
      if (item.group === "exclusive") input.checked = false;
    });
  }
}

function updateUiState() {
  const basicReady = Boolean(fields.eventType.value && fields.hours.value);
  const composition = getComposition();
  const serviceReady = basicReady && Boolean(composition);
  const modeReady = serviceReady && Boolean(state.buildMode);
  const packageReady = state.buildMode === "packages" && Boolean(state.selectedPackage);
  const showDetails = modeReady && (state.buildMode === "manual" || packageReady);
  const hasDj = serviceReady && fields.djMode.value !== "none";
  const hasHost = serviceReady && fields.hostMode.value !== "none";

  $$(".after-basic").forEach((node) => node.classList.toggle("is-visible", basicReady));
  ui.compositionSection.classList.toggle("is-visible", basicReady);
  ui.serviceDetailWrap.classList.toggle("is-hidden", !basicReady || !state.serviceType);
  ui.modeSection.classList.toggle("is-visible", serviceReady);
  ui.packageGrid.classList.toggle("is-visible", state.buildMode === "packages");
  ui.djSection.classList.toggle("is-visible", showDetails && hasDj);
  ui.hostSection.classList.toggle("is-visible", showDetails && hasHost);
  ui.techSection.classList.toggle("is-visible", showDetails);

  syncDateTimeFlags();
  ui.distanceWrap.classList.toggle("is-visible", fields.outOfTown.checked);
  ui.guestValue.textContent = getGuestValue();
  ui.distanceValue.textContent = `${fields.distanceKm.value} км`;

  const withDjEquipment = fields.djEquipmentMode.value === "own" && hasDj;
  ui.djKitWrap.classList.toggle("is-hidden", !withDjEquipment);
  ui.hostRoleWrap.classList.toggle("is-hidden", !hasHost || fields.hostMode.value === "hostDjSame");
  ui.hostPropsWrap.classList.toggle("is-hidden", !hasHost || fields.hostMode.value === "hostDjSame");

  if (!withDjEquipment) {
    fields.djKit.value = "none";
    state.selectedDjKits = [];
  }
  if (!hasHost || fields.hostMode.value === "hostDjSame") {
    fields.hostProps.value = "none";
    state.selectedHostProps = [];
  }
  syncSelectFallbacks();

  enforceMinimumHours();
  updateInputPlaceholders();
  requestAnimationFrame(() => {
    if (state.syncResultDock) state.syncResultDock();
  });
}

function enforceMinimumHours() {
  const minHours = getMinimumHours(readValues());
  if (fields.hours.value && Number(fields.hours.value) < minHours) fields.hours.value = String(minHours);
  [...fields.hours.options].forEach((option) => {
    option.disabled = option.value !== "" && Number(option.value) < minHours;
  });
}

function readValues() {
  return {
    eventType: fields.eventType.value,
    hours: Number(fields.hours.value),
    useExactDate: fields.useExactDate.checked,
    date: fields.eventDate.value,
    useExactTime: fields.useExactTime.checked,
    time: fields.startTime.value || "16:00",
    guests: getGuestValue(),
    serviceType: state.serviceType,
    serviceDetail: fields.serviceDetail.value,
    djMode: fields.djMode.value,
    djRole: fields.djRole.value,
    djEquipmentMode: fields.djEquipmentMode.value,
    djKit: fields.djKit.value,
    djKits: [...state.selectedDjKits],
    kitMode: state.kitMode,
    noInternet: fields.noInternet.checked,
    needGenerator: fields.needGenerator.checked,
    hostMode: fields.hostMode.value,
    hostRole: fields.hostRole.value,
    hostProps: fields.hostProps.value,
    hostPropsSelected: [...state.selectedHostProps],
    propsMode: state.propsMode,
    noParking: fields.noParking.checked,
    placeType: fields.placeType.value,
    outOfTown: fields.outOfTown.checked,
    distanceKm: Number(fields.distanceKm.value),
    cashless: fields.cashless.checked,
    discounts: [...state.appliedDiscounts]
  };
}

function getGuestValue() {
  return guestSteps[Number(fields.guests.value)] || guestSteps[0];
}

function openDiscountModal() {
  $$('input[name="discount"]').forEach((input) => {
    input.checked = state.appliedDiscounts.includes(input.value);
  });
  const modal = $("#discountModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeDiscountModal() {
  const modal = $("#discountModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function openBookingModal() {
  ui.bookingCopy.textContent = "Написать";
  ui.bookingText.value = buildBookingText(readValues(), state.lastResult || emptyResult());
  const modal = $("#bookingModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeBookingModal() {
  const modal = $("#bookingModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

async function copyBookingSummary() {
  const text = buildBookingText(readValues(), state.lastResult || emptyResult());
  ui.bookingText.value = text;
  try {
    await navigator.clipboard.writeText(text);
    ui.bookingCopy.textContent = "Смета скопирована";
  } catch {
    ui.bookingText.focus();
    ui.bookingText.select();
    document.execCommand("copy");
    ui.bookingCopy.textContent = "Смета скопирована";
  }
}

function recalculate() {
  const values = readValues();
  const result = calculate(values);
  state.lastResult = result;
  renderResult(values, result);
}

function calculate(values) {
  const pricing = state.pricing;
  const rows = [];
  if (!values.eventType || !values.hours) {
    return emptyResult(rows);
  }

  const rate = getGuestRate(values.guests);
  const durationMultiplier = pricing.durationMultipliers[String(values.hours)];
  const eventMultiplier = pricing.eventTypes[values.eventType].multiplier;
  const place = pricing.places[values.placeType] || pricing.places.restaurant;
  const placeMultiplier = place.multiplier;
  const dayTime = getDayTime(values);
  const closeness = getCloseness(values);
  const equipmentMultiplier = pricing.djEquipmentModes[values.djEquipmentMode].multiplier;
  const daysFromBase = daysBetween(pricing.meta.rateBaseDate, toDateInput(new Date()));

  const inflatedDjRate = rate.dj + daysFromBase * pricing.meta.djDailyIncrease;
  const inflatedHostRate = rate.host + daysFromBase * pricing.meta.hostDailyIncrease;

  const hasSelectedService = Boolean(values.serviceDetail) || values.djMode !== "none" || values.hostMode !== "none";
  if (!hasSelectedService) {
    const amount = roundDown(inflatedDjRate * values.hours * durationMultiplier * eventMultiplier, pricing.meta.roundDownTo);
    rows.push(line("Предварительно DJ", amount, [
      `ставка ${formatMoney(inflatedDjRate)}/час`,
      `${values.hours} ${plural(values.hours, "час", "часа", "часов")}`
    ]));
    return {
      rows,
      displayRows: rows,
      beforeReserve: amount,
      reserve: 0,
      withReserve: amount,
      discountPercent: 0,
      discount: 0,
      totalBeforeRound: amount,
      total: Math.max(minimumDisplayTotal, amount),
      vat: 0,
      rate,
      inflatedDjRate,
      inflatedHostRate,
      dayTime,
      closeness
    };
  }

  const hasDj = values.djMode !== "none";
  const hasHost = values.hostMode !== "none";
  const djHostSame = values.djMode === "djHostSame";
  const hostDjSame = values.hostMode === "hostDjSame";
  const samePerson = djHostSame || hostDjSame;

  let djWork = 0;
  if (hasDj && !samePerson) {
    const djMode = pricing.djModes[values.djMode];
    djWork = inflatedDjRate *
      values.hours *
      durationMultiplier *
      eventMultiplier *
      placeMultiplier *
      dayTime.multiplier *
      closeness.multiplier *
      pricing.djRoles[values.djRole].multiplier *
      equipmentMultiplier *
      djMode.hostPresenceMultiplier;

    rows.push(line("DJ", djWork, [
      `ставка ${formatMoney(inflatedDjRate)}/час`,
      pricing.djModes[values.djMode].label,
      pricing.djRoles[values.djRole].label,
      pricing.djEquipmentModes[values.djEquipmentMode].label,
      `${values.hours} ${plural(values.hours, "час", "часа", "часов")}`
    ]));
  }

  let hostWork = 0;
  if (hasHost && !samePerson) {
    const hostMode = pricing.hostModes[values.hostMode];
    hostWork = inflatedHostRate *
      values.hours *
      durationMultiplier *
      eventMultiplier *
      placeMultiplier *
      dayTime.multiplier *
      closeness.multiplier *
      pricing.hostRoles[values.hostRole].multiplier *
      equipmentMultiplier *
      hostMode.djPresenceMultiplier;

    rows.push(line("Ведущий", hostWork, [
      `ставка ${formatMoney(inflatedHostRate)}/час`,
      pricing.hostModes[values.hostMode].label,
      pricing.hostRoles[values.hostRole].label,
      `${values.hours} ${plural(values.hours, "час", "часа", "часов")}`
    ]));
  }

  if (samePerson) {
    const baseSamePersonRate = djHostSame ? inflatedDjRate : inflatedHostRate;
    const roleLabel = djHostSame ? pricing.djRoles[values.djRole].label : pricing.hostRoles[values.hostRole].label;
    const roleMultiplier = djHostSame ? pricing.djRoles[values.djRole].multiplier : pricing.hostRoles[values.hostRole].multiplier;
    hostWork = baseSamePersonRate *
      values.hours *
      durationMultiplier *
      eventMultiplier *
      placeMultiplier *
      dayTime.multiplier *
      closeness.multiplier *
      roleMultiplier *
      1.7;
    rows.push(line("DJ + ведущий в одном лице", hostWork, [
      `ставка ${formatMoney(baseSamePersonRate)}/час`,
      roleLabel,
      "коэффициент ×1.70",
      `${values.hours} ${plural(values.hours, "час", "часа", "часов")}`
    ]));
  }

  const djEquipmentOptions = values.kitMode === "manual" ? manualDjEquipment : pricing.djKits;
  const selectedDjKits = hasDj && values.djEquipmentMode === "own"
    ? values.djKits.filter((key) => djEquipmentOptions[key])
    : [];
  const djKitPrice = selectedDjKits.reduce((total, key) => total + djEquipmentOptions[key].price, 0);
  if (djKitPrice) rows.push(line("Оборудование DJ", djKitPrice, selectedDjKits.map((key) => djEquipmentOptions[key].label)));

  selectedDjKits.forEach((key) => {
    (djEquipmentOptions[key].extraRows || []).forEach((extra) => {
      rows.push(line(extra.title, extra.amount, extra.details || []));
    });
  });

  const hostEquipmentOptions = values.propsMode === "manual" ? manualHostEquipment : pricing.hostProps;
  const selectedHostProps = hasHost && !samePerson
    ? values.hostPropsSelected.filter((key) => hostEquipmentOptions[key])
    : [];
  const hostPropsPrice = selectedHostProps.reduce((total, key) => total + hostEquipmentOptions[key].price, 0);
  if (hostPropsPrice) rows.push(line("Реквизит и артисты ведущего", hostPropsPrice, selectedHostProps.map((key) => hostEquipmentOptions[key].label)));

  selectedHostProps.forEach((key) => {
    (hostEquipmentOptions[key].extraRows || []).forEach((extra) => {
      rows.push(line(extra.title, extra.amount, extra.details || []));
    });
  });

  if (values.noInternet) rows.push(line("Нет интернета", pricing.fixed.noInternet));
  if (values.needGenerator) rows.push(line("Нет подходящей розетки или/и нужен генератор", pricing.fixed.generator));
  if (values.noParking) rows.push(line("Нет парковки", pricing.fixed.parking));

  const hasLoadInOut = djKitPrice > 0 || hostPropsPrice > 0;
  if (hasLoadInOut) rows.push(line("Погрузка / монтаж / демонтаж", pricing.fixed.loadInOut, ["фиксированно при оборудовании или реквизите"]));

  const travelUnits = getTravelUnits(values, hasDj, hasHost, samePerson);
  const travel = values.outOfTown && travelUnits > 0 ? calcTravel(values.distanceKm) * travelUnits : 0;
  if (travel) rows.push(line("Проезд", travel, [`${values.distanceKm} км`, travelUnits > 1 ? "DJ + ведущий" : "1 специалист"]));

  const beforeReserve = sum(rows);
  const reserve = beforeReserve * (pricing.meta.reservePercent / 100);
  const baseRows = rows.slice();

  const withReserve = beforeReserve + reserve;
  const discountPercent = getDiscountPercent(values.discounts);
  const discount = withReserve * (discountPercent / 100);
  if (discount) rows.push(line("Скидка", -discount, [`−${discountPercent}%`, values.discounts.map((key) => pricing.discounts[key].label).join(", ")]));

  let afterDiscount = withReserve - discount;
  let legalExtra = 0;
  if (values.cashless) {
    legalExtra = afterDiscount * (pricing.meta.legalEntityMultiplier - 1);
    rows.push(line("Юрлицо с полным НДС 22%", legalExtra, ["множитель ×1.4"]));
    afterDiscount += legalExtra;
  }

  const totalBeforeRound = afterDiscount;
  const total = roundDown(totalBeforeRound, pricing.meta.roundDownTo);
  const vat = values.cashless ? total * pricing.meta.vatRate / (100 + pricing.meta.vatRate) : 0;

  return {
    rows: rows.filter((row) => Math.round(row.amount) !== 0),
    displayRows: buildDisplayRows(baseRows, reserve, discountPercent, discount, legalExtra, total),
    beforeReserve,
    reserve,
    withReserve,
    discountPercent,
    discount,
    totalBeforeRound,
    total,
    vat,
    rate,
    inflatedDjRate,
    inflatedHostRate,
    dayTime,
    closeness
  };
}

function emptyResult(rows = []) {
  return {
    rows,
    displayRows: rows,
    beforeReserve: 0,
    reserve: 0,
    withReserve: 0,
    discountPercent: 0,
    discount: 0,
    totalBeforeRound: 0,
    total: minimumDisplayTotal,
    vat: 0,
    rate: null,
    inflatedDjRate: 0,
    inflatedHostRate: 0,
    dayTime: null,
    closeness: null
  };
}

function renderResult(values, result) {
  animateTotal(result.total);
  ui.scenarioPill.textContent = values.hours
    ? `${values.hours} ${plural(values.hours, "час", "часа", "часов")} • ${values.guests} ${plural(values.guests, "гость", "гостя", "гостей")}`
    : "Выберите параметры";
  ui.vatNote.innerHTML = result.vat > 0
    ? `включая НДС 22%: <strong>${formatMoney(result.vat)}</strong>`
    : "Оплата наличными или переводом по СБП после мероприятия";

  const visibleRows = result.displayRows || result.rows;
  ui.breakdown.innerHTML = visibleRows.map((row) => `
    <div class="line-item">
      <div>
        <strong>${row.title}</strong>
        ${row.details.length ? `<span>${row.details.join(" • ")}</span>` : ""}
      </div>
      <b>${formatMoney(row.amount)}</b>
    </div>
  `).join("");
}

function animateTotal(nextTotal) {
  if (state.priceAnimation) cancelAnimationFrame(state.priceAnimation);
  const from = state.displayedTotal ?? nextTotal;
  const to = Math.max(minimumDisplayTotal, Math.round(nextTotal));
  const start = performance.now();
  const duration = 520;

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    ui.totalPrice.textContent = formatMoney(current);
    if (progress < 1) {
      state.priceAnimation = requestAnimationFrame(tick);
    } else {
      state.displayedTotal = to;
      ui.totalPrice.textContent = formatMoney(to);
    }
  };

  state.priceAnimation = requestAnimationFrame(tick);
}

function buildDisplayRows(baseRows, reserve, discountPercent, discount, legalExtra, total) {
  const baseTotal = sum(baseRows);
  const reserveFactor = baseTotal ? 1 + reserve / baseTotal : 1;
  const positiveRows = baseRows
    .filter((row) => Math.round(row.amount) !== 0)
    .map((row) => line(row.title, row.amount * reserveFactor, [...row.details, "подготовка включена"]));

  const rows = [...positiveRows];
  if (discount) rows.push(line("Скидка", -discount, [`−${discountPercent}%`]));
  if (legalExtra) rows.push(line("Юрлицо с полным НДС 22%", legalExtra, ["множитель ×1.4"]));

  const delta = Math.round(total - sum(rows));
  if (delta && rows.length) {
    const index = rows.findIndex((row) => row.amount > 0);
    if (index >= 0) rows[index] = { ...rows[index], amount: rows[index].amount + delta };
  }

  return rows.filter((row) => Math.round(row.amount) !== 0);
}

function buildBookingText(values, result) {
  const eventLabel = state.pricing.eventTypes[values.eventType]?.label || "не выбран";
  const placeLabel = state.pricing.places[values.placeType]?.label || "не выбрано";
  const compositionLabel = getServiceDetailLabel(values.serviceDetail) || "не выбран";
  const lines = [
    "Здравствуйте! Хочу уточнить бронь мероприятия.",
    "",
    `Тип мероприятия: ${eventLabel}`,
    `Длительность: ${values.hours || "не выбрано"} ${values.hours ? plural(values.hours, "час", "часа", "часов") : ""}`.trim(),
    `Гостей: ${values.guests}`,
    `Состав: ${compositionLabel}`,
    `Площадка: ${placeLabel}`,
    values.useExactDate && values.date ? `Дата: ${values.date}` : "Дата: пока не указана точно",
    values.useExactTime && values.time ? `Время начала: ${values.time}` : "Время начала: пока не указано точно"
  ];

  if (values.outOfTown) lines.push(`Выезд за город: ${values.distanceKm} км`);
  if (values.noInternet) lines.push("Особенность: нет интернета");
  if (values.needGenerator) lines.push("Особенность: нужен генератор");
  if (values.noParking) lines.push("Особенность: нет парковки");
  if (values.cashless) lines.push("Оплата: юр. лицо с полным НДС 22%");

  lines.push("", "Смета:");
  const visibleRows = result.displayRows || result.rows;
  if (visibleRows.length) {
    visibleRows.forEach((row) => {
      const details = row.details.length ? ` (${row.details.join("; ")})` : "";
      lines.push(`- ${row.title}: ${formatMoney(row.amount)}${details}`);
    });
  } else {
    lines.push("- Позиции ещё не выбраны полностью");
  }

  if (result.discountPercent) lines.push(`Скидка: −${result.discountPercent}%`);
  lines.push(`Итого предварительно: ${formatMoney(result.total)}`);
  lines.push("", "Прошу подтвердить возможность и точную стоимость.");
  return lines.join("\n");
}

function getServiceDetailLabel(value) {
  return Object.values(serviceDetails).flat().find((item) => item.value === value)?.label || "";
}

function getGuestRate(guests) {
  return state.pricing.guestRates.find((row) => guests >= row.min && guests <= row.max) || state.pricing.guestRates.at(-1);
}

function getMinimumHours(values) {
  if (!values.useExactDate || !values.useExactTime) return 1;
  const day = new Date(`${values.date}T12:00:00`).getDay();
  const hour = Number(values.time.split(":")[0]);
  return (day === 5 || day === 6) && hour >= 16 ? 3 : 1;
}

function getDayTime(values) {
  const map = state.pricing.dayTime;
  if (!values.useExactDate || !values.useExactTime || !values.date) return map.unknown;
  const day = new Date(`${values.date}T12:00:00`).getDay();
  const hour = Number(values.time.split(":")[0]);
  if (day === 0) return map.sunday;
  if (day === 5 || day === 6) return hour >= 16 ? map.friSatAfter16 : map.friSat;
  return map.weekday;
}

function getCloseness(values) {
  const map = state.pricing.dateCloseness;
  if (!values.useExactDate || !values.date) return map.unknown;
  const days = daysBetween(toDateInput(new Date()), values.date);
  if (days <= 3) return map["0-3"];
  if (days <= 7) return map["4-7"];
  if (days <= 14) return map["8-14"];
  if (days <= 30) return map["15-30"];
  return map["31+"];
}

function calcTravel(km) {
  if (!km) return 0;
  const tier = state.pricing.travel.tiers.find((item) => km <= item.max) || state.pricing.travel.tiers.at(-1);
  return Math.max(state.pricing.travel.minimum, km * tier.rate);
}

function getTravelUnits(values, hasDj, hasHost, samePerson) {
  if (samePerson) return 1;
  let units = 0;
  if (hasDj) units += 1;
  if (hasHost) units += 1;
  if (values.djMode === "providedHost" && !hasHost) units += 1;
  if (values.hostMode === "providedDj" && !hasDj) units += 1;
  return units;
}

function getDiscountPercent(keys) {
  const discounts = state.pricing.discounts;
  const exclusive = keys.find((key) => discounts[key].group === "exclusive");
  if (exclusive) return discounts[exclusive].percent;
  return keys.reduce((sum, key) => sum + discounts[key].percent, 0);
}

function line(title, amount, details = []) {
  return { title, amount: Math.round(amount), details: details.filter(Boolean) };
}

function sum(rows) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

function roundDown(value, step) {
  return Math.floor(value / step) * step;
}

function formatMoney(value) {
  const sign = value < 0 ? "−" : "";
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("ru-RU")} ₽`;
}

function daysBetween(from, to) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  return Math.floor((end - start) / 86400000);
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}


function timeOptions() {
  const times = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of ["00", "30"]) {
      times.push(`${String(hour).padStart(2, "0")}:${minute}`);
    }
  }
  return times;
}

function plural(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
