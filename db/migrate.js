import {SongModel} from './model.js';
import {seeds} from './seeds.js';

export async function migrate() {
  try {
    const data = await SongModel.findAll()
    if (data.length < seeds.length) {
      console.log('[log] migrate started')
      await seeds.forEach((seed) => {
        SongModel.create({
          artist: seed.artist,
          title: seed.title,
          chorus: seed.chorus
        })
      })
    }
  } catch (e) {
    console.log(`[err] migrate error ${e}`)
  }
  console.log(`[ok] migrate finished`)
}