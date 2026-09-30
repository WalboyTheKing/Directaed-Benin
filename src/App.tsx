import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { VideoModal } from './components/VideoModal.tsx';
import { SyncAdminModal } from './components/SyncAdminModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { SchoolView } from './views/SchoolView.tsx';
import { ActivitiesView } from './views/ActivitiesView.tsx';
import { VideosView } from './views/VideosView.tsx';
import { GalleryView } from './views/GalleryView.tsx';
import { NewsView } from './views/NewsView.tsx';
import { ContactView } from './views/ContactView.tsx';
import type { Video, VideoCategory, SyncStatus, VideosResponse } from './types/video.ts';
import { initialVideos, initialSyncStatus, initialCategories } from './data/initialVideos.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('accueil');
  const [activitiesFilter, setActivitiesFilter] = useState<string>('all');

  // Video State: commence vide pour afficher uniquement les vraies vidéos de la chaîne
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(initialSyncStatus);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fetch videos from server API
  const fetchVideos = useCallback(async () => {
    try {
      setIsLoadingVideos(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'الكل' && selectedCategory !== 'Toutes') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      params.append('sort', sortOrder);
      params.append('limit', '50');

      const res = await fetch(`/api/videos?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data: VideosResponse = await res.json();
        if (data && Array.isArray(data.videos)) {
          setVideos(data.videos);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[Videos] Erreur lors du chargement des vidéos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  }, [selectedCategory, searchQuery, sortOrder]);

  // Fetch sync status quietly
  const fetchSyncStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/sync/status', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data: SyncStatus = await res.json();
        setSyncStatus(data);
      }
    } catch {
      // Server warming up or transient delay - retain default status without logging error
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    fetchSyncStatus();
    // Poll sync status quietly every 30 seconds
    const interval = setInterval(fetchSyncStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchSyncStatus]);

  // Handle on-demand sync trigger
  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setSyncStatus(data.status);
        }
      }
      await fetchVideos();
    } catch {
      // Soft fallback
    } finally {
      setIsSyncing(false);
    }
  };

  // Tab change handler with optional category routing
  const handleSelectTab = (tab: string, categoryFilter?: string) => {
    if (categoryFilter) {
      if (tab === 'activites') {
        setActivitiesFilter(categoryFilter);
      } else if (tab === 'videos') {
        setSelectedCategory(categoryFilter as VideoCategory);
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      {/* Barre de navigation publique et institutionnelle */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Pages publiques */}
      <main className="flex-1">
        {currentTab === 'accueil' && (
          <HomeView
            onSelectTab={handleSelectTab}
            latestVideos={videos}
            onSelectVideo={(v) => setSelectedVideo(v)}
          />
        )}

        {currentTab === 'ecole' && <SchoolView onSelectTab={handleSelectTab} />}

        {currentTab === 'activites' && (
          <ActivitiesView
            onSelectTab={handleSelectTab}
            defaultSubCategory={activitiesFilter}
          />
        )}

        {currentTab === 'videos' && (
          <VideosView
            videos={videos}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            sortOrder={sortOrder}
            onSortChange={(sort) => setSortOrder(sort)}
            isLoading={isLoadingVideos}
            onSelectVideo={(v) => setSelectedVideo(v)}
          />
        )}

        {currentTab === 'galerie' && <GalleryView />}

        {currentTab === 'actualites' && <NewsView />}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Footer institutionnel avec accès admin sécurisé */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenAdmin={() => setIsSyncModalOpen(true)}
      />

      {/* Lecteur vidéo YouTube intégré */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Espace administration & diagnostic sécurisé */}
      <SyncAdminModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />
    </div>
  );
}
