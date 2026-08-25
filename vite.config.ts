import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Source unique de la version : package.json.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      /*
       * `prompt`, et non `autoUpdate`. Le journal vit dans le navigateur et
       * nulle part ailleurs : un rechargement décidé par le service worker au
       * milieu d'une entrée emporterait la journée qu'on écrivait. Le nouveau
       * worker s'installe, précache, puis attend ; c'est `UpdatePrompt` qui
       * lui donne la main, quand quelqu'un le demande.
       *
       * Corollaire : aucun `skipWaiting` dans `workbox` ci-dessous. Il
       * annulerait l'attente, et avec elle le choix.
       */
      registerType: 'prompt',
      // L'enregistrement passe par `useRegisterSW`, dans le composant qui
      // affiche le bandeau : le script que le plugin injecte d'office ferait
      // le travail une seconde fois, sans rien à quoi s'accrocher.
      injectRegister: null,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/app',
        name: 'journal. — journal quotidien',
        short_name: 'journal.',
        description:
          'Une année, un jour à la fois. Local, hors ligne, sans compte.',
        lang: 'fr',
        dir: 'ltr',
        start_url: '/app',
        scope: '/',
        display: 'standalone',
        // Pas de verrou d'orientation : l'année tient dans les deux sens, et
        // c'est en paysage qu'un écrit long se relit le mieux.
        background_color: '#f2f3f2',
        theme_color: '#f2f3f2',
        categories: ['productivity', 'lifestyle', 'utilities'],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // `txt` pour les notices de licences : elles couvrent une fonte que le
        // service worker précache, et une licence joignable seulement en ligne
        // n'accompagne pas vraiment ce qui, lui, part hors ligne.
        globPatterns: ['**/*.{js,css,html,svg,png,txt,woff2}'],
        // L'image de partage n'est lue que par les robots d'aperçu : la
        // précacher ferait porter 12 ko à chaque installation pour rien.
        globIgnores: ['**/og.png'],
        navigateFallback: '/index.html',
        // Ce qui n'est pas une route de l'app ne doit pas recevoir sa coquille.
        // Les notices de licences y sont pour une raison plus forte : on y
        // arrive par un lien de l'app, donc par une navigation — sans cette
        // ligne, le lien rendait `index.html` sous le nom du fichier, et la
        // licence de la fonte ne s'affichait jamais.
        navigateFallbackDenylist: [/\.txt$/],
        cleanupOutdatedCaches: true,
        /*
         * Sans cela, la toute première visite reste non contrôlée : le worker
         * s'installe, précache, et n'attrape la page qu'au chargement suivant.
         * Quelqu'un qui ouvre l'application puis descend dans le métro
         * trouverait une page blanche.
         *
         * Ce n'est pas la porte dérobée que `skipWaiting` serait : la
         * revendication n'a lieu qu'à l'activation, et une mise à jour
         * n'active rien tant que le bandeau n'a pas eu sa réponse. Elle ne
         * joue donc qu'à la première installation, quand il n'y a pas
         * d'ancienne version à emporter.
         */
        clientsClaim: true,
        // Aucune requête réseau à l'usage : tout est précaché, rien n'est
        // récupéré à la volée. Pas de runtimeCaching par construction.
        runtimeCaching: [],
      },
      // Sans cela, /manifest.webmanifest n'existe pas en développement et
      // le navigateur reçoit la page de repli — une erreur de console à
      // chaque rechargement, pour un fichier pourtant correct en production.
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
  },
})
