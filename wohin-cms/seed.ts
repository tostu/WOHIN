import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const activities = [
  {
    _id: 'activity-study',
    _type: 'activity',
    name: 'Study',
    slug: {_type: 'slug', current: 'study'},
    themeColor: 'matcha',
    icon: '📚',
    description: 'Quiet spots for focused work.',
  },
  {
    _id: 'activity-relax',
    _type: 'activity',
    name: 'Relax',
    slug: {_type: 'slug', current: 'relax'},
    themeColor: 'peach',
    icon: '🧘‍♀️',
    description: 'Unwind and recharge.',
  },
  {
    _id: 'activity-party',
    _type: 'activity',
    name: 'Party',
    slug: {_type: 'slug', current: 'party'},
    themeColor: 'sunny',
    icon: '🎉',
    description: 'Vibrant energy and social spots.',
  },
]

const locations = [
  {
    _type: 'location',
    name: 'Sunny Library',
    slug: {_type: 'slug', current: 'sunny-library'},
    address: '123 Radiant Blvd',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-study'}],
  },
  {
    _type: 'location',
    name: 'Golden Lounge',
    slug: {_type: 'slug', current: 'golden-lounge'},
    address: '456 Sunset Ave',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
  {
    _type: 'location',
    name: 'Neon Club',
    slug: {_type: 'slug', current: 'neon-club'},
    address: '789 Party St',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-party'}],
  },
  {
    _type: 'location',
    name: 'Matcha Mornings',
    slug: {_type: 'slug', current: 'matcha-mornings'},
    address: '101 Green Way',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-study'}],
  },
  {
    _type: 'location',
    name: 'Velvet Vibes',
    slug: {_type: 'slug', current: 'velvet-vibes'},
    address: '202 Soft Lane',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
  {
    _type: 'location',
    name: 'Peach Palace',
    slug: {_type: 'slug', current: 'peach-palace'},
    address: '303 Summer Rd',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-party'}],
  },
  {
    _type: 'location',
    name: 'Zen Garden',
    slug: {_type: 'slug', current: 'zen-garden'},
    address: '404 Calm Creek',
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
]

async function uploadImage() {
  console.log('Uploading random image from Picsum...')
  const response = await fetch(`https://picsum.photos/seed/${Math.random()}/600/400`)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
  
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const asset = await client.assets.upload('image', buffer, {
    filename: `picsum-${Math.random().toString(36).substring(7)}.jpg`,
    contentType: 'image/jpeg',
  })
  return asset
}

async function seed() {
  console.log('Seeding activities...')
  for (const activity of activities) {
    await client.createOrReplace(activity)
    console.log(`Created/Updated activity: ${activity.name}`)
  }

  console.log('Seeding locations...')
  for (const location of locations) {
    // Check if location already exists by slug
    const existing = await client.fetch(`*[_type == "location" && slug.current == $slug][0]`, {
      slug: location.slug.current,
    })

    if (!existing) {
      const asset = await uploadImage()
      const newLocation = {
        ...location,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      }
      await client.create(newLocation)
      console.log(`Created location with image: ${location.name}`)
    } else if (!existing.image) {
      console.log(`Updating existing location with missing image: ${location.name}`)
      const asset = await uploadImage()
      await client
        .patch(existing._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit()
      console.log(`Updated location: ${location.name}`)
    } else {
      console.log(`Location already exists with image: ${location.name}`)
    }
  }

  console.log('Seeding complete! ✨')
}

seed().catch(console.error)
