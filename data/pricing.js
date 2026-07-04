window.__PRICING__ = {
  "meta": {
    "version": "2026.07.03",
    "currency": "RUB",
    "rateBaseDate": "2026-07-03",
    "djDailyIncrease": 0.5,
    "hostDailyIncrease": 1.5,
    "reservePercent": 10,
    "legalEntityMultiplier": 1.4,
    "vatRate": 22,
    "roundDownTo": 100
  },
  "eventTypes": {
    "wedding": {
      "label": "Свадьба",
      "multiplier": 1
    },
    "anniversary": {
      "label": "Юбилей",
      "multiplier": 1
    },
    "birthday": {
      "label": "День рождения",
      "multiplier": 1
    },
    "kids": {
      "label": "Детский праздник",
      "multiplier": 1.3
    },
    "officeCorporate": {
      "label": "Корпоратив офисный",
      "multiplier": 1.3
    },
    "newYearCorporate": {
      "label": "Новогодний корпоратив",
      "multiplier": 1.5
    },
    "opening": {
      "label": "Открытие / Презентация",
      "multiplier": 1.3
    },
    "graduation": {
      "label": "Выпускной",
      "multiplier": 1.2
    },
    "festival": {
      "label": "День города / Фестиваль",
      "multiplier": 1.5
    },
    "club": {
      "label": "Клубная вечеринка",
      "multiplier": 1.4
    },
    "picnic": {
      "label": "Пикник / Тимбилдинг",
      "multiplier": 1
    },
    "custom": {
      "label": "Свой вариант",
      "multiplier": 1
    }
  },
  "durationMultipliers": {
    "1": 1.6,
    "2": 1.4,
    "3": 1,
    "4": 0.99,
    "5": 0.95,
    "6": 0.99,
    "7": 1,
    "8": 1.1,
    "9": 1.2,
    "10": 1.3,
    "11": 1.4,
    "12": 1.6
  },
  "guestRates": [
    {
      "min": 2,
      "max": 50,
      "dj": 1500,
      "host": 5000
    },
    {
      "min": 51,
      "max": 80,
      "dj": 1700,
      "host": 6500
    },
    {
      "min": 81,
      "max": 110,
      "dj": 2000,
      "host": 8000
    },
    {
      "min": 111,
      "max": 140,
      "dj": 2300,
      "host": 10000
    },
    {
      "min": 141,
      "max": 170,
      "dj": 2600,
      "host": 12500
    },
    {
      "min": 171,
      "max": 200,
      "dj": 3000,
      "host": 15000
    }
  ],
  "places": {
    "restaurant": {
      "label": "Ресторан / Лофт",
      "multiplier": 1
    },
    "country": {
      "label": "Загородный дом / база",
      "multiplier": 1.3
    },
    "tent": {
      "label": "Беседка / шатёр",
      "multiplier": 1.5
    },
    "street": {
      "label": "Улица / парк",
      "multiplier": 1.4
    }
  },
  "dayTime": {
    "unknown": {
      "label": "Дата или время не утверждены",
      "multiplier": 1
    },
    "weekday": {
      "label": "Будни",
      "multiplier": 1
    },
    "friSat": {
      "label": "Пятница / суббота",
      "multiplier": 1.1
    },
    "friSatAfter16": {
      "label": "Пятница / суббота после 16:00",
      "multiplier": 1.11
    },
    "sunday": {
      "label": "Воскресенье",
      "multiplier": 1.1
    }
  },
  "dateCloseness": {
    "unknown": {
      "label": "Дата не указана",
      "multiplier": 1
    },
    "0-3": {
      "label": "0–3 дня",
      "multiplier": 1.2
    },
    "4-7": {
      "label": "4–7 дней",
      "multiplier": 1.1
    },
    "8-14": {
      "label": "8–14 дней",
      "multiplier": 1
    },
    "15-30": {
      "label": "15–30 дней",
      "multiplier": 0.95
    },
    "31+": {
      "label": "31+ дней",
      "multiplier": 0.9
    }
  },
  "djModes": {
    "none": {
      "label": "DJ не нужен",
      "roleMultiplier": 0,
      "hostPresenceMultiplier": 1
    },
    "onlyDj": {
      "label": "Только DJ",
      "hostPresenceMultiplier": 1.3
    },
    "djHostSame": {
      "label": "DJ + ведущий в одном лице",
      "hostPresenceMultiplier": 1.7
    },
    "clientHost": {
      "label": "DJ, отдельный ведущий клиента/другой ведущий",
      "hostPresenceMultiplier": 1
    },
    "providedHost": {
      "label": "DJ, отдельный мой ведущий",
      "hostPresenceMultiplier": 0.98
    }
  },
  "djRoles": {
    "lounge": {
      "label": "Лаунж",
      "multiplier": 0.8
    },
    "basic": {
      "label": "Базовый универсал",
      "multiplier": 1
    },
    "contest": {
      "label": "Универсал с конкурсами",
      "multiplier": 1.2
    },
    "clubMc": {
      "label": "Клубный MC",
      "multiplier": 1.5
    },
    "awardHost": {
      "label": "Ведущий для премий",
      "multiplier": 3
    }
  },
  "djEquipmentModes": {
    "own": {
      "label": "С моим оборудованием",
      "multiplier": 1
    },
    "withoutMine": {
      "label": "Без моего оборудования",
      "multiplier": 1.09
    }
  },
  "djKits": {
    "none": {
      "label": "Без оборудования",
      "price": 0
    },
    "jbl": {
      "label": "Мобильный JBL",
      "price": 2000
    },
    "light": {
      "label": "Лёгкий комплект",
      "price": 3000
    },
    "lightLux": {
      "label": "Лёгкий комплект Люкс",
      "price": 9000
    },
    "standard": {
      "label": "Стандарт 2 кВт",
      "price": 4000
    },
    "standardLux": {
      "label": "Стандарт 2 кВт Люкс",
      "price": 12000
    },
    "pro": {
      "label": "Профи 5 кВт",
      "price": 15000
    },
    "proLux": {
      "label": "Профи Люкс",
      "price": 75000
    }
  },
  "hostModes": {
    "none": {
      "label": "Ведущий не нужен",
      "djPresenceMultiplier": 1
    },
    "onlyHost": {
      "label": "Только ведущий",
      "djPresenceMultiplier": 1.4
    },
    "hostDjSame": {
      "label": "Ведущий + DJ в одном лице",
      "djPresenceMultiplier": 1.7
    },
    "clientDj": {
      "label": "Ведущий, отдельный DJ клиента/другой DJ",
      "djPresenceMultiplier": 1
    },
    "providedDj": {
      "label": "Ведущий, отдельный мой DJ",
      "djPresenceMultiplier": 0.98
    }
  },
  "hostRoles": {
    "tamada": {
      "label": "Тамада",
      "multiplier": 0.9
    },
    "host": {
      "label": "Ведущий",
      "multiplier": 1
    },
    "animator": {
      "label": "Аниматор / игротехник",
      "multiplier": 1.11
    },
    "conference": {
      "label": "Конферансье",
      "multiplier": 1.5
    },
    "mc": {
      "label": "MC",
      "multiplier": 1.45
    }
  },
  "hostProps": {
    "none": {
      "label": "Без оборудования и реквизита",
      "price": 0
    },
    "timing": {
      "label": "Разработка индивидуального тайминга",
      "price": 1500
    },
    "specialists": {
      "label": "Подбор доп. специалистов и артистов",
      "price": 1500
    },
    "mobile": {
      "label": "Мобильный реквизит",
      "price": 2000
    },
    "light": {
      "label": "Лёгкий комплект реквизита плюс призы",
      "price": 5000
    },
    "lightLux": {
      "label": "Лёгкий комплект реквизита плюс призы Люкс",
      "price": 15000
    },
    "standard": {
      "label": "Стандарт: реквизит, призы, экран с проектором",
      "price": 10000
    },
    "standardLux": {
      "label": "Стандарт Люкс: реквизит, призы, экран с проектором",
      "price": 25000
    },
    "pro": {
      "label": "Профи: реквизит, призы, экран, операторы и помощники",
      "price": 40000
    },
    "proLux": {
      "label": "Профи Люкс: реквизит, призы, экран, операторы и помощники",
      "price": 120000
    }
  },
  "fixed": {
    "noInternet": 500,
    "generator": 5000,
    "parking": 1000,
    "loadInOut": 2000
  },
  "travel": {
    "minimum": 500,
    "tiers": [
      {
        "max": 50,
        "rate": 35
      },
      {
        "max": 150,
        "rate": 30
      },
      {
        "max": 300,
        "rate": 25
      }
    ]
  },
  "discounts": {
    "review": {
      "label": "Оставлю отзыв",
      "percent": 2,
      "group": "stackable"
    },
    "friends": {
      "label": "Приведу друзей",
      "percent": 5,
      "group": "stackable"
    },
    "today": {
      "label": "Бронирую сегодня",
      "percent": 3,
      "group": "stackable"
    },
    "partner": {
      "label": "Партнёр / агентство",
      "percent": 10,
      "group": "exclusive"
    },
    "longTerm": {
      "label": "Долгосрочный договор",
      "percent": 15,
      "group": "exclusive"
    }
  }
};
