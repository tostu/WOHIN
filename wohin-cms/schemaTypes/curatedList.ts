import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'curatedList',
  title: 'Curated List',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'e.g. 🍵, 📚, 🪩',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Vibey, short description of the list.',
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
      validation: (Rule) => Rule.required(),
    }),
  ],
})
