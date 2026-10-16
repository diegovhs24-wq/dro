import {Card, Stack, Text} from '@sanity/ui'

// Aanvragen staan niet meer in deze workspace: ze bevatten persoonsgegevens en
// staan in de private dataset "leads", in de workspace "Aanvragen".
export function AanvragenLink() {
  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          Aanvragen staan in een aparte, afgeschermde omgeving.
        </Text>
        <Text size={1} muted>
          Omdat aanvragen persoonsgegevens bevatten, worden ze niet meer in deze workspace bewaard.
        </Text>
        <Text size={1}>
          <a href="/studio/aanvragen">Open de omgeving Aanvragen</a>
        </Text>
      </Stack>
    </Card>
  )
}
