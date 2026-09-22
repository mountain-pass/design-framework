// Live preview: mounts the real components/ui/*.tsx into the component sections
// of the kitchen sink (react-preview/index.html is generated from the kitchen
// sink by scripts/build-preview.mjs, which leaves a <div data-preview-mount="id">
// where each component section's demo body was). The other sections — foundations
// and page compositions — are the kitchen sink's own markup, verbatim.

import * as React from "react"
import { createRoot } from "react-dom/client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

// --- inline icons, exact Lucide paths from the kitchen sink -----------------
type IconProps = { className?: string }
const mk =
  (d: React.ReactNode, sw = 2) =>
  ({ className }: IconProps) =>
    (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    )

const ChevronDown = mk(<path d="m6 9 6 6 6-6" />)
const ChevronUp = mk(<path d="m5 15 7-7 7 7" />)
const Check = mk(<path d="M20 6 9 17l-5-5" />, 3)
const Plus = mk(<path d="M5 12h14M12 5v14" />)
const ArrowRight = mk(<path d="M5 12h14M12 5l7 7-7 7" />)
const Settings = mk(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>)
const Spinner = mk(<path d="M21 12a9 9 0 1 1-6.219-8.56" />)
const Search = mk(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>)
const Filter = mk(<path d="M3 6h18M7 12h10M11 18h2" />)
const Columns = mk(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18" /></>)
const Dots = mk(<><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>)
const TrendUp = mk(<path d="M7 17 17 7M9 7h8v8" />, 2.5)
const TrendDown = mk(<path d="M7 7l10 10M17 9v8H9" />, 2.5)
const ImageI = mk(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.35-4.35a2 2 0 0 0-2.83 0L3 21" /></>, 1.5)
const Bell = mk(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>)
const InfoI = mk(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></>)
const AlertCircleI = mk(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></>)
const CheckCircle = mk(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>)
const Warning = mk(<><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4m0 4h.01" /></>)
const XCircle = mk(<><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6m0-6 6 6" /></>)

// --------------------------------------------------------------- sections ---

function ButtonsDemo() {
  return (
    <div className="ks-grid">
      <div>
        <p className="ks-label">Variants</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div>
        <p className="ks-label">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small · h-8</Button>
          <Button>Default · h-9</Button>
          <Button size="lg">Large · h-10</Button>
          <Button size="icon" aria-label="Settings"><Settings className="h-4 w-4" /></Button>
          <span className="font-mono text-xs text-muted-foreground">icon · h-9 w-9</span>
        </div>
      </div>
      <div>
        <p className="ks-label">States</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Rest</Button>
          <Button className="bg-primary/90">Hover</Button>
          <Button className="bg-primary/80">Active</Button>
          <Button className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focused</Button>
          <Button disabled>Disabled</Button>
          <Button><Spinner className="h-4 w-4 animate-spin" />Saving…</Button>
        </div>
        <p className="mt-3 font-mono text-xs text-muted-foreground">Hover and active are shown statically here. No transform, no scale — targets never move.</p>
      </div>
      <div>
        <p className="ks-label">With icons, and button groups</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button><Plus className="h-4 w-4" />New project</Button>
          <Button variant="outline">Continue<ArrowRight className="h-4 w-4" /></Button>
          <div className="inline-flex items-center rounded-md border border-input bg-background shadow-xs">
            <button className="inline-flex h-9 items-center rounded-l-md px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Day</button>
            <span className="h-5 w-px bg-border" aria-hidden="true" />
            <button className="inline-flex h-9 items-center bg-accent px-3 text-sm font-medium text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Week</button>
            <span className="h-5 w-px bg-border" aria-hidden="true" />
            <button className="inline-flex h-9 items-center rounded-r-md px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Month</button>
          </div>
          <div className="inline-flex items-center rounded-md shadow-xs">
            <button className="inline-flex h-9 items-center rounded-l-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Deploy</button>
            <button aria-label="More deploy options" className="inline-flex h-9 w-8 items-center justify-center rounded-r-md border-l border-primary-foreground/20 bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ChevronDown className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputsDemo() {
  return (
    <>
      <div className="ks-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="p1" className="text-sm font-medium leading-none">Project name</label>
          <Input id="p1" placeholder="acme-web" />
          <p className="text-[0.8125rem] text-muted-foreground">Lowercase letters, numbers and hyphens.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="p2" className="text-sm font-medium leading-none">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="p2" type="search" placeholder="Search deployments…" className="pl-9" />
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">With a leading icon at 16px, inset 12px.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="p3" className="text-sm font-medium leading-none text-destructive">Billing email</label>
          <Input id="p3" type="email" defaultValue="not-an-email" aria-invalid aria-describedby="p3-err" />
          <p id="p3-err" className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircleI className="h-3.5 w-3.5 shrink-0" />Enter a valid email address.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="p4" className="text-sm font-medium leading-none text-muted-foreground">Workspace ID</label>
          <Input id="p4" defaultValue="ws_8f21ba90" disabled className="bg-muted font-mono" />
          <p className="text-[0.8125rem] text-muted-foreground">Disabled — 50% opacity, muted fill.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="p5" className="text-sm font-medium leading-none">Region</label>
          <Select defaultValue="syd">
            <SelectTrigger id="p5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="syd">Sydney — ap-southeast-2</SelectItem>
              <SelectItem value="fra">Frankfurt — eu-central-1</SelectItem>
              <SelectItem value="ore">Oregon — us-west-2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.8125rem] text-muted-foreground">Cannot be changed after creation.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="p6" className="text-sm font-medium leading-none">Build command</label>
          <Textarea id="p6" rows={3} defaultValue={"pnpm install --frozen-lockfile\npnpm run build"} className="font-mono" />
          <p className="text-[0.8125rem] text-muted-foreground">Runs in the project root.</p>
        </div>
      </div>

      <div className="ks-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="ks-label">Checkbox</p>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm leading-none"><Checkbox /> Unchecked</label>
            <label className="flex items-center gap-2 text-sm leading-none"><Checkbox defaultChecked /> Checked</label>
            <label className="flex items-center gap-2 text-sm leading-none"><Checkbox checked="indeterminate" /> Indeterminate</label>
            <label className="flex items-center gap-2 text-sm leading-none opacity-50"><Checkbox disabled /> Disabled</label>
          </div>
        </div>
        <div>
          <p className="ks-label">Radio group</p>
          <RadioGroup defaultValue="main">
            <label className="flex items-center gap-2 text-sm leading-none"><RadioGroupItem value="push" /> Every push</label>
            <label className="flex items-center gap-2 text-sm leading-none"><RadioGroupItem value="main" /> Only on <code className="font-mono text-[0.8125rem]">main</code></label>
            <label className="flex items-center gap-2 text-sm leading-none"><RadioGroupItem value="manual" /> Manual only</label>
          </RadioGroup>
        </div>
        <div>
          <p className="ks-label">Switch</p>
          <div className="space-y-3.5">
            <label className="flex items-center gap-2.5 text-sm leading-none"><Switch /> Off</label>
            <label className="flex items-center gap-2.5 text-sm leading-none"><Switch defaultChecked /> On</label>
            <label className="flex items-center gap-2.5 text-sm leading-none opacity-50"><Switch disabled /> Disabled</label>
          </div>
        </div>
        <div>
          <p className="ks-label">Slider</p>
          <div className="pt-1">
            <Slider defaultValue={[62]} max={100} aria-label="Cache size" />
            <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
              <span>0</span><span className="tabular-nums text-foreground">620 MB</span><span>1 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Select — open" is a documentation device: the kitchen sink draws an
          open combobox statically (hand-authored APG markup, not a component) so
          the open state can be read at rest. A real Radix Select opens in a
          portal on interaction and cannot reproduce a static-open panel, so this
          block stays verbatim — it is the same markup the kitchen sink ships. */}
      <div className="mt-8 max-w-sm">
        <p className="ks-label">Select — open</p>
        <div className="space-y-2">
          <span id="ks-region-label" className="block text-sm font-medium leading-none">Region</span>
          <div className="relative">
            <div id="ks-region-trigger" role="combobox" tabIndex={0} aria-haspopup="listbox" aria-expanded="true" aria-controls="ks-region-listbox" aria-labelledby="ks-region-label ks-region-trigger" aria-activedescendant="ks-region-opt-2" className="flex h-9 w-full cursor-default items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span>Sydney — ap-southeast-2</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
            <div id="ks-region-listbox" role="listbox" aria-labelledby="ks-region-label" className="mt-1 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md">
              <div id="ks-region-opt-1" role="option" aria-selected="true" className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span>Sydney — ap-southeast-2</span>
              </div>
              <div id="ks-region-opt-2" role="option" aria-selected="false" className="flex h-8 w-full items-center gap-2 rounded-sm bg-accent px-2 text-sm text-accent-foreground">
                <span className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Frankfurt — eu-central-1</span>
              </div>
              <div id="ks-region-opt-3" role="option" aria-selected="false" className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                <span className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Oregon — us-west-2</span>
              </div>
            </div>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">Rendered open. The selected option carries a check and <span className="font-mono">aria-selected</span>; the highlighted option is tracked with <span className="font-mono">aria-activedescendant</span>.</p>
        </div>
      </div>
    </>
  )
}

function CardDemo() {
  return (
    <>
      <div className="ks-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic card</CardTitle>
            <CardDescription>Header, content, footer. The default container for everything.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content sits at 14px with a 1.6 line height. Card titles use the h3 scale so they do not compete with the page title.</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">Dismiss</Button>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div>
              <CardTitle>With header action</CardTitle>
              <CardDescription>The action is a ghost icon button, aligned to the title baseline.</CardDescription>
            </div>
            <button aria-label="More options" className="-mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Dots className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3 px-6 pb-6">
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Region</span><span className="font-medium">ap-southeast-2</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Runtime</span><span className="font-mono">nodejs22.x</span></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Last deploy</span><span className="tabular-nums">4 minutes ago</span></div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex h-32 items-center justify-center bg-muted"><ImageI className="h-8 w-8 text-muted-foreground" /></div>
          <div className="p-6">
            <CardTitle>Media card</CardTitle>
            <CardDescription>Media is flush to the card edge. The card clips it with <span className="font-mono">overflow-hidden</span>.</CardDescription>
          </div>
        </Card>
      </div>

      <p className="ks-label mt-10">Stat cards</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requests</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.025em]">1.28M</p>
          <p className="mt-1.5 flex items-center gap-1 text-[0.8125rem]"><TrendUp className="h-3.5 w-3.5 text-chart-3" /><span className="font-medium text-chart-3 tabular-nums">12.4%</span><span className="text-muted-foreground">vs last week</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">p95 latency</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.025em]">184<span className="ml-1 text-lg text-muted-foreground">ms</span></p>
          <p className="mt-1.5 flex items-center gap-1 text-[0.8125rem]"><TrendDown className="h-3.5 w-3.5 text-destructive" /><span className="font-medium text-destructive tabular-nums">8.1%</span><span className="text-muted-foreground">vs last week</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Error rate</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.025em]">0.03<span className="ml-0.5 text-lg text-muted-foreground">%</span></p>
          <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">Within the 0.1% budget</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Build minutes</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.025em]">412</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full w-[41%] rounded-full bg-primary" /></div>
          <p className="mt-1.5 text-[0.8125rem] text-muted-foreground tabular-nums">of 1,000 included</p>
        </div>
      </div>
    </>
  )
}

function StatusPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${tone} px-2.5 py-0.5 text-xs font-medium`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{children}
    </span>
  )
}
function Avatar({ initials }: { initials: string }) {
  return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[0.6875rem] font-medium text-muted-foreground">{initials}</span>
}

function TableDemo() {
  const rows = [
    { id: "acme-web-8f21ba9", sel: true, tone: "bg-chart-3/10 text-chart-3", status: "Ready", who: "RK", name: "Rina Kaur", ago: "4 min ago", dur: "1m 04s" },
    { id: "acme-web-3c90d17", sel: false, tone: "bg-primary/10 text-primary", status: "Building", who: "TO", name: "Tomás Ortiz", ago: "22 min ago", dur: "—" },
    { id: "acme-web-71b0e42", sel: false, tone: "bg-destructive/10 text-destructive", status: "Failed", who: "RK", name: "Rina Kaur", ago: "1 hr ago", dur: "0m 38s" },
    { id: "acme-web-d4419aa", sel: false, tone: "bg-chart-3/10 text-chart-3", status: "Ready", who: "JW", name: "Joan Weller", ago: "3 hr ago", dur: "1m 12s" },
    { id: "acme-web-0ae7c31", sel: false, tone: "bg-muted text-muted-foreground", status: "Cancelled", who: "TO", name: "Tomás Ortiz", ago: "Yesterday", dur: "0m 09s" },
  ]
  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Filter deployments…" className="pl-9" />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4" />Status</Button>
        <Button variant="outline"><Columns className="h-4 w-4" />Columns</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"><span className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground"><svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></span></TableHead>
            <TableHead>Deployment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead><button className="inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Created<ChevronUp className="h-3.5 w-3.5" /></button></TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} data-state={r.sel ? "selected" : undefined}>
              <TableCell>{r.sel
                ? <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>
                : <span className="flex h-4 w-4 rounded-sm border border-input bg-background" />}</TableCell>
              <TableCell className="font-mono text-[0.8125rem]">{r.id}</TableCell>
              <TableCell><StatusPill tone={r.tone}>{r.status}</StatusPill></TableCell>
              <TableCell><span className="flex items-center gap-2"><Avatar initials={r.who} />{r.name}</span></TableCell>
              <TableCell className="text-muted-foreground tabular-nums">{r.ago}</TableCell>
              <TableCell className="text-right tabular-nums">{r.dur}</TableCell>
              <TableCell><button aria-label="Row actions" className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Dots className="h-4 w-4" /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-[0.8125rem] text-muted-foreground"><span className="tabular-nums">1</span> of <span className="tabular-nums">5</span> rows selected</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}

function BadgesDemo() {
  return (
    <div className="ks-grid grid-cols-1 md:grid-cols-3">
      <div>
        <p className="ks-label">Badge variants</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
      <div>
        <p className="ks-label">Status pills</p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="bg-chart-3/10 text-chart-3">Healthy</StatusPill>
          <StatusPill tone="bg-chart-4/10 text-chart-4">Degraded</StatusPill>
          <StatusPill tone="bg-destructive/10 text-destructive">Down</StatusPill>
          <StatusPill tone="bg-primary/10 text-primary">Deploying</StatusPill>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />Paused</span>
        </div>
      </div>
      <div>
        <p className="ks-label">Counters</p>
        <div className="flex flex-wrap items-center gap-6">
          <button aria-label="Notifications, 12 unread" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] font-medium tabular-nums text-destructive-foreground">12</span>
          </button>
          <span className="inline-flex items-center gap-2 text-sm">Issues <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium tabular-nums text-muted-foreground">7</span></span>
          <span className="inline-flex items-center gap-2 text-sm">Drafts <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium tabular-nums text-muted-foreground">99+</span></span>
        </div>
      </div>
    </div>
  )
}

function AlertsDemo() {
  return (
    <div className="ks-grid grid-cols-1 lg:grid-cols-2">
      <Alert>
        <InfoI className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 space-y-1"><AlertTitle>Preview deployments are enabled</AlertTitle><AlertDescription>Every pull request gets its own URL. Previews are deleted 30 days after the branch is merged.</AlertDescription></div>
      </Alert>
      <Alert intent="success">
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
        <div className="min-w-0 space-y-1"><AlertTitle>Domain verified</AlertTitle><AlertDescription>acme.com is now serving from the production deployment.</AlertDescription></div>
      </Alert>
      <Alert intent="warning">
        <Warning className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
        <div className="min-w-0 space-y-1">
          <AlertTitle>Approaching your build minute limit</AlertTitle>
          <AlertDescription>You have used 412 of 1,000 minutes this cycle.</AlertDescription>
          <a href="#alerts" className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">Upgrade plan</a>
        </div>
      </Alert>
      <Alert intent="destructive">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <div className="min-w-0 space-y-1">
          <AlertTitle>Build failed</AlertTitle>
          <AlertDescription>Module not found: <span className="font-mono text-[0.8125rem]">@acme/ui-tokens</span>. Check that the package is listed in dependencies.</AlertDescription>
          <a href="#alerts" className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">View build log</a>
        </div>
      </Alert>
    </div>
  )
}

function TabsDemo() {
  return (
    <div className="ks-grid grid-cols-1 lg:grid-cols-2">
      <div>
        <p className="ks-label">Horizontal tabs</p>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><p className="max-w-[70ch] text-muted-foreground">The active panel renders below the bar with no additional container. A tab panel that adds its own border doubles the rule already drawn by the tab bar.</p></TabsContent>
          <TabsContent value="deployments"><p className="max-w-[70ch] text-muted-foreground">Deployments panel.</p></TabsContent>
          <TabsContent value="logs"><p className="max-w-[70ch] text-muted-foreground">Logs panel.</p></TabsContent>
          <TabsContent value="settings"><p className="max-w-[70ch] text-muted-foreground">Settings panel.</p></TabsContent>
        </Tabs>
      </div>
      <div className="space-y-8">
        <div>
          <p className="ks-label">Segmented control</p>
          <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
            <button className="inline-flex h-7 items-center rounded-sm bg-background px-3 text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Preview</button>
            <button className="inline-flex h-7 items-center rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Code</button>
            <button className="inline-flex h-7 items-center rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Diff</button>
          </div>
        </div>
        <div>
          <p className="ks-label">Vertical tabs</p>
          <div className="flex gap-6">
            <nav className="flex w-40 shrink-0 flex-col gap-0.5">
              <a href="#tabs" className="flex h-8 items-center rounded-md bg-accent px-2.5 text-sm font-medium text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">General</a>
              <a href="#tabs" className="flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Domains</a>
              <a href="#tabs" className="flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Environment</a>
              <a href="#tabs" className="flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Members</a>
            </nav>
            <p className="text-sm text-muted-foreground">Vertical tabs use the sidebar item treatment rather than an underline, because a vertical rule reads as a container edge.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------------- mount ---

const DEMOS: Record<string, () => React.ReactElement> = {
  buttons: ButtonsDemo,
  inputs: InputsDemo,
  card: CardDemo,
  table: TableDemo,
  badges: BadgesDemo,
  alerts: AlertsDemo,
  tabs: TabsDemo,
}

for (const [id, Demo] of Object.entries(DEMOS)) {
  const el = document.querySelector(`[data-preview-mount="${id}"]`)
  if (el) createRoot(el).render(<Demo />)
}
