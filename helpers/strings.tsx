export function maskString({ string }: { string: string }) {
  if (!string) return "";

  return "*".repeat(string.length);
}

export function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";

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
