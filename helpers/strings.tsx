export function maskString({ string }: { string: string }) {
  if (!string) return "";

  return "*".repeat(string.length);
}

export function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

export function ruApplicationsByCount({ count }: { count: number }) {
  const ruApplications: { [key: number]: string } = {
    0: "заявок",
    1: "заявка",
    2: "заявки",
    3: "заявки",
    4: "заявки",
    5: "заявок",
    6: "заявок",
    7: "заявок",
    8: "заявок",
    9: "заявок",
    10: "заявок",
    11: "заявок",
    12: "заявок",
    13: "заявок",
    14: "заявок",
  };

  if (count <= 14) return ruApplications[count];

  return ruApplications[count % 10];
}

export function formatDateString({ dateString }: { dateString: string }) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0"); // Получаем день
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Получаем месяц (нужно добавить 1, так как getUTCMonth() возвращает индекс месяца от 0 до 11)
  const year = date.getUTCFullYear(); // Получаем год
  const hours = String(date.getUTCHours()).padStart(2, "0"); // Получаем часы
  const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Получаем минуты

  return `${day}.${month}.${year} в ${hours}:${minutes}`;
}

export function nameFromNameParts({
  firstname,
  middlename,
  lastname,
}: {
  firstname?: string;
  middlename?: string;
  lastname?: string;
}) {
  return `${lastname ? `${lastname} ` : ``}${firstname ? `${firstname} ` : ``}${
    middlename ? middlename : ""
  }`;
}

export function translitMap(char: string) {
  const map: { [key: string]: string } = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return map[char];
}

function transliterate(text: string): string {
  return text
    .split("")
    .map((char) => translitMap(char))
    .join("");
}

export function normalizePhone({ phone }: { phone?: string }) {
  if (!phone) return;

  const phoneDigits = phone
    .replace(/\D/g, "")
    .match(/^(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?/);

  if (!phoneDigits) return;

  return `${
    phoneDigits[1]
      ? parseInt(phoneDigits[1]) == 8
        ? "+7"
        : phoneDigits[1]
        ? "+" + phoneDigits[1]
        : ""
      : ""
  }${phoneDigits[2] ? ` ${phoneDigits[2]}` : ""}${
    phoneDigits[3] ? phoneDigits[3] : ""
  }${phoneDigits[4] ? phoneDigits[4] : ""}${
    phoneDigits[5] ? ` ${phoneDigits[5]}` : ""
  }${phoneDigits[6] ? phoneDigits[6] : ""}${
    phoneDigits[7] ? phoneDigits[7] : ""
  }${phoneDigits[8] ? `-${phoneDigits[8]}` : ""}${
    phoneDigits[9] ? phoneDigits[9] : ""
  }${phoneDigits[10] ? `-${phoneDigits[10]}` : ""}${
    phoneDigits[11] ? phoneDigits[11] : ""
  }`;
}
