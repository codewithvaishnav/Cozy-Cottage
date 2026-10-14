import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function bookingsApiPlugin() {
  return {
    name: 'cozy-cottage-bookings-api',
    configureServer(server: any) {
      server.middlewares.use('/api/bookings', async (_req: any, res: any) => {
        try {
          const fetchProject = async (projectId: string) => {
            const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings?pageSize=300`;
            const r = await fetch(url);
            if (!r.ok) return [];
            const data = await r.json();
            return data.documents || [];
          };

          const [cozyDocs, blissfulDocs] = await Promise.allSettled([
            fetchProject('cozy-429f4'),
            fetchProject('blissful-53cbf')
          ]);

          const allDocs = [
            ...(cozyDocs.status === 'fulfilled' ? cozyDocs.value : []),
            ...(blissfulDocs.status === 'fulfilled' ? blissfulDocs.value : [])
          ];

          const bookedDates = new Set<string>();
          for (const doc of allDocs) {
            const f = doc.fields || {};
            if (f.status?.stringValue === 'Cancelled') continue;
            if (f.isDeletedByClient?.booleanValue === true) continue;

            const checkIn = f.checkInDate?.stringValue || f.startDate?.stringValue || f.date?.stringValue;
            const checkOut = f.checkOutDate?.stringValue || f.endDate?.stringValue || checkIn;

            if (checkIn) {
              const start = new Date(checkIn);
              const end = checkOut ? new Date(checkOut) : new Date(checkIn);
              const curr = new Date(start);
              while (curr <= end) {
                bookedDates.add(curr.toISOString().split('T')[0]);
                curr.setDate(curr.getDate() + 1);
              }
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({
            success: true,
            bookedDates: Array.from(bookedDates),
            totalBookings: allDocs.length
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err?.message || 'Error', bookedDates: [] }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), bookingsApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/firestore-cozy': {
          target: 'https://firestore.googleapis.com/v1/projects/cozy-429f4/databases/(default)/documents',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/firestore-cozy/, '')
        },
        '/api/firestore-blissful': {
          target: 'https://firestore.googleapis.com/v1/projects/blissful-53cbf/databases/(default)/documents',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/firestore-blissful/, '')
        }
      }
    },
  };
});
