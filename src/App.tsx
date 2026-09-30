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

  // Video State with instant fallback data
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Sync state with instant fallback
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(initialSyncStatus);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Local filter helper for resilience
  const filterLocalVideos = useCallback(() => {
    let filtered = [...initialVideos].filter((v) => v.status === 'ACTIVE');
    if (selectedCategory && selectedCategory !== 'الكل' && selectedCategory !== 'Toutes') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at).getTime();
      const dateB = new Date(b.published_at).getTime();
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
    setVideos(filtered);
  }, [selectedCategory, searchQuery, sortOrder]);

  // Fetch videos from server API with resilient fallback
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
        if (data && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          return;
        }
      }
      filterLocalVideos();
    } catch {
      filterLocalVideos();
    } finally {
      setIsLoadingVideos(false);
    }
  }, [selectedCategory, searchQuery, sortOrder, filterLocalVideos]);

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
      {/* 3-Zone Institutional Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        syncStatus={syncStatus}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentTab === 'accueil' && (
          <HomeView
            onSelectTab={handleSelectTab}
            latestVideos={videos}
            onSelectVideo={(v) => setSelectedVideo(v)}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
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
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            syncStatus={syncStatus}
            onRefresh={() => {
              fetchVideos();
              fetchSyncStatus();
            }}
          />
        )}

        {currentTab === 'galerie' && <GalleryView />}

        {currentTab === 'actualites' && <NewsView />}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Institutional Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* YouTube Player Video Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Synchronization & Architecture Admin Modal */}
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
