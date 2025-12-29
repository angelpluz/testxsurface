export type ContactInput = {
  name?: string;
  tel?: string;
  code?: string;
};

export type TransformedContact = {
  name?: string;
  tel: string | string[] | undefined;
  code?: string;
};

export type ContactContainer = {
  customer?: string;
  address?: string;
  contact?: Array<{ name?: string }>;
};

export type ExplodedContact = {
  name?: string;
  customer?: string;
  address?: string;
};

export type NameAge = {
  name?: string;
  age?: string | number;
};

// (A) Group contacts by code while preserving first-seen order.
export function transformContactsByCode(inputArray: ContactInput[]): TransformedContact[] {
  if (!Array.isArray(inputArray)) return [];

  const byCode = new Map<string, { name?: string; code?: string; count: number; tels: Array<string | undefined> }>();
  const order: string[] = [];

  inputArray.forEach((item, index) => {
    if (!item || typeof item !== "object") return;

    const hasCode = item.code !== undefined && item.code !== null;
    const key = hasCode ? String(item.code) : `__missing__${index}`;

    if (!byCode.has(key)) {
      order.push(key);
      byCode.set(key, {
        name: item.name,
        code: item.code,
        count: 0,
        tels: [],
      });
    }

    const entry = byCode.get(key);
    if (!entry) return;

    entry.count += 1;
    if (Object.prototype.hasOwnProperty.call(item, "tel")) {
      entry.tels.push(item.tel);
    }
  });

  return order.map((key) => {
    const entry = byCode.get(key);
    if (!entry) return { name: undefined, tel: undefined, code: undefined };

    const result: TransformedContact = {
      name: entry.name,
      code: entry.code,
      tel: undefined,
    };

    const cleanedTels = entry.tels.filter(
      (tel): tel is string => typeof tel === "string" && tel.trim().length > 0
    );

    if (entry.count > 1) {
      result.tel = cleanedTels.length > 0 ? cleanedTels : undefined;
    } else {
      result.tel = cleanedTels[0];
    }

    return result;
  });
}

// (B) Explode the contact list into one row per contact.
export function explodeContacts(inputObject: ContactContainer): ExplodedContact[] {
  if (!inputObject || typeof inputObject !== "object") return [];

  const contacts = Array.isArray(inputObject.contact) ? inputObject.contact : [];
  return contacts.map((contact) => ({
    name: contact && typeof contact === "object" ? contact.name : undefined,
    customer: inputObject.customer,
    address: inputObject.address,
  }));
}

// (C) Filter by age range + divisible-by-3 rule, sort numerically, and return names.
export function namesByAgeRangeSorted(inputArray: NameAge[], minAge = 9, maxAge = 30): string[] {
  if (!Array.isArray(inputArray)) return [];

  let min = Number(minAge);
  let max = Number(maxAge);
  if (!Number.isFinite(min)) min = 9;
  if (!Number.isFinite(max)) max = 30;
  if (min > max) [min, max] = [max, min];

  const filtered = inputArray
    .map((item, index) => ({
      name: typeof item?.name === "string" ? item.name : "",
      age: Number(item?.age),
      index,
    }))
    .filter((item) => Number.isFinite(item.age) && item.age >= min && item.age <= max && item.age % 3 === 0);

  // Stable sort by age, then by original index.
  filtered.sort((a, b) => a.age - b.age || a.index - b.index);

  return filtered.map((item) => item.name).filter((name) => name.length > 0);
}

// (D) Render a bullet list string from names.
export function renderBulletListFromNames(namesArray: string[]): string {
  if (!Array.isArray(namesArray) || namesArray.length === 0) return "";
  return namesArray
    .map((name) => `- This is ${name}, It correctly outputs from question C.`)
    .join("\n");
}

export const sampleInputA: ContactInput[] = [
  { name: "Alex", tel: "0991112222", code: "xsf0001" },
  { name: "Jane", tel: "0812221234", code: "xsf0002" },
  { name: "Alex", tel: "0832214433", code: "xsf0001" },
  { name: "Alex", tel: "0991113122", code: "xsf0003" },
];

export const sampleInputB: ContactContainer = {
  customer: "Xsurface",
  contact: [{ name: "Max" }, { name: "Mike" }, { name: "Adam" }],
  address: "Sukhumvit 62",
};

export const sampleInputC: NameAge[] = [
  { name: "A", age: "30" },
  { name: "B", age: "9" },
  { name: "C", age: "20" },
  { name: "D", age: "18" },
  { name: "E", age: "11" },
  { name: "F", age: "60" },
  { name: "G", age: "27" },
  { name: "H", age: "90" },
  { name: "I", age: "21" },
  { name: "J", age: "12" },
];
