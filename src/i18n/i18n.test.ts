import { describe, expect, it } from 'vitest'
import { en } from './en.ts'
import { fr } from './fr.ts'
import { resolveLang } from './index.tsx'

const frKeys = Object.keys(fr).sort()
const enKeys = Object.keys(en).sort()

describe('dictionnaires', () => {
  it('portent exactement les mêmes clés', () => {
    expect(enKeys).toEqual(frKeys)
  })

  it('ne laissent aucune valeur vide', () => {
    const empty = frKeys.filter(
      (key) =>
        !fr[key as keyof typeof fr]?.trim() ||
        !en[key as keyof typeof en]?.trim(),
    )
    expect(empty).toEqual([])
  })

  it('emploient les mêmes variables de part et d’autre', () => {
    const vars = (text: string): string[] =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? '').sort()
    const mismatched = frKeys.filter((key) => {
      const a = vars(fr[key as keyof typeof fr])
      const b = vars(en[key as keyof typeof en])
      return a.join(',') !== b.join(',')
    })
    expect(mismatched).toEqual([])
  })

  it('déclarent les deux formes de chaque pluriel', () => {
    const bases = new Set(
      frKeys
        .filter((key) => key.endsWith('.one') || key.endsWith('.other'))
        .map((key) => key.replace(/\.(one|other)$/, '')),
    )
    const incomplete = [...bases].filter(
      (base) => !frKeys.includes(`${base}.one`) || !frKeys.includes(`${base}.other`),
    )
    expect(incomplete).toEqual([])
  })

  it('n’écrivent aucun emoji', () => {
    const emoji = /\p{Extended_Pictographic}/u
    const found = frKeys.filter(
      (key) =>
        emoji.test(fr[key as keyof typeof fr]) ||
        emoji.test(en[key as keyof typeof en]),
    )
    expect(found).toEqual([])
  })
})

describe('resolveLang', () => {
  it('respecte un choix explicite', () => {
    expect(resolveLang('en')).toBe('en')
    expect(resolveLang('fr')).toBe('fr')
  })

  it('retombe sur une langue connue pour « système »', () => {
    expect(['fr', 'en']).toContain(resolveLang('system'))
  })
})
