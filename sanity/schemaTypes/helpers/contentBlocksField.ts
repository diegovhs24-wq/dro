import {defineArrayMember, defineField} from 'sanity'

const pageBlockTypes = [
  'homeHeroBlock',
  'pageHeroBlock',
  'problemSolutionBlock',
  'textBlock',
  'servicesListingBlock',
  'iconCardsBlock',
  'partnersBlock',
  'projectsListingBlock',
  'googleReviewsBlock',
  'ctaBannerBlock',
  'contactFormBlock',
  'aboutIntroBlock',
  'aboutTeamBlock',
  'aboutTeamImageBlock',
  'processHeaderBlock',
  'processBenefitsBlock',
  'processTrustBlock',
  'processFaqBlock',
  'processIntakeBannerBlock',
  'businessContentBlock',
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
            'processHeaderBlock',
            'processBenefitsBlock',
            'processTrustBlock',
            'processFaqBlock',
            'processIntakeBannerBlock',
            'businessContentBlock',
          ],
        },
        {
          name: 'listings',
          title: 'Listings & Cards',
          of: ['servicesListingBlock', 'projectsListingBlock', 'iconCardsBlock'],
        },
        {
          name: 'social',
          title: 'Social Proof',
          of: ['partnersBlock', 'googleReviewsBlock'],
        },
        {
          name: 'conversion',
          title: 'CTA & Forms',
          of: ['ctaBannerBlock', 'contactFormBlock'],
        },
      ],
      views: [{name: 'list'}],
    },
  },
})
