const state = {
  pricing: null,
  content: null,
  lastResult: null,
  appliedDiscounts: [],
  serviceType: "",
  displayedTotal: null,
  priceAnimation: null,
  syncResultDock: null
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
  fillSelect(fields.placeType, state.pricing.places);

  fields.hours.innerHTML = [
    '<option value="">Выберите кол-во часов</option>',
    ...Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}">${value} ${plural(value, "час", "часа", "часов")}</option>`;
    })
  ].join("");

  renderServiceDetails();

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
  fields.startTime.value = "16:00";
  fields.guests.value = "0";
  fields.serviceDetail.value = "";
  fields.djMode.value = "none";
  fields.djRole.value = "basic";
  fields.djEquipmentMode.value = "own";
  fields.djKit.value = "light";
  fields.hostMode.value = "none";
  fields.hostRole.value = "host";
  fields.hostProps.value = "none";
  fields.placeType.value = "restaurant";
  fields.distanceKm.value = "10";

  const date = new Date();
  date.setDate(date.getDate() + 14);
  fields.eventDate.value = toDateInput(date);
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
      renderServiceDetails();
      applyComposition();
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

function bindServiceDetailButtons() {
  $$("[data-service-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      fields.serviceDetail.value = button.dataset.serviceDetail;
      applyComposition();
      updateUiState();
      recalculate();
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
  const hasDj = serviceReady && fields.djMode.value !== "none";
  const hasHost = serviceReady && fields.hostMode.value !== "none";

  $$(".after-basic").forEach((node) => node.classList.toggle("is-visible", basicReady));
  ui.compositionSection.classList.toggle("is-visible", basicReady);
  ui.serviceDetailWrap.classList.toggle("is-hidden", !basicReady || !state.serviceType);
  ui.djSection.classList.toggle("is-visible", hasDj);
  ui.hostSection.classList.toggle("is-visible", hasHost);
  ui.techSection.classList.toggle("is-visible", serviceReady);

  ui.dateWrap.classList.toggle("is-visible", fields.useExactDate.checked);
  ui.timeWrap.classList.toggle("is-visible", fields.useExactTime.checked);
  ui.distanceWrap.classList.toggle("is-visible", fields.outOfTown.checked);
  ui.guestValue.textContent = getGuestValue();
  ui.distanceValue.textContent = `${fields.distanceKm.value} км`;

  const withDjEquipment = fields.djEquipmentMode.value === "own" && hasDj;
  ui.djKitWrap.classList.toggle("is-hidden", !withDjEquipment);
  ui.hostRoleWrap.classList.toggle("is-hidden", !hasHost || fields.hostMode.value === "hostDjSame");
  ui.hostPropsWrap.classList.toggle("is-hidden", !hasHost || fields.hostMode.value === "hostDjSame");

  if (!withDjEquipment) fields.djKit.value = "none";
  if (!hasHost || fields.hostMode.value === "hostDjSame") {
    fields.hostProps.value = "none";
  }

  enforceMinimumHours();
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
    noInternet: fields.noInternet.checked,
    needGenerator: fields.needGenerator.checked,
    hostMode: fields.hostMode.value,
    hostRole: fields.hostRole.value,
    hostProps: fields.hostProps.value,
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
  if (!values.eventType || !values.hours || !values.serviceDetail) {
    return emptyResult(rows);
  }

  const rate = getGuestRate(values.guests);
  const durationMultiplier = pricing.durationMultipliers[String(values.hours)];
  const eventMultiplier = pricing.eventTypes[values.eventType].multiplier;
  const placeMultiplier = pricing.places[values.placeType].multiplier;
  const dayTime = getDayTime(values);
  const closeness = getCloseness(values);
  const equipmentMultiplier = pricing.djEquipmentModes[values.djEquipmentMode].multiplier;
  const daysFromBase = daysBetween(pricing.meta.rateBaseDate, toDateInput(new Date()));

  const inflatedDjRate = rate.dj + daysFromBase * pricing.meta.djDailyIncrease;
  const inflatedHostRate = rate.host + daysFromBase * pricing.meta.hostDailyIncrease;

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

  const djKitPrice = hasDj ? pricing.djKits[values.djKit].price : 0;
  if (djKitPrice) rows.push(line("Оборудование DJ", djKitPrice, [pricing.djKits[values.djKit].label]));

  const hostPropsPrice = hasHost && !samePerson ? pricing.hostProps[values.hostProps].price : 0;
  if (hostPropsPrice) rows.push(line("Реквизит ведущего", hostPropsPrice, [pricing.hostProps[values.hostProps].label]));

  if (values.noInternet) rows.push(line("Нет интернета", pricing.fixed.noInternet));
  if (values.needGenerator) rows.push(line("Генератор", pricing.fixed.generator));
  if (values.noParking) rows.push(line("Нет парковки", pricing.fixed.parking));

  const hasLoadInOut = djKitPrice > 0 || hostPropsPrice > 0;
  if (hasLoadInOut) rows.push(line("Погрузка / монтаж / демонтаж", pricing.fixed.loadInOut, ["фиксированно при оборудовании или реквизите"]));

  const travelUnits = getTravelUnits(values, hasDj, hasHost, samePerson);
  const travel = values.outOfTown && travelUnits > 0 ? calcTravel(values.distanceKm) * travelUnits : 0;
  if (travel) rows.push(line("Проезд", travel, [`${values.distanceKm} км`, travelUnits > 1 ? "DJ + ведущий" : "1 специалист"]));

  const beforeReserve = sum(rows);
  const reserve = beforeReserve * (pricing.meta.reservePercent / 100);

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

  ui.breakdown.innerHTML = result.rows.map((row) => `
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
  if (result.rows.length) {
    result.rows.forEach((row) => {
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
