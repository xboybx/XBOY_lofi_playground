import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const defaultDiscover = {
  mainImage: "https://ik.imagekit.io/t8nfvprzb/Mac_os_lofi_site/Scene%20in%20xboy.png",
  subImage1: "https://ik.imagekit.io/mtkm3escy/Portfolio%20assets/midnight-drive.png?updatedAt=1764096599955",
  subImage2: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
  newReleaseIds: [],
  news: [
    { id: 1, title: "Lofi Radio Relaunch", content: "The 24/7 lofi radio stream has been updated with fresh tracks. Tune in to study and chill.", date: "Sep 15, 2025" }
  ]
};

const defaultSiteData = {
  wallpaperUrl: "", // Empty = show CSS gradient fallback
  about: {
    description: "welcome to my lofi space",
    avatarUrl: "/jely.png",
    subtitle: "Developer",
    paragraph1: "",
    paragraph2: "",
    paragraph3: ""
  },
  music: [],
  gallery: [],
  discover: defaultDiscover,
  socials: {
    // Personal socials
    instagram: '',
    youtube: '',
    github: '',
    linkedin: '',
    email: '',
    // Music platforms
    spotify: '',
    appleMusic: '',
    ytMusic: '',
    soundcloud: '',
    amazonMusic: '',
  }
};

export const useSiteStore = create((set, get) => ({
  data: defaultSiteData,
  loading: true,
  error: null,

  fetchData: async () => {
    if (!supabase) {
      set({ loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const [
        { data: identity },
        { data: about },
        { data: socials },
        { data: music },
        { data: gallery }
      ] = await Promise.all([
        supabase.from('site_identity').select('*').single(),
        supabase.from('about_me').select('*').single(),
        supabase.from('social_links').select('*'),
        supabase.from('music_tracks').select('*').order('id', { ascending: true }),
        supabase.from('gallery_media').select('*').order('id', { ascending: true })
      ]);

      const socialMap = {};
      if (socials) {
        socials.forEach(s => { socialMap[s.platform] = s.url; });
      }

      set({
        data: {
          // Use ?? so empty string from DB stays empty (not replaced by default)
          wallpaperUrl: identity?.wallpaper_url ?? '',
          about: {
            subtitle: about?.subtitle || defaultSiteData.about.subtitle,
            avatarUrl: about?.avatar_url || defaultSiteData.about.avatarUrl,
            description: about?.intro_text || defaultSiteData.about.description,
            paragraph1: about?.bio_paragraphs?.[0] || '',
            paragraph2: about?.bio_paragraphs?.[1] || '',
            paragraph3: about?.bio_paragraphs?.[2] || ''
          },
          socials: {
            // Personal socials
            instagram: socialMap.instagram || '',
            youtube: socialMap.youtube || '',
            github: socialMap.github || '',
            linkedin: socialMap.linkedin || '',
            email: socialMap.email || '',
            // Music platforms
            spotify: socialMap.spotify || '',
            appleMusic: socialMap.appleMusic || '',
            ytMusic: socialMap.ytMusic || '',
            soundcloud: socialMap.soundcloud || '',
            amazonMusic: socialMap.amazonMusic || '',
          },
          music: (music || []).map(m => ({
            id: m.id,
            title: m.title,
            author: m.author,
            youtubeId: m.youtube_id,
            cover: m.cover_url
          })),
          gallery: (gallery || []).map(g => ({
            id: g.id,
            img: g.media_url
          })),
          discover: identity?.discover_data || defaultDiscover
        },
        loading: false
      });
    } catch (error) {
      console.error('Error fetching site data:', error);
      set({ loading: false, error: error.message });
    }
  },

  updateData: async (newData) => {
    const currentData = get().data;
    let mergedData = { ...currentData, ...newData };

    // If music is changing, pre-compute newReleaseIds into discover NOW
    // so the single site_identity upsert below captures the final state
    if (newData.music) {
      const newReleaseIds = mergedData.music
        .filter(m => m.isNewRelease)
        .map(m => m.id);
      mergedData.discover = { ...mergedData.discover, newReleaseIds };
    }

    // Optimistic update — UI reflects change immediately
    set({ data: mergedData });
    if (!supabase) return;

    try {
      const promises = [];

      // 1. Identity — ALWAYS upsert as one single call to avoid race conditions.
      //    This covers: wallpaper changes, discover changes, and music newReleaseIds changes.
      promises.push(
        supabase.from('site_identity').upsert({
          id: 1,
          wallpaper_url: mergedData.wallpaperUrl,
          discover_data: mergedData.discover
        }).then(({ error }) => {
          if (error) console.error('[siteStore] site_identity upsert failed:', error);
        })
      );

      // 2. About
      if (newData.about) {
        promises.push(
          supabase.from('about_me').upsert({
            id: 1,
            subtitle: mergedData.about.subtitle,
            avatar_url: mergedData.about.avatarUrl,
            intro_text: mergedData.about.description,
            bio_paragraphs: [
              mergedData.about.paragraph1,
              mergedData.about.paragraph2,
              mergedData.about.paragraph3
            ]
          }).then(({ error }) => {
            if (error) console.error('[siteStore] about_me upsert failed:', error);
          })
        );
      }

      // 3. Socials
      if (newData.socials) {
        Object.keys(mergedData.socials).forEach(platform => {
          promises.push(
            supabase.from('social_links').upsert({
              platform,
              url: mergedData.socials[platform]
            }, { onConflict: 'platform' }).then(({ error }) => {
              if (error) console.error(`[siteStore] social_links upsert failed for ${platform}:`, error);
            })
          );
        });
      }

      // 4. Music (Clean Sync)
      if (newData.music) {
        const { error: delErr } = await supabase.from('music_tracks').delete().neq('id', 0);
        if (delErr) console.error('[siteStore] music_tracks delete failed:', delErr);

        if (mergedData.music.length > 0) {
          const insertData = mergedData.music.map(m => ({
            title: m.title,
            author: m.author,
            youtube_id: m.youtubeId,
            cover_url: m.cover
          }));
          promises.push(
            supabase.from('music_tracks').insert(insertData).then(({ error }) => {
              if (error) console.error('[siteStore] music_tracks insert failed:', error);
            })
          );
        }
      }

      // 5. Gallery (Clean Sync)
      if (newData.gallery) {
        const { error: delErr } = await supabase.from('gallery_media').delete().neq('id', 0);
        if (delErr) console.error('[siteStore] gallery_media delete failed:', delErr);

        if (mergedData.gallery.length > 0) {
          const insertData = mergedData.gallery.map(g => ({
            media_url: g.img,
            media_type: (/\.(mp4|webm|mkv|ogg)$/i.test(g.img)) ? 'video' : 'image'
          }));
          promises.push(
            supabase.from('gallery_media').insert(insertData).then(({ error }) => {
              if (error) console.error('[siteStore] gallery_media insert failed:', error);
            })
          );
        }
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('[siteStore] updateData unexpected error:', error);
    }
  }
}));
