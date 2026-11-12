import { createClient } from '@supabase/supabase-js'

function parseRSS(xml: string) {
  const items: any[] = []
  const rssRegex = /<item>([\s\S]*?)<\/item>/g
  const atomRegex = /<entry>([\s\S]*?)<\/entry>/g
  const regex = rssRegex.test(xml) ? /<item>([\s\S]*?)<\/item>/g : atomRegex
  let match
  while ((match = regex.exec(xml)) !== null) {
    const itemContent = match[1]
    const getTag = (tag: string) => {
      const cdataMatch = itemContent.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))
      if (cdataMatch) return cdataMatch[1]
      const normalMatch = itemContent.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
      return normalMatch ? normalMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    }
    const linkMatch = itemContent.match(/<link[^>]*href="([^"]+)"/)
    const link = linkMatch ? linkMatch[1] : getTag('link')
    let pubDate = getTag('pubDate') || getTag('published') || getTag('updated')
    try {
      const d = new Date(pubDate)
      if (isNaN(d.getTime())) pubDate = new Date().toISOString()
      else pubDate = d.toISOString()
    } catch { pubDate = new Date().toISOString() }

    const title = getTag('title')
    const url = link || getTag('guid')
    if (title && url) {
      items.push({
        title,
        url,
        excerpt: getTag('description').substring(0, 280).replace(/<[^>]+>/g, '').trim() + '...',
        published_at: pubDate,
      })
    }
  }
  return items
}

const FEEDS = [
  // AI
  { url: 'https://openai.com/news/rss.xml', source: 'OpenAI', category: 'AI' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI', category: 'AI' },
  { url: 'https://www.anthropic.com/rss.xml', source: 'Anthropic', category: 'AI' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'AI' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'AI' },
  
  // Business
  { url: 'https://feeds.hbr.org/harvardbusiness', source: 'HBR', category: 'Business' },
  { url: 'https://www.economist.com/finance-and-economics/rss.xml', source: 'The Economist', category: 'Business' },
  { url: 'https://www.forbes.com/business/feed/', source: 'Forbes', category: 'Business' },
  
  // Startups
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Startups' },
  { url: 'https://www.producthunt.com/feed', source: 'Product Hunt', category: 'Startups' },
  { url: 'https://venturebeat.com/feed/', source: 'VentureBeat', category: 'Startups' },

  // Science
  { url: 'https://www.nature.com/nature.rss', source: 'Nature', category: 'Science' },
  { url: 'https://www.sciencedaily.com/rss/top/science.xml', source: 'ScienceDaily', category: 'Science' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'Science' },
  { url: 'https://www.livescience.com/feeds/all', source: 'Live Science', category: 'Science' },

  // Cybersecurity
  { url: 'https://krebsonsecurity.com/feed/', source: 'Krebs on Security', category: 'Cybersecurity' },
  { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News', category: 'Cybersecurity' },
  { url: 'https://www.bleepingcomputer.com/feed/', source: 'BleepingComputer', category: 'Cybersecurity' },

  // Psychology
  { url: 'https://www.psychologytoday.com/us/feed/blog-posts', source: 'Psychology Today', category: 'Psychology' },
  { url: 'https://digest.bps.org.uk/feed/', source: 'BPS Research Digest', category: 'Psychology' },

  // Philosophy
  { url: 'https://dailynous.com/feed/', source: 'Daily Nous', category: 'Philosophy' },
  { url: 'https://psyche.co/feed', source: 'Psyche', category: 'Philosophy' },
  { url: 'https://aeon.co/feed.rss', source: 'Aeon', category: 'Philosophy' },

  // Architecture
  { url: 'https://www.archdaily.com/rss', source: 'ArchDaily', category: 'Architecture' },
  { url: 'https://www.dezeen.com/feed/', source: 'Dezeen', category: 'Architecture' },

  // Design
  { url: 'https://www.creativeboom.com/feed/', source: 'Creative Boom', category: 'Design' },
  { url: 'https://www.itsnicethat.com/rss', source: "It's Nice That", category: 'Design' },

  // Liberal Arts
  { url: 'https://www.themarginalian.org/feed/', source: 'The Marginalian', category: 'Liberal Arts' },
  { url: 'https://lithub.com/feed/', source: 'Literary Hub', category: 'Liberal Arts' },

  // Gaming
  { url: 'https://www.polygon.com/rss/index.xml', source: 'Polygon', category: 'Gaming' },
  { url: 'https://kotaku.com/rss', source: 'Kotaku', category: 'Gaming' },
  { url: 'https://feeds.ign.com/ign/all', source: 'IGN', category: 'Gaming' },

  // Marketing
  { url: 'https://moz.com/blog/feed', source: 'Moz', category: 'Marketing' },
  { url: 'https://www.socialmediaexaminer.com/feed/', source: 'Social Media Examiner', category: 'Marketing' },

  // Social Media
  { url: 'https://www.socialmediatoday.com/feeds/news/', source: 'Social Media Today', category: 'Social Media' },

  // Productivity
  { url: 'https://zenhabits.net/feed/', source: 'Zen Habits', category: 'Productivity' },
  { url: 'https://lifehacker.com/rss', source: 'Lifehacker', category: 'Productivity' },

  // Space
  { url: 'https://www.space.com/feeds/all', source: 'Space.com', category: 'Space' },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', source: 'NASA', category: 'Space' },

  // Environment
  { url: 'https://www.nationalgeographic.com/environment/rss', source: 'Nat Geo', category: 'Environment' },
  { url: 'https://insideclimatenews.org/feed/', source: 'Inside Climate News', category: 'Environment' },

  // Law
  { url: 'https://www.law.com/rss/', source: 'Law.com', category: 'Law' },

  // Neuroscience
  { url: 'https://neurosciencenews.com/feed/', source: 'Neuroscience News', category: 'Neuroscience' },
  { url: 'https://feeds.nos.nl/nosnieuwsalgemeen', source: 'NOS', category: 'Dutch' },
  { url: 'https://www.nu.nl/rss', source: 'NU.nl', category: 'Dutch' },
  { url: 'https://www.rtlnieuws.nl/rss.xml', source: 'RTL Nieuws', category: 'Dutch' },
  { url: 'https://hnrss.org/frontpage', source: 'Hacker News', category: 'AI' },
  { url: 'https://www.archdaily.com/feed', source: 'ArchDaily', category: 'Design' },
  { url: 'https://www.dezeen.com/feed/', source: 'Dezeen', category: 'Design' },
  { url: 'https://blog.hubspot.com/marketing/rss.xml', source: 'HubSpot', category: 'Marketing' },
  { url: 'https://jamesclear.com/feed', source: 'James Clear', category: 'Productivity' },
  { url: 'https://feeds.feedburner.com/TheAtlantic', source: 'The Atlantic', category: 'Liberal Arts' },
  { url: 'https://www.investopedia.com/index.rss', source: 'Investopedia', category: 'Business' },
]

export async function fetchAndStoreNews() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Purge older than 20 days
  const twentyDaysAgo = new Date()
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)
  await supabase.from('daily_news').delete().lt('published_at', twentyDaysAgo.toISOString())

  // Fetch in parallel
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: { 'User-Agent': 'MeridianAcademy/1.0 (RSS Reader)' },
          signal: AbortSignal.timeout(6000),
        })
        if (!response.ok) return []
        const xml = await response.text()
        const items = parseRSS(xml)
        // FETCH 5 PER FEED (Instead of 2) to guarantee coverage
        return items.slice(0, 5).map(item => ({
          ...item,
          source: feed.source,
          category: feed.category,
        }))
      } catch (e) {
        return []
      }
    })
  )

  const allArticles: any[] = []
  results.forEach(r => {
    if (r.status === 'fulfilled') allArticles.push(...r.value)
  })

  if (allArticles.length === 0) return { count: 0 }

  // Insert in chunks
  let totalInserted = 0
  for (let i = 0; i < allArticles.length; i += 50) {
    const chunk = allArticles.slice(i, i + 50)
    const { error } = await supabase.from('daily_news').upsert(chunk, { onConflict: 'url' })
    if (!error) totalInserted += chunk.length
  }

  return { count: totalInserted, fetched: allArticles.length, sources: FEEDS.length }
}