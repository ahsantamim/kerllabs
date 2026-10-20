import { capabilities, capabilityLabels, rolePermissions, type Role } from "@nodal/content";
import { Icon, RoleBadge } from "@nodal/ui";
import { ADMIN_NAV, Shell, Table } from "@/components/Shell";
import { getSession } from "@/lib/session";

export const metadata = { title: "Roles & access" };
const ROLES: Role[] = ["admin", "editor", "pm", "specialist"];

export default async function Roles() {
  const session = (await getSession())!;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/roles" title="Roles & access" subtitle="Specialists can only ever edit their own record">
      <Table head={["Permission", ...ROLES.map((r) => r.toUpperCase())]}>
        {capabilities.map((c) => (
          <tr key={c} className={c === "profile.edit_any" ? "!bg-error-subtle" : ""}>
            <td className="!text-fg">{capabilityLabels[c]}</td>
            {ROLES.map((r) => <td key={r}>{rolePermissions[r].includes(c) ? <Icon name="check" size={16} className="text-success" /> : <span className="text-fg-disabled">—</span>}</td>)}
          </tr>
        ))}
      </Table>
      <div className="flex gap-2">{ROLES.map((r) => <RoleBadge key={r} role={r} />)}</div>
    </Shell>
  );
}
