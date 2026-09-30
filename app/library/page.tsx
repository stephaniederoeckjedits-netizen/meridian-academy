// FILE: app/library/page.tsx  (URL: /library)

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

const RESOURCES = [
  {
    category: 'Grammar Foundations',
    items: [
      { title: 'Dutch Word Order Guide', desc: 'Subject → Verb → Rest and beyond' },
      { title: 'De vs Het — Article Rules', desc: 'The most common Dutch confusion' },
      { title: 'Verb Conjugation Cheat Sheet', desc: 'All regular patterns in one page' },
      { title: 'Pronoun Reference Table', desc: 'ik, jij, hij, zij, het, wij, jullie' },
    ],
  },
  {
    category: 'Pronunciation',
    items: [
      { title: 'The Dutch G Sound', desc: 'The signature sound of Dutch' },
      { title: 'UI, EU, UU — Vowel Guide', desc: 'The vowel combinations English lacks' },
      { title: 'Common Pronunciation Mistakes', desc: 'For English speakers' },
    ],
  },
  {
    category: 'Exams & Certificates',
    items: [
      { title: 'NT2 Staatsexamen Overview', desc: 'The official Dutch B2 exam' },
      { title: 'Inburgeringsexamen', desc: 'Dutch civic integration exam' },
      { title: 'IELTS / TOEFL for Dutch speakers', desc: 'English proficiency exams' },
    ],
  },
  {
    category: 'Essential Vocabulary',
    items: [
      { title: '500 Most Common Dutch Words', desc: 'Start with these' },
      { title: 'Dutch↔English False Friends', desc: 'Words that trick you' },
      { title: 'Workplace Dutch', desc: 'Professional vocabulary' },
      { title: 'Bureaucracy Vocabulary', desc: 'Gemeente, BS... terms you\'ll need' },
    ],
  },
]

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AppShell userEmail={user.email}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <div className="m-label m-label-cyan mb-3">Library</div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Study Resources
        </h1>
        <p className="text-[var(--m-text-muted)] mb-12 max-w-2xl">
          Reference material, cheat sheets, and guides to support your
          courses. More added regularly.
        </p>

        <div className="space-y-14">
          {RESOURCES.map((section) => (
            <section key={section.category}>
              <div className="m-label mb-5">{section.category}</div>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="m-panel p-5 m-panel-interactive"
                  >
                    <div className="font-semibold mb-1.5">{item.title}</div>
                    <p className="text-[var(--m-text-muted)] text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="m-panel p-6 mt-14 text-center">
          <div className="m-label mb-2">Coming Soon</div>
          <p className="text-[var(--m-text-muted)] text-sm">
            Full content for each resource is being written and will be
            released module by module.
          </p>
        </div>
      </div>
    </AppShell>
  )
}