import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type ClubRow = {
  id: string;
  name: string;
  shortName: string;
  joinCode: string;
  role: string;
  plan: string;
  planExpiresAt: string | null;
  memberCount: number;
  ownerId: string;
};

function makeJoinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function resolvePlan(plan: string, expires: string | null): string {
  if (plan === "club") return "club";
  if (expires && Date.parse(String(expires)) < Date.now()) return "expired";
  return plan || "trial";
}

function mapRow(row: ClubRow): ClubRow {
  return {
    ...row,
    memberCount: Number(row.memberCount),
    plan: resolvePlan(row.plan, row.planExpiresAt),
  };
}

async function clubForUser(userId: string): Promise<ClubRow | null> {
  const sql = await getSql();
  const rows = await sql<ClubRow>`
    select
      c.id,
      c.name,
      c.short_name as "shortName",
      c.join_code as "joinCode",
      m.role,
      c.plan,
      c.plan_expires_at as "planExpiresAt",
      c.owner_id as "ownerId",
      (select count(*)::int from club_members cm where cm.club_id = c.id) as "memberCount"
    from club_members m
    join clubs c on c.id = m.club_id
    where m.user_id = ${userId}
    order by m.created_at asc
    limit 1
  `;
  return rows[0] ? mapRow(rows[0]) : null;
}

export const getMyClub = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => clubForUser(context.userId));

export const createClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; shortName: string }) => ({
    name: String(input.name ?? "").trim().slice(0, 48),
    shortName: String(input.shortName ?? "").trim().slice(0, 8).toUpperCase(),
  }))
  .handler(async ({ context, data }) => {
    if (!data.name) throw new Error("Club name is required");
    const existing = await clubForUser(context.userId);
    if (existing) throw new Error("You already have a club");
    const sql = await getSql();
    const id = `club_${crypto.randomUUID().slice(0, 8)}`;
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    let code = makeJoinCode();
    let created = false;
    for (let i = 0; i < 8; i++) {
      try {
        await sql`
          insert into clubs (id, name, short_name, join_code, owner_id, plan, plan_expires_at)
          values (${id}, ${data.name}, ${data.shortName}, ${code}, ${context.userId}, ${"trial"}, ${expires})
        `;
        created = true;
        break;
      } catch {
        code = makeJoinCode();
      }
    }
    if (!created) throw new Error("Could not create club");
    await sql`
      insert into club_members (club_id, user_id, role)
      values (${id}, ${context.userId}, ${"owner"})
    `;
    return clubForUser(context.userId);
  });

export const joinClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { code: string }) => ({
    code: String(input.code ?? "").trim().toUpperCase().replace(/\s+/g, ""),
  }))
  .handler(async ({ context, data }) => {
    if (data.code.length < 4) throw new Error("Enter a join code");
    const existing = await clubForUser(context.userId);
    if (existing) throw new Error("Leave your current club before joining another");
    const sql = await getSql();
    const found = await sql<{ id: string }>`
      select id from clubs where join_code = ${data.code} limit 1
    `;
    if (!found[0]) throw new Error("No club with that code");
    await sql`
      insert into club_members (club_id, user_id, role)
      values (${found[0].id}, ${context.userId}, ${"coach"})
      on conflict (club_id, user_id) do nothing
    `;
    return clubForUser(context.userId);
  });

export const activateClubPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const club = await clubForUser(context.userId);
    if (!club) throw new Error("Create a club first");
    if (club.role !== "owner") throw new Error("Only the club owner can change the plan");
    const sql = await getSql();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    await sql`
      update clubs
      set plan = ${"club"}, plan_expires_at = ${expires}
      where id = ${club.id} and owner_id = ${context.userId}
    `;
    return clubForUser(context.userId);
  });
