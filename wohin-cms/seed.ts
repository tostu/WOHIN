import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const {projectId, dataset} = client.config()
console.log(`Using Project: ${projectId}, Dataset: ${dataset}`)

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
  {
    _id: 'activity-culture',
    _type: 'activity',
    name: 'Culture',
    slug: {_type: 'slug', current: 'culture'},
    themeColor: 'sky',
    icon: '🎭',
    description: 'Museums, theaters, and more.',
  },
  {
    _id: 'activity-eat-drink',
    _type: 'activity',
    name: 'Eat & Drink',
    slug: {_type: 'slug', current: 'eat-drink'},
    themeColor: 'rose',
    icon: '🍽️',
    description: 'The best cafes and restaurants.',
  },
]

const locations = [
  {
    _type: 'location',
    name: 'Café Morgenrot',
    slug: {_type: 'slug', current: 'cafe-morgenrot'},
    address: 'Kastanienallee 85, 10435 Berlin',
    hours: 'Tue-Sun 11:00-20:00',
    coordinates: {_type: 'geopoint', lat: 52.5390, lng: 13.4200},
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-eat-drink'}],
  },
  {
    _type: 'location',
    name: 'Klunkerkranich',
    slug: {_type: 'slug', current: 'klunkerkranich'},
    address: 'Karl-Marx-Str. 66, 12043 Berlin',
    hours: 'Mon-Sun 12:00-00:00',
    coordinates: {_type: 'geopoint', lat: 52.4810, lng: 13.4340},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-party'},
      {_type: 'reference', _ref: 'activity-relax'},
    ],
  },
  {
    _type: 'location',
    name: 'Tempelhofer Feld',
    slug: {_type: 'slug', current: 'tempelhofer-feld'},
    address: 'Tempelhofer Damm, 12101 Berlin',
    hours: 'Sunrise-Sunset',
    coordinates: {_type: 'geopoint', lat: 52.4730, lng: 13.4020},
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
  {
    _type: 'location',
    name: 'Mauerpark',
    slug: {_type: 'slug', current: 'mauerpark'},
    address: 'Gleimstraße 55, 10437 Berlin',
    hours: '24/7 (Market on Sundays)',
    coordinates: {_type: 'geopoint', lat: 52.5440, lng: 13.4030},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-relax'},
      {_type: 'reference', _ref: 'activity-culture'},
    ],
  },
  {
    _type: 'location',
    name: 'Holzmarkt 25',
    slug: {_type: 'slug', current: 'holzmarkt-25'},
    address: 'Holzmarktstraße 25, 10243 Berlin',
    hours: 'Mon-Sun 10:00-22:00',
    coordinates: {_type: 'geopoint', lat: 52.5120, lng: 13.4280},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-eat-drink'},
      {_type: 'reference', _ref: 'activity-culture'},
    ],
  },
  {
    _type: 'location',
    name: 'Prinzessinnengärten',
    slug: {_type: 'slug', current: 'prinzessinnengaerten'},
    address: 'Hermannstraße 84, 12051 Berlin',
    hours: 'Mon-Sun 10:00-18:00',
    coordinates: {_type: 'geopoint', lat: 52.5020, lng: 13.4110},
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
  {
    _type: 'location',
    name: 'Sisyphos',
    slug: {_type: 'slug', current: 'sisyphos'},
    address: 'Hauptstraße 15, 10317 Berlin',
    hours: 'Weekend Non-stop',
    coordinates: {_type: 'geopoint', lat: 52.4930, lng: 13.4690},
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-party'}],
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
  console.log(`Checking write permissions for project ${projectId} in dataset ${dataset}...`)
  try {
    // Attempt a no-op patch to test write access
    await client.patch('non-existent-id').set({}).commit()
  } catch (err: any) {
    if (err.statusCode === 403 || err.statusCode === 401) {
      console.error('❌ PERMISSION ERROR: Your Sanity CLI token does not have write access.')
      console.error('Try running: sanity logout && sanity login')
      console.error('Or ensure you have a "SANITY_AUTH_TOKEN" environment variable with "Editor" or "Administrator" role.')
      process.exit(1)
    }
    // 404 is actually "success" for a permission check on a non-existent document
    if (err.statusCode !== 404) {
      console.warn('⚠️ Connection test returned unexpected error:', err.message)
    }
  }

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
    } else {
      console.log(`Updating existing location: ${location.name}`)
      let patch = client.patch(existing._id).set(location)
      
      if (!existing.image) {
        const asset = await uploadImage()
        patch = patch.set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
      }
      
      await patch.commit()
      console.log(`Updated location: ${location.name}`)
    }
  }

  console.log('Seeding complete! ✨')
}

seed().catch(console.error)
