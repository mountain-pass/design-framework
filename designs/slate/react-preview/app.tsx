// Live preview app — renders the real components/ui/*.tsx.
// Transformed in the browser by index.html (Babel); no build step, but it does
// need a network connection for the CDN packages. See README.md.

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
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"
import { SidebarNav, SidebarNavItem, SidebarGroupLabel } from "@/components/ui/sidebar-nav"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

function App() {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">slate — live components</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rendered from the real <code className="font-mono">components/ui/*.tsx</code>, transformed in the browser.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? "Light" : "Dark"} mode
        </Button>
      </header>

      <Section title="Button">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button size="sm">sm</Button>
        <Button size="lg">lg</Button>
        <Button disabled>Disabled</Button>
      </Section>

      <Section title="Badge">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </Section>

      <Section title="Input / Textarea / Select">
        <Input placeholder="Project name" className="w-56" />
        <Input placeholder="Disabled" disabled className="w-40" />
        <Textarea placeholder="Notes" className="w-56" />
        <Select defaultValue="syd">
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="syd">Sydney — ap-southeast-2</SelectItem>
            <SelectItem value="fra">Frankfurt — eu-central-1</SelectItem>
            <SelectItem value="ore">Oregon — us-west-2</SelectItem>
          </SelectContent>
        </Select>
      </Section>

      <Section title="Checkbox / Radio / Switch / Slider">
        <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Checked</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox /> Unchecked</label>
        <RadioGroup defaultValue="a" className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="a" /> Every push</label>
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="b" /> Manual</label>
        </RadioGroup>
        <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> On</label>
        <div className="w-48"><Slider defaultValue={[62]} max={100} /></div>
      </Section>

      <Section title="Card">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Basic card</CardTitle>
            <CardDescription>Header, content, footer.</CardDescription>
          </CardHeader>
          <CardContent>Content sits at 14px with a 1.6 line height.</CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">Dismiss</Button>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Alert">
        <Alert className="w-full"><AlertTitle>Preview enabled</AlertTitle><AlertDescription>Every PR gets a URL.</AlertDescription></Alert>
        <Alert intent="success" className="w-full"><AlertTitle>Domain verified</AlertTitle><AlertDescription>acme.com is serving.</AlertDescription></Alert>
        <Alert intent="warning" className="w-full"><AlertTitle>Nearing limit</AlertTitle><AlertDescription>412 of 1,000 minutes used.</AlertDescription></Alert>
        <Alert intent="destructive" className="w-full"><AlertTitle>Build failed</AlertTitle><AlertDescription>Module not found.</AlertDescription></Alert>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deploys">Deployments</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">The active panel renders below the bar.</TabsContent>
          <TabsContent value="deploys">Deployments panel.</TabsContent>
          <TabsContent value="logs">Logs panel.</TabsContent>
        </Tabs>
      </Section>

      <Section title="Table">
        <Table>
          <TableCaption>Recent deployments</TableCaption>
          <TableHeader>
            <TableRow><TableHead>Deployment</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Duration</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow data-state="selected"><TableCell>acme-web-8f21ba9</TableCell><TableCell><Badge variant="secondary">Ready</Badge></TableCell><TableCell className="text-right tabular-nums">1m 12s</TableCell></TableRow>
            <TableRow><TableCell>acme-web-71b0e42</TableCell><TableCell><Badge variant="destructive">Failed</Badge></TableCell><TableCell className="text-right tabular-nums">0m 40s</TableCell></TableRow>
          </TableBody>
        </Table>
      </Section>

      <div className="flex flex-wrap items-start gap-8">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dropdown menu (click to open)</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>rina@acme.com</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem>Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive hover:bg-destructive/10">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sidebar nav</p>
          <SidebarNav className="w-56">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarNavItem href="#" active>Overview</SidebarNavItem>
            <SidebarNavItem href="#">Deployments</SidebarNavItem>
            <SidebarNavItem href="#">Analytics</SidebarNavItem>
          </SidebarNav>
        </section>
      </div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
