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
    name: 'Elbphilharmonie',
    slug: {_type: 'slug', current: 'elbphilharmonie'},
    address: 'Platz der Deutschen Einheit 1, 20457 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5413, lng: 9.9841},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-relax'},
      {_type: 'reference', _ref: 'activity-culture'},
    ],
  },
  {
    _type: 'location',
    name: 'Miniatur Wunderland',
    slug: {_type: 'slug', current: 'miniatur-wunderland'},
    address: 'Kehrwieder 2/Block D, 20457 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5439, lng: 9.9888},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-relax'},
      {_type: 'reference', _ref: 'activity-culture'},
    ],
  },
  {
    _type: 'location',
    name: 'Planten un Blomen',
    slug: {_type: 'slug', current: 'planten-un-blomen'},
    address: 'Marseiller Str., 20355 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5606, lng: 9.9821},
    status: 'approved',
    activities: [{_type: 'reference', _ref: 'activity-relax'}],
  },
  {
    _type: 'location',
    name: 'Reeperbahn',
    slug: {_type: 'slug', current: 'reeperbahn'},
    address: 'Reeperbahn, 20359 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5497, lng: 9.9606},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-party'},
      {_type: 'reference', _ref: 'activity-eat-drink'},
    ],
  },
  {
    _type: 'location',
    name: 'Speicherstadt',
    slug: {_type: 'slug', current: 'speicherstadt'},
    address: 'Brook, 20457 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5448, lng: 9.9950},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-relax'},
      {_type: 'reference', _ref: 'activity-culture'},
    ],
  },
  {
    _type: 'location',
    name: 'Sternschanze',
    slug: {_type: 'slug', current: 'sternschanze'},
    address: 'Schulterblatt, 20357 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5617, lng: 9.9620},
    status: 'approved',
    activities: [
      {_type: 'reference', _ref: 'activity-party'},
      {_type: 'reference', _ref: 'activity-eat-drink'},
    ],
  },
  {
    _type: 'location',
    name: 'Binnenalster',
    slug: {_type: 'slug', current: 'binnenalster'},
    address: 'Jungfernstieg, 20354 Hamburg',
    coordinates: {_type: 'geopoint', lat: 53.5534, lng: 9.9926},
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
