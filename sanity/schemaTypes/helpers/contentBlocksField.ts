import {defineArrayMember, defineField} from 'sanity'

const pageBlockTypes = [
  'homeHeroBlock',
  'pageHeroBlock',
  'problemSolutionBlock',
  'textBlock',
  'featuredServicesBlock',
  'featuredProjectsBlock',
  'iconCardsBlock',
  'partnersBlock',
  'googleReviewsBlock',
  'contactFormBlock',
  'aboutIntroBlock',
  'aboutTeamBlock',
  'aboutTeamImageBlock',
  'processBlock',
  'processFaqBlock',
  'processIntakeBannerBlock',
  'businessContentBlock',
  'videoChecklistBlock',
] as const

export const contentBlocksField = defineField({
  name: 'contentBlocks',
  title: 'Page Builder',
  type: 'array',
  description: 'Build this page with reusable content sections.',
  of: pageBlockTypes.map((type) => defineArrayMember({type})),
  options: {
    insertMenu: {
      groups: [
        {
          name: 'hero',
          title: 'Hero Sections',
          of: ['homeHeroBlock', 'pageHeroBlock'],
        },
        {
          name: 'content',
          title: 'Content Sections',
          of: [
            'textBlock',
            'problemSolutionBlock',
            'aboutIntroBlock',
            'aboutTeamBlock',
            'aboutTeamImageBlock',
            'processBlock',
            'processFaqBlock',
            'processIntakeBannerBlock',
            'businessContentBlock',
            'videoChecklistBlock',
          ],
        },
        {
          name: 'listings',
          title: 'Listings & Cards',
          of: ['featuredServicesBlock', 'featuredProjectsBlock', 'iconCardsBlock'],
        },
        {
          name: 'social',
          title: 'Social Proof',
          of: ['partnersBlock', 'googleReviewsBlock'],
        },
        {
          name: 'conversion',
          title: 'CTA & Forms',
          of: ['contactFormBlock'],
        },
      ],
      views: [{name: 'grid'}, {name: 'list'}],
    },
  },
})
