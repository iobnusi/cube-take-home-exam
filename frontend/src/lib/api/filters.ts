import { BASE_URL } from "../constants";
import { buildQuery } from "../utils";

export async function fetchL1Categories(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/filters/l1_categories`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l1_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL2Categories(l1: string): Promise<string[]> {
    const qs = buildQuery({ l1_category: l1 });
    const res = await fetch(`${BASE_URL}/filters/l2_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l2_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL3Categories(
    l1: string,
    l2: string
): Promise<string[]> {
    const qs = buildQuery({ l1_category: l1, l2_category: l2 });
    const res = await fetch(`${BASE_URL}/filters/l3_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l3_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL4Categories(
    l1: string,
    l2: string,
    l3: string
): Promise<string[]> {
    const qs = buildQuery({
        l1_category: l1,
        l2_category: l2,
        l3_category: l3,
    });
    const res = await fetch(`${BASE_URL}/filters/l4_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l4_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchPlatforms(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/filters/platforms`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/platforms");
    return res.json() as Promise<string[]>;
}

export async function fetchRegions(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/filters/regions`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/regions");
    return res.json() as Promise<string[]>;
}
