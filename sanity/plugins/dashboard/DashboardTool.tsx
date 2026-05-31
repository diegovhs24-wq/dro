import React, {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import {
  CheckmarkCircleIcon,
  CogIcon,
  DocumentsIcon,
  EnvelopeIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  AddIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
  WarningOutlineIcon,
} from '@sanity/icons'

// ─── Types ──────────────────────────────────────────────────────────────────

type Counts = {
  services: number
  projects: number
  pages: number
  reviews: number
  faqs: number
  partners: number
  submissions: number
}

type HealthItem = {_id: string; title: string}

type Health = {
  servicesNoImage: HealthItem[]
  servicesNoSummary: HealthItem[]
  servicesNoSeo: HealthItem[]
  projectsNoImages: HealthItem[]
  projectsNoDescription: HealthItem[]
}

type DashboardData = {counts: Counts; health: Health}

// ─── GROQ ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "counts": {
    "services":    count(*[_type == "service"]),
    "projects":    count(*[_type == "project"]),
    "pages":       count(*[_type == "page" && !(_id in ["home", "drafts.home"])]),
    "reviews":     count(*[_type == "review"]),
    "faqs":        count(*[_type == "faq"]),
    "partners":    count(*[_type == "partner"]),
    "submissions": count(*[_type == "formSubmission"])
  },
  "health": {
    "servicesNoImage":       *[_type == "service" && !defined(cardImage.image) && !defined(cardImage.externalImageUrl)]{_id, title},
    "servicesNoSummary":     *[_type == "service" && !defined(summary)]{_id, title},
    "servicesNoSeo":         *[_type == "service" && !defined(seo.metaTitle)]{_id, title},
    "projectsNoImages":      *[_type == "project" && !defined(beforeImage.image) && !defined(beforeImage.externalImageUrl) && !defined(afterImage.image) && !defined(afterImage.externalImageUrl)]{_id, title},
    "projectsNoDescription": *[_type == "project" && !defined(description) || description == ""]{_id, title}
  }
}`

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={3}>
        <Box style={{color: 'var(--card-muted-fg-color)', fontSize: 22}}>{icon}</Box>
        <Stack space={1}>
          <Text size={4} weight="bold">
            {count}
          </Text>
          <Text size={1} muted>
            {label}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}

function QuickLink({
  icon,
  label,
  intent,
  params,
}: {
  icon: React.ReactNode
  label: string
  intent: 'edit' | 'create'
  params: Record<string, string>
}) {
  return (
    <IntentLink intent={intent} params={params} style={{textDecoration: 'none'}}>
      <Card
        padding={3}
        radius={2}
        shadow={1}
        tone="default"
        style={{cursor: 'pointer', transition: 'box-shadow 150ms'}}
      >
        <Flex align="center" gap={2}>
          <Box style={{fontSize: 18, color: 'var(--card-muted-fg-color)'}}>{icon}</Box>
          <Text size={1} weight="semibold">
            {label}
          </Text>
        </Flex>
      </Card>
    </IntentLink>
  )
}

type IssueGroup = {label: string; items: HealthItem[]}

function HealthSection({groups}: {groups: IssueGroup[]}) {
  const allIssues = groups.flatMap((g) => g.items.map((item) => ({...item, group: g.label})))

  if (allIssues.length === 0) {
    return (
      <Card padding={4} radius={3} tone="positive" shadow={1}>
        <Flex align="center" gap={3}>
          <Box style={{fontSize: 20}}>
            <CheckmarkCircleIcon />
          </Box>
          <Stack space={1}>
            <Text size={2} weight="semibold">
              Alles ziet er goed uit
            </Text>
            <Text size={1} muted>
              Geen ontbrekende afbeeldingen, beschrijvingen of SEO-titels gevonden.
            </Text>
          </Stack>
        </Flex>
      </Card>
    )
  }

  return (
    <Stack space={2}>
      {groups
        .filter((g) => g.items.length > 0)
        .map((group) => (
          <Card key={group.label} padding={4} radius={3} tone="caution" shadow={1}>
            <Stack space={3}>
              <Flex align="center" gap={2}>
                <WarningOutlineIcon />
                <Text size={1} weight="semibold">
                  {group.label} ({group.items.length})
                </Text>
              </Flex>
              <Stack space={1}>
                {group.items.map((item) => (
                  <IntentLink
                    key={item._id}
                    intent="edit"
                    params={{id: item._id, type: item._id.startsWith('service-') ? 'service' : 'project'}}
                    style={{textDecoration: 'none'}}
                  >
                    <Text size={1} muted style={{cursor: 'pointer'}}>
                      → {item.title}
                    </Text>
                  </IntentLink>
                ))}
              </Stack>
            </Stack>
          </Card>
        ))}
    </Stack>
  )
}

// ─── Main tool ───────────────────────────────────────────────────────────────

export function DashboardTool() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshedAt, setRefreshedAt] = useState(new Date())

  useEffect(() => {
    setLoading(true)
    client
      .fetch<DashboardData>(QUERY)
      .then((result) => {
        setData(result)
        setRefreshedAt(new Date())
      })
      .finally(() => setLoading(false))
  }, [client])

  const stats: {icon: React.ReactNode; label: string; key: keyof Counts}[] = [
    {icon: <TagIcon />,       label: 'Diensten',    key: 'services'},
    {icon: <ImageIcon />,     label: 'Projecten',   key: 'projects'},
    {icon: <DocumentsIcon />, label: 'Pagina\'s',   key: 'pages'},
    {icon: <StarIcon />,      label: 'Reviews',     key: 'reviews'},
    {icon: <HelpCircleIcon />,label: 'FAQs',        key: 'faqs'},
    {icon: <UsersIcon />,     label: 'Partners',    key: 'partners'},
    {icon: <EnvelopeIcon />,  label: 'Aanvragen',   key: 'submissions'},
  ]

  const healthGroups: IssueGroup[] = data
    ? [
        {label: 'Diensten zonder kaartafbeelding',     items: data.health.servicesNoImage},
        {label: 'Diensten zonder samenvatting',        items: data.health.servicesNoSummary},
        {label: 'Diensten zonder SEO-titel',           items: data.health.servicesNoSeo},
        {label: 'Projecten zonder voor/na-afbeelding', items: data.health.projectsNoImages},
        {label: 'Projecten zonder beschrijving',       items: data.health.projectsNoDescription},
      ]
    : []

  return (
    <Box padding={5} style={{maxWidth: 960, margin: '0 auto'}}>
      <Stack space={6}>

        {/* Header */}
        <Flex align="flex-start" justify="space-between" wrap="wrap" gap={2}>
          <Stack space={2}>
            <Heading size={3}>DRO Renovaties — Dashboard</Heading>
            <Text size={1} muted>
              Bijgewerkt om {refreshedAt.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}
            </Text>
          </Stack>
          {loading && <Spinner muted />}
        </Flex>

        {/* Content overview */}
        <Stack space={3}>
          <Text size={1} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5}}>
            Inhoudsoverzicht
          </Text>
          <Grid columns={[2, 2, 4, 7]} gap={3}>
            {stats.map(({icon, label, key}) => (
              <StatCard
                key={key}
                icon={icon}
                label={label}
                count={data?.counts[key] ?? 0}
              />
            ))}
          </Grid>
        </Stack>

        {/* Quick links */}
        <Stack space={3}>
          <Text size={1} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5}}>
            Snelle toegang
          </Text>
          <Grid columns={[2, 3, 3, 4]} gap={3}>
            <QuickLink icon={<HomeIcon />}      label="Homepage bewerken"        intent="edit"   params={{id: 'home',          type: 'page'}} />
            <QuickLink icon={<CogIcon />}       label="Site-instellingen"         intent="edit"   params={{id: 'siteSettings',  type: 'siteSettings'}} />
            <QuickLink icon={<TagIcon />}       label="Diensten-indexpagina"     intent="edit"   params={{id: 'servicesIndex', type: 'servicesIndex'}} />
            <QuickLink icon={<EnvelopeIcon />}  label="Contactpagina bewerken"   intent="edit"   params={{id: 'page-contact',  type: 'page'}} />
            <QuickLink icon={<AddIcon />}      label="Nieuwe dienst toevoegen"  intent="create" params={{type: 'service'}} />
            <QuickLink icon={<AddIcon />}      label="Nieuw project toevoegen"  intent="create" params={{type: 'project'}} />
            <QuickLink icon={<AddIcon />}      label="Nieuwe review toevoegen"  intent="create" params={{type: 'review'}} />
            <QuickLink icon={<EnvelopeIcon />}  label="Aanvragen bekijken"       intent="create" params={{type: 'formSubmission'}} />
          </Grid>
        </Stack>

        {/* Content health */}
        <Stack space={3}>
          <Text size={1} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5}}>
            Inhoudskwaliteit
          </Text>
          {loading ? (
            <Card padding={4} radius={3} shadow={1}>
              <Flex align="center" justify="center">
                <Spinner muted />
              </Flex>
            </Card>
          ) : (
            <HealthSection groups={healthGroups} />
          )}
        </Stack>

      </Stack>
    </Box>
  )
}
